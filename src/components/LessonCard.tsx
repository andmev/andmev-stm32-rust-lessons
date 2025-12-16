interface Props {
  number: number;
  label?: string;
  title: string;
  description: string;
  category?: string;
  href: string;
}

export default function LessonCard({ number, label = 'Lesson', title, description, href }: Props) {
  return (
    <a
      href={href}
      className="group relative block rounded-[var(--radius-card)] bg-surface p-6 ring-1 ring-foreground/5 transition duration-300 hover:-translate-y-0.5 hover:ring-foreground/10 hover:shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-10"
    >
      <div className="space-y-3">
        <p className="text-sm text-muted tracking-wide">
          {label} {number}
        </p>

        <h3 className="font-sans-narrow text-foreground [font-size:clamp(1.3rem,0.9vw+1.05rem,2rem)] leading-[1.15] [text-wrap:balance]">
          {title}
        </h3>

        <p className="text-muted [font-size:clamp(1rem,0.45vw+0.95rem,1.5rem)] leading-[1.65]">
          {description}
        </p>
      </div>
    </a>
  );
}
