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
  const repository = "wallpapers";

  function handleToggle() {
    console.log("Toggle button clicked!");
    toggleMode();
  }
</script>

<ModeWatcher track={true} defaultMode="system" />
<Toaster />
<div class="bg-background relative flex min-h-[100vh] flex-col gap-5">
  <p class="text-muted-foreground absolute right-2 top-2 z-40 m-2">{version}</p>
  <Button onclick={handleToggle} variant="ghost" size="icon" class="absolute left-2 top-2 z-50 m-2">
    <Sun
      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    <Moon
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    <span class="sr-only">Toggle theme</span>
  </Button>

  <header
    class="from-ctp-lavender/15 via-ctp-mauve/10 to-ctp-pink/5 relative flex h-96 w-full flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-br">
    <!-- Background decoration with softer Catppuccin colors -->
    <div class="bg-grid-pattern opacity-3 absolute inset-0"></div>
    <div
      class="bg-ctp-mauve/20 absolute left-10 top-10 h-32 w-32 animate-pulse rounded-full blur-3xl">
    </div>
    <div
      class="bg-ctp-pink/15 absolute bottom-10 right-10 h-24 w-24 animate-pulse rounded-full blur-2xl">
    </div>
    <div
      class="bg-ctp-peach/10 absolute left-1/2 top-1/3 h-20 w-20 animate-pulse rounded-full blur-xl">
    </div>

    <div class="relative z-10 space-y-6 text-center">
      <div class="space-y-4">
        <h1
          class="from-ctp-mauve via-ctp-blue to-ctp-teal m-0 bg-gradient-to-r bg-clip-text font-bold text-transparent">
          Wallpapers Collection
        </h1>
        <p class="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
          Discover beautiful, high-quality wallpapers from the cozy open-source collection by
          <a
            href={`https://github.com/${owner}`}
            class="text-ctp-mauve hover:text-ctp-pink decoration-ctp-pink/50 font-medium transition-colors duration-300 hover:underline"
            >@{owner}</a>
        </p>
      </div>

      <div class="text-muted-foreground/90 flex items-center justify-center gap-6 text-sm">
        <div
          class="bg-ctp-green/10 border-ctp-green/20 flex items-center gap-2 rounded-full border px-3 py-1.5">
          <div class="bg-ctp-green h-2 w-2 animate-pulse rounded-full"></div>
          <span class="text-ctp-green font-medium">Free & Open Source</span>
        </div>
        <div
          class="bg-ctp-sky/10 border-ctp-sky/20 flex items-center gap-2 rounded-full border px-3 py-1.5">
          <div class="bg-ctp-sky h-2 w-2 rounded-full"></div>
          <span class="text-ctp-sky font-medium">High Resolution</span>
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
