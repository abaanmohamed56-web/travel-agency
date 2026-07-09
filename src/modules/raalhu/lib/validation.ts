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

export const leadStages = ["LEAD", "MQL", "SQL", "CUSTOMER", "CHURNED"] as const;

export const createContactSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  email: z.union([z.email(), z.literal("")]).optional(),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(120).optional(),
  stage: z.enum(leadStages).optional().default("LEAD"),
  source: z.string().trim().max(80).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
});
export type CreateContactInput = z.infer<typeof createContactSchema>;

export const updateContactSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  email: z.union([z.email(), z.literal("")]).optional(),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(120).optional(),
  stage: z.enum(leadStages).optional(),
  source: z.string().trim().max(80).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
});
export type UpdateContactInput = z.infer<typeof updateContactSchema>;

export const addContactNoteSchema = z.object({
  body: z.string().trim().min(1).max(4000),
});
export type AddContactNoteInput = z.infer<typeof addContactNoteSchema>;

export const campaignStatuses = [
  "DRAFT",
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
  "ARCHIVED",
] as const;

export const createCampaignSchema = z.object({
  name: z.string().trim().min(1).max(120),
  objective: z.string().trim().max(2000).optional(),
  channels: z.array(z.string().trim().min(1).max(40)).max(10).optional(),
  budget: z.number().positive().max(10_000_000).optional(),
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
});
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;

export const updateCampaignSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  objective: z.string().trim().max(2000).optional(),
  channels: z.array(z.string().trim().min(1).max(40)).max(10).optional(),
  budget: z.number().positive().max(10_000_000).optional(),
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
  status: z.enum(campaignStatuses).optional(),
});
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;

export const contentTypes = [
  "SOCIAL_POST",
  "BLOG_POST",
  "EMAIL",
  "AD_COPY",
  "SCRIPT",
  "OTHER",
] as const;

export const contentStatuses = [
  "IDEA",
  "DRAFT",
  "REVIEW",
  "APPROVED",
  "SCHEDULED",
  "PUBLISHED",
] as const;

export const createContentItemSchema = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().max(20000).optional(),
  contentType: z.enum(contentTypes).optional().default("SOCIAL_POST"),
  channel: z.string().trim().max(40).optional(),
  status: z.enum(contentStatuses).optional().default("DRAFT"),
  scheduledAt: z.iso.datetime().optional(),
  campaignId: z.cuid().optional(),
});
export type CreateContentItemInput = z.infer<typeof createContentItemSchema>;

export const updateContentItemSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  body: z.string().trim().max(20000).optional(),
  contentType: z.enum(contentTypes).optional(),
  channel: z.string().trim().max(40).optional(),
  status: z.enum(contentStatuses).optional(),
  scheduledAt: z.iso.datetime().optional(),
  campaignId: z.cuid().optional(),
});
export type UpdateContentItemInput = z.infer<typeof updateContentItemSchema>;

export const updateBusinessProfileSchema = z.object({
  businessName: z.string().trim().min(1).max(120).optional(),
  industry: z.string().trim().max(80).optional(),
  description: z.string().trim().max(2000).optional(),
  targetAudience: z.string().trim().max(2000).optional(),
  brandVoice: z.string().trim().max(2000).optional(),
  websiteUrl: z.union([z.url(), z.literal("")]).optional(),
  goals: z.array(z.string().trim().min(1).max(200)).max(10).optional(),
});
export type UpdateBusinessProfileInput = z.infer<
  typeof updateBusinessProfileSchema
>;

/** OWNER is excluded — ownership isn't transferable through the members API. */
export const assignableMembershipRoles = ["ADMIN", "MEMBER", "VIEWER"] as const;

export const inviteMemberSchema = z.object({
  email: z.email(),
  role: z.enum(assignableMembershipRoles).optional().default("MEMBER"),
});
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

export const updateMemberRoleSchema = z.object({
  role: z.enum(assignableMembershipRoles),
});
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;

export const createApiKeySchema = z.object({
  name: z.string().trim().min(1).max(80),
});
export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}
