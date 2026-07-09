import { Camera, Music2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/raalhu/ui/card";
import { Badge } from "@/components/raalhu/ui/badge";
import { buttonVariants } from "@/components/raalhu/ui/button";
import { DisconnectSocialButton } from "@/components/raalhu/dashboard/DisconnectSocialButton";
import { cn } from "@/lib/utils";

type Provider = "INSTAGRAM" | "TIKTOK";

const PROVIDER_META: Record<
  Provider,
  { label: string; icon: typeof Camera; connectPath: string }
> = {
  INSTAGRAM: { label: "Instagram", icon: Camera, connectPath: "instagram" },
  TIKTOK: { label: "TikTok", icon: Music2, connectPath: "tiktok" },
};

const STATUS_MESSAGE: Record<string, string> = {
  instagram_state_mismatch: "Instagram connection failed a security check — please try again.",
  instagram_no_business_account:
    "No Instagram Business account is linked to your Facebook Pages. Convert your Instagram account to a Business or Creator account and connect it to a Page first.",
  instagram_connect_failed: "Couldn't connect Instagram — please try again.",
  tiktok_state_mismatch: "TikTok connection failed a security check — please try again.",
  tiktok_connect_failed: "Couldn't connect TikTok — please try again.",
};

export function ConnectedAccountsCard({
  accounts,
  isAdmin,
  connected,
  error,
  configured,
}: {
  accounts: { provider: Provider; displayName: string | null }[];
  isAdmin: boolean;
  connected?: string;
  error?: string;
  configured: Record<Provider, boolean>;
}) {
  const byProvider = new Map(accounts.map((a) => [a.provider, a]));

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="text-base">Connected accounts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {connected && (
          <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
            Connected {connected}.
          </p>
        )}
        {error && STATUS_MESSAGE[error] && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-red-400">
            {STATUS_MESSAGE[error]}
          </p>
        )}

        {(Object.keys(PROVIDER_META) as Provider[]).map((provider) => {
          const meta = PROVIDER_META[provider];
          const Icon = meta.icon;
          const account = byProvider.get(provider);
          return (
            <div
              key={provider}
              className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Icon className="size-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{meta.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {account ? account.displayName ?? account.provider.toLowerCase() : "Not connected"}
                  </p>
                </div>
              </div>
              {!configured[provider] ? (
                <Badge variant="outline">not configured</Badge>
              ) : account ? (
                <>
                  <Badge variant="success">connected</Badge>
                  {isAdmin && <DisconnectSocialButton provider={meta.connectPath as "instagram" | "tiktok"} />}
                </>
              ) : (
                isAdmin && (
                  <a
                    href={`/api/raalhu/social/${meta.connectPath}/connect`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    Connect
                  </a>
                )
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
