import { log } from "userscripter";
import { ALWAYS } from "userscripter/lib/environment";
import { Operation, operation } from "userscripter/lib/operations";
import * as SITE from "~src/site";
import U from "~src/userscript";
import { addToClipboard, appendBtnToElements } from "./helpers/utils";
import { extractTableAsJson } from "./helpers/extractTableInfo";

const OPERATIONS: ReadonlyArray<Operation<any>> = [
  operation({
    description: "Track last clicked element for menu commands",
    condition: ALWAYS,
    action: () => {
        document.addEventListener("click", function clickListener(event) {
            if (event.target instanceof HTMLElement) {
                window.__JM_DEV_HELPERS__lastClickedElement = event.target
            } else {
                console.warn('Unexpected event target')
            }
        })
    },
  }),
  operation({
    description: "Insert a copy tooltip on tables",
    condition: ALWAYS,
    action: () => {
      appendBtnToElements(
        document.querySelectorAll("table"),
        (htmlElement, _event) => {
          const tableJson = extractTableAsJson(htmlElement);
          addToClipboard(JSON.stringify(tableJson, null, 4));
        },
        (spanEl) => {
          spanEl.innerText = "Copy";
        }
      );
    },
  }),
];

export default OPERATIONS;
