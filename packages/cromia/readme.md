<div align="center">
  <h2>🎨 cromia</h2>
  <p>Headless, composable color picker primitives for React. Unstyled, accessible, and fully customizable.</p>
  <a href="https://npmx.dev/package/cromia"><strong>npmx</strong></a>
</div>

### Installation

```bash
npm install cromia
```

### Usage

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

### Components

| Component | Description |
| --- | --- |
| `Root` | Provider that manages color state. Accepts `color`, `defaultColor`, `onColorChange`, `onColorCommitted`, and `disabled`. |
| `Area` | 2D picker for saturation (x-axis) and brightness (y-axis). |
| `AreaBackground` | Renders the hue-based gradient background for `Area`. |
| `AreaThumb` | Draggable thumb for `Area`. |
| `ChannelSlider` | 1D slider for a single channel: `hue`, `saturation`, `brightness`, or `alpha`. Supports `horizontal` and `vertical` orientation. |
| `ChannelSliderTrack` | Renders the gradient track for `ChannelSlider`. |
| `ChannelSliderThumb` | Draggable thumb for `ChannelSlider`. |
| `Input` | Text input bound to a channel (`hex`, `hex-alpha`, `hue`, `saturation`, `brightness`, `alpha`). |
| `Swatch` | Color swatch button. Accepts `value`, `selected`, and `onSelect`. |
| `SwatchGroup` | Container for swatches with `radiogroup` role. |

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

- [react-colorful](https://github.com/omgovich/react-colorful) — Reference for color conversion utilities and interaction patterns
- [React Aria](https://react-spectrum.adobe.com/react-aria/) — Influenced the accessibility and composability approach

### License

[MIT](../../LICENSE) &copy; [Arik Chakma](https://x.com/imarikchakma)
