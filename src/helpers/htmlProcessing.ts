// TODO need a common handler for priming html for pandoc
// e.g. on the racket site, span.RktIn -> code

const _handlers = {
  "docs.racket-lang.org": racketDocsProcessor,
};
export default function htmlProcessor(site, html) {
  const h = _handlers[site];
  return h(html);
}

export function racketDocsProcessor(html) {
  // TODO use zepto for this
}
