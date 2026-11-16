<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Reward System Controls</h1>
        <p class="text-sm text-slate-500 mt-0.5">
          Configure how users earn points from consented scans and how points convert into subscription discounts.
        </p>
      </div>
      <button
        @click="loadAdminRewards"
        class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition cursor-pointer self-start"
      >
        Refresh
      </button>
    </div>

    <!-- Feedback Toast -->
    <div
      v-if="feedback.message"
      class="rounded-xl px-4 py-3 text-xs font-semibold border"
      :class="feedback.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'"
    >
      {{ feedback.message }}
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Circulating Points</p>
        <p class="text-2xl font-extrabold text-slate-900 mt-1">{{ stats.total_circulating.toLocaleString() }} pts</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Earned</p>
        <p class="text-2xl font-extrabold text-emerald-600 mt-1">+{{ stats.total_earned.toLocaleString() }} pts</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Redeemed</p>
        <p class="text-2xl font-extrabold text-amber-600 mt-1">{{ stats.total_redeemed.toLocaleString() }} pts</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Users With Points</p>
        <p class="text-2xl font-extrabold text-slate-900 mt-1">{{ stats.users_with_points.toLocaleString() }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Rules Configuration (2 cols) -->
      <form @submit.prevent="saveSettings" class="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 class="text-base font-bold text-slate-900">Earning & Redemption Rules</h2>
            <p class="text-xs text-slate-500">Changes take effect immediately for all new scans and checkouts.</p>
          </div>
          <label class="inline-flex items-center gap-2 cursor-pointer select-none">
            <input v-model="form.enabled" type="checkbox" class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" />
            <span class="text-xs font-bold" :class="form.enabled ? 'text-emerald-700' : 'text-slate-500'">
              {{ form.enabled ? 'System Enabled' : 'System Paused' }}
            </span>
          </label>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Points per Valid Scan</label>
            <input v-model.number="form.points_per_scan" type="number" min="0" max="500" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <p class="text-[11px] text-slate-400 mt-1">Awarded for consented mushroom scans.</p>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Geotagged Location Bonus</label>
            <input v-model.number="form.points_location_bonus" type="number" min="0" max="500" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <p class="text-[11px] text-slate-400 mt-1">Extra points when coordinates are attached.</p>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">AI Retrain Selection Bonus</label>
            <input v-model.number="form.points_retrain_bonus" type="number" min="0" max="1000" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <p class="text-[11px] text-slate-400 mt-1">Awarded when a scan is used in retraining.</p>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Daily Rewarded Scan Cap</label>
            <input v-model.number="form.daily_scan_cap" type="number" min="0" max="100" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <p class="text-[11px] text-slate-400 mt-1">Max rewarded scans per user/day (0 = unlimited).</p>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Peso Value per Point (₱)</label>
            <input v-model.number="form.php_per_point" type="number" step="0.1" min="0.1" max="100" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <p class="text-[11px] text-slate-400 mt-1">
              At ₱{{ form.php_per_point }}/pt, Monthly (₱149) = {{ Math.ceil(149 / Math.max(0.1, form.php_per_point)) }} pts.
            </p>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Minimum Points to Redeem</label>
            <input v-model.number="form.min_redeem_points" type="number" min="1" max="5000" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <p class="text-[11px] text-slate-400 mt-1">Minimum balance needed to apply a discount.</p>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Max Discount Cap (%)</label>
            <input v-model.number="form.max_discount_percent" type="number" min="5" max="100" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <p class="text-[11px] text-slate-400 mt-1">Cap discount at e.g. 50% or 100% of plan price.</p>
          </div>

          <div class="flex items-center pt-5">
            <label class="inline-flex items-center gap-2.5 cursor-pointer select-none">
              <input v-model="form.allow_full_redemption" type="checkbox" class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" />
              <span class="text-xs font-bold text-slate-700">Allow 100% Free Redemption with Points</span>
            </label>
          </div>
        </div>

        <div class="pt-2 flex justify-end">
          <button
            type="submit"
            :disabled="savingSettings"
            class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition cursor-pointer"
          >
            {{ savingSettings ? 'Saving...' : 'Save Reward Rules' }}
          </button>
        </div>
      </form>

      <!-- Manual Point Adjustment -->
      <form @submit.prevent="submitAdjustment" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4 self-start">
        <div class="border-b border-slate-100 pb-3">
          <h2 class="text-base font-bold text-slate-900">Manual Point Adjustment</h2>
          <p class="text-xs text-slate-500">Grant bonus points or deduct points for a specific user.</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">User Email, Username, or ID</label>
          <input
            v-model="adjustForm.user_identifier"
            type="text"
            required
            placeholder="user@example.com"
            class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Points (+/-)</label>
          <input
            v-model.number="adjustForm.points"
            type="number"
            required
            placeholder="e.g. 25 or -10"
            class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Reason</label>
          <input
            v-model="adjustForm.reason"
            type="text"
            required
            placeholder="e.g. Bug bounty / verified species"
            class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          :disabled="adjusting"
          class="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold transition cursor-pointer"
        >
          {{ adjusting ? 'Applying...' : 'Apply Adjustment' }}
        </button>
      </form>
    </div>

    <!-- Recent Transactions -->
    <div class="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Point Activity</h2>
        <span class="text-xs text-slate-400">Latest {{ transactions.length }} entries</span>
      </div>

      <div v-if="transactions.length === 0" class="p-8 text-center text-sm text-slate-500">
        No point transactions recorded yet.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 text-slate-500 uppercase font-bold">
            <tr>
              <th class="px-5 py-3">User</th>
              <th class="px-5 py-3">Type</th>
              <th class="px-5 py-3">Description</th>
              <th class="px-5 py-3 text-right">Points</th>
              <th class="px-5 py-3 text-right">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-slate-50/70">
              <td class="px-5 py-3 font-semibold text-slate-800">
                {{ tx.user?.name || 'User' }}
                <span class="block text-[11px] font-normal text-slate-400">{{ tx.user?.email }}</span>
              </td>
              <td class="px-5 py-3">
                <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">{{ tx.type }}</span>
              </td>
              <td class="px-5 py-3 text-slate-600">{{ tx.description }}</td>
              <td
                class="px-5 py-3 text-right font-extrabold tabular-nums"
                :class="tx.points > 0 ? 'text-emerald-600' : 'text-rose-600'"
              >
                {{ tx.points > 0 ? `+${tx.points}` : tx.points }}
              </td>
              <td class="px-5 py-3 text-right text-slate-400 whitespace-nowrap">
                {{ new Date(tx.created_at).toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const config = useRuntimeConfig()
const savingSettings = ref(false)
const adjusting = ref(false)
const feedback = ref({ type: 'success', message: '' })

const stats = ref({
  total_circulating: 0,
  total_earned: 0,
  total_redeemed: 0,
  users_with_points: 0,
})

const form = ref({
  enabled: true,
  points_per_scan: 5,
  points_location_bonus: 3,
  points_retrain_bonus: 15,
  daily_scan_cap: 5,
  min_redeem_points: 10,
  php_per_point: 1.0,
  allow_full_redemption: true,
  max_discount_percent: 100,
})

const adjustForm = ref({
  user_identifier: '',
  points: 10,
  reason: '',
})

const transactions = ref<Array<any>>([])

async function loadAdminRewards() {
  try {
    const token = localStorage.getItem('token')
    const data: any = await $fetch(`${config.public.apiBase}/admin/rewards`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (data.settings) form.value = { ...form.value, ...data.settings }
    if (data.stats) stats.value = data.stats
    transactions.value = data.transactions || []
  } catch (e: any) {
    feedback.value = { type: 'error', message: e?.data?.message || 'Failed to load reward settings.' }
  }
}

async function saveSettings() {
  savingSettings.value = true
  feedback.value.message = ''
  try {
    const token = localStorage.getItem('token')
    const res: any = await $fetch(`${config.public.apiBase}/admin/rewards/settings`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: form.value,
    })
    feedback.value = { type: 'success', message: res.message || 'Reward rules saved.' }
  } catch (e: any) {
    feedback.value = { type: 'error', message: e?.data?.message || 'Failed to save reward rules.' }
  } finally {
    savingSettings.value = false
  }
}

async function submitAdjustment() {
  adjusting.value = true
  feedback.value.message = ''
  try {
    const token = localStorage.getItem('token')
    const res: any = await $fetch(`${config.public.apiBase}/admin/rewards/adjust`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: adjustForm.value,
    })
    feedback.value = { type: 'success', message: res.message || 'Points adjusted.' }
    adjustForm.value = { user_identifier: '', points: 10, reason: '' }
    await loadAdminRewards()
  } catch (e: any) {
    feedback.value = { type: 'error', message: e?.data?.message || 'Failed to adjust points.' }
  } finally {
    adjusting.value = false
  }
}

onMounted(loadAdminRewards)
</script>
