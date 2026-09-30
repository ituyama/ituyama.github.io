"use client";

import ContactButton from "@/components/ContactButton";
import { jobs } from "@/lib/jobs";

export default function JobsSection() {
  const job = jobs.openings[0];
  if (!job) return null;

  const contactSubject = `${jobs.mailtoPrefix || "案件相談"}: ${job.org}`;

  return (
    <section id="jobs" className="pop-work scroll-mt-10 md:pl-[72px]" aria-labelledby="jobs-title">
      <div className="pop-policy-inner">
        <h2 id="jobs-title" className="pop-policy-mark">
          {jobs.title}
        </h2>
        {job.summary ? <p className="pop-policy-body">{job.summary}</p> : null}
        {job.cta ? (
          <ContactButton
            subject={contactSubject}
            source={`${jobs.title} / ${job.org}`}
            className="pop-btn mt-5 w-fit"
          >
            <i className="bi bi-envelope-fill" aria-hidden="true" />
            {job.cta}
          </ContactButton>
        ) : null}
      </div>
    </section>
  );
}
