import { NextRequest } from "next/server";
import { getStayBySlug } from "@/lib/staysServer";

const sceneLabels: Record<string, string> = {
  cover: "Arrival view",
  lounge: "Shared living",
  suite: "Private suite",
};

const sceneOffsets: Record<string, { circleX: string; circleY: string; waveY: string }> = {
  cover: { circleX: "80%", circleY: "18%", waveY: "280" },
  lounge: { circleX: "20%", circleY: "20%", waveY: "300" },
  suite: { circleX: "72%", circleY: "24%", waveY: "320" },
};

function colorPairForCollection(collection: string) {
  if (collection === "Quiet City Stays") {
    return { base: "#274037", accent: "#d8cbb7", soft: "#8fa89d" };
  }

  if (collection === "Slow Weekend Houses") {
    return { base: "#705139", accent: "#f0e2cf", soft: "#d5af8f" };
  }

  return { base: "#1f2f34", accent: "#efe0c7", soft: "#7fa0a1" };
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const stay = await getStayBySlug(slug);

  if (!stay) {
    return new Response("Not found", { status: 404 });
  }

  const scene = request.nextUrl.searchParams.get("scene") ?? "cover";
  const offsets = sceneOffsets[scene] ?? sceneOffsets.cover;
  const colors = colorPairForCollection(stay.collection);
  const label = sceneLabels[scene] ?? sceneLabels.cover;

  const svg = `
    <svg width="1200" height="900" viewBox="0 0 1200 900" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="900" fill="${colors.base}"/>
      <circle cx="${offsets.circleX}" cy="${offsets.circleY}" r="230" fill="${colors.soft}" fill-opacity="0.22"/>
      <path d="M0 ${offsets.waveY}C180 240 300 230 430 286C560 342 720 430 920 372C1030 340 1110 270 1200 236V900H0V${offsets.waveY}Z" fill="${colors.accent}" fill-opacity="0.92"/>
      <path d="M0 640C160 604 260 524 408 552C556 580 677 690 820 690C975 690 1084 609 1200 540V900H0V640Z" fill="#F7F4EE" fill-opacity="0.94"/>
      <rect x="112" y="122" width="976" height="656" rx="34" fill="white" fill-opacity="0.08" stroke="white" stroke-opacity="0.24"/>
      <text x="112" y="120" dx="56" dy="86" fill="#F7F4EE" font-family="Georgia, serif" font-size="66" letter-spacing="-2">${stay.title}</text>
      <text x="112" y="120" dx="56" dy="142" fill="#F7F4EE" font-family="Arial, sans-serif" font-size="24" opacity="0.78">${stay.location}, ${stay.country}</text>
      <text x="112" y="120" dx="56" dy="186" fill="#F7F4EE" font-family="Arial, sans-serif" font-size="22" opacity="0.64">${label}</text>
      <text x="112" y="120" dx="56" dy="570" fill="#F7F4EE" font-family="Arial, sans-serif" font-size="24" opacity="0.8">${stay.bestFor}</text>
      <text x="112" y="120" dx="56" dy="620" fill="#F7F4EE" font-family="Arial, sans-serif" font-size="22" opacity="0.64">${stay.collection}</text>
    </svg>
  `;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
