import { NodeType } from './node';

export type DocumentTree<TProps> = {
  type: NodeType,
  props: TProps,
  content: string;
  children: DocumentTree<TProps>[],
}