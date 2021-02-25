import { ALWAYS } from "userscripter/lib/environment";
import { Operation, operation } from "userscripter/lib/operations";
import { addToClipboard } from "./helpers/utils";
import { extractTableAsJson } from "./helpers/extractTableInfo";

const OPERATIONS: ReadonlyArray<Operation<any>> = [
  operation({
    description: "Track last clicked element for menu commands",
    condition: ALWAYS,
    action: () => {
        let menuActive = false
        document.addEventListener("click", function clickListener(event) {
            const maybeTable = event.target
            if (!menuActive && maybeTable instanceof HTMLTableElement) {
                GM_registerMenuCommand('Copy this table', () => {
                    const tableJson = extractTableAsJson(maybeTable)
                    addToClipboard(JSON.stringify(tableJson, null, 4))
                })
            } else if (menuActive && !(maybeTable instanceof HTMLTableElement)) {
                GM_unregisterMenuCommand('Copy this table')
            }
        })
    },
  }),
];

export default OPERATIONS;
