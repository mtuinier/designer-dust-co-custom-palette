import { derived, writable } from "svelte/store";
import type { Palette } from "../utils/palettes";

function createPalette(count: number) {
  const { subscribe, set, update } = writable<Palette[]>(
    new Array(count).fill(undefined)
  );

  return {
    subscribe,
    add: (target: number, palette: Palette) =>
      update((p) => {
        if (target > p.length) {
          throw new Error(
            "Bounds Error: can not add color to palette outside of it's size"
          );
        }
        p[target] = palette;
        return p;
      }),
    remove: (target: number) =>
      update((p) => {
        p[target] = undefined;
        return p;
      }),
    reset: () => set(new Array(count).fill(undefined)),
  };
}

export type PaletteStore = ReturnType<typeof createPalette>;

export const miniPalette = createPalette(16);
export const standardPalette = createPalette(24);
export const vaultPalette = createPalette(36);

const miniTransposedMapping = {
  0: 3,
  1: 2,
  2: 1,
  3: 0,
  4: 7,
  5: 6,
  6: 5,
  7: 4,
  8: 11,
  9: 10,
  10: 9,
  11: 8,
  12: 15,
  13: 14,
  14: 13,
  15: 12,
};

const standardTransposedMapping = {
  0: 7,
  1: 6,
  2: 5,
  3: 4,
  4: 3,
  5: 2,
  6: 1,
  7: 0,
  8: 15,
  9: 14,
  10: 13,
  11: 12,
  12: 11,
  13: 10,
  14: 9,
  15: 8,
  16: 23,
  17: 22,
  18: 21,
  19: 20,
  20: 19,
  21: 18,
  22: 17,
  23: 16,
};

export const miniPaletteLabelView = derived(miniPalette, ($miniPalette) => {
  const labels: Palette[] = [];
  $miniPalette.forEach((palette, i) => {
    labels[miniTransposedMapping[i]] = palette;
  });
  return labels;
});

export const standardPaletteLabelView = derived(
  standardPalette,
  ($standardPalette) => {
    const labels: Palette[] = [];
    $standardPalette.forEach((palette, i) => {
      labels[standardTransposedMapping[i]] = palette;
    });
    return labels;
  }
);

function createSelectedSegment() {
  const { subscribe, update } = writable(0);

  return {
    subscribe,
    select: (n) => update(() => n),
  };
}

export const miniSelectedSegment = createSelectedSegment();
export const standardSelectedSegment = createSelectedSegment();
export const vaultSelectedSegment = createSelectedSegment();

export type SelectedSegmentStore = ReturnType<typeof createSelectedSegment>;
