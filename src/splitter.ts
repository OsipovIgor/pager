import { computeLowerLimit, getTextChild } from './utils';

export function createSplitter(
  textNode: Text,
  props: any,
  createElement: Function,
  page: HTMLElement,
  checkFitIn: Function
) {
  return function split(
    offset: number,
    leftLimit: number,
    rightLimit: number,
    elementToRemove?: HTMLElement
  ): Text | null {
    // console.log('current segment: ', `(${leftLimit}, ${rightLimit})`);

    if (rightLimit - leftLimit <= 1 && elementToRemove) {
      const { textContent } = elementToRemove;

      if (textContent) {
        const spaceIndex = textContent.lastIndexOf(' ');

        if (spaceIndex !== -1) {
          const textChild = getTextChild(elementToRemove);

          if (textChild != null) {
            const splittedText = textChild.splitText(spaceIndex - 1);
            return splittedText;
          }
        }
      }
      return null;
    }
    elementToRemove && elementToRemove.remove();

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
