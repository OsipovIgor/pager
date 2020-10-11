import contract from './document.json';

enum PageType {
  A3 = 'a3',
  A4 = 'a4',
  A5 = 'a5'
}

enum NodeType {
  document = 'document',
  header = 'header',
  paragraph = 'paragraph'
}

type HeaderLevel = 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6';

type Props = {};
type HeaderProps = Props & { level: HeaderLevel };
type ParagraphProps = Props & { className: string };

type DocumentProps = {
  title: string;
  author: string;
  version: string;
  hash: string;
  lang: string;
};

const app = document.getElementById('app');
if (app !== null) {
  // document -> page -> ...
  const doc = createDocument(contract.props);
  let page = createPage(PageType.A4);

  doc.appendChild(page);
  app.appendChild(doc);

  let pageBottom = getBottomCoeff(page);
  const pageStyles = window.getComputedStyle(page);

  const verticalPadding = getVerticalPadding(pageStyles);

  for (let child of contract.children) {
    switch (child.type) {
      case NodeType.header:
        const header = createHeader(child.props, child.content);
        page.appendChild(header);
        break;
      case NodeType.paragraph:
        const paragraph = createParagraph(child.props, child.content);
        page.appendChild(paragraph);
        const paragraphBottom = getBottomCoeff(paragraph);
        const diff = pageBottom - paragraphBottom - verticalPadding;

        if (diff < 0) {
          page = createPage(PageType.A4);

          doc.appendChild(page);
          page.appendChild(paragraph);
          pageBottom = getBottomCoeff(page);
        }

        break;
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

function getBottomCoeff(element: HTMLElement) {
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

function createHeader(props: HeaderProps, content: string) {
  if (!props.level) {
    throw new Error('Header must be a level.');
  }

  const el = document.createElement(props.level);
  el.classList.add('header');
  el.textContent = content;

  return el;
}

function createParagraph(props: ParagraphProps, content: string) {
  const el = document.createElement('p');
  el.classList.add('paragraph');
  el.textContent = content;

  return el;
}

function validateDocument(contract: any) {
  // должен иметь поле type = document и children
  if (!contract) return false;
  if (contract.type !== NodeType.document) return false;
}
