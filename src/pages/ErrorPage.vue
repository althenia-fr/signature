<template>
  <div class="max-w-4xl mx-auto text-center py-20 px-4">
    <div class="mb-8">
      <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 mb-6">
        <font-awesome-icon :icon="errorIcon" class="text-5xl" :class="iconColorClass" />
      </div>
      <h1 class="text-4xl font-extrabold text-slate-900 mb-4">
        {{ errorTitle }}
      </h1>
      <p class="text-lg text-slate-600 mb-10 max-w-xl mx-auto">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const type = computed(() => route.query.type || route.params.type || '404')

const errorDetails = {
  '404': {
    title: 'Page introuvable',
    message: "Oops ! La page que vous recherchez semble avoir déménagé ou n'existe pas. Veuillez vérifier l'URL ou retourner à l'accueil.",
    icon: 'search',
    color: 'text-slate-400'
  },
  'invalid-token': {
    title: 'Lien de signature invalide',
    message: "Le format du lien de signature n'est pas correct. Veuillez utiliser le lien exact qui vous a été envoyé par SMS ou par email.",
    icon: 'link-slash',
    color: 'text-amber-500'
  },
  'expired': {
    title: 'Lien expiré ou introuvable',
    message: "Ce document n'est plus disponible ou le lien a expiré. Si vous n'avez pas encore signé, veuillez demander un nouveau lien à votre organisation.",
    icon: 'exclamation-triangle',
    color: 'text-red-500'
  }
}

const currentError = computed(() => errorDetails[type.value] || errorDetails['404'])

const errorTitle = computed(() => currentError.value.title)
const errorMessage = computed(() => currentError.value.message)
const errorIcon = computed(() => currentError.value.icon)
const iconColorClass = computed(() => currentError.value.color)
</script>
