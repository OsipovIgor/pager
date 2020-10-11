import contract from './document.json';

enum PageType {
  A3 = 'a3',
  A4 = 'a4',
  A5 = 'a5'
}

enum NodeType {
  document = 'document',
}

/**
 * header, paragraph, text - основные текстовые элементы;
 */
enum Node20Type {
  header = 'header',
  paragraph = 'paragraph'
}

type HeaderLevel = 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6';

interface Props {};
interface HeaderProps extends Props { level: HeaderLevel };
interface ParagraphProps extends Props { className: string };

type DocumentProps = {
  title: string;
  author: string;
  version: string;
  hash: string;
  lang: string;
};

type CreateElement = (props: HeaderProps & ParagraphProps, content?: string) => HTMLElement;

const app = document.getElementById('app');

const elementCreators: Record<Node20Type, CreateElement> = {
  [Node20Type.header]: createHeader,
  [Node20Type.paragraph]: createParagraph,
}

if (app !== null) {
  // document -> page -> ...
  const doc = createDocument(contract.props);
  let page = createPage(PageType.A4);

  doc.appendChild(page);
  app.appendChild(doc);

  // Нижняя граница страницы
  let pageLowerLimit = computeLowerLimit(page);
  const pageStyles = window.getComputedStyle(page);

  const pageVerticalPadding = getVerticalPadding(pageStyles);

  for (let child of contract.children) {
    const createElement = elementCreators[child.type as Node20Type];

    const element = createElement(child.props, child.content);
    page.appendChild(element);

    //
    const lowerLimit = computeLowerLimit(element);
    const isElementFitIt = pageLowerLimit - lowerLimit - pageVerticalPadding > 0;

    // если элемент не влизает на страницу
    if (!isElementFitIt) {
      element.remove();

      // если первый дочерний элемент это текст, пытаемся его обрезать
      if (element.firstChild && element.firstChild.nodeType === Node.TEXT_NODE) {
        const textChild = element.firstChild as Text;
        const textContent = textChild.textContent;

        if (textContent) {
          const offset = textContent.length / 2;
          textChild.splitText(offset);

          const splittedElement = createElement(child.props);
          splittedElement.appendChild(textChild);

          page.appendChild(splittedElement);
          // проверить влезает ли нода
        }
      }

      // добавляем новую страницу
      page = createPage(PageType.A4);
      page.appendChild(element);
      doc.appendChild(page);

      // обновляем нижнюю границу
      pageLowerLimit = computeLowerLimit(page);
    }
  }
}

function getVerticalPadding(computedStyle: CSSStyleDeclaration): number {
  if (!(computedStyle instanceof CSSStyleDeclaration)) return 0;
  const padding = computedStyle.getPropertyValue('padding');

  const array = padding.split(' ');
  if (array.length !== 4) return 0;

  const [top, right, bottom, left] = array.map(parseFloat);
  return top + bottom;
}

/**
 * Получаем нижние границы элемента
 * @param element
 */
function computeLowerLimit(element: HTMLElement) {
  return element.getBoundingClientRect().bottom;
}

function createDocument(props: DocumentProps) {
  const doc = document.createElement('div');
  doc.classList.add('document');

  if (props.lang) doc.setAttribute('lang', props.lang);

  return doc;
}

function createPage(type: PageType) {
  const page = document.createElement('div');
  page.classList.add('page');
  page.classList.add(type);

  return page;
}

function createHeader(props: HeaderProps, content?: string): HTMLElement {
  if (!props.level) {
    throw new Error('Header must be a level.');
  }

  const el = document.createElement(props.level);
  el.classList.add('header');
  if (content)
    el.textContent = content;

  return el;
}

function createParagraph(props: ParagraphProps, content?: string): HTMLElement {
  const el = document.createElement('p');
  el.classList.add('paragraph');

  if (content)
    el.textContent = content;

  if (props && props.className) {
    el.classList.add(props.className);
  }

  return el;
}

function validateDocument(contract: any) {
  // должен иметь поле type = document и children
  if (!contract) return false;
  if (contract.type !== NodeType.document) return false;
}
