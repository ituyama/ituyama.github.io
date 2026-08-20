export default function SectionHead({
  id,
  title,
  subtitle,
  long = false,
}: {
  id: string;
  title: string;
  subtitle?: string;
  long?: boolean;
}) {
  return (
    <div className="pop-section-head">
      <h2 id={id} className={`pop-policy-mark${long ? " pop-policy-mark-long" : ""}`}>
        {title}
      </h2>
      {subtitle ? <p className="pop-section-intro">{subtitle}</p> : null}
    </div>
  );
}
