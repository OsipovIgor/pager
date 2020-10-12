import { computeLowerLimit } from './utils';

export function createSplitter(
  textNode: Text,
  props: any,
  createElement: Function,
  page: HTMLElement,
  checkFitIn: Function
) {
  return function split(offset: number, leftLimit: number, rightLimit: number, elementToRemove?: HTMLElement): number {
    if (elementToRemove) elementToRemove.remove();

    if (rightLimit - leftLimit <= 1 && elementToRemove) {
      const { textContent } = elementToRemove;

      if (textContent) {
        const currentContent = textContent.substring(0, offset);
        const spaceIndex = currentContent.lastIndexOf(' ');

        return spaceIndex;
      }
      return -1;
    }

    const clonedChild = textNode.cloneNode(true) as Text;
    clonedChild.splitText(offset);

    const splittedElement = createElement(props);
    splittedElement.appendChild(clonedChild);

    page.appendChild(splittedElement);
    // проверить влезает ли нода
    const lowerLimit = computeLowerLimit(splittedElement);
    const isElementFitIt = checkFitIn(lowerLimit);

    if (isElementFitIt) {
      const nextOffset = Math.floor(offset + (rightLimit - offset) / 2);
      return split(nextOffset, offset, rightLimit, splittedElement);
    } else {
      const nextOffset = Math.floor(leftLimit + (offset - leftLimit) / 2);
      return split(nextOffset, leftLimit, offset, splittedElement);
    }
  };
}
