import { defineConfig } from "vite";
import { readdirSync, statSync } from "fs";
import { resolve, relative } from "path";

const root = import.meta.dirname;

/**
 * Recense toutes les pages HTML sous `pages/` pour les enregistrer comme
 * points d'entrée du build. Evite d'avoir a mettre a jour ce fichier
 * manuellement a chaque nouvelle fiche compétence/réalisation créée.
 */
function findHtmlEntries(
  dir: string,
  entries: Record<string, string> = {},
): Record<string, string> {
  for (const name of readdirSync(dir)) {
    const fullPath = resolve(dir, name);
    if (statSync(fullPath).isDirectory()) {
      findHtmlEntries(fullPath, entries);
    } else if (name.endsWith(".html")) {
      const key = relative(root, fullPath)
        .replace(/[\\/]/g, "-")
        .replace(/\.html$/, "");
      entries[key] = fullPath;
    }
  }
  return entries;
}

export default defineConfig(({ command }) => ({
  // Le site est publié sur GitHub Pages en tant que "project page"
  // (https://<user>.github.io/Portfolio---Iscod/) : les assets doivent donc
  // être préfixés par le nom du dépôt en build. En dev, on reste à la racine.
  base: command === "build" ? "/Portfolio---Iscod/" : "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        ...findHtmlEntries(resolve(root, "pages")),
      },
    },
  },
}));
