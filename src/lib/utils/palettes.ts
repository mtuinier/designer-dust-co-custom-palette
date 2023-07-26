export interface Palette {
  name: string;
  img: string;
  active: boolean;
  colors: string[];
}

export const palettes: Palette[] = [
  {
    name: "Arcade Floor",
    img: "https://cdn.shopify.com/s/files/1/0537/6157/3040/files/arcadefloor_swatch.jpg?v=1688618078",
    active: true,
    colors: ["Black", "Blacklight"],
  },
];

export const activePalettes = palettes
  .filter((p) => !!p.active)
  .sort((a, b) =>
    a.name.toLowerCase().at(0).localeCompare(b.name.toLowerCase().at(0))
  );

const uniqueColors = palettes.reduce((acc, p) => {
  p.colors.forEach((color) => {
    acc.add(color);
  });

  return acc;
}, new Set<string>());

export const colorFilters = Array.from(uniqueColors);
