<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Contribution Rewards</h1>
        <p class="text-sm text-slate-500 mt-0.5">
          Earn points by sharing consented mushroom scans to help improve MycoVision's AI, then redeem them for subscription discounts or free months.
        </p>
      </div>
      <NuxtLink
        to="/users/subscription"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition no-underline shrink-0"
      >
        Redeem on Subscription
      </NuxtLink>
    </div>

    <!-- Feedback Toast -->
    <div
      v-if="toastMessage"
      class="rounded-xl px-4 py-3 text-xs font-semibold border"
      :class="toastType === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'"
    >
      {{ toastMessage }}
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="i in 3" :key="i" class="h-32 rounded-2xl bg-slate-100 animate-pulse" />
    </div>

    <template v-else>
      <!-- Consent warning if disabled -->
      <div
        v-if="!rewards.allow_data_training"
        class="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div class="text-sm text-amber-900">
          <p class="font-semibold">Data-training contribution is currently turned off</p>
          <p class="text-amber-700 text-xs mt-0.5">
            Enable AI training consent in your Settings or on your next scan to start earning reward points for valid mushroom contributions.
          </p>
        </div>
        <NuxtLink
          to="/users/settings"
          class="inline-flex items-center justify-center px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold no-underline shrink-0"
        >
          Manage Consent
        </NuxtLink>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Balance Card -->
        <div class="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <p class="text-xs font-semibold uppercase tracking-wider text-emerald-100">Wallet Balance</p>
              <span v-if="rewards.pending_points > 0" class="text-[11px] bg-emerald-800/80 px-2 py-0.5 rounded-full border border-emerald-400/40 text-emerald-200">
                +{{ rewards.pending_points }} pts in review
              </span>
            </div>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-4xl font-extrabold">{{ rewards.reward_points }}</span>
              <span class="text-sm font-semibold text-emerald-100">pts</span>
            </div>
          </div>
          <p class="mt-2 text-xs text-emerald-100">
            Worth <strong class="text-white">₱{{ rewards.points_value_php }}</strong> discount (1 pt = ₱1.00 credit)
          </p>
        </div>

        <!-- 7-Day Pass Micro-Target Card -->
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">7-Day Pro Pass</p>
              <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                35 pts
              </span>
            </div>
            <p class="text-sm font-bold text-slate-800 mt-2">
              {{ rewards.reward_points >= 35 ? 'Ready to redeem 1 week of Pro!' : `${35 - rewards.reward_points} more pts for 1 week of Pro` }}
            </p>
            <div class="mt-2.5 w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                class="h-full bg-emerald-500 rounded-full transition-all"
                :style="{ width: `${Math.min(100, (rewards.reward_points / 35) * 100)}%` }"
              />
            </div>
          </div>

          <button
            type="button"
            :disabled="rewards.reward_points < 35 || redeemingPass"
            @click="redeemWeeklyPass"
            class="mt-3.5 w-full py-2 px-3 rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            :class="rewards.reward_points >= 35 ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'"
          >
            <span v-if="redeemingPass" class="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            <span v-else>{{ rewards.reward_points >= 35 ? 'Redeem 7-Day Pass' : 'Need 35 pts' }}</span>
          </button>
        </div>

        <!-- Free Month Target Card -->
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Monthly Pro Pass</p>
              <span class="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                149 pts
              </span>
            </div>
            <p class="text-sm font-bold text-slate-800 mt-2">
              {{ rewards.reward_points >= 149 ? 'You have enough points for a free month!' : `${149 - rewards.reward_points} more pts for a free month` }}
            </p>
            <div class="mt-2.5 w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                class="h-full bg-teal-500 rounded-full transition-all"
                :style="{ width: `${Math.min(100, (rewards.reward_points / 149) * 100)}%` }"
              />
            </div>
          </div>

          <NuxtLink
            to="/users/subscription"
            class="mt-3.5 w-full py-2 px-3 rounded-xl text-xs font-bold transition text-center no-underline border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
          >
            View Subscription Options
          </NuxtLink>
        </div>
      </div>

      <!-- How to Earn -->
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">How You Earn Points</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="rounded-xl bg-slate-50 border border-slate-100 p-4">
            <div class="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
              +{{ rewards.rules.scan_contribution }} pts
            </div>
            <h3 class="text-sm font-bold text-slate-900 mt-2.5">Consented AI Scan</h3>
            <p class="text-xs text-slate-500 mt-1">
              Earned when you scan a real mushroom with AI training consent enabled (up to {{ rewards.daily_scan_cap }} scans/day).
            </p>
          </div>

          <div class="rounded-xl bg-slate-50 border border-slate-100 p-4">
            <div class="inline-flex items-center px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 text-xs font-bold">
              +{{ rewards.rules.location_bonus }} pts
            </div>
            <h3 class="text-sm font-bold text-slate-900 mt-2.5">Geotagged Location</h3>
            <p class="text-xs text-slate-500 mt-1">
              Added automatically when your contributed scan includes valid GPS or map coordinates.
            </p>
          </div>

          <div class="rounded-xl bg-slate-50 border border-slate-100 p-4">
            <div class="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold">
              +5 to +25 pts
            </div>
            <h3 class="text-sm font-bold text-slate-900 mt-2.5">Target Specimen Bounty</h3>
            <p class="text-xs text-slate-500 mt-1">
              Bonus awarded whenever you are the first to discover a biology catalog target species or new specimen.
            </p>
          </div>

          <div class="rounded-xl bg-slate-50 border border-slate-100 p-4">
            <div class="inline-flex items-center px-2.5 py-1 rounded-lg bg-violet-100 text-violet-800 text-xs font-bold">
              +{{ rewards.rules.retrain_bonus }} pts
            </div>
            <h3 class="text-sm font-bold text-slate-900 mt-2.5">AI Retraining Bonus</h3>
            <p class="text-xs text-slate-500 mt-1">
              Extra bonus awarded when an admin includes your scan in an official AI model retraining run.
            </p>
          </div>
        </div>
      </div>

      <!-- Transaction History -->
      <div class="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Point Activity</h2>
          <span class="text-xs text-slate-400">Latest {{ rewards.transactions.length }} transactions</span>
        </div>

        <div v-if="rewards.transactions.length === 0" class="p-8 text-center text-sm text-slate-500">
          No point transactions yet. Scan a mushroom with training consent enabled to earn your first points!
        </div>

        <div v-else class="divide-y divide-slate-100">
          <div
            v-for="tx in rewards.transactions"
            :key="tx.id"
            class="px-5 py-3.5 flex items-center justify-between gap-4"
          >
            <div>
              <p class="text-sm font-semibold text-slate-800">{{ tx.description }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ formatDate(tx.created_at) }}</p>
            </div>
            <span
              class="text-sm font-extrabold tabular-nums shrink-0"
              :class="tx.points > 0 ? 'text-emerald-600' : 'text-rose-600'"
            >
              {{ tx.points > 0 ? `+${tx.points}` : tx.points }} pts
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user' })

