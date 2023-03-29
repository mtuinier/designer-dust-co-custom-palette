<script lang="ts">
  import PaletteContainer from "./lib/components/PaletteContainer.svelte";
  import PaletteList from "./lib/components/PaletteList.svelte";
  import type { Palette } from "./lib/utils/palettes";

  let selectedSegment: number = 0;

  let segments: (Palette | undefined)[] = new Array(24).fill(undefined);

  function fillSegment(e: CustomEvent<Palette>) {
    segments[selectedSegment] = e.detail;
  }
</script>

<div class="widget">
  <PaletteContainer bind:selectedSegment bind:segments />
  <PaletteList on:selectedPalette={fillSegment} bind:selectedSegment />
</div>

<style>
  .widget {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 80px;
  }
</style>
