import type { Metadata } from "next";
import OgCard from "@/components/OgCard";

export const metadata: Metadata = {
  title: "OG",
  robots: { index: false, follow: false },
};

export default function OgPage() {
  return <OgCard />;
}