const config = useRuntimeConfig()
const loading = ref(true)
const redeemingPass = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const rewards = ref({
  reward_points: 0,
  pending_points: 0,
  points_value_php: 0,
  allow_data_training: false,
  daily_scan_count: 0,
  daily_scan_cap: 5,
  rules: {
    scan_contribution: 5,
    location_bonus: 3,
    retrain_bonus: 15,
    points_weekly_pass: 35,
    min_redeem_points: 10,
    php_per_point: 1,
  },
  transactions: [] as Array<{
    id: number
    points: number
    type: string
    description: string
    created_at: string
  }>,
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function loadRewards() {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const data: any = await $fetch(`${config.public.apiBase}/rewards`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    rewards.value = data
  } catch (e) {
    console.error('Failed to load rewards', e)
  } finally {
    loading.value = false
  }
}

async function redeemWeeklyPass() {
  if (rewards.value.reward_points < 35 || redeemingPass.value) return
  redeemingPass.value = true
  toastMessage.value = ''

  try {
    const token = localStorage.getItem('token')
    const res: any = await $fetch(`${config.public.apiBase}/subscription/redeem-pass`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: { days: 7 },
    })

    toastType.value = 'success'
    toastMessage.value = res.message || 'Successfully redeemed 35 points for a 7-Day Pro Pass!'
    await loadRewards()
    window.dispatchEvent(new Event('subscription-updated'))
  } catch (err: any) {
    toastType.value = 'error'
    toastMessage.value = err?.data?.message || err?.message || 'Failed to redeem pass. Please try again.'
  } finally {
    redeemingPass.value = false
  }
}

onMounted(loadRewards)
</script>
