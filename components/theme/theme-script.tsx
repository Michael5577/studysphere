import { THEME_STORAGE_KEY } from "@/lib/theme/storage";

/** Inline script to apply theme before first paint (prevents flash). */
export function ThemeScript() {
  const script = `
(function () {
  var KEY = ${JSON.stringify(THEME_STORAGE_KEY)};
  var root = document.documentElement;
  try {
    var raw = localStorage.getItem(KEY);
    if (!raw) return;
    var p = JSON.parse(raw);
    var scheme = p.colorScheme || "system";
    var bg = p.backgroundStyle || "vivid";
    var dark =
      scheme === "dark" ||
      (scheme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.dataset.theme = dark ? "dark" : "light";
    root.dataset.colorScheme = scheme;
    root.dataset.bg = bg;
    root.style.colorScheme = dark ? "dark" : "light";
  } catch (e) {}
})();
`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
