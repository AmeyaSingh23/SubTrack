"use client";

import { useState } from "react";
import { getServiceDomain, getClearbitLogoUrl, getFaviconUrl } from "@/lib/service-logo";

type Props = {
  name: string;
  size?: number;
  className?: string;
};

export function ServiceLogo({ name, size = 32, className = "" }: Props) {
  const domain = getServiceDomain(name);
  console.log(name, "→", domain);

  
  // Track which source we're on: clearbit → favicon → letter
  const [stage, setStage] = useState<"favicon" | "letter">(
    domain ? "favicon" : "letter");

  if (stage === "letter" || !domain) {
    return <LetterAvatar name={name} size={size} className={className} />;
  }

  const src = getFaviconUrl(domain);

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center bg-white/5 overflow-hidden ${className}`}
    >
      <img
        src={src}
        alt={`${name} logo`}
        width={size}
        height={size}
        className="object-contain p-1"
        onError={() => setStage("letter")}
      />
    </div>
  );
}

function LetterAvatar({ name, size, className }: { name: string; size: number; className: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`flex items-center justify-center border border-white/10 font-mono text-xs text-white/40 ${className}`}
    >
      {name[0].toUpperCase()}
    </div>
  );
}