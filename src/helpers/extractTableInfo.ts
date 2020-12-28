const arr = Array.from;

const extractLinkedText = (node: HTMLElement): string => {
    const tmpNode = node.cloneNode(true) as HTMLElement;
    arr(tmpNode.querySelectorAll("a")).forEach(
        (el) => (el.innerText = `[${el.innerText}](${el.href})`)
    );
    return tmpNode.innerText.trim();
};

export function extractTableAsJson(table: HTMLTableElement): object {
    // Ideally first check if table is "regular" aka has equal number of th to td/tr
    let keys: string[] = [];

    if (table.tHead !== null) {
        keys = arr(table.tHead.querySelectorAll("th")).map((el) =>
            extractLinkedText(el)
        );
    } else {
        keys = arr(table.querySelectorAll("th")).map((el) =>
            extractLinkedText(el))
    }

    return arr(table.tBodies).flatMap((el) =>
        arr(el.querySelectorAll("tr")).map((tableRow) => {
            const dataCells = arr(tableRow.querySelectorAll("td")).map((el) =>
                extractLinkedText(el)
            );
            if (dataCells.length !== keys.length) {
                console.warn("Found a row with a mismatch");
            }
            if (keys.length === 0) {
                return dataCells;
            }
            return keys.reduce(
                (tableRow, dataKey, idx) => ({
                    ...tableRow,
                    [dataKey]: dataCells[idx],
                }),
                {}
            );
        })
    );
}

export function traverseGfmTable(table: HTMLTableElement) {
    let keys: string[] = [];
    keys = arr(table.querySelectorAll("th")).map((el) =>
        extractLinkedText(el)
    );
    return arr(table.tBodies).map((el) =>
        arr(el.querySelectorAll("tr")).map((tableRow) => {
            const dataCells = arr(tableRow.querySelectorAll("td")).map((el) =>
                extractLinkedText(el)
            );
            if (dataCells.length !== keys.length) {
                console.warn("Found a row with a mismatch");
            }
            if (keys.length === 0) {
                return dataCells;
            }
            return keys.reduce(
                (tableRow, dataKey, idx) => ({
                    ...tableRow,
                    [dataKey]: dataCells[idx],
                }),
                {}
            );
        })
    );
}
