# useVModels

## 描述

简化 v-model 绑定，接收 props 和 emit，返回一个包含所有 props 的响应式对象。

## 示例

```ts
import { useVModels } from '@base-web-kits/base-tools-vue';

// 在组件 setup 中
const props = defineProps<{
  foo: string;
  bar: number;
}>();
const emit = defineEmits(['update:foo', 'update:bar']);

const { foo, bar } = useVModels(props, emit);

console.log(foo.value); // props.foo
foo.value = 'new value'; // emits update:foo
```

## 来源

[VueUse](https://vueuse.org/functions/useVModels/)
