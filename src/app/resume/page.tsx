import { notFound, redirect } from "next/navigation";
import { hasResume } from "@/lib/site";

export const dynamic = "force-static";

export default function ResumePage() {
  if (!hasResume) notFound();
  redirect("/resume.pdf");
}
