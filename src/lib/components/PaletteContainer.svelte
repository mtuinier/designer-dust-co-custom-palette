<script lang="ts">
  import { activePalettes } from "../utils/palettes";
  import Trash from "svelte-material-icons/TrashCanOutline.svelte";
  import { Splide, SplideSlide, SplideTrack } from "@splidejs/svelte-splide";
  import "@splidejs/svelte-splide/css";
  import {
    miniPaletteLabelView,
    type PaletteStore,
    type SelectedSegmentStore,
  } from "../stores/palettes";

  let dragging = false;
  export let kind: "mini" | "standard" | "vault";
  export let palette: PaletteStore;
  export let selectedSegment: SelectedSegmentStore;

  const config = {
    mini: {
      rows: 4,
      columns: 4,
      width: 160,
      height: 160,
    },
    standard: {
      rows: 3,
      columns: 8,
      width: 80,
      height: 120,
    },
    vault: {
      rows: 4,
      columns: 9,
      width: 640 / 9,
      height: 110,
    },
  };

  $: labels = kind === "mini" ? miniPaletteLabelView : palette;

  $: console.log($labels);

  const settings = config[kind];

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
  }

  function handleDrop(e: DragEvent, i: number) {
    const data = e.dataTransfer.getData("paletteDrag");
    if (!data) return;
    const p = JSON.parse(data);
    palette.add(i, p);

    const trashData = e.dataTransfer.getData("trashIndex");
    if (!trashData) return;
    const trashIndex = JSON.parse(trashData);
    palette.remove(trashIndex);
    dragging = false;
  }

  function handleDragStart(e: DragEvent, i: number) {
    e.stopPropagation();
    dragging = true;
    const p = $palette[i];
    if (!p) return;
    e.dataTransfer.clearData();
    e.dataTransfer.setData("paletteDrag", JSON.stringify(p));
    e.dataTransfer.setData("trashIndex", JSON.stringify(i));
    e.dataTransfer.dropEffect = "move";
  }

  function handleTrashDrop(e: DragEvent) {
    const data = e.dataTransfer.getData("trashIndex");
    if (!data) return;
    const trashIndex = JSON.parse(data);
    palette.remove(trashIndex);
    dragging = false;
  }

  function handleDragEnd() {
    dragging = false;
  }
</script>

<div class="custom">
  <Splide
    options={{
      width: 800,
      drag: false,
    }}
  >
    <SplideSlide class="flex-center">
      <div
        class="container"
        class:round={kind === "mini"}
        style={`grid-template-columns: repeat(${settings.columns}, ${settings.width}px); grid-template-rows: repeat(${settings.rows}, ${settings.height}px);`}
      >
        {#each $palette as segment, i}
          <label
            for="segment-{i}"
            class="segment"
            class:selected={i === $selectedSegment}
            class:top-left={i === 0 && kind === "mini"}
            class:top-right={i === 3 && kind === "mini"}
            class:bottom-left={i === 12 && kind === "mini"}
            class:bottom-right={i === 15 && kind === "mini"}
            on:dragover={handleDragOver}
            on:drop={(e) => handleDrop(e, i)}
            on:dragstart={(e) => handleDragStart(e, i)}
            on:dragend={handleDragEnd}
            draggable
          >
            {#if !!segment}
              <div>
                <img src={segment.img} alt={segment.name} class="preview" />
              </div>
            {:else}
              {i + 1}
            {/if}
          </label>
          <select
            id="segment-{i}"
            class="screen-readers-only"
            on:click={() => selectedSegment.select(i)}
          >
            {#each activePalettes as palette}
              <option value={palette.name} />
            {/each}
          </select>
        {/each}
      </div>
      <div
        class:hidden={!dragging}
        class="trash"
        on:dragover={handleDragOver}
        on:drop={handleTrashDrop}
      >
        <Trash width={40} height={40} />
      </div>
    </SplideSlide>
    <SplideSlide>
      <div
        class="container"
        class:round={kind === "mini"}
        style={`grid-template-columns: repeat(${settings.columns}, ${settings.width}px); grid-template-rows: repeat(${settings.rows}, ${settings.height}px);`}
      >
        {#each $labels as segment, i}
          <div
            class="segment nopointer"
            class:top-left={i === 0 && kind === "mini"}
            class:top-right={i === 3 && kind === "mini"}
            class:bottom-left={i === 12 && kind === "mini"}
            class:bottom-right={i === 15 && kind === "mini"}
          >
            {#if !!segment}
              <span class="label">{segment.name}</span>
            {/if}
          </div>
        {/each}
      </div>
    </SplideSlide>
  </Splide>
</div>

<style>
  .custom {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: sticky;
    top: 80px;
    gap: 16px;
  }

  .nopointer {
    cursor: auto;
  }

  .round {
    border-radius: 160px;
  }

  .top-left {
    border-radius: 160px 0 0 0;
  }

  .top-right {
    border-radius: 0 160px 0 0;
  }

  .bottom-left {
    border-radius: 0 0 0 160px;
  }

  .bottom-right {
    border-radius: 0 0 160px 0;
  }

  .container {
    display: grid;
    border: 1px solid black;
    width: 640px;
    margin: 0 auto;
  }

  .segment {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid black;
    cursor: pointer;
    overflow: hidden;
  }

  .preview {
    width: 170px;
    object-fit: fill;
  }

  .selected {
    box-shadow: rgba(3, 102, 214, 0.5) 0px 0px 10px 3px;
  }

  .trash {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  * :global(.flex-center) {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .label {
    display: block;
    margin: 0 auto;
    width: 80%;
  }

  * :global(.no-events) {
    pointer-events: none;
  }

  .hidden {
    visibility: hidden;
  }
</style>
