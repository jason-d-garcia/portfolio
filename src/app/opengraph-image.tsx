import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Jason Garcia: applied ML for learning";

export default function Image() {
  return ogImage("Jason Garcia", "Machine learning, optimization and interactive software, built to help people learn, create and do more.");
}
