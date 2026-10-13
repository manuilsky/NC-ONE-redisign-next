/** Mirrors `basePath` from next.config (via NEXT_PUBLIC_BASE_PATH). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-absolute public asset path with the app basePath. */
export function withBasePath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith(basePath + "/")) {
    return path;
  }
  return `${basePath}${path}`;
}
