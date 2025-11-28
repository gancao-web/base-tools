/**
 * 拖拽排序 (不改变原数组)
 * @param list 原始数组
 * @param fromIndex 要移动的元素的原始索引
 * @param toIndex 要移动到的目标索引
 * @returns 移动元素后的新数组
 */
export function arrayMove<T>(list: T[], fromIndex: number, toIndex: number) {
  const newList = [...list]; // 创建新数组副本
  const [removed] = newList.splice(fromIndex, 1); // 移除 fromIndex 处的元素
  newList.splice(toIndex, 0, removed); // 插入到 toIndex 处
  return newList;
}
