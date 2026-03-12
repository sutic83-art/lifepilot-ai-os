import { ReactNode } from "react";

type SectionCardProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

export function SectionCard({
  title,
  subtitle,
  children,
}: SectionCardProps) {
  return (
    <section className="rounded-3xl border p-6">
      {(title || subtitle) && (
        <div className="mb-4">
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {title && (
            <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
          )}
        </div>
      )}

      {children}
    </section>
  );
}