import type { Family } from "@/lib/platforms";

export type NavItem = { href: string; label: string; family?: Family };

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Início" },
  { href: "/plataforma/pc", label: "PC", family: "pc" },
  { href: "/plataforma/xbox", label: "Xbox", family: "xbox" },
  { href: "/plataforma/playstation", label: "PlayStation", family: "playstation" },
  { href: "/plataforma/nintendo", label: "Nintendo", family: "nintendo" },
  { href: "/plataforma/sega", label: "Sega", family: "sega" },
  { href: "/jogos", label: "Meus Jogos" },
];

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
