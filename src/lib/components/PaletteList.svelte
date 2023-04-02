<script lang="ts">
  import Tooltip, { Wrapper } from "@smui/tooltip";
  import IconButton, { Icon } from "@smui/icon-button";
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";
  import Accordion, { Panel, Header, Content } from "@smui-extra/accordion";
  import type { PaletteStore, SelectedSegmentStore } from "../stores/palettes";
  import {
    activePalettes,
    colorFilters,
    type Palette,
  } from "../utils/palettes";

  export let palette: PaletteStore;
  export let selectedSegment: SelectedSegmentStore;
  let filtersOpen = false;
  let selectedFilters: string[] = [];

  $: console.log(selectedFilters);

  $: filteredPalettes =
    selectedFilters.length > 0
      ? activePalettes.filter((palette) => {
          for (const filter of selectedFilters) {
            if (palette.colors.includes(filter)) return true;
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
</script>

<div>
  <Accordion>
    <Panel variant="outlined" bind:open={filtersOpen}>
      <Header>
        Filter by Color
        <IconButton slot="icon" toggle pressed={filtersOpen}>
          <Icon class="material-icons" on>expand_less</Icon>
          <Icon class="material-icons">expand_more</Icon>
        </IconButton>
      </Header>
      <Content>
        <div class="filters">
          {#each colorFilters as option}
            <FormField>
              <Checkbox bind:group={selectedFilters} value={option} />
              <span slot="label">{option}</span>
            </FormField>
          {/each}
        </div>
      </Content>
    </Panel>
  </Accordion>
  <p class="sparkle-name">
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

  .sparkle-name {
    text-align: left;
  }

  .filters {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  * :global(.input) {
    width: 100%;
  }
</style>
