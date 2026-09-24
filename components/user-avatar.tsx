import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function UserAvatar({
  src,
  name,
  className,
}: {
  src: string | null | undefined;
  name: string;
  className?: string;
}) {
  const initials = name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <Avatar className={cn("ring-2 ring-primary/40", className)}>
      {src && (
        <AvatarImage
          src={src}
          alt={name}
          // Nitidez "pixel" só nos sprites prontos; fotos enviadas ficam suaves.
          className={cn("object-cover", src.startsWith("/avatars/") && "pixelated")}
        />
      )}
      <AvatarFallback className="bg-linear-to-br from-glow to-glow-2 font-heading font-bold text-primary-foreground">
        {initials || "P1"}
      </AvatarFallback>
    </Avatar>
  );
}
