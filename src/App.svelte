<script lang="ts">
  import Tab, { Label } from "@smui/tab";
  import TabBar from "@smui/tab-bar";

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

  let active = "Mini Palette";
</script>

<div class="inner">
  <TabBar
    tabs={["Mini Palette", "Standard Palette", "Vault"]}
    let:tab
    bind:active
  >
    <Tab {tab}>
      <Label>{tab}</Label>
    </Tab>
  </TabBar>

  <div class="widget">
    {#if active === "Mini Palette"}
      <PaletteContainer
        palette={miniPalette}
        kind="mini"
        selectedSegment={miniSelectedSegment}
      />
      <PaletteList
        palette={miniPalette}
        selectedSegment={miniSelectedSegment}
      />
    {/if}
    {#if active === "Standard Palette"}
      <PaletteContainer
        palette={standardPalette}
        kind="standard"
        selectedSegment={standardSelectedSegment}
      />
      <PaletteList
        palette={standardPalette}
        selectedSegment={standardSelectedSegment}
      />
    {/if}
    {#if active === "Vault"}
      <PaletteContainer
        palette={vaultPalette}
        kind="vault"
        selectedSegment={vaultSelectedSegment}
      />
      <PaletteList
        palette={vaultPalette}
        selectedSegment={vaultSelectedSegment}
      />
    {/if}
  </div>
</div>

<style>
  .inner {
    min-height: 100%;
  }
  .widget {
    margin-top: 80px;
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 80px;
  }
</style>
