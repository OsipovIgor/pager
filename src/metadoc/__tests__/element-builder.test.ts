import { DOMElementBuilder } from '../element-builder';
import { NodeType } from '../types/node';

let builder: DOMElementBuilder;

beforeEach(() => {
  builder = new DOMElementBuilder(NodeType.document);
})

describe('DOMElementBuilder', () => {
  test('Создание экземпляра без ошибок', () => {
    expect(builder).not.toBeNull();
  });

  describe('Метод build', () => {
    test('Узел document должна преобразовываться в div', () => {
      builder = new DOMElementBuilder(NodeType.document);
      const element = builder.build();
      expect(element).toBeInstanceOf(HTMLDivElement);
    });

    test('Узел paragraph должна преобразовываться в p', () => {
      builder = new DOMElementBuilder(NodeType.paragraph);
      const element = builder.build();
      expect(element).toBeInstanceOf(HTMLParagraphElement);
    });

    test('Узел header должен преобразовываться в h1', () => {
      builder = new DOMElementBuilder(NodeType.header);
      const element = builder.build();
      expect(element).toBeInstanceOf(HTMLHeadingElement);
    });
  });

})
