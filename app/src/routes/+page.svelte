<script lang="ts">
  import { onMount } from "svelte";
  import Loading from "./loading.svelte";
  import Filters from "./filters.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { AspectRatio } from "$lib/components/ui/aspect-ratio";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Copy, Download, Info } from "@lucide/svelte";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { toast } from "svelte-sonner";
  import Badge from "$lib/components/ui/badge/badge.svelte";

  type Wallpaper = {
    name: string;
    filename: string;
    tags: string[];
    size: string;
    width: number;
    height: number;
    hovered: boolean;
  };

  let wallpapers: Wallpaper[] = $state([]);
  let tags: string[] = $state([]);
  let selectedTags: string[] = $state([]);
  let search: string = $state("");

  const owner = "pivoshenko";
  const repository = "wallpapers";
  const path = "app/static/wallpapers";

  function parseFilename(filename: string) {
    let [namePart, ...tagsArray] = filename.split(".")[0].split("_");
    let tagsPart = tagsArray.join("_");
    let name = namePart.replace(/-/g, " ").replace(/\b\w/, (l: string) => l.toUpperCase());
    let fileTags = tagsPart ? tagsPart.split("_") : [];

    fileTags.forEach((tag: string) => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });

    return {
      name,
      filename,
      tags: fileTags,
    };
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard!"))
      .catch(() => toast.error("Failed to copy"));
  };

  async function fetchWallpapers() {
    const res = await fetch("/files.json");
    const fileData: {
      filename: string;
      path: string;
      size: string;
      width: number;
      height: number;
    }[] = await res.json();
    wallpapers = fileData.map((file) => {
      let { name, filename, tags: fileTags } = parseFilename(file.filename);

      return {
        name,
        filename,
        path,
        tags: fileTags,
        size: file.size,
        width: file.width,
        height: file.height,
        hovered: false,
      };
    });
  }

  onMount(fetchWallpapers);
</script>

