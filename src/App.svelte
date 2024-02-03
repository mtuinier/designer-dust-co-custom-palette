<script lang="ts">
  import { onMount } from "svelte";

  import PaletteContainer from "./lib/components/PaletteContainer.svelte";
  import PaletteList from "./lib/components/PaletteList.svelte";
  import {
    miniPalette,
    miniSelectedSegment,
    standardPalette,
    standardSelectedSegment,
    vaultPalette,
    vaultSelectedSegment,
  } from "./lib/stores/palettes";

  let price = 0; // in cents
  let productHandle = "";
  let productId = "";
  let variant = "";

  onMount(async () => {
    const dataset = document.getElementById("app").dataset;
    productId = dataset.productId ?? "";
    variant = dataset.variant ?? "";
    productHandle = dataset.productHandle ?? "custom-mini-palette";
    price = Number(dataset.price) ?? 0;
  });
</script>

<div class="inner">
  <div class="widget">
    {#if productHandle === "custom-mini-palette"}
      <PaletteContainer
        palette={miniPalette}
        kind="mini"
        selectedSegment={miniSelectedSegment}
      />
      <PaletteList
        palette={miniPalette}
        kind="mini"
        selectedSegment={miniSelectedSegment}
        {price}
        {productHandle}
        {variant}
      />
    {/if}
    {#if productHandle === "custom-24-face-sprinkles-palette"}
      <PaletteContainer
        palette={standardPalette}
        kind="standard"
        selectedSegment={standardSelectedSegment}
      />
      <PaletteList
        palette={standardPalette}
        kind="standard"
        selectedSegment={standardSelectedSegment}
        {price}
        {productHandle}
        {variant}
      />
    {/if}
    {#if productHandle === "custom-vault"}
      <PaletteContainer
        palette={vaultPalette}
        kind="vault"
        selectedSegment={vaultSelectedSegment}
      />
      <PaletteList
        palette={vaultPalette}
        kind="vault"
        selectedSegment={vaultSelectedSegment}
        {price}
        {productHandle}
        {variant}
      />
    {/if}
  </div>
</div>

<style>
  .inner {
    min-height: 100%;
  }
  .widget {
    margin-bottom: 80px;
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    gap: 80px;
    padding: 24px;
  }

  @media screen and (max-width: 1400px) {
    .widget {
      gap: 40px;
    }
  }

  @media screen and (max-width: 1150px) {
    .widget {
      flex-direction: column;
      align-items: center;
    }
  }
</style>
