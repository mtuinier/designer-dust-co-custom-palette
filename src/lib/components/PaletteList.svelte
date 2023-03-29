<script lang="ts">
  import Tooltip, { Wrapper } from "@smui/tooltip";
  import { createEventDispatcher } from "svelte";
  import { activePalettes, type Palette } from "../utils/palettes";

  export let selectedSegment: number;

  const dispatch = createEventDispatcher<{ selectedPalette: Palette }>();

  function handlePaletteSelect(palette: Palette) {
    dispatch("selectedPalette", palette);
  }

  function handleDragStart(e: DragEvent, palette: Palette) {
    e.dataTransfer.clearData();
    e.dataTransfer.setData("paletteDrag", JSON.stringify(palette));
    e.dataTransfer.dropEffect = "move";
  }
</script>

<div>
  <p>
    Sparkle {selectedSegment + 1}
  </p>
  <div class="palette-list">
    {#each activePalettes as palette}
      {#if palette.active}
        <Wrapper>
          <Tooltip>{palette.name}</Tooltip>
          <button
            type="button"
            on:click={() => handlePaletteSelect(palette)}
            draggable
            on:dragstart={(e) => handleDragStart(e, palette)}
          >
            <img src={palette.img} alt={palette.name} class="palette" />
          </button>
        </Wrapper>
      {/if}
    {/each}
  </div>
</div>

<style>
  .palette-list {
    display: grid;
    grid-template-columns: repeat(4, 100px);
    gap: 16px;
  }

  .palette {
    width: 100px;
    height: 100px;
    border-radius: 100%;
  }
</style>
