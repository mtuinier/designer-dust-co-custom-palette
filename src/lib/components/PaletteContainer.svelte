<script lang="ts">
  import { activePalettes } from "../utils/palettes";
  import Trash from "svelte-material-icons/TrashCanOutline.svelte";
  import { Splide, SplideSlide, SplideTrack } from "@splidejs/svelte-splide";
  import "@splidejs/svelte-splide/css";
  import {
    miniPaletteLabelView,
    standardPaletteLabelView,
    type PaletteStore,
    type SelectedSegmentStore,
  } from "../stores/palettes";

  let dragging = false;
  let storedScroll;
  export let kind: "mini" | "standard" | "vault";
  export let palette: PaletteStore;
  export let selectedSegment: SelectedSegmentStore;

  const config = {
    mini: {
      containerRatio: "1 / 1",
      rows: 4,
      columns: 4,
      ratioW: 25,
      ratioH: 25,
    },
    standard: {
      containerRatio: "10 / 6",
      rows: 3,
      columns: 8,
      ratioW: 100 / 8,
      ratioH: 100 / 3,
    },
    vault: {
      containerRatio: "2 / 1",
      rows: 4,
      columns: 9,
      ratioW: 100 / 8.99,
      ratioH: 100 / 4,
    },
  };

  $: labels =
    kind === "mini"
      ? miniPaletteLabelView
      : kind === "standard"
        ? standardPaletteLabelView
        : palette;

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
      breakpoints: {
        1150: {
          width: "95vw",
        },
      },
      drag: false,
      pagination: false,
    }}
  >
    <SplideSlide class="flex-center">
      <div
        class="container"
        id="front-labels"
        class:round={kind === "mini"}
        style={`grid-template-columns: repeat(${settings.columns}, ${settings.ratioW}%); grid-template-rows: repeat(${settings.rows}, ${settings.ratioH}%); aspect-ratio: ${settings.containerRatio};`}
      >
        {#each $palette as segment, i}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <label
            for="segment-{i}"
            class="segment segment-{kind} segment-preview"
            class:bigFont={kind === "mini"}
            class:selected={i === $selectedSegment}
            class:top-left={i === 0 && kind === "mini"}
            class:top-right={i === 3 && kind === "mini"}
            class:bottom-left={i === 12 && kind === "mini"}
            class:bottom-right={i === 15 && kind === "mini"}
            on:dragover={handleDragOver}
            on:drop={(e) => handleDrop(e, i)}
            on:dragstart={(e) => handleDragStart(e, i)}
            on:dragend={handleDragEnd}
            on:click={() => {
              storedScroll = window.scrollY;
            }}
            draggable
          >
            {#if !!segment}
              <div class="img-container">
                <img src={segment.img} alt={segment.name} class="preview" />
              </div>
            {:else}
              <span>
                {i + 1}
              </span>
            {/if}
          </label>
          <select
            id="segment-{i}"
            class="screen-readers-only"
            on:click={() => {
              // hack to maintain scroll position.
              // the select element wants to bring scroll back to the top
              window.scroll(0, storedScroll);
              selectedSegment.select(i);
            }}
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
        id="back-labels"
        class:round={kind === "mini"}
        style={`grid-template-columns: repeat(${settings.columns}, ${settings.ratioW}%); grid-template-rows: repeat(${settings.rows}, ${settings.ratioH}%); aspect-ratio: ${settings.containerRatio};`}
      >
        {#each $labels as segment, i}
          <div
            class={`segment nopointer segment-${kind} label-segment`}
            class:top-left={i === 0 && kind === "mini"}
            class:top-right={i === 3 && kind === "mini"}
            class:bottom-left={i === 12 && kind === "mini"}
            class:bottom-right={i === 15 && kind === "mini"}
          >
            {#if !!segment}
              <span class="label label-{kind}">{segment.name}</span>
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
    font-family: "Keep on Truckin";
    text-align: center;
  }

  .round {
    border-radius: 33%;
  }

  .img-container {
    width: 100%;
    height: 100%;
  }

  .container {
    display: grid;
    width: 640px;
    margin: 0 auto;
    border: 2px solid black;
    overflow: hidden;
  }

  .segment {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid black;
    cursor: pointer;
    overflow: hidden;
    margin-bottom: 0;
    font-size: 16px;
    word-wrap: break-word;
  }

  .label-segment.top-left {
    padding-top: 20%;
    padding-left: 20%;
    text-align: right;
  }

  .label-segment.top-right {
    padding-top: 20%;
    padding-right: 20%;
    text-align: left;
  }

  .label-segment.bottom-left {
    padding-left: 20%;
    padding-bottom: 20%;
    text-align: right;
  }

  .label-segment.bottom-right {
    padding-bottom: 20%;
    padding-right: 20%;
    text-align: left;
  }

  .label-segment {
    padding-left: 5%;
    padding-right: 5%;
  }

  .segment-mini:nth-of-type(4n + 1) {
    border-left: none;
  }

  .segment-mini:nth-of-type(-n + 4) {
    border-top: none;
  }

  .segment-mini:nth-of-type(4n) {
    border-right: none;
  }

  .segment-mini:nth-of-type(n + 13) {
    border-bottom: none;
  }

  .segment-standard:nth-of-type(8n + 1) {
    border-left: none;
  }

  .segment-standard:nth-of-type(-n + 8) {
    border-top: none;
  }

  .segment-standard:nth-of-type(8n) {
    border-right: none;
  }

  .segment-standard:nth-of-type(n + 17) {
    border-bottom: none;
  }

  .segment-vault:nth-of-type(9n + 1) {
    border-left: none;
  }

  .segment-vault:nth-of-type(-n + 9) {
    border-top: none;
  }

  .segment-vault:nth-of-type(9n) {
    border-right: none;
  }

  .segment-vault:nth-of-type(n + 28) {
    border-bottom: none;
  }

  .bigFont {
    font-size: 22px;
  }

  .nopointer {
    cursor: auto;
  }

  .segment .preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
    max-width: 100%;
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

  .label-standard {
    font-size: 12px;
  }

  .label-vault {
    font-size: 10px;
  }

  * :global(.no-events) {
    pointer-events: none;
  }

  .hidden {
    visibility: hidden;
  }

  .top-left > span,
  .bottom-left > span {
    margin-left: 20%;
  }

  .top-right > span,
  .bottom-right > span {
    margin-right: 20%;
  }

  @media screen and (max-width: 1150px) {
    .custom {
      gap: 40px;
      position: relative;
    }

    .container {
      width: 80vw;
    }
  }

  @media screen and (max-width: 900px) {
    .custom {
      top: 48px;
    }

    .label {
      font-size: 2vw;
    }

    .label-standard {
      font-size: 1.2vw;
    }

    .label-vault {
      font-size: 1.2vw;
    }

    .clone .label {
      font-size: 22px;
    }

    .clone .label-standard {
      font-size: 18px;
    }

    .clone .label-vault {
      font-size: 18px;
    }
  }
</style>
