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
        license: "GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt",
        author: U.author,
        match: [
            `*://${U.hostname}/*`,
        ],
        namespace: U.namespace,
        run_at: U.runAt,
    };
}
