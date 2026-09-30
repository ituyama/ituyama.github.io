"use client";

import type { ReactNode } from "react";

import { useContactForm } from "@/components/ContactFormProvider";
import type { ContactIntent } from "@/lib/contact";

type Props = ContactIntent & {
  children: ReactNode;
  className?: string;
};

export default function ContactButton({ children, className, ...intent }: Props) {
  const { openContact } = useContactForm();

  return (
    <button type="button" className={className} onClick={() => openContact(intent)}>
      {children}
    </button>
  );
}
