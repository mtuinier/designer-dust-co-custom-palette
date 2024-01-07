<script lang="ts">
  import Tooltip, { Wrapper } from "@smui/tooltip";
  import h2c from "html2canvas";
  import IconButton, { Icon } from "@smui/icon-button";
  import Checkbox from "@smui/checkbox";
  import CircularProgress from "@smui/circular-progress";
  import FormField from "@smui/form-field";
  import Accordion, { Panel, Header, Content } from "@smui-extra/accordion";
  import type { PaletteStore, SelectedSegmentStore } from "../stores/palettes";
  import {
    miniPaletteLabelView,
    standardPaletteLabelView,
  } from "../stores/palettes";
  import {
    activePalettes,
    colorFilters,
    type Palette,
  } from "../utils/palettes";

  type Kind = "mini" | "standard" | "vault";

  export let palette: PaletteStore;
  export let selectedSegment: SelectedSegmentStore;
  export let price: number;
  export let variant: string;
  export let productHandle: string;
  export let kind: Kind;
  let status: "loading" | "idle" = "idle";
  let filtersOpen = false;
  let selectedFilters: string[] = [];

  interface DimensionConfig {
    width: string;
    height: string;
  }

  const config: Record<Kind, DimensionConfig> = {
    mini: {
      width: "752.8px",
      height: "752.8px",
    },
    standard: {
      width: "1113.6px",
      height: "600.96px",
    },
    vault: {
      width: "1152px",
      height: "648.96px",
    },
  };

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

  function handleReset() {
    palette.reset();
  }

  async function uploadToBucket(id: string) {
    try {
      const [url, filename] = await getSignedUrl();
      const canvas = await draw(id);
      const dataUrl = canvas.toDataURL("image/jpeg");
      const blobData = dataURItoBlob(dataUrl);
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "image/jpeg",
        },
        body: blobData,
      });
      if (res.status === 200) {
        return filename;
      }
    } catch (e) {
      console.error("oop there was an error uploading to bucket: ", e);
    }
  }

  async function draw(id: string) {
    const labels = document.getElementById(id);
    const clone = labels.cloneNode(true);

    if (clone instanceof HTMLElement) {
      const offscreen = document.getElementById("offscreen");
      clone.style.width = config[kind].width;
      clone.style.height = config[kind].height;
      clone.classList.add("clone");
      offscreen.appendChild(clone);
      const segments = [...clone.getElementsByClassName("label-segment")];
      segments.forEach((s, i) => {
        if (s instanceof HTMLElement) {
          s.style.fontSize = kind === "mini" ? "22px" : "18px";
          const currentLabels =
            kind === "mini"
              ? $miniPaletteLabelView
              : kind === "standard"
                ? $standardPaletteLabelView
                : palette;
          const words = currentLabels[i]?.name?.split(" ") || "";
          for (let word of words) {
            if (word.length > 8)
              s.style.fontSize = kind === "mini" ? "18px" : "14px";
          }
        }
      });
      await new Promise((res) => setTimeout(res, 50));
      const canvas = await h2c(clone);
      offscreen.remove();
      return canvas;
    }
  }

  async function getSignedUrl() {
    const res = await fetch("https://app-lqold5wx4a-uw.a.run.app/getUrl");
    const { url, filename } = await res.json();
    return [url, filename];
  }

  function dataURItoBlob(dataURI: string) {
    const binary = atob(dataURI.split(",")[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: "image/jpeg" });
  }

  async function handleAddToCart() {
    status = "loading";
    const properties: Record<string, string> = {
      productUrl: `https://designerdustco.com/products/${productHandle}`,
      weight: "180",
    };
    for (const [i, p] of $palette.entries()) {
      if (p) {
        properties[`Sparkle ${i + 1}`] = p.name;
      }
    }

    try {
      const filename = await uploadToBucket("back-labels");
      if (filename) {
        properties["View - Back: "] =
          `https://storage.googleapis.com/ddc_custom_palette_labels/${filename}`;
      }
    } catch (e) {
      console.error("something went wrong", e);
    }
    let formData = {
      items: [
        {
          id: variant,
          quantity: 1,
          properties,
        },
      ],
    };
    try {
      fetch(window.Shopify.routes.root + "cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          status = "idle";
          return response.json();
        })
        .then(() => {
          window.location.href = "/cart";
        })
        .catch((error) => {
          status = "idle";
          console.error("Error adding to cart:", error);
        });
    } catch {
      status = "idle";
    } finally {
      status = "idle";
    }
  }
</script>

<div class="list-widget">
  <Accordion>
    <Panel variant="outlined" bind:open={filtersOpen}>
      <Header>
        Filter by Color
        <IconButton slot="icon" toggle pressed={filtersOpen}>
          <Icon class="material-symbols-outlined" on>expand_less</Icon>
          <Icon class="material-symbols-outlined">expand_more</Icon>
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
  <div class="palette-list">
    {#each filteredPalettes as palette (palette.name)}
      <Wrapper>
        <button
          class="palette-add-button"
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
  {#if window.Shopify}
    <div class="price">
      {window.Shopify.formatMoney(price, window.Shopify.money_format)}
    </div>
  {/if}
  <div class="buttons">
    <button on:click={handleReset}>Reset</button>
    <button
      on:click={handleAddToCart}
      disabled={status !== "idle"}
      class="cart"
    >
      {#if status === "idle"}
        <span class="material-symbols-outlined">shopping_cart</span>Add to Cart
      {/if}
      {#if status === "loading"}
        <CircularProgress style="height: 32px; width: 32px;" indeterminate />
      {/if}
    </button>
  </div>
</div>
<div class="offscreen" id="offscreen" />

<style>
  .palette-list {
    display: grid;
    grid-template-columns: repeat(4, 116px);
    gap: 16px;
    margin: 32px 0;
  }

  .cart {
    --mdc-theme-primary: white;
    min-width: 137px;
  }

  .price {
    font-size: 24px;
    margin-bottom: 16px;
  }

  .palette {
    width: 100px;
    height: 100px;
    border-radius: 100%;
    max-width: 100px;
    max-height: 100px;
  }

  .buttons {
    display: flex;
    gap: 8px;
  }

  .buttons > button {
    background-color: #636060;
    color: white;
    padding: 12px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .offscreen {
    font-family: "Keep on Truckin";
    text-align: center;
    position: absolute;
    left: 5000px;
    font-size: 24px;
  }

  .sparkle-name {
    margin-top: 8px;
    text-align: left;
  }

  .filters {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  * :global(.input) {
    width: 100%;
  }

  @media screen and (max-width: 1400px) {
    .palette-list {
      grid-template-columns: repeat(3, 116px);
    }
  }

  @media screen and (max-width: 1150px) {
    .palette-list {
      display: flex;
      width: 99vw;
      max-width: 99vw;
      overflow-x: auto;
      padding: 16px 0;
    }

    .buttons {
      justify-content: center;
    }

    * :global(.smui-accordion .smui-accordion__panel) {
      width: 95vw;
    }
  }
</style>
