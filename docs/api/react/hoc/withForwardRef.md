# withForwardRef

转发 `ref` 的 HOC：将外部的 `ref` 传递到内部组件。

## Example

```tsx
import { withForwardRef } from '@base-web-kits/base-tools/react';

// 将 ref 透传到原生 input
const Input = React.forwardRef<HTMLInputElement, { value?: string }>((props, ref) => (
  <input ref={ref} {...props} />
));
const InputWithRef = withForwardRef<HTMLInputElement, { value?: string }>(Input);

const App = () => {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return <InputWithRef ref={ref} value="hi" />;
};
```
