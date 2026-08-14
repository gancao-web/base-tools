/**
 * 获取树节点的直接子节点。
 * @param node 当前树节点
 * @returns 子节点数组；叶子节点可返回 `null` 或 `undefined`
 */
export type TreeChildrenGetter<T> = (node: T) => readonly T[] | null | undefined;

/** 默认读取节点的 `children` 字段。 */
function getDefaultChildren<T>(node: T): readonly T[] | undefined {
  if (typeof node !== 'object' || node === null) return undefined;
  return (node as { children?: readonly T[] }).children;
}

/**
 * 按先序深度优先遍历将树展开为一维数组，不修改原树。
 * 默认读取节点的 `children` 字段，也可通过 `getChildren` 适配其他字段。
 * @param tree 树的根节点数组
 * @param getChildren 子节点读取函数
 * @returns 按“当前节点、子节点”顺序展开的新数组
 * @example
 * const tree = [{ id: 1, children: [{ id: 2 }] }, { id: 3 }];
 * flattenTree(tree).map((node) => node.id); // [1, 2, 3]
 *
 * const customTree = [{ id: 1, items: [{ id: 2, items: [] }] }];
 * flattenTree(customTree, (node) => node.items); // [{ id: 1, ... }, { id: 2, ... }]
 */
export function flattenTree<T>(
  tree: readonly T[],
  getChildren: TreeChildrenGetter<T> = getDefaultChildren,
) {
  const result: T[] = [];
  const stack = [...tree].reverse();

  while (stack.length) {
    const node = stack.pop() as T;
    result.push(node);
    const children = getChildren(node);
    if (children?.length) stack.push(...[...children].reverse());
  }

  return result;
}

/**
 * 按先序深度优先遍历查找第一个匹配节点。
 * 默认读取节点的 `children` 字段，也可通过 `getChildren` 适配其他字段。
 * @param tree 树的根节点数组
 * @param predicate 节点匹配函数
 * @param getChildren 子节点读取函数
 * @returns 第一个匹配节点；未命中时返回 `undefined`
 * @example
 * const tree = [{ id: 1, children: [{ id: 2 }] }];
 * findTreeNode(tree, (node) => node.id === 2); // { id: 2 }
 */
export function findTreeNode<T>(
  tree: readonly T[],
  predicate: (node: T) => boolean,
  getChildren: TreeChildrenGetter<T> = getDefaultChildren,
) {
  const stack = [...tree].reverse();

  while (stack.length) {
    const node = stack.pop() as T;
    if (predicate(node)) return node;
    const children = getChildren(node);
    if (children?.length) stack.push(...[...children].reverse());
  }

  return undefined;
}

/**
 * 按先序深度优先遍历查找第一个匹配节点，并返回从根节点到该节点的完整路径。
 * 默认读取节点的 `children` 字段，也可通过 `getChildren` 适配其他字段。
 * @param tree 树的根节点数组
 * @param predicate 节点匹配函数
 * @param getChildren 子节点读取函数
 * @returns 包含根节点和目标节点的路径；未命中时返回 `undefined`
 * @example
 * const tree = [{ id: 1, children: [{ id: 2, children: [{ id: 3 }] }] }];
 * findTreePath(tree, (node) => node.id === 3)?.map((node) => node.id); // [1, 2, 3]
 */
export function findTreePath<T>(
  tree: readonly T[],
  predicate: (node: T) => boolean,
  getChildren: TreeChildrenGetter<T> = getDefaultChildren,
) {
  const stack = [...tree].reverse().map((node) => ({ node, path: [] as T[] }));

  while (stack.length) {
    const { node, path } = stack.pop() as { node: T; path: T[] };
    const currentPath = [...path, node];
    if (predicate(node)) return currentPath;

    const children = getChildren(node);
    if (children?.length) {
      for (let index = children.length - 1; index >= 0; index--) {
        stack.push({ node: children[index], path: currentPath });
      }
    }
  }

  return undefined;
}
