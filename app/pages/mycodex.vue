<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-extrabold text-white tracking-tight">MycoDex</h1>
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <AppIcon name="sparkles" class="w-3.5 h-3.5 text-emerald-400" />
            Field Encyclopedia
          </span>
        </div>
        <p class="text-sm text-slate-300 mt-1.5 leading-relaxed">
          Catalog your wild mushroom discoveries, earn crowdsourcing points, and redeem them for free 7-Day Pro Passes!
        </p>
      </div>

      <!-- Quick Scan Shortcut -->
      <NuxtLink
        to="/users/scan"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-sm transition no-underline shrink-0"
      >
        <AppIcon name="camera" class="w-4 h-4" />
        Scan to Unlock
      </NuxtLink>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="space-y-4">
      <div class="h-36 rounded-2xl bg-emerald-950/40 border border-emerald-900/30 animate-pulse" />
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="i in 8" :key="i" class="h-64 rounded-2xl bg-emerald-950/40 border border-emerald-900/30 animate-pulse" />
      </div>
    </div>

    <template v-else>
      <!-- Feedback notification banner -->
      <div
        v-if="feedbackMessage"
        class="rounded-xl p-4 flex items-center justify-between gap-3 text-sm transition-all"
        :class="feedbackSuccess ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-red-50 border border-red-200 text-red-900'"
      >
        <div class="flex items-center gap-2">
          <AppIcon :name="feedbackSuccess ? 'check-circle' : 'alert-circle'" class="w-5 h-5" :class="feedbackSuccess ? 'text-emerald-600' : 'text-red-600'" />
          <span>{{ feedbackMessage }}</span>
        </div>
        <button @click="feedbackMessage = ''" class="text-xs font-bold opacity-70 hover:opacity-100">✕</button>
      </div>

      <!-- ── Subscription Progress Header ────────────────────────────────────── -->
      <div class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <!-- Points & Progress -->
        <div class="flex-1 space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2.5">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Subscription Reward Progress</span>
              <!-- Pending points badge -->
              <span
                v-if="mycodex.pending_points > 0"
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200"
                title="Points awarded from recent scans awaiting human expert verification"
              >
                <AppIcon name="clock" class="w-3 h-3 text-amber-600" />
                {{ mycodex.pending_points }} pts in review
              </span>
            </div>

            <!-- Current subscription status -->
            <span
              class="text-xs font-bold px-2.5 py-1 rounded-full border"
              :class="mycodex.subscription?.is_subscribed ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'"
            >
              {{ mycodex.subscription?.is_subscribed ? '🌟 Pro Active' : 'Free Tier' }}
              <span v-if="mycodex.subscription?.expires_at" class="font-normal text-[11px] text-slate-500">
                (Exp: {{ new Date(mycodex.subscription.expires_at).toLocaleDateString() }})
              </span>
            </span>
          </div>

          <!-- Progress Bar Toward 100 Pts -->
          <div>
            <div class="flex items-baseline justify-between mb-1.5">
              <div class="flex items-baseline gap-1.5">
                <span class="text-3xl font-black text-slate-900">{{ mycodex.verified_points }}</span>
                <span class="text-sm font-semibold text-slate-400">/ 100 Verified Points</span>
              </div>
              <span class="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {{ mycodex.progress_percent }}% toward 7-Day Pro Pass
              </span>
            </div>
            <div class="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200/60">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="mycodex.verified_points >= 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-400 animate-pulse' : 'bg-emerald-500'"
                :style="{ width: `${mycodex.progress_percent}%` }"
              />
            </div>
          </div>

          <p class="text-xs text-slate-500 leading-relaxed">
            Every <strong>100 Verified Points</strong> unlocks a <strong>7-Day Pro Pass</strong> with unlimited high-accuracy AI scans.
            Earn points by contributing high-confidence and active learning borderline mushroom scans!
          </p>
        </div>

        <!-- Action Button -->
        <div class="shrink-0 flex flex-col items-center sm:items-end gap-1.5 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
          <button
            type="button"
            :disabled="!mycodex.can_redeem || isRedeeming"
            @click="redeemProPass"
            class="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            :class="mycodex.can_redeem
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-200 ring-2 ring-emerald-500/30'
              : 'bg-slate-100 text-slate-400 border border-slate-200'"
          >
            <span v-if="isRedeeming" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            <AppIcon v-else name="sparkles" class="w-4 h-4" />
            <span>{{ isRedeeming ? 'Redeeming…' : (mycodex.can_redeem ? 'Redeem 7-Day Pro Pass' : 'Need 100 Verified Pts') }}</span>
          </button>
          <span class="text-[11px] text-slate-400">
            {{ mycodex.can_redeem ? '100 points ready to redeem' : `${100 - mycodex.verified_points} points remaining` }}
          </span>
        </div>
      </div>

      <!-- ── MycoDex Catalog & Species Grid ─────────────────────────────────── -->
      <div class="space-y-4">
        <!-- Stats bar & filter -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <h2 class="text-base font-bold text-white">Mushroom Species Discovered</h2>
            <span class="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {{ mycodex.species_discovered_count }} / {{ mycodex.total_species_count }}
            </span>
          </div>

          <!-- Filter buttons -->
          <div class="flex items-center gap-1.5 p-1 bg-[#0c221a] border border-emerald-900/40 rounded-xl text-xs font-semibold">
            <button
              @click="filterMode = 'all'"
              class="px-3 py-1.5 rounded-lg border-none cursor-pointer transition-colors"
              :class="filterMode === 'all' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-transparent text-slate-400 hover:text-white'"
            >
              All ({{ mycodex.total_species_count }})
            </button>
            <button
              @click="filterMode = 'discovered'"
              class="px-3 py-1.5 rounded-lg border-none cursor-pointer transition-colors"
              :class="filterMode === 'discovered' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-transparent text-slate-400 hover:text-white'"
            >
              Unlocked ({{ mycodex.species_discovered_count }})
            </button>
            <button
              @click="filterMode = 'locked'"
              class="px-3 py-1.5 rounded-lg border-none cursor-pointer transition-colors"
              :class="filterMode === 'locked' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-transparent text-slate-400 hover:text-white'"
            >
              Locked ({{ mycodex.total_species_count - mycodex.species_discovered_count }})
            </button>
          </div>
        </div>

        <!-- Grid of Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="species in filteredSpeciesGrid"
            :key="species.id"
            class="group rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col bg-white"
            :class="species.is_discovered
              ? 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
              : 'border-dashed border-slate-300 bg-slate-50/70 opacity-90'"
          >
            <!-- Card Image Area -->
            <div class="relative h-44 bg-slate-100 overflow-hidden flex items-center justify-center">
              <template v-if="species.is_discovered">
                <img
                  v-if="species.cover_image_url"
                  :src="species.cover_image_url"
                  :alt="species.common_name"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div v-else class="w-full h-full bg-emerald-50 flex items-center justify-center">
                  <AppIcon name="leaf" class="w-12 h-12 text-emerald-400" />
                </div>

                <!-- Specimen Scan Count Badge -->
                <div class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-black/75 text-white backdrop-blur-xs flex items-center gap-1 shadow-sm">
                  <span>x{{ species.scan_count }}</span>
                </div>

                <!-- Classification / Edibility Badge -->
                <div class="absolute bottom-2.5 left-2.5">
                  <span
                    class="px-2 py-0.5 rounded-md text-[10.5px] font-extrabold uppercase tracking-wider backdrop-blur-xs shadow-xs"
                    :class="species.classification === 'edible'
                      ? 'bg-emerald-600/90 text-white'
                      : (species.classification === 'poisonous' ? 'bg-red-600/90 text-white' : 'bg-slate-800/80 text-slate-100')"
                  >
                    {{ species.classification }}
                  </span>
                </div>
              </template>

              <!-- Locked Silhouette State -->
              <template v-else>
                <div class="w-full h-full bg-gradient-to-b from-slate-200 to-slate-300 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <div class="w-14 h-14 rounded-full bg-slate-300/80 flex items-center justify-center text-slate-500 shadow-inner">
                    <AppIcon name="lock" class="w-6 h-6" />
                  </div>
                  <span class="text-xs font-bold text-slate-500 tracking-wider">LOCKED SPECIMEN</span>
                </div>
              </template>
            </div>

            <!-- Card Info Body -->
            <div class="p-4 flex-1 flex flex-col justify-between gap-3">
              <div>
                <template v-if="species.is_discovered">
                  <h3 class="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {{ species.common_name }}
                  </h3>
                  <p class="text-xs italic text-slate-500 font-serif mt-0.5">
                    {{ species.scientific_name }}
                  </p>
                  <p v-if="species.habitat" class="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    <strong class="text-slate-700">Habitat:</strong> {{ species.habitat }}
                  </p>
                </template>

                <template v-else>
                  <h3 class="text-sm font-bold text-slate-500">
                    ??? Unknown Species
                  </h3>
                  <p class="text-xs italic text-slate-400 mt-0.5">
                    Undiscovered
                  </p>
                  <p class="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Find and scan this mushroom in the wild with AI data sharing to unlock full field notes and discovery rewards!
                  </p>
                </template>
              </div>

              <!-- Footer tag -->
              <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span v-if="species.is_discovered && species.first_scanned_at" class="text-slate-400">
                  Found {{ new Date(species.first_scanned_at).toLocaleDateString() }}
                </span>
                <span v-else class="text-slate-400 font-medium">
                  Scan to unlock
                </span>

                <NuxtLink
                  to="/users/scan"
                  class="font-bold text-emerald-600 hover:text-emerald-800 no-underline inline-flex items-center gap-0.5"
                >
                  <span>Scan</span>
                  <span>→</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user', middleware: 'auth' })

