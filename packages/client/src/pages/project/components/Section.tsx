import { Badge } from '../../../common/components/ui';

interface SectionProps {
  title: string;
  badges?: { id: string; value: string }[];
  children: React.ReactNode;
}

export function Section({ title, badges, children }: SectionProps) {
  return (
    <div className="bg-card rounded-xl">
      <div className="sticky -top-4 md:-top-6 bg-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-secondary/60 z-20 rounded-t-xl border-b border-border/50">
        <h2 className="text-xl md:text-2xl font-bold py-3 md:py-4 px-4 md:px-6 text-foreground">
          {title}
        </h2>
      </div>
      {badges && badges.length > 0 && (
        <div className="flex gap-2 px-4 md:px-6 pt-3 md:pt-6">
          {badges.map((badge) => (
            <Badge key={badge.id} variant="secondary">
              {badge.value}
            </Badge>
          ))}
        </div>
      )}
      <div className="p-3 md:p-6">{children}</div>
    </div>
  );
}
