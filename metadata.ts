import {
    BuildConfig,
} from "userscripter/build";
import { Metadata } from "userscript-metadata";

import U from "./src/userscript";

export default function(_: BuildConfig): Metadata {
    return {
        name: U.name,
        version: U.version,
        description: U.description,
        license: "GNU GPLv3",
        author: U.author,
        match: [
            `*://${U.hostname}/*`,
        ],
        namespace: U.namespace,
        run_at: U.runAt,
    };
}
