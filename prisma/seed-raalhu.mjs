/**
 * Seeds a demo Raalhu AI workspace: org, business profile, campaigns,
 * scheduled content, CRM contacts, and notifications.
 *
 * Usage: npm run db:seed:raalhu
 * Login: demo@raalhu.ai / raalhu-demo
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function daysFromNow(days, hour = 10) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d;
}

async function main() {
  const password = await bcrypt.hash("raalhu-demo", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@raalhu.ai" },
    update: {},
    create: {
      email: "demo@raalhu.ai",
      name: "Demo Founder",
      password,
      emailVerified: new Date(),
    },
  });

  const existing = await prisma.organization.findUnique({
    where: { slug: "raalhu-demo" },
  });
  if (existing) {
    console.log("Demo org already seeded — deleting and re-seeding.");
    await prisma.organization.delete({ where: { id: existing.id } });
  }

  const org = await prisma.organization.create({
    data: {
      name: "Villa Faru Guesthouse",
      slug: "raalhu-demo",
      plan: "GROWTH",
      memberships: { create: { userId: user.id, role: "OWNER" } },
      businessProfile: {
        create: {
          businessName: "Villa Faru Guesthouse",
          industry: "Hospitality & Travel",
          description:
            "A 12-room beachfront guesthouse on a local Maldivian island offering diving trips, sandbank picnics, and authentic local experiences.",
          targetAudience:
            "Adventure travelers and couples aged 25-45 from Europe looking for affordable Maldives stays outside resorts.",
          brandVoice:
            "Warm, personal, and adventurous. Sounds like a local friend showing you the real Maldives — never corporate.",
          websiteUrl: "https://villafaru.example.com",
          goals: ["More direct bookings", "Grow social media", "Build brand awareness"],
        },
      },
    },
  });

  const summerCampaign = await prisma.campaign.create({
    data: {
      organizationId: org.id,
      createdById: user.id,
      name: "Monsoon Escape — Direct Booking Push",
      objective:
        "Drive 30% more direct bookings for the low season by promoting monsoon-special rates and diving packages to past guests and lookalike audiences.",
      status: "ACTIVE",
      channels: ["instagram", "facebook", "email"],
      budget: "1500.00",
      startDate: daysFromNow(-14),
      endDate: daysFromNow(30),
      brief: {
        angle: "The Maldives locals keep to themselves — half price in monsoon season",
        offer: "20% off direct bookings + free sandbank picnic",
      },
    },
  });

  const ugcCampaign = await prisma.campaign.create({
    data: {
      organizationId: org.id,
      createdById: user.id,
      name: "Guest Stories — UGC Flywheel",
      objective:
        "Collect and repost guest photos and reviews to build social proof and grow Instagram followers by 2k this quarter.",
      status: "DRAFT",
      channels: ["instagram", "tiktok"],
      brief: {
        mechanic: "Free excursion entry for tagged posts using #VillaFaruLife",
      },
      createdByAgent: true,
    },
  });

  const content = [
    { title: "Reel: Sunrise dive at the house reef", channel: "instagram", contentType: "SOCIAL_POST", status: "SCHEDULED", campaignId: summerCampaign.id, scheduledAt: daysFromNow(1, 9), body: "POV: your 6am alarm is a whale shark. 🦈 House-reef dives daily — gear included.\n\n#Maldives #DiveLife #VillaFaru" },
    { title: "Carousel: 5 things resorts won't show you", channel: "instagram", contentType: "SOCIAL_POST", status: "SCHEDULED", campaignId: summerCampaign.id, scheduledAt: daysFromNow(3, 18), body: "Slide 1: The real Maldives is on local islands…" },
    { title: "Email: Monsoon special for past guests", channel: "email", contentType: "EMAIL", status: "APPROVED", campaignId: summerCampaign.id, scheduledAt: daysFromNow(5, 8), body: "Subject: The Maldives, half price (locals' secret season)" },
    { title: "Facebook ad: 20% off direct bookings", channel: "facebook", contentType: "AD_COPY", status: "REVIEW", campaignId: summerCampaign.id, scheduledAt: daysFromNow(7, 12), body: "Skip the booking sites. Book direct, save 20%, and we'll throw in a sandbank picnic." },
    { title: "Reel: Sandbank picnic setup timelapse", channel: "instagram", contentType: "SOCIAL_POST", status: "DRAFT", campaignId: ugcCampaign.id, scheduledAt: daysFromNow(9, 17), body: "Setting up your private sandbank in 60 seconds. 🏝️" },
    { title: "TikTok: Guest reacts to first manta sighting", channel: "tiktok", contentType: "SOCIAL_POST", status: "DRAFT", campaignId: ugcCampaign.id, scheduledAt: daysFromNow(12, 19), createdByAgent: true },
    { title: "Blog: Local island vs resort — honest guide", channel: "blog", contentType: "BLOG_POST", status: "IDEA", scheduledAt: daysFromNow(15, 10), createdByAgent: true },
    { title: "Story series: A day with our dive master", channel: "instagram", contentType: "SOCIAL_POST", status: "IDEA", scheduledAt: daysFromNow(18, 11) },
    { title: "Email: Last chance — monsoon rates end soon", channel: "email", contentType: "EMAIL", status: "DRAFT", campaignId: summerCampaign.id, scheduledAt: daysFromNow(25, 8) },
  ];
  for (const item of content) {
    await prisma.contentItem.create({
      data: { organizationId: org.id, createdById: user.id, ...item },
    });
  }

  const contacts = [
    { name: "Anna Bergström", email: "anna.b@example.com", company: "—", stage: "CUSTOMER", source: "Direct booking", tags: ["repeat-guest", "diver"] },
    { name: "Lukas Weber", email: "lukas.w@example.com", stage: "SQL", source: "Instagram DM", tags: ["honeymoon"] },
    { name: "Emma Laurent", email: "emma.l@example.com", stage: "LEAD", source: "Website form", tags: ["family"] },
    { name: "Tom Richards", email: "tom.r@example.com", stage: "MQL", source: "Newsletter", tags: ["diver"] },
    { name: "Sofia Rossi", email: "sofia.r@example.com", stage: "CUSTOMER", source: "Booking.com → direct", tags: ["repeat-guest"] },
    { name: "Jan Kowalski", email: "jan.k@example.com", stage: "LEAD", source: "Facebook ad", tags: [] },
    { name: "Marie Dubois", email: "marie.d@example.com", stage: "SQL", source: "WhatsApp", tags: ["group-booking"] },
    { name: "Chen Wei", email: "chen.w@example.com", stage: "LEAD", source: "Instagram", tags: ["photographer"] },
    { name: "Olga Petrova", email: "olga.p@example.com", stage: "CHURNED", source: "Newsletter", tags: [] },
    { name: "David Kim", email: "david.k@example.com", stage: "MQL", source: "Blog", tags: ["diver", "solo"] },
    { name: "Laura García", email: "laura.g@example.com", stage: "CUSTOMER", source: "Referral", tags: ["influencer"] },
    { name: "James O'Brien", email: "james.o@example.com", stage: "LEAD", source: "TikTok", tags: [] },
  ];
  for (const c of contacts) {
    await prisma.contact.create({ data: { organizationId: org.id, ...c } });
  }

  await prisma.raalhuNotification.createMany({
    data: [
      { organizationId: org.id, userId: user.id, title: "Campaign is live", body: "“Monsoon Escape” started delivering across Instagram, Facebook, and email.", type: "success" },
      { organizationId: org.id, userId: user.id, title: "3 posts scheduled this week", body: "Your content calendar has 3 items going out in the next 7 days.", type: "info" },
      { organizationId: org.id, title: "New lead from Facebook ad", body: "Jan Kowalski asked about availability in August.", type: "info" },
      { organizationId: org.id, userId: user.id, title: "Content awaiting review", body: "The Facebook ad copy for Monsoon Escape needs your approval.", type: "warning" },
    ],
  });

  await prisma.auditLog.create({
    data: {
      organizationId: org.id,
      actorUserId: user.id,
      action: "organization.seeded",
      targetType: "Organization",
      targetId: org.id,
    },
  });

  console.log("Seeded demo workspace:");
  console.log("  org:   Villa Faru Guesthouse (raalhu-demo)");
  console.log("  login: demo@raalhu.ai / raalhu-demo");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
