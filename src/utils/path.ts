export function isPathActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;

  return pathname === href || pathname.startsWith(href + "/");
}
