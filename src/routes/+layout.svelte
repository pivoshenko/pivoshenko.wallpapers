<script lang="ts">
  import "../app.css";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Moon, Sun } from "@lucide/svelte";
  import { toggleMode } from "mode-watcher";
  import { ModeWatcher } from "mode-watcher";
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  let { children } = $props();

  const version = "v1.0.0";
  const owner = "pivoshenko";

  function handleToggle() {
    console.log("Toggle button clicked!");
    toggleMode();
  }
</script>

<ModeWatcher track={true} defaultMode="system" />
<Toaster />
<div class="relative flex min-h-[100vh] flex-col gap-5 bg-background">
  <p class="absolute right-2 top-2 z-40 m-2 text-muted-foreground">{version}</p>
  <Button onclick={handleToggle} variant="ghost" size="icon" class="absolute left-2 top-2 z-50 m-2">
    <Sun
      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    />
    <Moon
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    />
    <span class="sr-only">Toggle theme</span>
  </Button>

  <header
    class="relative flex h-96 w-full flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-br from-ctp-lavender/15 via-ctp-mauve/10 to-ctp-pink/5"
  >
    <!-- Background decoration with softer Catppuccin colors -->
    <div class="bg-grid-pattern opacity-3 absolute inset-0"></div>
    <div
      class="absolute left-10 top-10 h-32 w-32 animate-pulse rounded-full bg-ctp-mauve/20 blur-3xl"
    ></div>
    <div
      class="absolute bottom-10 right-10 h-24 w-24 animate-pulse rounded-full bg-ctp-pink/15 blur-2xl"
    ></div>
    <div
      class="absolute left-1/2 top-1/3 h-20 w-20 animate-pulse rounded-full bg-ctp-peach/10 blur-xl"
    ></div>

    <div class="relative z-10 space-y-6 text-center">
      <div class="space-y-4">
        <h1
          class="m-0 bg-gradient-to-r from-ctp-mauve via-ctp-blue to-ctp-teal bg-clip-text font-bold text-transparent"
        >
          Wallpapers Collection
        </h1>
        <p class="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Discover beautiful, high-quality wallpapers from the cozy open-source collection by
          <a
            href={`https://github.com/${owner}`}
            class="font-medium text-ctp-mauve decoration-ctp-pink/50 transition-colors duration-300 hover:text-ctp-pink hover:underline"
            >@{owner}</a
          >
        </p>
      </div>

      <div class="flex items-center justify-center gap-6 text-sm text-muted-foreground/90">
        <div
          class="flex items-center gap-2 rounded-full border border-ctp-green/20 bg-ctp-green/10 px-3 py-1.5"
        >
          <div class="h-2 w-2 animate-pulse rounded-full bg-ctp-green"></div>
          <span class="font-medium text-ctp-green">Free & Open Source</span>
        </div>
        <div
          class="flex items-center gap-2 rounded-full border border-ctp-sky/20 bg-ctp-sky/10 px-3 py-1.5"
        >
          <div class="h-2 w-2 rounded-full bg-ctp-sky"></div>
          <span class="font-medium text-ctp-sky">High Resolution</span>
        </div>
      </div>
    </div>
  </header>

  <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
    {@render children()}
  </main>

  <div class="mt-32"></div>
  <div class="absolute bottom-0 flex h-32 w-full flex-col items-center justify-center gap-4">
    <img src="/favicon.svg" alt="logo" class="w-5 rounded-md" />
    <a href={`https://github.com/${owner}`} class="text-muted-foreground">@pivoshenko</a>
  </div>
</div>
