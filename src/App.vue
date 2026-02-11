<script setup lang="ts">
import PageNavigation from '@/components/PageNavigation.vue'
import FloatingActions from '@/components/FloatingActions.vue'
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-3 py-4 md:px-4 md:py-8">
      <PageNavigation />
      <RouterView />
    </div>
    <FloatingActions />
  </div>
</template>
