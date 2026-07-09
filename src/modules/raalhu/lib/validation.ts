import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(48)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Lowercase letters, numbers, and hyphens only",
    }),
  profile: z.object({
    businessName: z.string().trim().min(1).max(120),
    industry: z.string().trim().max(80).optional(),
    description: z.string().trim().max(2000).optional(),
    targetAudience: z.string().trim().max(2000).optional(),
    brandVoice: z.string().trim().max(2000).optional(),
    websiteUrl: z
      .union([z.url(), z.literal("")])
      .optional(),
    goals: z.array(z.string().trim().min(1).max(200)).max(10).optional(),
  }),
});
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

export const chatRequestSchema = z.object({
  conversationId: z.cuid().optional(),
  message: z.string().trim().min(1).max(8000),
});
export type ChatRequestInput = z.infer<typeof chatRequestSchema>;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}
