import { ColorPicker } from 'cromia';
import { useState } from 'react';
import { SectionHeader } from './section-header';

const SWATCHES = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#1c1917',
  '#78716c',
];

const CHANNELS = ['hue', 'saturation', 'brightness', 'alpha'] as const;
const CHANNEL_NAMES: Record<(typeof CHANNELS)[number], string> = {
  hue: 'Hue',
  saturation: 'Saturation',
  brightness: 'Brightness',
  alpha: 'Alpha',
};

const THUMB =
  'size-4 border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.1)] bg-[var(--color-picker-thumb-color)]';

const SWATCH =
  'size-6 cursor-pointer shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] transition-opacity hover:opacity-80 data-[selected]:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08),0_0_0_2px_#fff,0_0_0_3px_#000]';

const AREA_BG =
  'overflow-hidden bg-[linear-gradient(to_top,#000,transparent),linear-gradient(to_right,#fff,transparent)]';


function CompletePicker() {
  const [color, setColor] = useState('#3b82f6');

  return (
    <section>
      <SectionHeader
        number="01"
        title="Complete"
        description="Area, sliders, input, and swatches."
        color={color}
      />

      <ColorPicker.Root color={color} onColorChange={setColor}>
        <ColorPicker.Area className="relative h-44 w-full cursor-crosshair">
          <ColorPicker.AreaBackground className={AREA_BG} />
          <ColorPicker.AreaThumb className={THUMB} />
        </ColorPicker.Area>

        <div className="mt-3 space-y-2">
          <ColorPicker.ChannelSlider
            channel="hue"
            className="relative h-2.5 w-full"
          >
            <ColorPicker.ChannelSliderTrack className="h-full w-full" />
            <ColorPicker.ChannelSliderThumb className={THUMB} />
          </ColorPicker.ChannelSlider>

          <ColorPicker.ChannelSlider
            channel="alpha"
            className="relative h-2.5 w-full"
          >
            <ColorPicker.ChannelSliderTrack className="h-full w-full" />
            <ColorPicker.ChannelSliderThumb className={THUMB} />
          </ColorPicker.ChannelSlider>
        </div>

        <div className="mt-3 flex items-center gap-2 border border-gray-200 px-2 py-1.5">
          <div
            className="size-4 shrink-0"
            style={{ backgroundColor: color }}
          />
          <ColorPicker.Input
            channel="hex-alpha"
            className="w-full bg-transparent font-mono text-[13px] text-gray-500 uppercase outline-none focus:text-black data-invalid:text-red-400"
          />
        </div>

        <ColorPicker.SwatchGroup className="mt-3 flex flex-wrap gap-1">
          {SWATCHES.map((c) => (
            <ColorPicker.Swatch
              key={c}
              value={c}
              selected={color === c}
              onSelect={setColor}
              className={SWATCH}
            />
          ))}
        </ColorPicker.SwatchGroup>

        <div className="mt-3 flex items-center gap-3">
          {CHANNELS.map((ch) => (
            <div key={ch} className="flex items-center gap-1">
              <span className="text-[11px] font-medium text-gray-300 uppercase">
                {ch[0]}
              </span>
              <ColorPicker.Input
                channel={ch}
                className="w-10 bg-transparent font-mono text-[11px] text-gray-500 tabular-nums outline-none focus:text-black"
              />
            </div>
          ))}
        </div>
      </ColorPicker.Root>
    </section>
  );
}

