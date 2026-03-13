import { useCallback, useState } from 'react';
import { UnitField } from 'unit-field';

import { SectionHeader } from './section-header';

const INPUT =
  'w-full bg-transparent pr-2.5 text-right font-mono text-sm text-gray-700 tabular-nums outline-none placeholder:text-gray-300';

const DRAG_AREA =
  'flex aspect-square w-9 shrink-0 cursor-ew-resize items-center justify-center text-[12px] font-medium text-gray-400 select-none';

const ROOT =
  'relative flex h-9 w-full items-stretch border border-gray-200 transition-colors data-[focused=true]:border-gray-400';

function pxFormat(v: number) {
  return `${v}px`;
}

function pxParse(v: string) {
  const n = parseInt(v.replace('px', ''), 10);
  return isNaN(n) ? null : n;
}

function degFormat(v: number) {
  return `${v}\u00B0`;
}

function degParse(v: string) {
  const n = parseInt(v.replace('\u00B0', ''), 10);
  return isNaN(n) ? null : n;
}

function pctFormat(v: number) {
  return `${v}%`;
}

function pctParse(v: string) {
  const n = parseInt(v.replace('%', ''), 10);
  return isNaN(n) ? null : n;
}

function FieldRow(props: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[80px_1fr] items-center gap-3">
      <span className="text-[13px] text-gray-400">{props.label}</span>
      {props.children}
    </div>
  );
}

function PropertiesDemo() {
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(120);
  const [radius, setRadius] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [border, setBorder] = useState(1);

  return (
    <section>
      <SectionHeader
        number="01"
        title="Properties"
        description="Drag the labels to scrub. Arrow keys for fine control, shift for large steps."
      />

      <div className="space-y-1.5">
        <FieldRow label="Width">
          <UnitField.Root
            className={ROOT}
            format={pxFormat}
            parse={pxParse}
            value={width}
            onValueChange={setWidth}
            min={0}
            max={1000}
          >
            <UnitField.DragArea className={DRAG_AREA}>W</UnitField.DragArea>
            <UnitField.Input className={INPUT} />
          </UnitField.Root>
        </FieldRow>
        <FieldRow label="Height">
          <UnitField.Root
            className={ROOT}
            format={pxFormat}
            parse={pxParse}
            value={height}
            onValueChange={setHeight}
            min={0}
            max={1000}
          >
            <UnitField.DragArea className={DRAG_AREA}>H</UnitField.DragArea>
            <UnitField.Input className={INPUT} />
          </UnitField.Root>
        </FieldRow>
        <FieldRow label="Radius">
          <UnitField.Root
            className={ROOT}
            format={pxFormat}
            parse={pxParse}
            value={radius}
            onValueChange={setRadius}
            min={0}
            max={999}
          >
            <UnitField.DragArea className={DRAG_AREA}>R</UnitField.DragArea>
            <UnitField.Input className={INPUT} />
          </UnitField.Root>
        </FieldRow>
        <FieldRow label="Rotation">
          <UnitField.Root
            className={ROOT}
            format={degFormat}
            parse={degParse}
            value={rotation}
            onValueChange={setRotation}
            min={0}
            max={360}
          >
            <UnitField.DragArea className={DRAG_AREA}>&deg;</UnitField.DragArea>
            <UnitField.Input className={INPUT} />
          </UnitField.Root>
        </FieldRow>
        <FieldRow label="Opacity">
          <UnitField.Root
            className={ROOT}
            format={pctFormat}
            parse={pctParse}
            value={opacity}
            onValueChange={setOpacity}
            min={0}
            max={100}
          >
            <UnitField.DragArea className={DRAG_AREA}>%</UnitField.DragArea>
            <UnitField.Input className={INPUT} />
          </UnitField.Root>
        </FieldRow>
        <FieldRow label="Border">
          <UnitField.Root
            className={ROOT}
            format={pxFormat}
            parse={pxParse}
            value={border}
            onValueChange={setBorder}
            min={0}
            max={20}
          >
            <UnitField.DragArea className={DRAG_AREA}>B</UnitField.DragArea>
            <UnitField.Input className={INPUT} />
          </UnitField.Root>
        </FieldRow>
      </div>

      <div className="mt-4 flex h-32 items-center justify-center overflow-hidden border border-gray-200">
        <div
          className="bg-gray-800"
          style={{
            width: Math.min(width, 160),
            height: Math.min(height, 80),
            borderRadius: radius,
            transform: `rotate(${rotation}deg)`,
            opacity: opacity / 100,
            borderWidth: border,
            borderColor: '#9ca3af',
            borderStyle: 'solid',
            transition: 'all 150ms ease',
          }}
        />
      </div>
    </section>
  );
}

