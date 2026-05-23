export type ServiceEntry = {
  domain: string;
  category: "Streaming" | "Music" | "Work" | "Utilities" | "Health" | "Other";
  billingCycle: "monthly" | "yearly" | "weekly";
  cancelUrl: string;
};

export const SERVICE_REGISTRY: Record<string, ServiceEntry> = {
  netflix: {
    domain: "netflix.com",
    category: "Streaming",
    billingCycle: "monthly",
    cancelUrl: "https://www.netflix.com/cancelplan",
  },
  spotify: {
    domain: "spotify.com",
    category: "Music",
    billingCycle: "monthly",
    cancelUrl: "https://www.spotify.com/account/subscription/",
  },
  "youtube premium": {
    domain: "youtube.com",
    category: "Streaming",
    billingCycle: "monthly",
    cancelUrl: "https://www.youtube.com/paid_memberships",
  },
  "apple music": {
    domain: "apple.com",
    category: "Music",
    billingCycle: "monthly",
    cancelUrl: "https://appleid.apple.com/account/manage",
  },
  "apple tv+": {
    domain: "apple.com",
    category: "Streaming",
    billingCycle: "monthly",
    cancelUrl: "https://appleid.apple.com/account/manage",
  },
  "apple one": {
    domain: "apple.com",
    category: "Other",
    billingCycle: "monthly",
    cancelUrl: "https://appleid.apple.com/account/manage",
  },
  "amazon prime": {
    domain: "amazon.com",
    category: "Streaming",
    billingCycle: "yearly",
    cancelUrl: "https://www.amazon.in/mc/pipelines/cancellation",
  },
  "disney+": {
    domain: "disneyplus.com",
    category: "Streaming",
    billingCycle: "monthly",
    cancelUrl: "https://www.disneyplus.com/account/subscription",
  },
  hotstar: {
    domain: "hotstar.com",
    category: "Streaming",
    billingCycle: "monthly",
    cancelUrl: "https://www.hotstar.com/in/account",
  },
  "jio cinema": {
    domain: "jiocinema.com",
    category: "Streaming",
    billingCycle: "monthly",
    cancelUrl: "https://www.jiocinema.com/my-account",
  },
  "sony liv": {
    domain: "sonyliv.com",
    category: "Streaming",
    billingCycle: "monthly",
    cancelUrl: "https://www.sonyliv.com/settings",
  },
  zee5: {
    domain: "zee5.com",
    category: "Streaming",
    billingCycle: "monthly",
    cancelUrl: "https://www.zee5.com/subscription",
  },
  "mx player": {
    domain: "mxplayer.in",
    category: "Streaming",
    billingCycle: "monthly",
    cancelUrl: "https://www.mxplayer.in/subscription",
  },
  hulu: {
    domain: "hulu.com",
    category: "Streaming",
    billingCycle: "monthly",
    cancelUrl: "https://secure.hulu.com/account/cancel",
  },
  "hbo max": {
    domain: "max.com",
    category: "Streaming",
    billingCycle: "monthly",
    cancelUrl: "https://www.max.com/account/subscription",
  },
  "paramount+": {
    domain: "paramountplus.com",
    category: "Streaming",
    billingCycle: "monthly",
    cancelUrl: "https://www.paramountplus.com/account/",
  },
  crunchyroll: {
    domain: "crunchyroll.com",
    category: "Streaming",
    billingCycle: "monthly",
    cancelUrl: "https://www.crunchyroll.com/account/membership",
  },
  notion: {
    domain: "notion.so",
    category: "Work",
    billingCycle: "monthly",
    cancelUrl: "https://www.notion.so/profile/plans",
  },
  slack: {
    domain: "slack.com",
    category: "Work",
    billingCycle: "monthly",
    cancelUrl: "https://slack.com/account/settings",
  },
  figma: {
    domain: "figma.com",
    category: "Work",
    billingCycle: "monthly",
    cancelUrl: "https://www.figma.com/settings",
  },
  "adobe creative cloud": {
    domain: "adobe.com",
    category: "Work",
    billingCycle: "monthly",
    cancelUrl: "https://account.adobe.com/plans",
  },
  canva: {
    domain: "canva.com",
    category: "Work",
    billingCycle: "monthly",
    cancelUrl: "https://www.canva.com/settings/purchase-history",
  },
  dropbox: {
    domain: "dropbox.com",
    category: "Work",
    billingCycle: "monthly",
    cancelUrl: "https://www.dropbox.com/account/plan",
  },
  "google one": {
    domain: "one.google.com",
    category: "Utilities",
    billingCycle: "monthly",
    cancelUrl: "https://one.google.com/storage",
  },
  "microsoft 365": {
    domain: "microsoft.com",
    category: "Work",
    billingCycle: "yearly",
    cancelUrl: "https://account.microsoft.com/services",
  },
  github: {
    domain: "github.com",
    category: "Work",
    billingCycle: "monthly",
    cancelUrl: "https://github.com/settings/billing/subscriptions",
  },
  "github copilot": {
    domain: "github.com",
    category: "Work",
    billingCycle: "monthly",
    cancelUrl: "https://github.com/settings/billing/licensing",
  },
  chatgpt: {
    domain: "openai.com",
    category: "Work",
    billingCycle: "monthly",
    cancelUrl: "https://chatgpt.com",
  },
  cursor: {
    domain: "cursor.com",
    category: "Work",
    billingCycle: "monthly",
    cancelUrl: "https://cursor.com/settings",
  },
  vercel: {
    domain: "vercel.com",
    category: "Work",
    billingCycle: "monthly",
    cancelUrl: "https://vercel.com/dashboard/settings/billing",
  },
  linear: {
    domain: "linear.app",
    category: "Work",
    billingCycle: "monthly",
    cancelUrl: "https://linear.app/settings/billing",
  },
  loom: {
    domain: "loom.com",
    category: "Work",
    billingCycle: "monthly",
    cancelUrl: "https://www.loom.com/settings/plans",
  },
  zoom: {
    domain: "zoom.us",
    category: "Work",
    billingCycle: "monthly",
    cancelUrl: "https://zoom.us/billing",
  },
  duolingo: {
    domain: "duolingo.com",
    category: "Health",
    billingCycle: "monthly",
    cancelUrl: "https://www.duolingo.com/settings/super",
  },
  headspace: {
    domain: "headspace.com",
    category: "Health",
    billingCycle: "monthly",
    cancelUrl: "https://www.headspace.com/account",
  },
  calm: {
    domain: "calm.com",
    category: "Health",
    billingCycle: "yearly",
    cancelUrl: "https://www.calm.com/account",
  },
  grammarly: {
    domain: "grammarly.com",
    category: "Work",
    billingCycle: "monthly",
    cancelUrl: "https://account.grammarly.com/subscription",
  },
  nordvpn: {
    domain: "nordvpn.com",
    category: "Utilities",
    billingCycle: "yearly",
    cancelUrl: "https://my.nordaccount.com/dashboard/nordvpn/subscriptions/",
  },
  expressvpn: {
    domain: "expressvpn.com",
    category: "Utilities",
    billingCycle: "yearly",
    cancelUrl: "https://www.expressvpn.com/account",
  },
  "1password": {
    domain: "1password.com",
    category: "Utilities",
    billingCycle: "yearly",
    cancelUrl: "https://my.1password.com/profile",
  },
  "xbox game pass": {
    domain: "xbox.com",
    category: "Other",
    billingCycle: "monthly",
    cancelUrl: "https://account.microsoft.com/services",
  },
  "playstation plus": {
    domain: "playstation.com",
    category: "Other",
    billingCycle: "monthly",
    cancelUrl: "https://www.playstation.com/en-in/playstation-plus/",
  },
};

export function matchService(input: string): { key: string; entry: ServiceEntry } | null {
  const normalized = input.toLowerCase().trim();
  if (!normalized || normalized.length < 2) return null;

  // 1. Exact match
  if (SERVICE_REGISTRY[normalized]) {
    return { key: normalized, entry: SERVICE_REGISTRY[normalized] };
  }

  // 2. Registry key starts with what user typed ("netf" → "netflix")
  // Minimum 3 chars to avoid matching too early ("sp" → "spotify")
  if (normalized.length >= 3) {
    for (const [key, entry] of Object.entries(SERVICE_REGISTRY)) {
      if (key.startsWith(normalized)) {
        return { key, entry };
      }
    }
  }

  // Removed the normalized.includes(key) check entirely —
  // it was too eager ("not" matching "notion", "app" matching "apple music")

  return null;
}