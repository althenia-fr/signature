<template>
  <div v-if="processing" class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
    <BaseLoader label="Mise à jour de vos préférences..." />
  </div>

  <div class="max-w-6xl mx-auto space-y-8">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-slate-200 pb-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">
          Gestion des Rappels
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Sélectionnez les documents pour lesquels vous souhaitez suspendre les Rappels de signature.
        </p>
      </div>
    </div>

    <div v-if="loading" class="min-h-[400px] flex items-center justify-center bg-white rounded-3xl border border-slate-200 shadow-sm">
      <BaseLoader label="Chargement de vos alertes..." />
    </div>

    <div v-else-if="success" class="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-8 text-center max-w-2xl mx-auto space-y-4">
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-slate-900">Vos préférences ont été enregistrées</h2>
      <p class="text-sm text-slate-600">
        Les alertes pour les documents sélectionnés ont été définitivement coupées. Vous ne recevrez plus de relances par email pour ces derniers.
      </p>
    </div>

    <div v-else class="space-y-6">
      <div class="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">

        <div class="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-slate-900">Documents concernés</h2>
          <span class="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            {{ selectedAlertsCount }} alerte{{ selectedAlertsCount>1?"s":"" }} à stopper
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left">
            <tbody>
            <tr
                v-for="alert in alerts"
                :key="alert.sdid"
                class="border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors"
            >
              <td class="p-6 text-sm font-medium text-slate-900 min-w-[200px] w-1/3">
                <div class="flex items-center gap-3">
                  {{ alert.otherPartyName }}
                </div>
              </td>

              <td class="p-6 text-sm text-slate-600 w-1/2">
                {{ alert.description }}
              </td>

              <td class="p-6 text-sm text-right min-w-[120px] ">
                {{ alert.frequency }}
              </td>

              <td class="p-6 text-sm text-right min-w-[120px]">
                <label class="inline-flex items-center gap-3 cursor-pointer select-none group">
                    <span class="text-xs font-medium transition-colors" :class="alert.alertDisabled ? 'text-red-600 font-semibold' : 'text-slate-400 group-hover:text-slate-600'">
                      Stop alerte
                    </span>
                  <input
                      type="checkbox"
                      v-model="alert.alertDisabled"
                      class="h-5 w-5 rounded-lg border-slate-300 text-red-600 focus:ring-red-500 focus:ring-offset-0 transition-colors cursor-pointer"
                  />
                </label>
              </td>
            </tr>

            <tr v-if="alerts.length === 0">
              <td colspan="3" class="p-12 text-center text-slate-500">
                Aucune alerte de rappel active trouvée pour votre compte.
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p class="text-xs text-slate-500 max-w-md">
            En cliquant sur le bouton, toutes les alertes cochées seront désactivées. Les autres continueront à vous être envoyées.
          </p>

          <button  @click="submitStopAlerts" class="inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 bg-primary text-white hover:bg-slate-700 shadow-sm px-8 py-3.5 text-base" :disabled="!hasSelection || processing">
            {{ hasSelection ? `Stopper ${selectedAlertsCount} alerte${selectedAlertsCount>1?'s':''}` : 'Sélectionnez au moins une alerte' }}
          </button>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import BaseLoader from '@/components/BaseLoader.vue'
import { ref, computed, onMounted } from 'vue'
import {fetchCancelRecords, postCancel} from "@services/cancelService.js";
import { useRoute } from 'vue-router'

const route = useRoute()


const loading = ref(true)
const processing = ref(false)
const success = ref(false)
let email = null;
let sdids = null;

const alerts = ref([])

onMounted(async () => {
  try {

    sdids = route.query.sdids
    email = route.query.email

    alerts.value = await fetchCancelRecords(sdids,email)

    for(let i=0;i< alerts.value.length;i++) alerts.value[i].alertDisabled=true

  } catch (error) {
    console.error("Erreur de chargement", error)
  } finally {
    loading.value = false
  }
})

const hasSelection = computed(() => {
  return alerts.value.some(alert => alert.alertDisabled)
})

// Changement de logique ici : on compte celles qui vont être stoppées (cochées)
const selectedAlertsCount = computed(() => {
  return alerts.value.filter(alert => alert.alertDisabled).length
})

const submitStopAlerts = async () => {
  if (!hasSelection.value) return

  processing.value = true

  try {

    await postCancel(alerts.value,email);
    success.value = true

  } catch (error) {
    console.error("Erreur", error)
  } finally {
    processing.value = false
  }
}
</script>

<style scoped>
input[type="checkbox"]:checked {
  background-color: #dc2626;
  border-color: #dc2626;
}
</style>