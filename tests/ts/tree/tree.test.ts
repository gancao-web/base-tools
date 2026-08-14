import { describe, expect, it } from 'vitest';
import { findTreeNode, findTreePath, flattenTree } from '../../../src/ts';

type Node = {
  id: number;
  children?: Node[];
};

const tree: Node[] = [
  {
    id: 1,
    children: [{ id: 2 }, { id: 3, children: [{ id: 4 }] }],
  },
  { id: 5 },
];

describe('ts/tree', () => {
  it('flattens nodes in preorder', () => {
    expect(flattenTree(tree).map((node) => node.id)).toEqual([1, 2, 3, 4, 5]);
  });

  it('finds the first matching node', () => {
    expect(findTreeNode(tree, (node) => node.id === 4)?.id).toBe(4);
    expect(findTreeNode(tree, (node) => node.id === 9)).toBeUndefined();
  });

  it('returns the complete path to the first matching node', () => {
    expect(findTreePath(tree, (node) => node.id === 4)?.map((node) => node.id)).toEqual([1, 3, 4]);
    expect(findTreePath(tree, (node) => node.id === 9)).toBeUndefined();
  });

  it('supports custom child fields', () => {
    const customTree = [{ id: 1, items: [{ id: 2, items: [] }] }];
    expect(flattenTree(customTree, (node) => node.items).map((node) => node.id)).toEqual([1, 2]);
  });
});
