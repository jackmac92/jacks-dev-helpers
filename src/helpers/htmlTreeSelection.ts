export function htmlTreeSelection(): Promise<HTMLElement> {
  return new Promise((resolve) => {
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

    let lastElement: HTMLElement = document.body;
    let shouldClearAll = false;

    let overHandler = (e: Event) => {
      let target = e.target as HTMLElement;

      if (target === null) {
        return;
      }

      lastElement = target;

      target.classList.add("html-tree-selection");

      if (target.classList.contains("html-tree-selection-overlay")) {
        if (target.dataset.index) {
          let iframe =
            iframeOverlays[parseInt(target.dataset.index, 10)].iframe;
          iframe.classList.add("html-tree-selection");
        } else {
          console.warn("failed to find iframe");
        }
      }

      e.stopPropagation();
    };
    let outHandler = (e: Event) => {
      let target = e.target as HTMLElement;

      if (shouldClearAll) {
        clearCurrentSelection();
        shouldClearAll = false;
      }

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
      e.preventDefault();
      e.stopPropagation();

      if (target.classList.contains("html-tree-selection-overlay")) {
        if (target.dataset.index) {
          target = iframeOverlays[parseInt(target.dataset.index, 10)].iframe;
        } else {
          console.warn("maybe failed to find iframe?", target, iframeOverlays);
        }
      }

      resolve(target);
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

      window.removeEventListener("scroll", updateOverlayPositions);
      window.removeEventListener("resize", updateOverlayPositions);
    };

    const selectNode = (el: Element) => {
      return el.dispatchEvent(new MouseEvent("mouseover", { bubbles: false }));
    };
    const unselectNode = (el: Element) => {
      return el.dispatchEvent(new MouseEvent("mouseout", { bubbles: false }));
    };
    const clearCurrentSelection = () => {
      clickable.forEach((c) => {
        for (var i = 0; i < c.length; i++) {
          unselectNode(c[i]);
        }
      });
    };
    const moveSelectionToElement = (el: Element) => {
      shouldClearAll = true;
      clearCurrentSelection();
      selectNode(el);
    };
    const moveSelectionToParent = () => {
      const parent = lastElement.parentElement;
      if (parent !== null) {
        moveSelectionToElement(parent);
      }
    };
    const moveSelectionToChild = () => {
      const child = lastElement.children && lastElement.children[0];
      if (child && child !== null) {
        moveSelectionToElement(child);
      }
    };
    const moveSelectionToNextSibling = () => {
      const sibling = lastElement.nextElementSibling;
      if (sibling !== null) {
        moveSelectionToElement(sibling);
      }
    };
    const moveSelectionToPrevSibling = () => {
      const sibling = lastElement.previousElementSibling;
      if (sibling !== null) {
        moveSelectionToElement(sibling);
      }
    };

    let keyHandler = (e: KeyboardEvent) => {
      const h = {
        Escape: disable,
        ArrowLeft: moveSelectionToParent,
        ArrowRight: moveSelectionToChild,
        ArrowUp: moveSelectionToNextSibling,
        ArrowDown: moveSelectionToPrevSibling,
      };
      console.debug(e.key);
      // @ts-ignore
      const handler = h[e.key];
      handler && handler();
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

    // enable
    window.addEventListener("scroll", updateOverlayPositions);
    window.addEventListener("resize", updateOverlayPositions);

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
  });
}
