// TODO need a common handler for priming html for pandoc
// e.g. on the racket site, span.RktIn -> code

// const supportedSites = ["docs.racket-lang.org"] as const;
// @ts-ignore
const supportedSites = { "docs.racket-lang.org": 1 } as const;

// @ts-ignore
type supportedSite = typeof supportedSites[keyof typeof supportedSites];

// @ts-ignore
const _handlers: { [k: supportedSite]: any } = {
  "docs.racket-lang.org": racketDocsProcessor,
};

// @ts-ignore
export default function htmlProcessor(site: supportedSite, html: HTMLElement) {
  // @ts-ignore
  const h = _handlers[site];
  // @ts-ignore
  return h(html);
}

// @ts-ignore
export function racketDocsProcessor(html: HTMLElement) {
  // TODO use zepto for this
}
