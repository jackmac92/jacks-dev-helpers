import { ALWAYS } from "userscripter/lib/environment";
import { Stylesheets, stylesheet } from "userscripter/lib/stylesheets";

const STYLESHEETS = {
  general: stylesheet({
    condition: ALWAYS,
    css: `
            .jacks-dev-helpers-interact-widget {
              display: none;
              top: 0px;
              right: 0px;
              padding: 5px 10px;
              cursor: grab;
              background: unset;
              align-self: flex-end;
            }
            .jacks-dev-helper-outer-wrap {
              display: flex
            }
            .jacks-dev-helpers-interact-target:hover > .jacks-dev-helpers-interact-widget {
              display: inline-flex;
            }
            .jacks-dev-helpers-interact-widget:hover {
              text-decoration: underline;
            }
             `,
  }),
  htmlTreeSelectionOverlay: stylesheet({
    condition: ALWAYS,
    css: `
:root {
  --html-tree-selection-icon-url: "";
  --html-tree-selection-highlight: rgba(255, 0, 0, 0.5);
  --html-tree-selection-overlay-bg: rgba(128, 128, 128, 0.85);
}

.html-tree-selection-cursor,
.html-tree-selection-cursor a,
.html-tree-selection-cursor input,
.html-tree-selection-cursor select,
.html-tree-selection-cursor button,
.html-tree-selection-cursor div[role=button] {
  cursor: var(--html-tree-selection-icon-url), crosshair !important;
}

.html-tree-selection {
  filter: opacity(0.2);
  box-shadow: inset 0px 0px 25px var(--html-tree-selection-highlight);
}

.html-tree-selection-overlay {
  position: absolute;
  z-index: 2147483647;
  background:
    no-repeat center/70% var(--html-tree-selection-icon-url),
    var(--html-tree-selection-overlay-bg);
  mix-blend-mode: difference;
}

@media (prefers-color-scheme: dark) {
  :root {
    --html-tree-selection-highlight: rgba(0, 255, 255, 0.5);
  }
}
`,
  }),
} as const;
// <span class="w3-badge">9</span>

// This trick uncovers type errors in STYLESHEETS while retaining the static knowledge of its properties (so we can still write e.g. STYLESHEETS.foo):
const _: Stylesheets = STYLESHEETS;
void _;

export default STYLESHEETS;
