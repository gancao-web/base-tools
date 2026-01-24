# useVModel

## 描述

简化 v-model 绑定，接收 props 和 emit，返回单个 prop 的响应式引用。

## 示例

```ts
import { useVModel } from '@base-web-kits/base-tools-vue';

// 在组件 setup 中
const props = defineProps<{
  modelValue: string;
}>();
const emit = defineEmits(['update:modelValue']);

const data = useVModel(props, 'modelValue', emit);

console.log(data.value); // props.modelValue
data.value = 'new value'; // emits update:modelValue
```

## 来源

[VueUse](https://vueuse.org/functions/useVModel/)
