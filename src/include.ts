/**
 * Injecte le header et le footer communs (public/partials/) dans chaque page.
 */
export async function loadPartials(): Promise<void> {
  const base = import.meta.env.BASE_URL;
  const [headerHtml, footerHtml] = await Promise.all([
    fetch(`${base}partials/header.html`).then((res) => res.text()),
    fetch(`${base}partials/footer.html`).then((res) => res.text()),
  ]);

  const headerEl = document.getElementById("header-placeholder");
  const footerEl = document.getElementById("footer-placeholder");

  if (headerEl) headerEl.innerHTML = headerHtml;
  if (footerEl) footerEl.innerHTML = footerHtml;

  initHeaderBehavior();
  rewriteRootRelativeUrls(document);
}

/**
 * Les pages écrivent leurs liens/chemins internes en absolu (/pages/..., /assets/...)
 * car le header/footer partagé est injecté a des profondeurs de dossier différentes.
 * Sous GitHub Pages (déploiement dans un sous-dossier /<repo>/), il faut leur ajouter
 * ce préfixe ; en local ou sur un déploiement a la racine, BASE_URL vaut "/" et cette
 * fonction ne fait rien.
 */
function rewriteRootRelativeUrls(root: ParentNode): void {
  const prefix = import.meta.env.BASE_URL.slice(0, -1);
  if (!prefix) return;

  const isRootRelative = (value: string | null): value is string =>
    !!value && value.startsWith("/") && !value.startsWith("//");

  root.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((el) => {
    const href = el.getAttribute("href");
    if (isRootRelative(href)) el.setAttribute("href", prefix + href);
  });

  root.querySelectorAll<HTMLImageElement>("img[src]").forEach((el) => {
    const src = el.getAttribute("src");
    if (isRootRelative(src)) el.setAttribute("src", prefix + src);
  });
}

function initHeaderBehavior(): void {
  const header = document.getElementById("site-header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    header.classList.toggle("shadow-sm", window.scrollY > 10);
  });

  const currentPage = document.body.dataset.page;
  if (!currentPage) return;

  const activeLink = header.querySelector<HTMLAnchorElement>(`[data-nav="${currentPage}"]`);
  if (activeLink) {
    activeLink.classList.add("active");
    activeLink.setAttribute("aria-current", "page");
  }
}
