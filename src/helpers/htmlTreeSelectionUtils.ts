export class HtmlElContainer {
  localName = "";
  id = "";
  classes = "";
  el!: HTMLElement;
  child?: HtmlElContainer;
}

/**
 * Generates a recursive object structure representing the subtree of the
 * DOM containing the specified element.
 *
 * The outhermost layer of the object will be for the 'body' element. Each
 * further node on the path down to 'element' will be attached via a 'child'
 * property.
 *
 * @param {Element} element - target DOM element
 * @returns {Object} Representation of the subtree in the following
 * format:
 *
 *   Stucture = {
 *     localName: {String}
 *     id: {String}
 *     classes: {String}
 *     el: {Element}
 *     child: {Structure|undefined}
 *   }
 */
function generateElementHierarchy(element: HTMLElement): HtmlElContainer {
  let currentObject = new HtmlElContainer();
  let lastObject = new HtmlElContainer();
  let currentElement = element;
  while (currentElement.localName !== "html") {
    currentObject = new HtmlElContainer();
    currentObject.el = currentElement;
    currentObject.localName = currentElement.localName;
    currentObject.id = currentElement.id;
    currentObject.classes = Array.from(currentElement.classList).reduce(
      (acc, val) => `${acc}.${val}`,
      ""
    );
    currentObject.child = lastObject;

    lastObject = currentObject;
    const parentEl = currentElement.parentElement;
    if (parentEl === null) {
      throw Error("Null parent before root!");
    }
    currentElement = parentEl;
  }
  return currentObject;
}

/**
 * Generates a selector string from a element hierarchy produced by
 * generateElementHierarchy. The selector string will uniquely return the
 * bottom most element in the hierarchy, when passed to .querySelector().
 *
 * The selector is fully qualified. This means each node in the path from
 * 'element' up the DOM tree, to the first uniquely identifiable node, is
 * referenced within the selector.
 *
 * E.g. this snippet:
 *
 * <body>
 *   <div id="content">
 *     <div id="foo">
 *       <ul><li><p></p></li></ul>
 *     </div>
 *   </div>
 * </body>
 *
 * Will yield the following DOMString:
 *
 * #foo > ul > li > p
 *
 * To determine uniqueness, id, classes and sibling index is considered,
 * according this order of precedence:
 *
 * 1. id
 * 2. classes
 * 3. index
 *
 * @param {Object} hierarchy - Hierarchy object returned by
 * generateElementHierarchy
 * @returns {String} Selector DOMString
 */
function elementHierarchyToDOMString(hierarchy: HtmlElContainer) {
  let selectorParts = [];
  let currentObject = hierarchy;
  let parentElement = document; // document will always be a parent
  while (currentObject !== undefined) {
    let selectorPart = "";
    let uniqueByIdInDocument = false;
    let uniqueByIdInParent = false;
    let idSelector = `#${currentObject.id}`;

    if (currentObject.id !== "") {
      uniqueByIdInDocument = document.querySelectorAll(idSelector).length === 1;
      // Will be the same in first iteration since d === parentElement
      uniqueByIdInParent =
        parentElement.querySelectorAll(idSelector).length === 1;
    }

    if (uniqueByIdInDocument) {
      selectorPart = idSelector;

      // Since this element is *globally* unique by id, any parts of the
      // selector created until now can be disregarded
      selectorParts = [];
    } else if (uniqueByIdInParent) {
      selectorPart = idSelector;
    } else {
      // Try with classes when id fails
      let uniqueByClassesInDocument = false;
      let uniqueByClassesInParent = false;

      if (currentObject.classes !== "") {
        uniqueByClassesInDocument =
          document.querySelectorAll(currentObject.classes).length === 1;
        uniqueByClassesInParent =
          parentElement.querySelectorAll(currentObject.classes).length === 1;
      }

      if (uniqueByClassesInDocument) {
        selectorPart = currentObject.classes;

        // Same as above; if classes can uniquely target the element,
        // previous parts of the selector can be thrown away
        selectorParts = [];
      } else if (uniqueByClassesInParent) {
        selectorPart = currentObject.classes;
      } else {
        // In case both id and class based selectors are non-viable, use
        // nth-of-type instead where needed
        // Find all siblings of the same tag
        let childrenArray = Array.from(parentElement.children);
        let sameTagChildren = childrenArray.filter(
          (child) => child.localName === currentObject.localName
        );

        if (sameTagChildren.length > 1) {
          let currentObjectIndex = sameTagChildren.indexOf(currentObject.el);

          selectorPart = `${currentObject.localName}:nth-of-type(${
            currentObjectIndex + 1
          })`;
        } else {
          selectorPart = currentObject.localName;
        }
      }
    }

    selectorParts.push(selectorPart);
    parentElement = currentObject.el;
    currentObject = currentObject.child;
  }

  return selectorParts.join(" > ");
}
