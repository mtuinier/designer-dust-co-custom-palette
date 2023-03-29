<script lang="ts">
  import { activePalettes, type Palette } from "../utils/palettes";

  export let selectedSegment: number;

  export let segments: (Palette | undefined)[];

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
    const palette = segments[i];
    console.log(palette);
    if (!palette) return;
    e.dataTransfer.clearData();
    e.dataTransfer.setData("paletteDrag", JSON.stringify(palette));
    e.dataTransfer.dropEffect = "move";
  }
</script>

<div class="container">
  {#each segments as segment, i}
    <label
      for="segment-{i}"
      class="segment"
      class:selected={i === selectedSegment}
      on:dragover={handleDragOver}
      on:drop={(e) => handleDrop(e, i)}
      on:dragstart={(e) => handleDragStart(e, i)}
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
    >
      {#each activePalettes as palette}
        <option value={palette.name} />
      {/each}
    </select>
  {/each}
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: repeat(8, 80px);
    grid-template-rows: repeat(3, 120px);
    position: sticky;
    top: 80px;
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
</style>
