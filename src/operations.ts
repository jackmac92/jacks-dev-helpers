import { ALWAYS } from "userscripter/lib/environment";
import { deepEntries, delimitEntry } from "deep-entries";
import { Operation, operation } from "userscripter/lib/operations";
import { addToClipboard } from "./helpers/utils";
import { extractTableAsJson } from "./helpers/extractTableInfo";

const OPERATIONS: ReadonlyArray<Operation<any>> = [
  operation({
    description: "Provide helper funcs for dev console",
    condition: ALWAYS,
    action: () => {
      const findKeyDeep = (obj: object, str: string) => {
        const flatObj = deepEntries(obj, delimitEntry);
        return flatObj.filter(([k, _value]: [string, unknown]) => k.includes(str));
      };
      // @ts-expect-error
      window.findKeyDeep = findKeyDeep;
    },
  }),
  operation({
    description: "Copy table as json via right click",
    condition: ALWAYS,
    action: () => {
      let menuActive = false;
      document.addEventListener("mousemove", function clickListener(event) {
        const maybeTable = event.target;
        if (!menuActive && maybeTable instanceof HTMLTableElement) {
          GM_registerMenuCommand("Copy this table", () => {
            const tableJson = extractTableAsJson(maybeTable);
            addToClipboard(JSON.stringify(tableJson, null, 4));
          });
        } else if (menuActive && !(maybeTable instanceof HTMLTableElement)) {
          GM_unregisterMenuCommand("Copy this table");
        }
      });
    },
  }),
];

export default OPERATIONS;
