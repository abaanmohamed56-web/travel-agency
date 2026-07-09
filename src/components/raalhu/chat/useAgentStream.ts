"use client";

import { useCallback, useRef, useState } from "react";

export type AgentEvent =
  | { type: "text_delta"; text: string }
  | { type: "agent_started"; agentId: string; task?: string }
  | { type: "agent_finished"; agentId: string }
  | { type: "tool_started"; agentId: string; tool: string }
  | { type: "tool_finished"; agentId: string; tool: string }
  | { type: "artifact"; agentId: string; title: string; href: string }
  | { type: "run_finished"; runId?: string; conversationId?: string }
  | { type: "error"; code?: string; message: string };

export interface ActivityItem {
  id: number;
  agentId: string;
  kind: "agent" | "tool";
  label: string;
  done: boolean;
}

export interface ArtifactLink {
  id: number;
  title: string;
  href: string;
}

export interface ChatTurn {
  role: "user" | "assistant";
  text: string;
  activity?: ActivityItem[];
  artifacts?: ArtifactLink[];
}

/** Streams POST /api/raalhu/chat SSE events into chat state (fetch — EventSource can't POST). */
export function useAgentStream(onRunFinished?: () => void) {
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationIdRef = useRef<string | undefined>(undefined);
  const activitySeq = useRef(0);

  const send = useCallback(async (message: string) => {
    setError(null);
    setStreaming(true);
    setTurns((prev) => [
      ...prev,
      { role: "user", text: message },
      { role: "assistant", text: "", activity: [] },
    ]);

    const patchAssistant = (fn: (turn: ChatTurn) => ChatTurn) =>
      setTurns((prev) => {
        const next = [...prev];
        next[next.length - 1] = fn(next[next.length - 1]);
        return next;
      });

    const handleEvent = (event: AgentEvent) => {
      switch (event.type) {
        case "text_delta":
          patchAssistant((t) => ({ ...t, text: t.text + event.text }));
          break;
        case "agent_started":
          patchAssistant((t) => ({
            ...t,
            activity: [
              ...(t.activity ?? []),
              {
                id: activitySeq.current++,
                agentId: event.agentId,
                kind: "agent",
                label: event.task ?? "working",
                done: false,
              },
            ],
          }));
          break;
        case "agent_finished":
          patchAssistant((t) => ({
            ...t,
            activity: (t.activity ?? []).map((a) =>
              a.agentId === event.agentId && a.kind === "agent"
                ? { ...a, done: true }
                : a
            ),
          }));
          break;
        case "tool_started":
          patchAssistant((t) => ({
            ...t,
            activity: [
              ...(t.activity ?? []),
              {
                id: activitySeq.current++,
                agentId: event.agentId,
                kind: "tool",
                label: event.tool,
                done: false,
              },
            ],
          }));
          break;
        case "tool_finished":
          patchAssistant((t) => ({
            ...t,
            activity: (t.activity ?? []).map((a) =>
              a.kind === "tool" && a.label === event.tool && !a.done
                ? { ...a, done: true }
                : a
            ),
          }));
          break;
        case "artifact":
          patchAssistant((t) => ({
            ...t,
            artifacts: [
              ...(t.artifacts ?? []),
              { id: activitySeq.current++, title: event.title, href: event.href },
            ],
          }));
          break;
        case "run_finished":
          if (event.conversationId) {
            conversationIdRef.current = event.conversationId;
          }
          onRunFinished?.();
          break;
        case "error":
          setError(event.message);
          break;
      }
    };

    try {
      const res = await fetch("/api/raalhu/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          conversationId: conversationIdRef.current,
        }),
      });
      if (res.status === 429) {
        throw new Error("Rate limit reached — give your team a minute to catch up.");
      }
      if (!res.ok || !res.body) {
        throw new Error("The AI team is unreachable right now.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        // SSE frames are separated by a blank line.
        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";
        for (const frame of frames) {
          const data = frame
            .split("\n")
            .filter((l) => l.startsWith("data:"))
            .map((l) => l.slice(5).trim())
            .join("");
          if (!data) continue;
          try {
            handleEvent(JSON.parse(data) as AgentEvent);
          } catch {
            // Ignore malformed frames.
          }
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      // Drop an assistant turn that never produced anything.
      setTurns((prev) => {
        const last = prev[prev.length - 1];
        if (
          last?.role === "assistant" &&
          !last.text &&
          (last.activity?.length ?? 0) === 0
        ) {
          return prev.slice(0, -1);
        }
        return prev;
      });
      setStreaming(false);
    }
  }, [onRunFinished]);

  return { turns, streaming, error, send };
}
