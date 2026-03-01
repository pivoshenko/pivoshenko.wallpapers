<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {#each Array(12) as _}
    <div class="relative overflow-hidden rounded-xl bg-card shadow-md">
      <!-- Image skeleton -->
      <div class="relative aspect-[16/9] animate-pulse overflow-hidden bg-muted/50">
        <div
          class="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-muted/30 to-transparent"
        ></div>
      </div>

      <!-- Content skeleton -->
      <div class="space-y-3 p-4">
        <div class="flex items-center justify-between">
          <!-- Title skeleton -->
          <div class="relative h-5 w-32 animate-pulse overflow-hidden rounded bg-muted/50">
            <div
              class="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-muted/30 to-transparent"
            ></div>
          </div>
          <!-- Info button skeleton -->
          <div class="relative h-8 w-8 animate-pulse overflow-hidden rounded bg-muted/50">
            <div
              class="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-muted/30 to-transparent"
            ></div>
          </div>
        </div>

        <!-- Tags skeleton -->
        <div class="flex gap-1">
          <div class="relative h-5 w-16 animate-pulse overflow-hidden rounded-full bg-muted/50">
            <div
              class="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-muted/30 to-transparent"
            ></div>
          </div>
          <div class="relative h-5 w-12 animate-pulse overflow-hidden rounded-full bg-muted/50">
            <div
              class="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-muted/30 to-transparent"
            ></div>
          </div>
        </div>

        <!-- Stats skeleton -->
        <div class="flex justify-between">
          <div class="relative h-4 w-20 animate-pulse overflow-hidden rounded bg-muted/50">
            <div
              class="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-muted/30 to-transparent"
            ></div>
          </div>
          <div class="relative h-4 w-16 animate-pulse overflow-hidden rounded bg-muted/50">
            <div
              class="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-muted/30 to-transparent"
            ></div>
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
</style>