function PaddingDemo() {
  const [top, setTop] = useState(16);
  const [right, setRight] = useState(24);
  const [bottom, setBottom] = useState(16);
  const [left, setLeft] = useState(24);

  return (
    <section>
      <SectionHeader
        number="02"
        title="Padding"
        description="Grouped fields for spacing values."
      />

      <div className="grid grid-cols-2 gap-2">
        <UnitField.Root
          className={ROOT}
          format={pxFormat}
          parse={pxParse}
          value={top}
          onValueChange={setTop}
          min={0}
          max={100}
        >
          <UnitField.DragArea className={DRAG_AREA}>T</UnitField.DragArea>
          <UnitField.Input className={INPUT} />
        </UnitField.Root>
        <UnitField.Root
          className={ROOT}
          format={pxFormat}
          parse={pxParse}
          value={right}
          onValueChange={setRight}
          min={0}
          max={100}
        >
          <UnitField.DragArea className={DRAG_AREA}>R</UnitField.DragArea>
          <UnitField.Input className={INPUT} />
        </UnitField.Root>
        <UnitField.Root
          className={ROOT}
          format={pxFormat}
          parse={pxParse}
          value={bottom}
          onValueChange={setBottom}
          min={0}
          max={100}
        >
          <UnitField.DragArea className={DRAG_AREA}>B</UnitField.DragArea>
          <UnitField.Input className={INPUT} />
        </UnitField.Root>
        <UnitField.Root
          className={ROOT}
          format={pxFormat}
          parse={pxParse}
          value={left}
          onValueChange={setLeft}
          min={0}
          max={100}
        >
          <UnitField.DragArea className={DRAG_AREA}>L</UnitField.DragArea>
          <UnitField.Input className={INPUT} />
        </UnitField.Root>
      </div>

      <div className="mt-4 flex items-center justify-center border border-gray-200 p-4">
        <div className="relative inline-block border border-dashed border-gray-300">
          <div
            style={{
              paddingTop: Math.min(top, 32),
              paddingRight: Math.min(right, 40),
              paddingBottom: Math.min(bottom, 32),
              paddingLeft: Math.min(left, 40),
              transition: 'all 150ms ease',
            }}
          >
            <div className="h-10 w-24 bg-gray-800" />
          </div>
          <span className="absolute top-1/2 left-1 -translate-y-1/2 font-mono text-[9px] text-gray-400">
            {left}
          </span>
          <span className="absolute top-1/2 right-1 -translate-y-1/2 font-mono text-[9px] text-gray-400">
            {right}
          </span>
          <span className="absolute top-1 left-1/2 -translate-x-1/2 font-mono text-[9px] text-gray-400">
            {top}
          </span>
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[9px] text-gray-400">
            {bottom}
          </span>
        </div>
      </div>
    </section>
  );
}

function CommittedDemo() {
  const [value, setValue] = useState(50);
  const [committed, setCommitted] = useState(50);

  const handleCommitted = useCallback((v: number) => {
    setCommitted(v);
  }, []);

  return (
    <section>
      <SectionHeader
        number="03"
        title="Committed value"
        description="Live value updates on drag, committed value fires on release."
      />

      <UnitField.Root
        className={ROOT}
        format={pctFormat}
        parse={pctParse}
        value={value}
        onValueChange={setValue}
        onValueCommitted={handleCommitted}
        min={0}
        max={100}
      >
        <UnitField.DragArea className={DRAG_AREA}>%</UnitField.DragArea>
        <UnitField.Input className={INPUT} />
      </UnitField.Root>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between border border-gray-200 px-3 py-2">
          <span className="text-[12px] text-gray-400">Live</span>
          <span className="font-mono text-[13px] text-gray-600 tabular-nums">
            {value}%
          </span>
        </div>
        <div className="flex items-center justify-between border border-gray-200 px-3 py-2">
          <span className="text-[12px] text-gray-400">Committed</span>
          <span className="font-mono text-[13px] text-gray-600 tabular-nums">
            {committed}%
          </span>
        </div>
      </div>

      <div className="mt-3 border border-gray-200">
        <div
          className="h-1.5 bg-gray-800 transition-all duration-75"
          style={{ width: `${value}%` }}
        />
      </div>
    </section>
  );
}

function FontSizeDemo() {
  const [fontSize, setFontSize] = useState(24);
  const [lineHeight, setLineHeight] = useState(150);
  const [letterSpacing, setLetterSpacing] = useState(0);

  return (
    <section>
      <SectionHeader
        number="04"
        title="Typography"
        description="Font size, line height, and letter spacing."
      />

      <div className="space-y-1.5">
        <FieldRow label="Size">
          <UnitField.Root
            className={ROOT}
            format={pxFormat}
            parse={pxParse}
            value={fontSize}
            onValueChange={setFontSize}
            min={8}
            max={120}
          >
            <UnitField.DragArea className={DRAG_AREA}>Sz</UnitField.DragArea>
            <UnitField.Input className={INPUT} />
          </UnitField.Root>
        </FieldRow>
        <FieldRow label="Leading">
          <UnitField.Root
            className={ROOT}
            format={pctFormat}
            parse={pctParse}
            value={lineHeight}
            onValueChange={setLineHeight}
            min={50}
            max={300}
          >
            <UnitField.DragArea className={DRAG_AREA}>Ld</UnitField.DragArea>
            <UnitField.Input className={INPUT} />
          </UnitField.Root>
        </FieldRow>
        <FieldRow label="Tracking">
          <UnitField.Root
            className={ROOT}
            format={pxFormat}
            parse={(v) => {
              const n = parseFloat(v.replace('px', ''));
              return isNaN(n) ? null : n;
            }}
            value={letterSpacing}
            onValueChange={setLetterSpacing}
            min={-10}
            max={20}
            step={0.5}
          >
            <UnitField.DragArea className={DRAG_AREA}>Tk</UnitField.DragArea>
            <UnitField.Input className={INPUT} />
          </UnitField.Root>
        </FieldRow>
      </div>

      <div className="mt-4 border border-gray-200 p-4 overflow-hidden">
        <p
          className="text-black transition-all font-medium"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: `${lineHeight}%`,
            letterSpacing: `${letterSpacing}px`,
          }}
        >
          Aa Bb Cc
        </p>
      </div>
    </section>
  );
}

export function UnitFieldExamples() {
  return (
    <div className="grid items-start gap-x-6 gap-y-10 sm:grid-cols-2">
      <PropertiesDemo />
      <PaddingDemo />
      <CommittedDemo />
      <FontSizeDemo />
    </div>
  );
}
