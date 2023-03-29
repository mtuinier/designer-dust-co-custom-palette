<script lang="ts">
  import { activePalettes, type Palette } from "../utils/palettes";
  import Trash from "svelte-material-icons/TrashCanOutline.svelte";

  export let selectedSegment: number;
  export let segments: (Palette | undefined)[];
  let dragging = false;

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
  }

  function handleDrop(e: DragEvent, i: number) {
    const data = e.dataTransfer.getData("paletteDrag");
    if (!data) return;
    const palette = JSON.parse(data);
    segments[i] = palette;
  }

  function handleDragStart(e: DragEvent, i: number) {
    dragging = true;
    const palette = segments[i];
    console.log(palette);
    if (!palette) return;
    e.dataTransfer.clearData();
    e.dataTransfer.setData("paletteDrag", JSON.stringify(palette));
    e.dataTransfer.setData("trashIndex", JSON.stringify(i));
    e.dataTransfer.dropEffect = "move";
  }

  function handleTrashDrop(e: DragEvent) {
    const data = e.dataTransfer.getData("trashIndex");
    if (!data) return;
    const trashIndex = JSON.parse(data);
    segments[trashIndex] = undefined;
    dragging = false;
  }

  function handleDragEnd() {
    dragging = false;
  }
</script>

<div class="custom">
  <div class="container">
    {#each segments as segment, i}
      <label
        for="segment-{i}"
        class="segment"
        class:selected={i === selectedSegment}
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
        on:click={() => (selectedSegment = i)}
        value={segments[i]}
      >
        {#each activePalettes as palette}
          <option value={palette.name} />
        {/each}
      </select>
    {/each}
  </div>
  {#if dragging}
    <div class="trash" on:dragover={handleDragOver} on:drop={handleTrashDrop}>
      <Trash width={40} height={40} />
    </div>
  {/if}
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
  .container {
    display: grid;
    grid-template-columns: repeat(8, 80px);
    grid-template-rows: repeat(3, 120px);
  }

  .segment {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 2px solid black;
    border-left: 2px solid black;
    cursor: pointer;
    overflow: hidden;
    width: 80px;
    height: 120px;
  }

  .preview {
    width: 125px;
    object-fit: fill;
  }

  .segment:nth-of-type(-n + 8) {
    border-top: 2px solid black;
  }

  .segment:nth-of-type(8n) {
    border-right: 2px solid black;
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
</style>
