<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <header class="bg-white border-b border-slate-200 py-4 px-6 shadow-sm">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <h1 class="text-xl font-bold text-primary flex items-center gap-2">
          <font-awesome-icon icon="file-signature" />
          Signature Althenia
        </h1>
      </div>
    </header>

    <main class="flex-grow container mx-auto py-8 px-4">
      <slot />
    </main>

    <footer class="bg-white border-t border-slate-200 py-6 px-6 mt-12">
      <div class="max-w-7xl mx-auto text-center text-sm text-slate-500">
        &copy; {{ new Date().getFullYear() }} Plateforme de signature Althenia. Tous droits réservés.
      </div>
    </footer>
  </div>
</template>

<script setup>
// Layout for the application
</script>
