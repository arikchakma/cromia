<div align="center">
  <h2>🛝 unit-field</h2>
  <p>Headless, composable numeric input field for React with drag-to-scrub and keyboard controls. Unstyled, accessible, and fully customizable.</p>
  <a href="https://npmx.dev/package/unit-field"><strong>npmx</strong></a>
</div>

### Installation

```bash
npm install unit-field
```

### Usage

```tsx
import { UnitField } from 'unit-field';

function MyUnitField() {
  const [value, setValue] = useState(100);

  return (
    <UnitField.Root value={value} onValueChange={setValue}>
      <UnitField.Input />
      <UnitField.DragArea />
    </UnitField.Root>
  );
}
```

### Components

| Component  | Description                                                                                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Root`     | Provider that manages value state. Accepts `value`, `defaultValue`, `onValueChange`, `onValueCommitted`, `step`, `largeStep`, `min`, `max`, `format`, `parse`, and `disabled`. |
| `Input`    | Text input bound to the current value.                                                                                                                                         |
| `DragArea` | Invisible overlay that enables drag-to-scrub. Accepts `sensitivity` to control pixels per step.                                                                                |

### Props

#### Root

| Prop               | Type                                | Default                   | Description                                                   |
| ------------------ | ----------------------------------- | ------------------------- | ------------------------------------------------------------- |
| `value`            | `number`                            | —                         | Controlled value.                                             |
| `defaultValue`     | `number`                            | —                         | Uncontrolled initial value.                                   |
| `onValueChange`    | `(value: number) => void`           | —                         | Called on every value change.                                 |
| `onValueCommitted` | `(value: number) => void`           | —                         | Called when the user commits a value (blur, enter, drag end). |
| `step`             | `number`                            | `1`                       | Increment per arrow key press or drag step.                   |
| `largeStep`        | `number`                            | `10`                      | Increment when holding Shift.                                 |
| `min`              | `number`                            | `Number.MIN_SAFE_INTEGER` | Minimum value.                                                |
| `max`              | `number`                            | `Number.MAX_SAFE_INTEGER` | Maximum value.                                                |
| `format`           | `(value: number) => string`         | `String`                  | Format value for display.                                     |
| `parse`            | `(value: string) => number \| null` | `parseInt`                | Parse input string to number.                                 |
| `disabled`         | `boolean`                           | `false`                   | Disable the field.                                            |

#### DragArea

| Prop          | Type     | Default | Description                        |
| ------------- | -------- | ------- | ---------------------------------- |
| `sensitivity` | `number` | `2`     | Pixels of mouse movement per step. |

### Context

Access internal state with `useUnitFieldContext()`:

```tsx
import { useUnitFieldContext } from 'unit-field';

function CustomDisplay() {
  const { value, isDragging } = useUnitFieldContext();
  return <span>{isDragging ? 'Scrubbing...' : value}</span>;
}
```

### Acknowledgements

- [Base UI](https://base-ui.com/) — Utilities and patterns that influenced the component architecture

### License

[MIT](../../LICENSE) &copy; [Arik Chakma](https://x.com/imarikchakma)
