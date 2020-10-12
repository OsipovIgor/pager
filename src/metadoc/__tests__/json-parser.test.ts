import { MetadocParser } from '../parser';

const parser = new MetadocParser();
describe('JSON Parser', () => {
  test('Отрисовка пустого документа', () => {
    const json = {
      type: 'document',
      props: {
        title: 'metaDOC description',
        author: 'Dan Brown',
        version: '3.43',
        hash: '25b886356ee66309c98012eb9da0fd3ec03601d45cbb1314bff945',
        lang: 'ru'
      },
      children: []
    };

    const dom = parser.parse(json);

    expect(dom).not.toBeNull();
  });
});
