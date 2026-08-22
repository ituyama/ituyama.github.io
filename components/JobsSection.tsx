import OpeningsSection from "@/components/OpeningsSection";
import { jobs } from "@/lib/jobs";

export default function JobsSection() {
  if (!jobs.openings.length) return null;
  return <OpeningsSection id="jobs" feed={jobs} />;
}
