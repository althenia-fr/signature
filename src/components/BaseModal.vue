<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="$emit('close')" />

        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 class="text-lg font-bold text-slate-900">
              {{ title }}
            </h3>
            <button class="text-slate-400 hover:text-slate-600 transition-colors" @click="$emit('close')">
              <font-awesome-icon icon="times" class="text-xl" />
            </button>
          </div>

          <div class="px-6 py-6 max-h-[70vh] overflow-y-auto">
            <slot />
          </div>

          <div v-if="$slots.footer" class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})

defineEmits(['close'])
</script>
