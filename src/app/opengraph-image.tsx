import { OG_SIZE, ogCard } from "./og-card";

export const alt = "Віха — безкоштовний курс з управління проєктами";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    kicker: "Безкоштовний курс українською за PMBOK 7 і 8",
    title: "Управління проєктами від першої віхи до результату",
  });
}
