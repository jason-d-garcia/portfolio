import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Jason Garcia: applied ML for learning";

export default function Image() {
  return ogImage("Applied ML for learning", "I build human-centered machine learning and ship it as things people can use.");
}
