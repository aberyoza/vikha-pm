import { COURSE_KIND } from "@/lib/paywall";
import { OG_SIZE, ogCard } from "./og-card";

export const alt = `Віха — ${COURSE_KIND.toLowerCase()} з управління проєктами`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    kicker: `${COURSE_KIND} українською за PMBOK 7 і 8`,
    title: "Управління проєктами від першої віхи до результату",
  });
}
