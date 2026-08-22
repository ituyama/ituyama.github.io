"use client";

import ContactButton from "@/components/ContactButton";

export default function ContactSideNavButton() {
  return (
    <ContactButton
      subject="ポートフォリオからの連絡"
      source="サイドナビ"
      className="flex size-11 items-center justify-center rounded-[10px] text-[1.2rem] text-bento-ink hover:bg-white"
    >
      <span className="sr-only">お問い合わせ</span>
      <i className="bi bi-envelope" aria-hidden="true" />
    </ContactButton>
  );
}
