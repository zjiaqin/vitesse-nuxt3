<script lang="ts" setup>
import { Header } from '@/components/layouts'
</script>

<template>
  <main class="px-10 py-20 text-center">
    <Header />
    <slot />
    <Footer />
    <div class="mx-auto mt-5 text-center text-sm opacity-25">
      [Default Layout]
    </div>
  </main>
</template>
