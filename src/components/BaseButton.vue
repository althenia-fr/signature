<template>
  <button :class="[
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
    variants[variant],
    sizes[size],
    block ? 'w-full' : ''
]" :disabled="disabled || loading">
    <svg v-if="loading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>

    <!-- Icon -->
    <font-awesome-icon v-if="icon && !loading" :icon="icon" />

    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'md'
  },
  block: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  icon: {
    type: [String, Array],
    default: null
  }
})

const variants = {
  primary: 'bg-primary text-white hover:bg-blue-700 shadow-sm shadow-blue-200',
  secondary: 'bg-secondary text-white hover:bg-slate-700 shadow-sm shadow-slate-200',
  outline: 'bg-transparent border-2 border-slate-200 text-slate-700 hover:bg-slate-50',
  success: 'bg-success text-white hover:bg-green-700 shadow-sm shadow-green-200',
  error: 'bg-error text-white hover:bg-red-700 shadow-sm shadow-red-200',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
  xl: 'px-10 py-4 text-lg'
}
</script>
