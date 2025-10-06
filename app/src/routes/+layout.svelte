<script lang="ts">
  import "../app.css";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { ChevronRight, Moon, Sun } from "@lucide/svelte";
  import { toggleMode } from "mode-watcher";
  import { ModeWatcher } from "mode-watcher";
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  let { children } = $props();

  const version = "v1.0.0";
  const owner = "pivoshenko";
  const repository = "wallpapers";
</script>

<ModeWatcher />
<Toaster />
<div class="bg-background relative flex min-h-[100vh] flex-col gap-5">
  <p class="text-muted-foreground absolute right-2 top-2 m-2">{version}</p>
  <Button onclick={toggleMode} variant="ghost" size="icon" class="absolute left-2 right-2 m-2">
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
      <Badge
        class="bg-background/90 hover:bg-background/95 border-ctp-mauve/20 hover:border-ctp-mauve/40 gap-2 border shadow-lg backdrop-blur-sm transition-all duration-500 hover:shadow-xl"
        href={"https://github.com/" + owner + "/" + repository}
        target="_blank">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="text-ctp-mauve">
          <path
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        GitHub Repository <ChevronRight size={16} />
      </Badge>

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
  <div
    class="bg-primary/20 absolute bottom-0 flex h-32 w-full flex-col items-center justify-center gap-4">
    <img src="/favicon.svg" alt="logo" class="w-5 rounded-md" />
    <a href={`https://github.com/${owner}`} class="text-muted-foreground">@pivoshenko</a>
  </div>
</div>
