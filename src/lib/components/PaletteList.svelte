<script lang="ts">
  import Tooltip, { Wrapper } from "@smui/tooltip";
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import Chip, { Set, TrailingAction, Text } from "@smui/chips";
  import type { PaletteStore, SelectedSegmentStore } from "../stores/palettes";
  import { activePalettes, type Palette } from "../utils/palettes";
  import { onMount } from "svelte";

  export let palette: PaletteStore;
  export let selectedSegment: SelectedSegmentStore;
  let filters: Map<string, undefined> = new Map();
  let currentSearch = "";
  $: filterArray = Array.from(filters.keys());

  $: filteredPalettes =
    filters.size > 0
      ? activePalettes.filter((palette) => {
          const colors = palette.colors.map((c) => c.toLowerCase());
          for (const filter of filters.keys()) {
            if (colors.includes(filter)) return true;
          }
        })
      : activePalettes;

  function handlePaletteSelect(p) {
    palette.add($selectedSegment, p);
  }

  function handleDragStart(e: DragEvent, palette: Palette) {
    e.dataTransfer.clearData();
    e.dataTransfer.setData("paletteDrag", JSON.stringify(palette));
    e.dataTransfer.dropEffect = "move";
  }

  function handleFilterSubmission() {
    filters.set(currentSearch.toLowerCase(), undefined);
    filters = filters;
    currentSearch = "";
  }

  function handleChipRemoval(chip: string) {
    filters.delete(chip);
    filters = filters;
  }
</script>

<div>
  <form on:submit|preventDefault={handleFilterSubmission}>
    <Textfield bind:value={currentSearch} label="Filters" class="input">
      <HelperText slot="helper">Enter one or more color filters</HelperText>
    </Textfield>
  </form>
  <div>
    <Set chips={filterArray} let:chip input>
      <Chip {chip}>
        <Text>{chip}</Text>
        <TrailingAction
          icon$class="material-icons"
          on:SMUIChipsChipTrailingAction:unmount={() => handleChipRemoval(chip)}
          >cancel</TrailingAction
        >
      </Chip>
    </Set>
  </div>
  <p>
    Sparkle {$selectedSegment + 1}
  </p>
  <div class="palette-list">
    {#each filteredPalettes as palette (palette.name)}
      <Wrapper>
        <button
          type="button"
          on:click={() => handlePaletteSelect(palette)}
          draggable
          on:dragstart={(e) => handleDragStart(e, palette)}
        >
          <img src={palette.img} alt={palette.name} class="palette" />
          <Tooltip>{palette.name}</Tooltip>
        </button>
      </Wrapper>
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

  * :global(.input) {
    width: 100%;
  }
</style>