const config = useRuntimeConfig()
const loading = ref(true)
const isRedeeming = ref(false)
const filterMode = ref<'all' | 'discovered' | 'locked'>('all')
const feedbackMessage = ref('')
const feedbackSuccess = ref(true)

const mycodex = ref<any>({
  verified_points: 0,
  pending_points: 0,
  points_required: 100,
  can_redeem: false,
  progress_percent: 0,
  subscription: { is_subscribed: false, tier: 'free', expires_at: null },
  species_discovered_count: 0,
  total_species_count: 0,
  species_grid: [],
})

const getHeaders = () => {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

async function fetchMycoDex() {
  loading.value = true
  try {
    const res = await $fetch<any>(`${config.public.apiBase}/user/mycodex`, {
      headers: getHeaders(),
    })
    mycodex.value = res
  } catch (err: any) {
    console.error('Failed to load MycoDex:', err)
  } finally {
    loading.value = false
  }
}

async function redeemProPass() {
  if (!mycodex.value.can_redeem || isRedeeming.value) return

  isRedeeming.value = true
  feedbackMessage.value = ''

  try {
    const res = await $fetch<any>(`${config.public.apiBase}/user/redeem-subscription`, {
      method: 'POST',
      headers: getHeaders(),
    })
    feedbackSuccess.value = true
    feedbackMessage.value = res.message || 'Successfully redeemed 100 Verified Points for a 7-Day Pro Pass!'
    await fetchMycoDex()
  } catch (err: any) {
    feedbackSuccess.value = false
    feedbackMessage.value = err?.data?.message || 'Failed to redeem subscription. Please try again.'
  } finally {
    isRedeeming.value = false
  }
}

const filteredSpeciesGrid = computed(() => {
  const list = mycodex.value.species_grid || []
  if (filterMode.value === 'discovered') {
    return list.filter((s: any) => s.is_discovered)
  }
  if (filterMode.value === 'locked') {
    return list.filter((s: any) => !s.is_discovered)
  }
  return list
})

onMounted(() => {
  fetchMycoDex()
})
</script>

