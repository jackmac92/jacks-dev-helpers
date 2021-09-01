export function htmlTreeSelection() {
  // TODO select via keyboard?
  // No need to wait for a 'DOMContentLoaded' event since the manifest
  // specifies:
  //
  //   "run_at": "document_end"
  //

  let clickable = [
    document.getElementsByTagName("a"),
    document.getElementsByTagName("button"),
    document.querySelectorAll("[role=button]"),
  ];
  const iframeOverlays: {
    iframe: HTMLIFrameElement;
    overlay: HTMLDivElement;
  }[] = [];

  let overHandler = (e: Event) => {
    let target = e.target as HTMLElement;

    if (target === null) {
      return;
    }

    target.classList.add("html-tree-selection");

    if (target.classList.contains("html-tree-selection-overlay")) {
      let iframe =
        iframeOverlays[parseInt(target.dataset.index ?? "", 10)].iframe;
      iframe.classList.add("html-tree-selection");
    }

    e.stopPropagation();
  };
  let outHandler = (e: Event) => {
    let target = e.target as HTMLElement;

    if (target === null) {
      return;
    }

    target.classList.remove("html-tree-selection");
    e.stopPropagation();
  };

  let clickHandler = (e: Event) => {
    disable();

    let target = e.target as HTMLElement;

    if (target === null) {
      return;
    }

    if (target.classList.contains("html-tree-selection-overlay")) {
      target = iframeOverlays[parseInt(target.dataset.index ?? "", 10)].iframe;
    }

    // TODO instead of removing target, return it (or possibly many)
    target.remove();

    e.preventDefault();
    e.stopPropagation();
  };

  let enable = () => {
    // override click handlers on any clickable element
    clickable.forEach((c) => {
      for (var i = 0; i < c.length; i++) {
        // @ts-expect-error
        c[i].onclickBackup = c[i].onclick;
        c[i].addEventListener("click", clickHandler);
      }
    });

    let iframes = document.querySelectorAll("iframe");

    iframes.forEach((i) => {
      let overlay = document.createElement("div");
      let iframeClientRect = i.getBoundingClientRect();
      let offsetX = iframeClientRect.left + window.scrollX;
      let offsetY = iframeClientRect.top + window.scrollY;

      overlay.classList.add("html-tree-selection-overlay");
      overlay.style.top = `${offsetY}px`;
      overlay.style.left = `${offsetX}px`;
      overlay.style.width = `${iframeClientRect.width}px`;
      overlay.style.height = `${iframeClientRect.height}px`;

      overlay.dataset.index = `${iframeOverlays.length}`;

      iframeOverlays.push({
        iframe: i,
        overlay: overlay,
      });

      document.body.appendChild(overlay);
    });

    document.documentElement.classList.add("html-tree-selection-cursor");
    document.addEventListener("mouseover", overHandler);
    document.addEventListener("mouseout", outHandler);
    document.addEventListener("click", clickHandler);
    document.addEventListener("keydown", keyHandler, true);
  };

  let disable = () => {
    clickable.forEach((c) => {
      for (var i = 0; i < c.length; i++) {
        c[i].removeEventListener("click", clickHandler);
        // @ts-expect-error
        c[i].addEventListener("click", c[i].onclickBackup);
        // @ts-expect-error
        delete c[i].onclickBackup;
      }
    });

    iframeOverlays.forEach((o) => o.overlay.remove());

    document.documentElement.classList.remove("html-tree-selection-cursor");

    // clean any orphaned hover applied class
    let orphan = document.querySelector(".html-tree-selection");
    if (orphan !== null) {
      orphan.classList.remove("html-tree-selection");
    }

    document.removeEventListener("mouseover", overHandler);
    document.removeEventListener("mouseout", outHandler);
    document.removeEventListener("click", clickHandler);
    document.removeEventListener("keydown", keyHandler, true);
  };

  let keyHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disable();
    }
  };

  let updateOverlayPositions = (_e: Event) => {
    iframeOverlays.forEach((o) => {
      let iframe = o.iframe;
      let iframeClientRect = iframe.getBoundingClientRect();
      let overlay = o.overlay;
      let offsetX = iframeClientRect.left + window.scrollX;
      let offsetY = iframeClientRect.top + window.scrollY;

      overlay.style.top = `${offsetY}px`;
      overlay.style.left = `${offsetX}px`;
    });
  };

  window.addEventListener("scroll", updateOverlayPositions);
  window.addEventListener("resize", updateOverlayPositions);

  return {
    enable,
    disable,
    cleanup() {
      window.removeEventListener("scroll", updateOverlayPositions);
      window.removeEventListener("resize", updateOverlayPositions);
    },
  };
}

export function installHtmlTreeSelectionApi() {
  // @ts-expect-error
  window.htmlTreeSelection = htmlTreeSelection;
}
