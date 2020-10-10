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
  const page = createPage(PageType.A4);

  contract.children.forEach((child: any) => {
    switch (child.type) {
      case NodeType.header:
        page.appendChild(createHeader(child.props, child.content));
        break;
      case NodeType.paragraph:
        page.appendChild(createParagraph(child.props, child.content));
        break;
    }
  });

  doc.appendChild(page);
  app.appendChild(doc);
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
