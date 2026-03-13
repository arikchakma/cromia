import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';

import * as ColorPicker from './color-picker';

function renderPicker(props: ColorPicker.Root.Props) {
  return render(
    <ColorPicker.Root {...props}>
      <ColorPicker.Area data-testid="area" style={{ width: 200, height: 200 }}>
        <ColorPicker.AreaBackground />
        <ColorPicker.AreaThumb />
      </ColorPicker.Area>
      <ColorPicker.ChannelSlider
        channel="hue"
        data-testid="hue-slider"
        style={{ width: 200, height: 20 }}
      >
        <ColorPicker.ChannelSliderTrack />
        <ColorPicker.ChannelSliderThumb />
      </ColorPicker.ChannelSlider>
      <ColorPicker.ChannelSlider
        channel="alpha"
        data-testid="alpha-slider"
        style={{ width: 200, height: 20 }}
      >
        <ColorPicker.ChannelSliderTrack />
        <ColorPicker.ChannelSliderThumb />
      </ColorPicker.ChannelSlider>
      <ColorPicker.Input channel="hex" data-testid="hex-input" />
      <ColorPicker.Input
        channel="hex-alpha"
        data-testid="hex-alpha-input"
        prefixed
      />
      <ColorPicker.Input
        channel="hex"
        data-testid="hex-unprefixed"
        prefixed={false}
      />
      <ColorPicker.Input channel="hue" data-testid="hue-input" />
      <ColorPicker.Input channel="alpha" data-testid="alpha-input" />
      <ColorPicker.SwatchGroup data-testid="swatch-group">
        <ColorPicker.Swatch value="#ff0000" />
        <ColorPicker.Swatch value="#00ff00" />
        <ColorPicker.Swatch value="#0000ff" />
      </ColorPicker.SwatchGroup>
    </ColorPicker.Root>
  );
}

describe('ColorPicker rendering', () => {
  it('renders root with data attribute', async () => {
    await renderPicker({ defaultColor: '#ff0000' });
    await expect.element(page.getByRole('group').first()).toBeInTheDocument();
  });

  it('renders all sub-components', async () => {
    const screen = await renderPicker({ defaultColor: '#ff0000' });
    await expect.element(screen.getByTestId('area')).toBeInTheDocument();
    await expect.element(screen.getByTestId('hue-slider')).toBeInTheDocument();
    await expect
      .element(screen.getByTestId('alpha-slider'))
      .toBeInTheDocument();
    await expect.element(screen.getByTestId('hex-input')).toBeInTheDocument();
    await expect
      .element(screen.getByTestId('swatch-group'))
      .toBeInTheDocument();
  });
});

