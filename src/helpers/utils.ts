export const addToClipboard = (content: string) => {
  const permissionName = "clipboard-write" as PermissionName;
  return navigator.permissions
    .query({ name: permissionName })
    .then((result) => {
      if (result.state == "granted" || result.state == "prompt") {
        return navigator.clipboard.writeText(content).then(() => {});
      }
      throw Error(
        "Permission for clipboard-write was not obtained " + result.state
      );
    });
};

export const getSiblings = (elem: HTMLElement): HTMLElement[] => {
  const siblings = [];
  let sibling = elem.parentNode && elem.parentNode.firstElementChild;

  if (!sibling) {
    return [];
  }

  // Loop through each sibling and push to the array
  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== elem) {
      siblings.push(sibling as HTMLElement);
    }
    sibling = sibling.nextElementSibling;
  }

  return siblings;
};

export const appendBtnToElements = <Z extends HTMLElement>(
  elements: NodeListOf<Z>,
  clickHandler: (e: Z, a: Event) => void,
  modifyBtn: (b: HTMLElement) => void
): HTMLElement[] => {
  return Array.from(elements).map((codeBlock) => {
    codeBlock.classList.add("jacks-dev-helpers-interact-target");
    codeBlock.innerHTML = `<span class="jacks-dev-helpers-outer-wrap" >${codeBlock.innerHTML}</span>`;
    const copyBtn = document.createElement("span");
    copyBtn.classList.add("jacks-dev-helpers-interact-widget");
    copyBtn.addEventListener("click", (event) => {
      const tmpCodeBlock = codeBlock.cloneNode(true) as Z;
      const children = tmpCodeBlock.children;
      for (let i = 0; i < children.length; i++) {
        const childComponent = children[i];
        if (
          childComponent.classList.contains("jacks-dev-helpers-interact-widget")
        ) {
          tmpCodeBlock.removeChild(childComponent);
        }
      }
      clickHandler(tmpCodeBlock as Z, event);
    });
    modifyBtn(copyBtn);
    codeBlock.appendChild(copyBtn);
    return copyBtn;
  });
};

export async function installEsModule() {
  const script = document.createElement("script");
  script.setAttribute("type", "module");
  script.setAttribute("src", chrome.extension.getURL("main.js"));
  const head =
    document.head ||
    document.getElementsByTagName("head")[0] ||
    document.documentElement;
  head.insertBefore(script, head.lastChild);
}