function ChannelsPicker() {
  const [color, setColor] = useState('#ef4444');

  return (
    <section>
      <SectionHeader
        number="02"
        title="Channels"
        description="Individual H·S·B·A editable sliders."
        color={color}
      />

      <ColorPicker.Root color={color} onColorChange={setColor}>
        <div className="space-y-4">
          {CHANNELS.map((ch) => (
            <div key={ch}>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="text-[12px] font-medium text-gray-500">
                  {CHANNEL_NAMES[ch]}
                </span>
                <ColorPicker.Input
                  channel={ch}
                  className="w-14 bg-transparent text-right font-mono text-[11px] text-gray-400 tabular-nums outline-none focus:text-black"
                />
              </div>
              <ColorPicker.ChannelSlider
                channel={ch}
                className="relative h-3 w-full"
              >
                <ColorPicker.ChannelSliderTrack className="h-full w-full" />
                <ColorPicker.ChannelSliderThumb className={THUMB} />
              </ColorPicker.ChannelSlider>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 border border-gray-200 px-2 py-1.5">
          <div
            className="size-4 shrink-0"
            style={{ backgroundColor: color }}
          />
          <ColorPicker.Input
            channel="hex"
            className="w-full bg-transparent font-mono text-[13px] text-gray-500 uppercase outline-none focus:text-black data-invalid:text-red-400"
          />
        </div>
      </ColorPicker.Root>
    </section>
  );
}

function CompactPicker() {
  const [color, setColor] = useState('#8b5cf6');

  return (
    <section>
      <SectionHeader
        number="03"
        title="Compact"
        description="Just the essentials — area and hue."
        color={color}
      />

      <ColorPicker.Root color={color} onColorChange={setColor}>
        <ColorPicker.Area className="relative h-44 w-full cursor-crosshair">
          <ColorPicker.AreaBackground className={AREA_BG} />
          <ColorPicker.AreaThumb className={THUMB} />
        </ColorPicker.Area>

        <div className="mt-3">
          <ColorPicker.ChannelSlider
            channel="hue"
            className="relative h-[10px] w-full"
          >
            <ColorPicker.ChannelSliderTrack className="h-full w-full" />
            <ColorPicker.ChannelSliderThumb className={THUMB} />
          </ColorPicker.ChannelSlider>
        </div>

        <div className="mt-3 flex items-center gap-2 border border-gray-200 px-2 py-1.5">
          <div
            className="size-4 shrink-0"
            style={{ backgroundColor: color }}
          />
          <ColorPicker.Input
            channel="hex"
            className="w-full bg-transparent font-mono text-[13px] text-gray-500 uppercase outline-none focus:text-black data-invalid:text-red-400"
          />
        </div>
      </ColorPicker.Root>
    </section>
  );
}

function SwatchPicker() {
  const [color, setColor] = useState('#22c55e');

  return (
    <section>
      <SectionHeader
        number="04"
        title="Swatches"
        description="Preset palette with hue fine-tuning."
        color={color}
      />

      <ColorPicker.Root color={color} onColorChange={setColor}>
        <div
          className="h-20 w-full border border-gray-200"
          style={{ backgroundColor: color }}
        />

        <div className="mt-3">
          <ColorPicker.ChannelSlider
            channel="hue"
            className="relative h-2.5 w-full"
          >
            <ColorPicker.ChannelSliderTrack className="h-full w-full" />
            <ColorPicker.ChannelSliderThumb className={THUMB} />
          </ColorPicker.ChannelSlider>
        </div>

        <ColorPicker.SwatchGroup className="mt-3 flex flex-wrap gap-1">
          {SWATCHES.map((c) => (
            <ColorPicker.Swatch
              key={c}
              value={c}
              selected={color === c}
              onSelect={setColor}
              className={SWATCH}
            />
          ))}
        </ColorPicker.SwatchGroup>

        <div className="mt-3 flex items-center gap-2 border border-gray-200 px-2 py-1.5">
          <div
            className="size-4 shrink-0"
            style={{ backgroundColor: color }}
          />
          <ColorPicker.Input
            channel="hex"
            className="w-full bg-transparent font-mono text-[13px] text-gray-500 uppercase outline-none focus:text-black data-invalid:text-red-400"
          />
        </div>
      </ColorPicker.Root>
    </section>
  );
}

export function ColorPickerExamples() {
  return (
    <div className="grid items-start gap-10 sm:grid-cols-2">
      <CompletePicker />
      <ChannelsPicker />
      <CompactPicker />
      <SwatchPicker />
    </div>
  );
}
