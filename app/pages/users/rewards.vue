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
        <div class="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-5 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wider text-emerald-100">Available Balance</p>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-4xl font-extrabold">{{ rewards.reward_points }}</span>
            <span class="text-sm font-semibold text-emerald-100">pts</span>
          </div>
          <p class="mt-2 text-xs text-emerald-100">
            Worth <strong class="text-white">₱{{ rewards.points_value_php }}</strong> toward any subscription plan (1 pt = ₱1)
          </p>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Daily Scan Cap</p>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-slate-900">{{ rewards.daily_scan_count }}</span>
            <span class="text-sm font-medium text-slate-400">/ {{ rewards.daily_scan_cap }} rewarded today</span>
          </div>
          <div class="mt-3 w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              class="h-full bg-emerald-500 rounded-full transition-all"
              :style="{ width: `${Math.min(100, (rewards.daily_scan_count / Math.max(1, rewards.daily_scan_cap)) * 100)}%` }"
            />
          </div>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Redemption Target</p>
            <p class="text-lg font-bold text-slate-900 mt-1.5">Free Monthly Pro = 149 pts</p>
            <p class="text-xs text-slate-500 mt-1">
              {{ rewards.reward_points >= 149 ? 'You have enough points for a free month!' : `${149 - rewards.reward_points} more pts for a free month (or use ${rewards.rules.min_redeem_points}+ pts for a discount).` }}
            </p>
          </div>
        </div>
      </div>

      <!-- How to Earn -->
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">How You Earn Points</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="rounded-xl bg-slate-50 border border-slate-100 p-4">
            <div class="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
              +{{ rewards.rules.scan_contribution }} pts
            </div>
            <h3 class="text-sm font-bold text-slate-900 mt-2.5">Valid Consented Scan</h3>
            <p class="text-xs text-slate-500 mt-1">
              Earned when you scan a real mushroom with AI training consent enabled (up to {{ rewards.daily_scan_cap }} scans/day).
            </p>
          </div>

          <div class="rounded-xl bg-slate-50 border border-slate-100 p-4">
            <div class="inline-flex items-center px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 text-xs font-bold">
              +{{ rewards.rules.location_bonus }} pts
            </div>
            <h3 class="text-sm font-bold text-slate-900 mt-2.5">Geotagged Location Bonus</h3>
            <p class="text-xs text-slate-500 mt-1">
              Added automatically when your contributed scan includes GPS or pinned map coordinates.
            </p>
          </div>

          <div class="rounded-xl bg-slate-50 border border-slate-100 p-4">
            <div class="inline-flex items-center px-2.5 py-1 rounded-lg bg-violet-100 text-violet-800 text-xs font-bold">
              +{{ rewards.rules.retrain_bonus }} pts
            </div>
            <h3 class="text-sm font-bold text-slate-900 mt-2.5">AI Retraining Selection</h3>
            <p class="text-xs text-slate-500 mt-1">
              Bonus awarded when an admin includes your contributed scan in a model retraining batch.
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

const rewards = ref({
  reward_points: 0,
  points_value_php: 0,
  allow_data_training: false,
  daily_scan_count: 0,
  daily_scan_cap: 5,
  rules: {
    scan_contribution: 5,
    location_bonus: 3,
    retrain_bonus: 15,
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

onMounted(loadRewards)
</script>
