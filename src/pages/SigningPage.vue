<template>
  <!-- Full-screen loader overlay for submission -->
  <div v-if="signing" class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
    <BaseLoader label="traitement en cours..." />
  </div>

  <div class="max-w-6xl mx-auto space-y-8">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-slate-200 pb-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">
          Signer le document
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Jeton d'accès : <span class="font-medium text-slate-700">{{ token || 'Aucun jeton' }}</span>
        </p>
      </div>

    </div>

    <div v-if="false" class="hidden"></div>

    <div v-else class="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
      <section class="space-y-6">
        <div class="rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div class="p-6 border-b border-slate-200 flex items-center justify-between gap-4">
            <div>
              <h2 class="text-xl font-semibold text-slate-900">Aperçu du document (page {{pageNumber+1}} / {{record.previewJpgUrl.length}})</h2>
              <p class="text-sm text-slate-500 mt-1" v-if="record.previewJpgUrl && record.previewJpgUrl.length>1">Cliquez sur le document pour feuilleter ses pages</p>
            </div>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {{ statusLabel }}
            </span>
          </div>

          <div class="min-h-[520px] bg-slate-100 flex items-center justify-center p-4">
            <template v-if="loading">
              <BaseLoader label="Chargement de l'aperçu..." />
            </template>

            <template v-else-if="errorMessage">
              <div class="text-center text-slate-600 max-w-xl">
                <p class="text-lg font-semibold text-red-600">Impossible de charger le document</p>
                <p class="mt-2">{{ errorMessage }}</p>
              </div>
            </template>

            <!--template v-else-if="record.previewJpgUrl && record.previewJpgUrl.length>0">
              <img :src="record.previewJpgUrl[pageNumber]" @click.stop="flickPage" alt="Aperçu du document"
                class="w-full h-full object-contain rounded-3xl" />
            </template-->

            <template v-else-if="record.previewJpgUrl && record.previewJpgUrl.length > 0">
              <div class="relative w-full h-full flex items-center justify-center">
                <!-- Bouton Précédent -->
                <button
                    v-if="record.previewJpgUrl.length > 1"
                    @click.stop="prevPage"
                    class="absolute left-0 -translate-x-1/2 z-10 bg-white shadow-lg rounded-full p-2 border border-slate-200 hover:bg-slate-50 transition-colors"
                    title="Page précédente"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <img
                    :src="record.previewJpgUrl[pageNumber]"
                    @click.stop="flickPage"
                    alt="Aperçu du document"
                    class="w-full h-full object-contain rounded-3xl shadow-sm"
                />

                <!-- Bouton Suivant -->
                <button
                    v-if="record.previewJpgUrl.length > 1"
                    @click.stop="flickPage"
                    class="absolute right-0 translate-x-1/2 z-10 bg-white shadow-lg rounded-full p-2 border border-slate-200 hover:bg-slate-50 transition-colors"
                    title="Page suivante"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </template>

            <template v-else>
              <div class="text-center text-slate-500">
                <p class="font-medium">L'image d'aperçu n'est pas disponible.</p>
                <p class="mt-2 text-sm">Veuillez télécharger le PDF pour voir le document complet.</p>
              </div>
            </template>


          </div>
        </div>
      </section>

      <aside class="space-y-6">
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-lg font-semibold text-slate-900">Statut de signature</h3>
          <div class="mt-4 space-y-4 text-sm text-slate-700">
            <div class="rounded-2xl bg-slate-50 p-4">
              <p class="font-medium">Signataire 1</p>
              <p class="mt-1 text-slate-500">{{ party1Status }}</p>
            </div>
            <div class="rounded-2xl bg-slate-50 p-4" v-if="hasParty2">
              <p class="font-medium">Signataire 2</p>
              <p class="mt-1 text-slate-500">{{ party2Status }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
          <div>
            <h3 class="text-lg font-semibold text-slate-900">Votre action</h3>
            <p class="mt-2 text-sm text-slate-500">
              {{ partyActionText }}
            </p>
          </div>

          <BaseButton size="lg" icon="signature" :disabled="hasSigned || loading || !!errorMessage || (record.canSign === false)"
            @click="openSignatureModal">
            {{ hasSigned ? 'Déjà signé' : 'Signer le document' }}
          </BaseButton>

          <div class="rounded-3xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
            <p class="font-semibold">Étape suivante</p>
            <p class="mt-2" v-if="hasParty2">Après signature des 2 parties, vous recevrez le document par email.</p>
            <p class="mt-2" v-else>Après votre signature, vous recevrez le document final par email.</p>
          </div>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
          <div>
            <h3 class="text-lg font-semibold text-slate-900">Télécharger le PDF</h3>
            <p class="mt-2 text-sm text-slate-500">
              Cliquez sur le bouton pour obtenir le fichier original.
            </p>
          </div>

          <BaseButton size="lg" variant="secondary" icon="download"  @click="downloadPdf" :disabled="!record.downloadUrl || loading || invalidLink">
            Télécharger le PDF
          </BaseButton>

        </div>



      </aside>
    </div>


    <BaseModal :show="signatureModalOpen" title="Capturer votre signature" @close="signatureModalOpen = false">
      <div class="space-y-4">
        <p class="text-sm text-slate-500">Tracez votre signature ci-dessous pour signer le document</p>
        <div class="rounded-3xl border border-slate-200 bg-white p-4">
          <canvas ref="signatureCanvas" class="w-full h-72 rounded-3xl bg-slate-50"></canvas>
        </div>
      </div>
      <template #footer>
        <p v-if="signatureError" class="text-sm text-red-600">{{ signatureError }}</p>
        <BaseButton variant="outline" @click="clearSignature">Effacer</BaseButton>
        <BaseButton @click="submitSignatureAction" :disabled="signing">
          {{ signing ? 'en cours...' : 'Signer le document' }}
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SignaturePad from 'signature_pad'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import BaseLoader from '@/components/BaseLoader.vue'
import { fetchSigningRecord, submitSignature } from '@/services/signatureService'

const route = useRoute()
const router = useRouter()
const token = route.params.token || ''
const pageNumber = ref(0)

const record = reactive({
  sdid: null,
  downloadUrl: '',
  previewJpgUrl: '',
  metadata: '',
  webhookUrl: '',
  canSign: null,
  signed: false,
  completed: false,
  currentPartyToken: '',
  currentPartyName: '',
  party1Token: '',
  party1Name: '',
  party1Msisdn: null,
  party1SignJpgUrl: '',
  party1Signed: false,
  party2Token: '',
  party2Name: '',
  party2Msisdn: null,
  party2SignJpgUrl: '',
  party2Signed: false
})

const loading = ref(true)
const signing = ref(false)
const errorMessage = ref('')
const detailModalOpen = ref(false)
const signatureModalOpen = ref(false)
const signatureCanvas = ref(null)
const signaturePad = ref(null)
const signatureError = ref('')

const currentParty = computed(() => {
  if (token.startsWith('p1-')) return 1
  if (token.startsWith('p2-')) return 2
  return null
})

const hasParty2 = computed(() => !!record.party2Name)
const hasSigned = computed(() => {
  if (currentParty.value === 1) return !!record.party1Signed
  if (currentParty.value === 2) return !!record.party2Signed
  return false
})

const party1Status = computed(() => {
  if (!record.party1Name) return 'Statut de la partie 1 indisponible'
  return record.party1Signed
    ? `${record.party1Name} a signé`
    : `${record.party1Name} n'a pas signé`
})

const party2Status = computed(() => {
  if (!record.party2Name) return 'Aucune deuxième partie requise'
  return record.party2Signed
    ? `${record.party2Name} a signé`
    : `${record.party2Name} n'a pas signé`
})

const statusLabel = computed(() => {
  if (!record.sdid) return 'En attente'
  if (record.party1Signed && (!record.party2Name || record.party2Signed)) return 'Terminé'
  return 'En attente de signatures'
})

const partyActionText = computed(() => {
  if (!record.sdid) return 'En attente du chargement des détails du document.'
  if (hasSigned.value) return 'Votre signature est déjà enregistrée pour ce document.'
  return 'Cliquez pour saisir votre signature.'
})

const loadRecord = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const data = await fetchSigningRecord(token)
    Object.assign(record, data)
  } catch (error) {
    if (error.message.includes('introuvable') || error.message.includes('invalide')) {
      router.replace({ name: 'error', query: { type: 'expired' } })
    } else {
      errorMessage.value = error.message || 'Impossible de charger les données du document.'
    }
  } finally {
    loading.value = false
  }
}

