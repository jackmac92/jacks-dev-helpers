export { }; // do not remove

declare global {
    // STOLEN FROM https://raw.githubusercontent.com/s-tomo/violentmonkey-types/master/index.d.ts
    type GM_callback = (this: Window) => void;

    const GM_info: {
        uuid: string;
        script: {
            name: string;
            namespace: string;
            description: string;
            version: string;
            excludes: string[];
            includes: string[];
            matches: string[];
            resources: string[];
            runAt: "" | "document-end" | "document-start" | "document-idle";
            unwrap: boolean;
        };
        scriptHandler: "Violentmonkey";
        version: string;
        scriptMetaStr: string;
        scriptWillUpdate: boolean;
        injectInto: "page" | "content" | "auto";
    };

    function GM_getValue<T>(key: string, defaultValue: T): T | undefined;
    function GM_setValue(key: string, value: unknown): void;
    function GM_deleteValue(key: string): void;
    function GM_listValues(): string[];

    function GM_getResourceText(name: string): string | undefined;
    function GM_getResourceURL(name: string): string;

    function GM_addStyle(
        css: string
    ): { then(style: HTMLStyleElement): void };

    interface GM_tab {
        close: () => void;
        closed: boolean;
        onclose: null | GM_callback;
    }
    function GM_openInTab(
        url: string,
        options?: { active?: boolean }
    ): GM_tab;
    function GM_openInTab(url: string, openInBackground?: boolean): GM_tab;

    function GM_registerMenuCommand(
        caption: string,
        func: GM_callback
    ): void;
    function GM_unregisterMenuCommand(caption: string): void;

    function GM_notification(options: {
        text: string;
        title?: string;
        image?: string;
        onclick?: GM_callback;
        ondone?: GM_callback;
    }): void;
    function GM_notification(
        text: string,
        title?: string,
        image?: string,
        onclick?: GM_callback
    ): void;

    type GM_clipboardDataType =
        | "text/plain"
        | "text/uri-list"
        | "text/csv"
        | "text/css"
        | "text/html"
        | "application/xhtml+xml"
        | "image/png"
        | "image/jpg, image/jpeg"
        | "image/gif"
        | "image/svg+xml"
        | "application/xml, text/xml"
        | "application/javascript"
        | "application/json"
        | "application/octet-stream";
    function GM_setClipboard(
        data: unknown,
        type?: GM_clipboardDataType
    ): void;

    type GM_httpMethod =
        | "GET"
        | "POST"
        | "PUT"
        | "PATCH"
        | "DELETE"
        | "OPTION"
        | "HEAD";
    interface GM_httpResponseType {
        text: string;
        json: object;
        blob: Blob;
        arraybuffer: ArrayBuffer;
    }
    interface GM_progressEvent<
        K extends keyof GM_httpResponseType,
        C = unknown
        > {
        context?: C;
        finalUrl: string;
        readyState: 0 | 1 | 2 | 3 | 4;
        response: GM_httpResponseType[K] | null;
        responseHeaders: string;
        status: number;
        statusText: string;
    }
    interface GM_httpRequestOptions<
        K extends keyof GM_httpResponseType,
        C = unknown
        > {
        headers?: { [key: string]: string };
        timeout?: number;
        onerror?: (this: Window, event: GM_progressEvent<K, C>) => void;
        onprogress?: (
            this: Window,
            event: {
                lengthComputable: boolean;
                loaded: number;
                total: number;
            } & GM_progressEvent<K>
        ) => void;
        ontimeout?: (this: Window, event: GM_progressEvent<K, C>) => void;
    }
    interface GM_httpResponse {
        abort: () => void;
    }
    function GM_xmlhttpRequest<
        K extends keyof GM_httpResponseType,
        C = unknown
    >(
        details: {
            url: string;
            method?: GM_httpMethod;
            user?: string;
            password?: string;
            overrideMimetype?: string;
            responseType?: K;
            data?: string | FormData | Blob;
            context?: C;
            anonymous?: boolean;
            synchronous?: boolean;
            onabort?: (this: Window, event: GM_progressEvent<K, C>) => void;
            onload?: (this: Window, event: GM_progressEvent<K, C>) => void;
            onloadend?: (this: Window, event: GM_progressEvent<K, C>) => void;
            onreadystatechange?: (this: Window, event: GM_progressEvent<K, C>) => void;
        } & GM_httpRequestOptions<K, C>
    ): GM_httpResponse;
    function GM_download(
        options: {
            url: string;
            name?: string;
            onload?: GM_callback;
        } & GM_httpRequestOptions<"arraybuffer">
    ): GM_httpResponse;
    function GM_download(url: string, name?: string): GM_httpResponse;
}
