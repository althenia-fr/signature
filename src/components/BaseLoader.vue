<template>
  <div class="flex flex-col items-center justify-center gap-3 py-6">
    <div class="relative w-12 h-12">
      <!-- Outer ring -->
      <div class="absolute border-4 border-slate-100 rounded-full w-full h-full" />
      <!-- Progress ring -->
      <div class="absolute border-4 border-primary rounded-full w-full h-full border-t-transparent animate-spin" />
    </div>
    <p v-if="label" class="text-sm font-medium text-slate-500 animate-pulse">
      {{ label }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  }
})
</script>