const downloadPdf = () => {
  if (!record.downloadUrl) return
  window.open(record.downloadUrl, '_blank')
}

const openSignatureModal = async () => {
  if (hasSigned.value || !currentParty.value) return
  signatureError.value = ''
  signatureModalOpen.value = true
  await nextTick()
  initSignaturePad()
}

const initSignaturePad = () => {
  const canvas = signatureCanvas.value
  if (!canvas) return
  signaturePad.value = new SignaturePad(canvas, {
    backgroundColor: 'rgba(255,255,255,0)',
    penColor: '#101828'
  })
  resizeCanvas()
}

const resizeCanvas = () => {
  const canvas = signatureCanvas.value
  if (!canvas || !signaturePad.value) return
  const ratio = Math.max(window.devicePixelRatio || 1, 1)
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  canvas.width = width * ratio
  canvas.height = height * ratio
  const context = canvas.getContext('2d')
  context.scale(ratio, ratio)
  signaturePad.value.clear()
}

const clearSignature = () => {
  signatureError.value = ''
  signaturePad.value?.clear()
}

const submitSignatureAction = async () => {
  if (!signaturePad.value) {
    signatureError.value = 'Signature pad is not ready.'
    return
  }
  if (signaturePad.value.isEmpty()) {
    signatureError.value = "Veuillez tracer votre signature avant d'enregistrer."
    return
  }

  signing.value = true
  signatureError.value = ''

  try {
    const signaturePng = signaturePad.value.toDataURL('image/png')
    const result = await submitSignature(token, signaturePng)

    Object.assign(record, result)

    signatureModalOpen.value = false
  } catch (error) {
    signatureError.value = error.message || 'Failed to submit signature.'
  } finally {
    signing.value = false
  }
}

const flickPage = () => {
  if(pageNumber.value<record.previewJpgUrl.length-1) pageNumber.value++
  else pageNumber.value = 0;
}

const prevPage = () => {
  if (pageNumber.value > 0) pageNumber.value--
  else pageNumber.value = record.previewJpgUrl.length - 1
}

onMounted(() => {
  loadRecord()
})
</script>
