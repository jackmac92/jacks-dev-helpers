import { log } from "userscripter";
import { ALWAYS } from "userscripter/lib/environment";
import { Operation, operation } from "userscripter/lib/operations";
import * as SITE from "~src/site";
import U from "~src/userscript";
import { addToClipboard, appendBtnToElements } from "./helpers/utils";
import { extractTableAsJson } from './helpers/extractTableInfo';

const OPERATIONS: ReadonlyArray<Operation<any>> = [
    operation({
        description: "Insert copy tooltip on codeblocks",
        condition: ALWAYS,
        // dependencies: { heading: SITE.SELECTOR_HEADING },
        // action: e => {
        //     e.heading.textContent = "Working userscript!"
        // },
        action: () => {
            appendBtnToElements(
                document.querySelectorAll('code'),
                (codeBlock) => addToClipboard(codeBlock.innerText),
                (spanEl) => { spanEl.innerText = "Copy" }
            )
        }
    }),
    operation({
        description: "Insert a copy tooltip on tables",
        condition: ALWAYS,
        action: () => {
            appendBtnToElements(
                document.querySelectorAll('table'),
                (htmlElement, _event) => {
                    const tableJson = extractTableAsJson(htmlElement)
                    addToClipboard(JSON.stringify(tableJson, null, 4))
                },
                (spanEl) => { spanEl.innerText = "Copy" }
            )
        }
    })
];

export default OPERATIONS;
