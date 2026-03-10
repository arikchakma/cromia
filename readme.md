<div align="center">
  <h2>🎨 cromia</h2>
  <p>Headless, composable color picker primitives for React. Unstyled, accessible, and fully customizable.</p>
  <a href="https://npmjs.com/package/cromia"><strong>npm</strong></a>
</div>

### What Does It Do?

**cromia** provides unstyled, composable color picker components for React. It handles all the color logic, keyboard interactions, and accessibility — you bring the styles.

```tsx
import { ColorPicker } from 'cromia';

function MyColorPicker() {
  const [color, setColor] = useState('#ff0000');

  return (
    <ColorPicker.Root color={color} onColorChange={setColor}>
      <ColorPicker.Area>
        <ColorPicker.AreaBackground />
        <ColorPicker.AreaThumb />
      </ColorPicker.Area>

      <ColorPicker.ChannelSlider channel="hue">
        <ColorPicker.ChannelSliderTrack />
        <ColorPicker.ChannelSliderThumb />
      </ColorPicker.ChannelSlider>

      <ColorPicker.Input channel="hex" />
    </ColorPicker.Root>
  );
}
```

### Features

- **Headless** — No built-in styles. Use CSS custom properties, data attributes, or your own styling solution.
- **Composable** — Pick only the parts you need: area, sliders, inputs, swatches.
- **Accessible** — Full keyboard navigation, ARIA labels, and proper roles out of the box.
- **Any color format** — Accepts hex, RGB, RGBA, HSL, HSLA, HSV, HSVA strings and objects.

### Components

| Component            | Description                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `Root`               | Provider that manages color state. Accepts `color`, `defaultColor`, `onColorChange`, `onColorCommitted`, and `disabled`.         |
| `Area`               | 2D picker for saturation (x-axis) and brightness (y-axis).                                                                       |
| `AreaBackground`     | Renders the hue-based gradient background for `Area`.                                                                            |
| `AreaThumb`          | Draggable thumb for `Area`.                                                                                                      |
| `ChannelSlider`      | 1D slider for a single channel: `hue`, `saturation`, `brightness`, or `alpha`. Supports `horizontal` and `vertical` orientation. |
| `ChannelSliderTrack` | Renders the gradient track for `ChannelSlider`.                                                                                  |
| `ChannelSliderThumb` | Draggable thumb for `ChannelSlider`.                                                                                             |
| `Input`              | Text input bound to a channel (`hex`, `hex-alpha`, `hue`, `saturation`, `brightness`, `alpha`).                                  |
| `Swatch`             | A color swatch button. Accepts `value`, `selected`, and `onSelect`.                                                              |
| `SwatchGroup`        | Container for swatches with `radiogroup` role.                                                                                   |

### Supported Color Formats

cromia accepts any of these as the `color` or `defaultColor` prop:

```ts
// Strings
'#f00'                    // hex 3
'#ff0000'                 // hex 6
'#ff0000ff'               // hex 8
'rgb(255, 0, 0)'          // rgb
'rgba(255, 0, 0, 1)'      // rgba
'hsl(0, 100%, 50%)'       // hsl
'hsla(0, 100%, 50%, 1)'   // hsla

// Objects
{ r: 255, g: 0, b: 0 }           // RgbColor
{ r: 255, g: 0, b: 0, a: 1 }     // RgbaColor
{ h: 0, s: 100, l: 50 }           // HslColor
{ h: 0, s: 100, l: 50, a: 1 }     // HslaColor
{ h: 0, s: 100, v: 100 }          // HsvColor
{ h: 0, s: 100, v: 100, a: 1 }    // HsvaColor
```

Callbacks (`onColorChange`, `onColorCommitted`) always return hex strings.

### CSS Custom Properties

cromia exposes CSS custom properties for styling:

```css
/* On Root */
--color-picker-hue           /* 0-360 */
--color-picker-saturation    /* 0-100 */
--color-picker-brightness    /* 0-100 */
--color-picker-alpha         /* 0-1 */

/* On AreaThumb */
--color-picker-area-thumb-x  /* percentage */
--color-picker-area-thumb-y  /* percentage */
--color-picker-thumb-color   /* current color as HSL */

/* On ChannelSliderThumb */
--color-picker-slider-thumb-position  /* percentage */

/* On ChannelSliderTrack */
--color-picker-slider-gradient  /* gradient string */
```

### Acknowledgements

This project was inspired by and learned from:

- [react-colorful](https://github.com/omgovich/react-colorful) — A tiny color picker component that served as a reference for color conversion utilities and interaction patterns
- [React Aria](https://react-spectrum.adobe.com/react-aria/) — Adobe's collection of accessible React hooks and components that influenced the accessibility and composability approach

### Contributing

Feel free to submit pull requests, create issues, or spread the word.

### License

MIT &copy; [Arik Chakma](https://x.com/imarikchakma)
