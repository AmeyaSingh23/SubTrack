// Maps common subscription names → their domain
// The domain is all we need to fetch a logo
const SERVICE_DOMAINS: Record<string, string> = {
  netflix: "netflix.com",
  spotify: "spotify.com",
  youtube: "youtube.com",
  "youtube premium": "youtube.com",
  apple: "apple.com",
  "apple music": "apple.com",
  "apple tv": "apple.com",
  "apple tv+": "apple.com",
  "apple one": "apple.com",
  amazon: "amazon.com",
  "amazon prime": "amazon.com",
  "prime video": "amazon.com",
  disney: "disneyplus.com",
  "disney+": "disneyplus.com",
  hotstar: "hotstar.com",
  "jio cinema": "jiocinema.com",
  jiocinema: "jiocinema.com",
  "sony liv": "sonyliv.com",
  sonyliv: "sonyliv.com",
  zee5: "zee5.com",
  hbo: "hbomax.com",
  "hbo max": "hbomax.com",
  max: "max.com",
  hulu: "hulu.com",
  paramount: "paramountplus.com",
  "paramount+": "paramountplus.com",
  peacock: "peacocktv.com",
  crunchyroll: "crunchyroll.com",
  mxplayer: "mxplayer.in",
  "mx player": "mxplayer.in",
  github: "github.com",
  gitlab: "gitlab.com",
  notion: "notion.so",
  slack: "slack.com",
  figma: "figma.com",
  adobe: "adobe.com",
  "adobe creative cloud": "adobe.com",
  canva: "canva.com",
  dropbox: "dropbox.com",
  "google one": "one.google.com",
  "google workspace": "workspace.google.com",
  chatgpt: "openai.com",
  openai: "openai.com",
  claude: "anthropic.com",
  midjourney: "midjourney.com",
  "github copilot": "github.com",
  cursor: "cursor.com",
  vercel: "vercel.com",
  "linear": "linear.app",
  loom: "loom.com",
  zoom: "zoom.us",
  "microsoft 365": "microsoft.com",
  "microsoft office": "microsoft.com",
  office: "microsoft.com",
  xbox: "xbox.com",
  "xbox game pass": "xbox.com",
  playstation: "playstation.com",
  "ps plus": "playstation.com",
  "playstation plus": "playstation.com",
  duolingo: "duolingo.com",
  headspace: "headspace.com",
  calm: "calm.com",
  grammarly: "grammarly.com",
  "1password": "1password.com",
  lastpass: "lastpass.com",
  nordvpn: "nordvpn.com",
  expressvpn: "expressvpn.com",
  protonmail: "proton.me",
  "proton mail": "proton.me",
};

export function getServiceDomain(name: string): string | null {
  const normalized = name.toLowerCase().trim();
  
  // 1. Exact match
  if (SERVICE_DOMAINS[normalized]) return SERVICE_DOMAINS[normalized];
  
  // 2. Partial match — "Netflix (Family)" should still match "netflix"
  for (const [key, domain] of Object.entries(SERVICE_DOMAINS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return domain;
    }
  }
  
  // 3. Guess the domain — "Spotify" → "spotify.com"
  // Works for tons of SaaS tools that use their own name as a .com domain
  const guessed = normalized.replace(/[^a-z0-9]/g, "") + ".com";
  return guessed; // We'll handle failure in the component with onError
}

export function getClearbitLogoUrl(domain: string): string {
  return `https://logo.clearbit.com/${domain}`;
}

export function getFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}