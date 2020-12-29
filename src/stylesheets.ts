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
             `
    }),
} as const;
// <span class="w3-badge">9</span>

// This trick uncovers type errors in STYLESHEETS while retaining the static knowledge of its properties (so we can still write e.g. STYLESHEETS.foo):
const _: Stylesheets = STYLESHEETS; void _;

export default STYLESHEETS;
