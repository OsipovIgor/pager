export function getTextChild(element: HTMLElement) {
  if (element.firstChild && element.firstChild.nodeType === Node.TEXT_NODE) {
    const textNode = element.firstChild as Text;
    return textNode;
  }

  return null;
}

/**
 * Получаем нижние границы элемента
 * @param element
 */
export function computeLowerLimit(element: HTMLElement) {
  return element.getBoundingClientRect().bottom;
}
