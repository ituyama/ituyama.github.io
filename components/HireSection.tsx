import OpeningsSection from "@/components/OpeningsSection";
import { hire } from "@/lib/hire";

export default function HireSection() {
  if (!hire.openings.length) return null;
  return <OpeningsSection id="hire" feed={hire} />;
}