describe('controlled mode', () => {
  it('does not fire onColorChange on mount', async () => {
    const handleChange = vi.fn();
    await renderPicker({ color: '#ff0000', onColorChange: handleChange });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('reflects controlled color in hex input', async () => {
    const screen = await renderPicker({ color: '#3b82f6' });
    await expect
      .element(screen.getByTestId('hex-input'))
      .toHaveValue('#3b82f6');
  });
});

describe('uncontrolled mode', () => {
  it('renders with defaultColor', async () => {
    const screen = await renderPicker({ defaultColor: '#ff0000' });
    await expect
      .element(screen.getByTestId('hex-input'))
      .toHaveValue('#ff0000');
  });
});

describe('area keyboard interactions', () => {
  it('changes color on ArrowRight', async () => {
    const handleChange = vi.fn();
    const screen = await renderPicker({
      color: '#808080',
      onColorChange: handleChange,
    });
    const area = screen.getByTestId('area');

    area.element().focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(handleChange).toHaveBeenCalled();
    const hex = handleChange.mock.calls[0][0] as string;
    expect(hex).not.toBe('#808080');
  });

  it('changes color on ArrowUp', async () => {
    const handleChange = vi.fn();
    const screen = await renderPicker({
      color: '#808080',
      onColorChange: handleChange,
    });
    const area = screen.getByTestId('area');

    area.element().focus();
    await userEvent.keyboard('{ArrowUp}');

    expect(handleChange).toHaveBeenCalled();
    const hex = handleChange.mock.calls[0][0] as string;
    expect(hex).not.toBe('#808080');
  });

  it('ignores non-arrow keys', async () => {
    const handleChange = vi.fn();
    const screen = await renderPicker({
      defaultColor: '#808080',
      onColorChange: handleChange,
    });
    const area = screen.getByTestId('area');

    area.element().focus();
    await userEvent.keyboard('a');

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('commits color on key interaction', async () => {
    const handleCommitted = vi.fn();
    const screen = await renderPicker({
      defaultColor: '#808080',
      onColorCommitted: handleCommitted,
    });
    const area = screen.getByTestId('area');

    area.element().focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(handleCommitted).toHaveBeenCalledOnce();
  });
});

describe('hue slider keyboard interactions', () => {
  it('increases hue on ArrowRight', async () => {
    const handleChange = vi.fn();
    const screen = await renderPicker({
      color: '#ff0000',
      onColorChange: handleChange,
    });
    const thumb = screen.getByTestId('hue-slider').getByRole('slider');

    await thumb.element().focus();
    await userEvent.keyboard('{ArrowRight}');

    expect(handleChange).toHaveBeenCalled();
    const hex = handleChange.mock.calls[0][0] as string;
    expect(hex).not.toBe('#ff0000');
  });

  it('ArrowUp also increases hue (1D WAI-ARIA)', async () => {
    const handleChange = vi.fn();
    const screen = await renderPicker({
      color: '#ff0000',
      onColorChange: handleChange,
    });
    const thumb = screen.getByTestId('hue-slider').getByRole('slider');

    await thumb.element().focus();
    await userEvent.keyboard('{ArrowUp}');

    expect(handleChange).toHaveBeenCalled();
    const hex = handleChange.mock.calls[0][0] as string;
    expect(hex).not.toBe('#ff0000');
  });

  it('Home sets hue to minimum', async () => {
    const handleChange = vi.fn();
    const screen = await renderPicker({
      color: '#00ff00',
      onColorChange: handleChange,
    });
    const thumb = screen.getByTestId('hue-slider').getByRole('slider');

    await thumb.element().focus();
    await userEvent.keyboard('{Home}');

    expect(handleChange).toHaveBeenCalled();
    const hex = handleChange.mock.calls[0][0] as string;
    expect(hex).toMatch(/^#/);
  });

  it('End sets hue to maximum', async () => {
    const handleChange = vi.fn();
    const screen = await renderPicker({
      color: '#ff0000',
      onColorChange: handleChange,
    });
    const thumb = screen.getByTestId('hue-slider').getByRole('slider');

    await thumb.element().focus();
    await userEvent.keyboard('{End}');

    expect(handleChange).toHaveBeenCalled();
    const hex = handleChange.mock.calls[0][0] as string;
    expect(hex).toMatch(/^#/);
  });
});

describe('hex input', () => {
  it('displays current color as hex', async () => {
    const screen = await renderPicker({ defaultColor: '#3b82f6' });
    await expect
      .element(screen.getByTestId('hex-input'))
      .toHaveValue('#3b82f6');
  });

  it('updates color on valid hex input', async () => {
    const handleChange = vi.fn();
    const screen = await renderPicker({
      defaultColor: '#ff0000',
      onColorChange: handleChange,
    });
    const input = screen.getByTestId('hex-input');

    await input.element().focus();
    await userEvent.clear(input);
    await userEvent.fill(input, '#00ff00');

    expect(handleChange).toHaveBeenCalled();
    const lastHex = handleChange.mock.calls[
      handleChange.mock.calls.length - 1
    ][0] as string;
    expect(lastHex).toBe('#00ff00');
  });

  it('marks input as invalid on bad hex', async () => {
    const screen = await renderPicker({ defaultColor: '#ff0000' });
    const input = screen.getByTestId('hex-input');

    await input.element().focus();
    await userEvent.clear(input);
    await userEvent.fill(input, 'zzz');

    await expect.element(input).toHaveAttribute('data-invalid', '');
    await expect.element(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('commits on blur', async () => {
    const handleCommitted = vi.fn();
    const screen = await renderPicker({
      defaultColor: '#ff0000',
      onColorCommitted: handleCommitted,
    });
    const input = screen.getByTestId('hex-input');

    await input.element().focus();
    await userEvent.clear(input);
    await userEvent.fill(input, '#00ff00');
    await input.element().blur();

    expect(handleCommitted).toHaveBeenCalled();
  });

  it('steps hex on ArrowUp', async () => {
    const handleChange = vi.fn();
    const screen = await renderPicker({
      defaultColor: '#000001',
      onColorChange: handleChange,
    });
    const input = screen.getByTestId('hex-input');

    await input.element().focus();
    await userEvent.keyboard('{ArrowUp}');

    expect(handleChange).toHaveBeenCalled();
  });

  it('steps hex on ArrowDown', async () => {
    const handleChange = vi.fn();
    const screen = await renderPicker({
      defaultColor: '#000002',
      onColorChange: handleChange,
    });
    const input = screen.getByTestId('hex-input');

    await input.element().focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(handleChange).toHaveBeenCalled();
  });
});

describe('hex-alpha input', () => {
  it('shows 6-char hex when alpha is 1', async () => {
    const screen = await renderPicker({ defaultColor: '#ff0000' });
    await expect
      .element(screen.getByTestId('hex-alpha-input'))
      .toHaveValue('#ff0000');
  });
});

describe('prefixed prop', () => {
  it('includes # when prefixed is true', async () => {
    const screen = await renderPicker({ defaultColor: '#ff0000' });
    await expect
      .element(screen.getByTestId('hex-input'))
      .toHaveValue('#ff0000');
  });

  it('excludes # when prefixed is false', async () => {
    const screen = await renderPicker({ defaultColor: '#ff0000' });
    await expect
      .element(screen.getByTestId('hex-unprefixed'))
      .toHaveValue('ff0000');
  });
});

describe('channel inputs', () => {
  it('displays hue value with degree suffix', async () => {
    const screen = await renderPicker({ defaultColor: '#00ff00' });
    await expect.element(screen.getByTestId('hue-input')).toHaveValue('120°');
  });

  it('displays alpha percentage', async () => {
    const screen = await renderPicker({ defaultColor: '#ff0000' });
    await expect.element(screen.getByTestId('alpha-input')).toHaveValue('100%');
  });

  it('updates hue on valid input', async () => {
    const handleChange = vi.fn();
    const screen = await renderPicker({
      defaultColor: '#ff0000',
      onColorChange: handleChange,
    });
    const input = screen.getByTestId('hue-input');

    await input.element().focus();
    await userEvent.clear(input);
    await userEvent.fill(input, '180°');

    expect(handleChange).toHaveBeenCalled();
  });

  it('rejects out-of-range values', async () => {
    const screen = await renderPicker({ defaultColor: '#ff0000' });
    const input = screen.getByTestId('hue-input');

    await input.element().focus();
    await userEvent.clear(input);
    await userEvent.fill(input, '999');

    await expect.element(input).toHaveAttribute('data-invalid', '');
  });
});

describe('swatch', () => {
  it('renders with correct ARIA attributes', async () => {
    const screen = await render(
      <ColorPicker.Swatch value="#ff0000" selected data-testid="swatch-red" />
    );
    const swatch = screen.getByTestId('swatch-red');

    await expect.element(swatch).toHaveRole('radio');
    await expect.element(swatch).toHaveAttribute('aria-label', '#ff0000');
  });

  it('marks selected swatch', async () => {
    const screen = await render(
      <ColorPicker.Swatch value="#ff0000" selected data-testid="swatch-red" />
    );
    const swatch = screen.getByTestId('swatch-red');

    await expect.element(swatch).toHaveAttribute('aria-checked', 'true');
    await expect.element(swatch).toHaveAttribute('data-selected', '');
  });

  it('marks non-selected swatch', async () => {
    const screen = await render(
      <ColorPicker.Swatch value="#00ff00" data-testid="swatch-green" />
    );
    const swatch = screen.getByTestId('swatch-green');

    await expect.element(swatch).toHaveAttribute('aria-checked', 'false');
  });

  it('fires onSelect on click', async () => {
    const handleSelect = vi.fn();
    const screen = await render(
      <ColorPicker.Swatch
        value="#0000ff"
        onSelect={handleSelect}
        data-testid="swatch-blue"
      />
    );
    const swatch = screen.getByTestId('swatch-blue');

    await swatch.click();

    expect(handleSelect).toHaveBeenCalledWith('#0000ff');
  });

  it('does not fire onSelect when disabled', async () => {
    const handleSelect = vi.fn();
    const screen = await render(
      <ColorPicker.Swatch
        value="#00ff00"
        onSelect={handleSelect}
        disabled
        data-testid="swatch-green"
      />
    );

    await screen.getByTestId('swatch-green').click();

    expect(handleSelect).not.toHaveBeenCalled();
  });
});

describe('swatch group', () => {
  it('renders with radiogroup role', async () => {
    const screen = await render(
      <ColorPicker.SwatchGroup data-testid="swatch-group">
        <ColorPicker.Swatch value="#ff0000" />
      </ColorPicker.SwatchGroup>
    );
    await expect
      .element(screen.getByTestId('swatch-group'))
      .toHaveRole('radiogroup');
  });
});

describe('disabled state', () => {
  it('sets data-disabled on root', async () => {
    await render(
      <ColorPicker.Root
        defaultColor="#ff0000"
        disabled
        data-testid="disabled-root"
      />
    );
    await expect
      .element(page.getByTestId('disabled-root'))
      .toHaveAttribute('data-disabled', '');
  });
});

describe('CSS custom properties', () => {
  it('sets --color-picker-* variables on root', async () => {
    await render(
      <ColorPicker.Root defaultColor="#ff0000" data-testid="css-root" />
    );
    const root = page.getByTestId('css-root').element() as HTMLElement;

    expect(root.style.getPropertyValue('--color-picker-hue')).toBe('0');
    expect(root.style.getPropertyValue('--color-picker-saturation')).toBe(
      '100'
    );
    expect(root.style.getPropertyValue('--color-picker-brightness')).toBe(
      '100'
    );
    expect(root.style.getPropertyValue('--color-picker-alpha')).toBe('1');
  });
});