<div
  class="bg-background/90 border-ctp-mauve/20 sticky top-0 z-20 mb-6 border-b px-4 py-4 shadow-sm backdrop-blur-md sm:px-6">
  <div class="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex flex-1 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
      <div class="relative max-w-md flex-1">
        <Input
          class="bg-ctp-mauve/5 border-ctp-mauve/20 focus:bg-background focus:border-ctp-mauve/40 h-12 rounded-xl pl-12 pr-4 shadow-sm transition-all duration-300"
          placeholder="Search wallpapers..."
          bind:value={search} />
        <div class="text-ctp-mauve/70 absolute left-4 top-1/2 -translate-y-1/2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        {#if search}
          <button
            class="text-ctp-mauve/60 hover:text-ctp-red absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300 hover:scale-110"
            onclick={() => (search = "")}
            aria-label="Clear search">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        {/if}
      </div>
      <Filters title="Filter by tags" options={tags} bind:selectedValues={selectedTags} />
    </div>

    <div
      class="text-muted-foreground flex items-center justify-between gap-3 text-sm sm:justify-end">
      {#if search || selectedTags.length > 0}
        <span class="text-ctp-sapphire text-xs font-medium sm:text-sm">
          {wallpapers.filter(
            (w) =>
              (selectedTags.length === 0 || selectedTags.some((tag) => w.tags.includes(tag))) &&
              w.name.toLowerCase().includes(search.toLowerCase()),
          ).length} of {wallpapers.length} wallpapers
        </span>
      {:else}
        <span class="text-ctp-teal text-xs font-medium sm:text-sm"
          >{wallpapers.length} wallpapers total</span>
      {/if}

      {#if search || selectedTags.length > 0}
        <Button
          variant="ghost"
          size="sm"
          class="text-ctp-red hover:text-ctp-red hover:bg-ctp-red/5 h-9 px-3 text-xs font-medium transition-all duration-300"
          onclick={() => {
            search = "";
            selectedTags = [];
          }}>
          Clear all
        </Button>
      {/if}
    </div>
  </div>
</div>
{#if wallpapers.length === 0}
  <Loading />
{:else}
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {#each wallpapers as wallpaper}
      {#if selectedTags.length === 0 || selectedTags.some((tag) => wallpaper.tags.includes(tag))}
        {#if wallpaper.name.toLowerCase().includes(search.toLowerCase())}
          <div
            class="bg-card/80 hover:shadow-ctp-mauve/10 border-border/50 hover:border-ctp-mauve/30 group relative overflow-hidden rounded-2xl border shadow-lg backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
            <div class="relative overflow-hidden">
              <AspectRatio
                ratio={16 / 9}
                class="bg-muted/30 w-full"
                onmouseenter={() => (wallpaper.hovered = true)}
                onmouseleave={() => (wallpaper.hovered = false)}>
                <!-- Wallpaper Image -->
                <img
                  src={`/wallpapers/${wallpaper.filename}`}
                  alt={wallpaper.name + " wallpaper"}
                  class="h-full w-full object-cover transition-all duration-700 group-hover:scale-110" />

                <!-- Overlay with actions -->
                <div
                  class="from-ctp-mauve/80 via-ctp-blue/20 absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div class="text-white">
                      <p class="text-sm font-medium">{wallpaper.width}×{wallpaper.height}</p>
                      <p class="text-xs opacity-90">{wallpaper.size} MB</p>
                    </div>
                    <Button
                      size="sm"
                      class="border-white/30 bg-white/20 text-white shadow-lg backdrop-blur-sm hover:border-white/50 hover:bg-white/30"
                      href={`https://raw.githubusercontent.com/${owner}/${repository}/main/${path}/${wallpaper.filename}`}
                      target="_blank">
                      <Download size={16} />
                      Download
                    </Button>
                  </div>
                </div>

                <!-- Download overlay (legacy hover behavior) -->
                {#if wallpaper.hovered}
                  <div
                    class="bg-ctp-mauve/30 absolute inset-0 z-[5] flex items-center justify-center backdrop-blur-sm lg:hidden">
                    <Button
                      href={`https://raw.githubusercontent.com/${owner}/${repository}/main/${path}/${wallpaper.filename}`}
                      target="_blank"
                      class="text-ctp-mauve bg-white/95 shadow-lg hover:bg-white">
                      <Download size={16} />
                      Download
                    </Button>
                  </div>
                {/if}
              </AspectRatio>
            </div>

            <!-- Card content -->
            <div class="p-5">
              <div class="mb-4 flex items-center justify-between">
                <h3
                  class="text-card-foreground group-hover:text-ctp-mauve font-semibold transition-colors duration-300">
                  {wallpaper.name}
                </h3>
                <Drawer.Root>
                  <Drawer.Trigger>
                    <Button
                      size="icon"
                      variant="ghost"
                      class="hover:bg-ctp-mauve/10 hover:text-ctp-mauve h-9 w-9 opacity-60 transition-all duration-300 hover:opacity-100">
                      <Info size={16} />
                    </Button>
                  </Drawer.Trigger>
                  <Drawer.Content>
                    <div class="m-auto w-full max-w-3xl select-text">
                      <Drawer.Header>
                        <Drawer.Title>{wallpaper.name}</Drawer.Title>
                      </Drawer.Header>
                      <div class="space-y-4 p-4 pb-0">
                        <div class="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span class="text-muted-foreground">Filename:</span>
                            <p class="bg-muted/50 mt-1 rounded px-2 py-1 font-mono text-xs">
                              {wallpaper.filename}
                            </p>
                          </div>
                          <div>
                            <span class="text-muted-foreground">Size:</span>
                            <p class="font-semibold">{wallpaper.size} MB</p>
                          </div>
                          <div>
                            <span class="text-muted-foreground">Resolution:</span>
                            <p class="font-semibold">{wallpaper.width}×{wallpaper.height}</p>
                          </div>
                          <div>
                            <span class="text-muted-foreground">Aspect Ratio:</span>
                            <p class="font-semibold">
                              {(wallpaper.width / wallpaper.height).toFixed(2)}:1
                            </p>
                          </div>
                        </div>

                        <div>
                          <span class="text-muted-foreground">Tags:</span>
                          <div class="mt-2 flex flex-wrap gap-2">
                            {#if wallpaper.tags.length > 0}
                              {#each wallpaper.tags as tag}
                                <Badge variant="secondary" class="text-xs">{tag}</Badge>
                              {/each}
                            {:else}
                              <span class="text-muted-foreground text-sm italic">No tags</span>
                            {/if}
                          </div>
                        </div>

                        <div>
                          <div class="mb-2 flex items-center justify-between">
                            <span class="text-muted-foreground">Nix fetchurl:</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onclick={() => {
                                let content = `image = pkgs.fetchurl {
  url = "https://raw.githubusercontent.com/${owner}/${repository}/refs/heads/main/${path}/${wallpaper.filename}";
  sha256 = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
};`;
                                copyToClipboard(content);
                              }}>
                              <Copy size={14} />
                              Copy
                            </Button>
                          </div>
                          <pre
                            class="bg-muted/50 overflow-x-auto rounded-lg p-3 text-xs">image = pkgs.fetchurl &#123;
  url = "https://raw.githubusercontent.com/{owner}/{repository}/refs/heads/main/{path}/{wallpaper.filename}";
  sha256 = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
&#125;;</pre>
                        </div>
                      </div>
                      <Drawer.Footer>
                        <div class="flex gap-2">
                          <Button
                            class="flex-1"
                            href={`https://raw.githubusercontent.com/${owner}/${repository}/main/${path}/${wallpaper.filename}`}
                            target="_blank">
                            <Download size={16} />
                            Download Original
                          </Button>
                          <Drawer.Close>
                            <Button variant="outline" class="w-full">Close</Button>
                          </Drawer.Close>
                        </div>
                      </Drawer.Footer>
                    </div>
                  </Drawer.Content>
                </Drawer.Root>
              </div>

              <!-- Tags preview -->
              {#if wallpaper.tags.length > 0}
                <div class="mb-3 flex flex-wrap gap-2">
                  {#each wallpaper.tags.slice(0, 3) as tag, index}
                    <Badge
                      variant="outline"
                      class="border px-3 py-1 text-xs font-medium transition-all duration-300 hover:scale-105
                              {index % 4 === 0
                        ? 'border-ctp-mauve/40 text-ctp-mauve bg-ctp-mauve/5 hover:bg-ctp-mauve/10'
                        : index % 4 === 1
                          ? 'border-ctp-pink/40 text-ctp-pink bg-ctp-pink/5 hover:bg-ctp-pink/10'
                          : index % 4 === 2
                            ? 'border-ctp-peach/40 text-ctp-peach bg-ctp-peach/5 hover:bg-ctp-peach/10'
                            : 'border-ctp-teal/40 text-ctp-teal bg-ctp-teal/5 hover:bg-ctp-teal/10'}">
                      {tag}
                    </Badge>
                  {/each}
                  {#if wallpaper.tags.length > 3}
                    <Badge
                      variant="outline"
                      class="border-ctp-lavender/40 text-ctp-lavender bg-ctp-lavender/5 hover:bg-ctp-lavender/10 px-3 py-1 text-xs font-medium"
                      >+{wallpaper.tags.length - 3}</Badge>
                  {/if}
                </div>
              {/if}

              <!-- Quick stats -->
              <div
                class="text-muted-foreground flex items-center justify-between text-xs font-medium">
                <span class="text-ctp-sapphire">{wallpaper.width}×{wallpaper.height}</span>
                <span class="text-ctp-green">{wallpaper.size} MB</span>
              </div>
            </div>
          </div>
        {/if}
      {/if}
    {/each}
  </div>
{/if}
