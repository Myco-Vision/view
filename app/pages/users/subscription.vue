<template>
  <div class="flex flex-col gap-6 max-w-6xl mx-auto pb-12">

    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <span>Subscription &amp; Plans</span>
          <span v-if="subscriptionStatus.is_subscribed" class="text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
            PRO ACTIVE
          </span>
          <span v-else class="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            FREE TIER
          </span>
        </h1>
        <p class="text-[13.5px] text-slate-500 mt-1">
          Unlock unlimited AI mushroom scans and advanced identification features powered by PayMongo.
        </p>
      </div>

      <!-- Quick Action / Status Badge -->
      <div class="flex items-center gap-3">
        <button
          @click="fetchSubscriptionStatus"
          :disabled="isLoading"
          class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
        >
          <svg class="w-3.5 h-3.5 text-slate-500" :class="{ 'animate-spin': isLoading }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
            <path d="M16 21h5v-5"/>
          </svg>
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Alert Banner (Success / Cancel / Error) -->
    <div
      v-if="alertMessage"
      class="p-4 rounded-xl border flex items-start justify-between gap-3 transition-all duration-300"
      :class="alertType === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : (alertType === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-red-50 border-red-200 text-red-900')"
    >
      <div class="flex items-start gap-3">
        <span class="text-xl">
          <template v-if="alertType === 'success'">🎉</template>
          <template v-else-if="alertType === 'warning'">⚠️</template>
          <template v-else>ℹ️</template>
        </span>
        <div>
          <p class="font-bold text-sm">{{ alertTitle }}</p>
          <p class="text-xs mt-0.5 opacity-90">{{ alertMessage }}</p>
        </div>
      </div>
      <button @click="alertMessage = ''" class="text-xs bg-transparent border-none cursor-pointer p-1 opacity-60 hover:opacity-100">✕</button>
    </div>

    <!-- ── CURRENT STATUS CARD ──────────────────────────── -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
      <!-- Background subtle gradient accent -->
      <div
        class="absolute -right-16 -top-16 w-52 h-52 rounded-full blur-3xl pointer-events-none opacity-40"
        :class="subscriptionStatus.is_subscribed ? 'bg-emerald-400' : 'bg-amber-300'"
      ></div>

      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <!-- Status summary -->
        <div class="flex items-start gap-4">
          <div
            class="w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-md"
            :class="subscriptionStatus.is_subscribed ? 'bg-gradient-to-br from-emerald-500 to-teal-700' : 'bg-gradient-to-br from-amber-500 to-amber-600'"
          >
            <svg v-if="subscriptionStatus.is_subscribed" class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <svg v-else class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>

          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-bold text-slate-900">
                {{ currentPlanDisplayName }}
              </h2>
              <span
                class="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide"
                :class="subscriptionStatus.is_subscribed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'"
              >
                {{ subscriptionStatus.is_subscribed ? 'Active' : 'Free Account' }}
              </span>
            </div>

            <!-- Free user quota text -->
            <div v-if="!subscriptionStatus.is_subscribed" class="mt-2 text-xs text-slate-600 flex flex-col gap-1.5">
              <p>
                You have used <strong class="text-slate-900 font-semibold">{{ subscriptionStatus.scans_used }} of 3</strong> lifetime free scans.
                <span class="text-amber-700 font-medium">Free scans do not renew daily.</span>
              </p>
              <!-- Progress Bar -->
              <div class="w-64 max-w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 mt-0.5">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="freeScansRemaining === 0 ? 'bg-red-500' : 'bg-emerald-500'"
                  :style="{ width: `${Math.min(100, (subscriptionStatus.scans_used / 3) * 100)}%` }"
                ></div>
              </div>
              <p v-if="freeScansRemaining === 0" class="text-red-600 font-semibold mt-0.5">
                ⚠️ All free scans used. Subscribe to Premium below to continue scanning!
              </p>
              <p v-else class="text-slate-500">
                {{ freeScansRemaining }} {{ freeScansRemaining === 1 ? 'scan' : 'scans' }} remaining before subscription is required.
              </p>
            </div>

            <!-- Subscribed user details -->
            <div v-else class="mt-1.5 text-xs text-slate-600 flex flex-col gap-1">
              <p class="flex items-center gap-2 text-emerald-800 font-semibold">
                <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                Unlimited mushroom scans active
              </p>
              <p v-if="subscriptionStatus.active_subscription?.expires_at" class="text-slate-500">
                Valid until: <strong class="text-slate-800">{{ formatDate(subscriptionStatus.active_subscription.expires_at) }}</strong>
                <span v-if="subscriptionStatus.active_subscription.days_remaining !== null" class="ml-1.5 px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                  {{ subscriptionStatus.active_subscription.days_remaining }} days remaining
                </span>
              </p>
              <p v-if="subscriptionStatus.active_subscription?.is_cancelled" class="text-amber-700 font-medium">
                Auto-renewal is cancelled. Your plan remains active until the expiration date.
              </p>
            </div>
          </div>
        </div>

        <!-- Right action: Cancel Auto-renewal or Scan button -->
        <div class="flex items-center gap-3 shrink-0">
          <NuxtLink
            to="/users/scan"
            class="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-sm inline-flex items-center gap-1.5 no-underline"
          >
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            <span>Scan Mushroom</span>
          </NuxtLink>

          <button
            v-if="subscriptionStatus.is_subscribed && !subscriptionStatus.active_subscription?.is_cancelled"
            @click="confirmCancelSubscription"
            :disabled="isCancelling"
            class="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition cursor-pointer disabled:opacity-50"
          >
            {{ isCancelling ? 'Cancelling…' : 'Cancel Auto-Renewal' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── PRICING TIERS ───────────────────────────────── -->
    <div class="flex flex-col gap-4">
      <div class="text-center max-w-xl mx-auto mt-2">
        <h2 class="text-xl sm:text-2xl font-bold text-slate-900">Choose Your Subscription Plan</h2>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Enjoy unlimited AI identification, toxic mushroom warnings, and complete database access.
        </p>
      </div>

      <!-- Payment Method Selection Pills -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1 shadow-2xs">
        <div>
          <h3 class="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Payment Method</span>
            <span class="text-[11px] font-normal text-slate-500">via PayMongo</span>
          </h3>
          <p class="text-[11.5px] text-slate-500 mt-0.5">All subscriptions are paid securely through GCash.</p>
        </div>

        <div class="flex items-center gap-2">
          <span class="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border bg-[#007DFE] text-white border-[#007DFE] shadow-sm">
            <span>🔵 GCash</span>
            <span class="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">Only method</span>
          </span>
        </div>
      </div>

      <!-- Pricing Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mt-3">

        <!-- 1. FREE TIER CARD -->
        <div class="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 hover:border-slate-300 hover:shadow-md">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Starter</span>
              <span v-if="!subscriptionStatus.is_subscribed" class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                Current Plan
              </span>
            </div>
            <h3 class="text-lg font-bold text-slate-900 mt-2">Free Account</h3>
            <p class="text-xs text-slate-500 mt-1">For curious explorers and first-time foragers.</p>

            <div class="mt-4 pb-4 border-b border-slate-100">
              <div class="flex items-baseline gap-1">
                <span class="text-3xl font-black text-slate-900">₱0</span>
                <span class="text-xs text-slate-400">/ forever</span>
              </div>
              <p class="text-[11px] text-amber-700 font-medium mt-1">3 lifetime scans total • Non-renewable</p>
            </div>

            <!-- Features -->
            <ul class="mt-5 space-y-2.5 text-xs text-slate-600">
              <li class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span><strong>3 AI Mushroom Scans</strong> included</span>
              </li>
              <li class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span><strong>Full Access to Saved Data:</strong> View all previous scans, history, and timestamps anytime</span>
              </li>
              <li class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Mushroom collections &amp; favorites</span>
              </li>
              <li class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Browse mushroom species directory</span>
              </li>
            </ul>
          </div>

          <div class="mt-6 pt-4">
            <button
              disabled
              class="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-xs font-semibold cursor-not-allowed text-center"
            >
              {{ !subscriptionStatus.is_subscribed ? 'Active Plan' : 'Free Tier' }}
            </button>
          </div>
        </div>

        <!-- 2. MONTHLY PLAN CARD -->
        <div
          class="bg-white border rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-lg relative"
          :class="subscriptionStatus.active_subscription?.plan === 'monthly' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-emerald-300'"
        >
          <div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-600">Flexible</span>
              <span v-if="subscriptionStatus.active_subscription?.plan === 'monthly'" class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                Current Plan
              </span>
            </div>
            <h3 class="text-lg font-bold text-slate-900 mt-2">Premium Monthly</h3>
            <p class="text-xs text-slate-500 mt-1">Unlimited scans with monthly flexibility.</p>

            <div class="mt-4 pb-4 border-b border-slate-100">
              <div class="flex items-baseline gap-1">
                <span class="text-3xl font-black text-slate-900">₱149</span>
                <span class="text-xs text-slate-400">/ month</span>
                <span class="text-[11px] text-slate-400 ml-1">(~$2 USD)</span>
              </div>
              <p class="text-[11px] text-emerald-700 font-medium mt-1">Unlimited AI scans • Cancel anytime</p>
            </div>

            <!-- Features -->
            <ul class="mt-5 space-y-2.5 text-xs text-slate-600">
              <li class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span><strong class="text-slate-900">Unlimited AI Mushroom Scans</strong> every day</span>
              </li>
              <li class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Priority inference speed on AI model</span>
              </li>
              <li class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Full access to all saved data &amp; collection</span>
              </li>
              <li class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Mushroom toxicity guide &amp; edibility details</span>
              </li>
              <li class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Export collection &amp; scan reports (PDF)</span>
              </li>
            </ul>
          </div>

          <div class="mt-6 pt-4">
            <button
              @click="initiateCheckout('monthly')"
              :disabled="isProcessingCheckout || subscriptionStatus.active_subscription?.plan === 'monthly'"
              class="w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              <span v-if="checkoutPlanLoading === 'monthly'" class="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              <span>
                {{ subscriptionStatus.active_subscription?.plan === 'monthly' ? 'Subscribed' : `Subscribe Monthly (₱149 via ${paymentMethodLabel})` }}
              </span>
            </button>
          </div>
        </div>

        <!-- 3. ANNUAL PLAN CARD (BEST VALUE) -->
        <div
          class="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl p-6 flex flex-col justify-between shadow-xl relative border-2 border-emerald-500/60 overflow-hidden"
        >
          <!-- Badge -->
          <div class="absolute top-0 right-0">
            <div class="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider py-1 px-3.5 rounded-bl-xl shadow-md">
              BEST VALUE • SAVE ~27%
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Annual Pass</span>
              <span v-if="subscriptionStatus.active_subscription?.plan === 'annual'" class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                Current Plan
              </span>
            </div>
            <h3 class="text-lg font-bold text-white mt-2">Premium Annual</h3>
            <p class="text-xs text-slate-400 mt-1">Full year of unlimited forays &amp; scans.</p>

            <div class="mt-4 pb-4 border-b border-slate-800">
              <div class="flex items-baseline gap-1">
                <span class="text-3xl font-black text-white">₱1,299</span>
                <span class="text-xs text-slate-400">/ year</span>
              </div>
              <p class="text-[11px] text-emerald-400 font-medium mt-1">Only ~₱108 / month (save ₱489/yr)</p>
            </div>

            <!-- Features -->
            <ul class="mt-5 space-y-2.5 text-xs text-slate-300">
              <li class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span><strong class="text-white">All Premium Monthly features included</strong></span>
              </li>
              <li class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Full 365 days of uninterrupted AI identification</span>
              </li>
              <li class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Save ~27% compared to monthly billing</span>
              </li>
              <li class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Priority support and early access to new mushroom models</span>
              </li>
              <li class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Unlimited PDF exports for scans &amp; collections</span>
              </li>
            </ul>
          </div>

          <div class="mt-6 pt-4">
            <button
              @click="initiateCheckout('annual')"
              :disabled="isProcessingCheckout || subscriptionStatus.active_subscription?.plan === 'annual'"
              class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black hover:opacity-95 transition cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              <span v-if="checkoutPlanLoading === 'annual'" class="w-3.5 h-3.5 border-2 border-slate-900/40 border-t-slate-950 rounded-full animate-spin"></span>
              <span>
                {{ subscriptionStatus.active_subscription?.plan === 'annual' ? 'Subscribed' : `Subscribe Annually (₱1,299 via ${paymentMethodLabel})` }}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- ── PAYMONGO SECURITY & PAYMENT METHODS ─────────── -->
    <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div>
            <h4 class="text-xs sm:text-sm font-bold text-slate-900">Secure Payments via PayMongo</h4>
            <p class="text-[11.5px] text-slate-500">
              End-to-end encrypted GCash checkout powered by PayMongo.
            </p>
          </div>
        </div>

        <!-- Payment badges -->
        <div class="flex flex-wrap items-center justify-center gap-2">
          <span class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-[#007DFE] shadow-2xs">
            GCash
          </span>
        </div>
      </div>
    </div>

    <!-- ── PAYMENT & BILLING HISTORY ────────────────────── -->
    <div v-if="subscriptionStatus.history && subscriptionStatus.history.length > 0" class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>Payment &amp; Billing History</span>
        </h3>
        <button
          @click="syncPaymentStatus"
          :disabled="isSyncing"
          title="Check latest payment status with PayMongo"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer disabled:opacity-50"
        >
          <svg class="w-3.5 h-3.5" :class="{ 'animate-spin': isSyncing }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{{ isSyncing ? 'Syncing...' : 'Sync Status' }}</span>
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
              <th class="pb-2.5">Date</th>
              <th class="pb-2.5">Plan</th>
              <th class="pb-2.5">Amount</th>
              <th class="pb-2.5">Payment Method</th>
              <th class="pb-2.5">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700">
            <tr v-for="item in subscriptionStatus.history" :key="item.id" class="hover:bg-slate-50/60 transition">
              <td class="py-3 font-medium">{{ formatDate(item.created_at) }}</td>
              <td class="py-3 capitalize">{{ item.plan }}</td>
              <td class="py-3 font-semibold text-slate-900">₱{{ Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</td>
              <td class="py-3 uppercase text-slate-600 font-medium">{{ formatPaymentMethod(item.payment_method) }}</td>
              <td class="py-3">
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
                  :class="item.status === 'active' ? 'bg-emerald-100 text-emerald-800' : (item.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600')"
                >
                  {{ item.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── FAQ SECTION ─────────────────────────────────── -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h3 class="text-base font-bold text-slate-900 mb-4">Frequently Asked Questions</h3>
      <div class="space-y-4 text-xs text-slate-600">
        <div>
          <h4 class="font-bold text-slate-800 text-sm">How do the 3 free scans work?</h4>
          <p class="mt-1 leading-relaxed">
            Every new account gets 3 free lifetime AI mushroom scans. These scans do not renew daily. Once you have used your 3 free scans, you can subscribe to either the Monthly (₱149/mo) or Annual (₱1,299/yr) plan for unlimited scans.
          </p>
        </div>
        <div>
          <h4 class="font-bold text-slate-800 text-sm">Will I still have access to my saved scans if I don't subscribe?</h4>
          <p class="mt-1 leading-relaxed">
            Yes! Free tier users have lifetime access to all previously saved scans, collection history, and species details. Only new scan submissions require an active subscription once the 3 free scans are used.
          </p>
        </div>
        <div>
          <h4 class="font-bold text-slate-800 text-sm">Which payment methods are supported?</h4>
          <p class="mt-1 leading-relaxed">
            We accept GCash only, processed securely through PayMongo Philippines.
          </p>
        </div>
        <div>
          <h4 class="font-bold text-slate-800 text-sm">Can I cancel my subscription at any time?</h4>
          <p class="mt-1 leading-relaxed">
            Yes! You can cancel auto-renewal with one click at any time. You will continue to have full unlimited scan access until your current billing period ends.
          </p>
        </div>
      </div>
    </div>

    <!-- ── SIMULATED GCASH / PAYMONGO MODAL (FOR TEST / SANDBOX MODE) ── -->
    <Teleport to="body">
      <div v-if="simulatorModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
        <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 relative animate-in fade-in zoom-in duration-200">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center gap-2">
              <span class="text-xl">📱</span>
              <span class="font-bold text-slate-900 text-sm">GCash Test Gateway</span>
            </div>
            <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Sandbox Test
            </span>
          </div>

          <div class="text-center py-2 flex flex-col items-center">
            <div class="w-14 h-14 rounded-2xl bg-[#007DFE]/10 text-[#007DFE] flex items-center justify-center text-2xl font-bold mb-2">
              ₱
            </div>
            <p class="text-xs text-slate-500">Pay to MycoVision</p>
            <p class="text-2xl font-black text-slate-900 mt-1">
              ₱{{ Number(simulatorData?.plan?.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
            </p>
            <p class="text-[11px] text-slate-400 mt-0.5 capitalize">{{ simulatorData?.plan?.name }}</p>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-xl p-3 text-[11.5px] text-blue-900 leading-relaxed">
            <p class="font-semibold">Simulated Payment Flow</p>
            <p class="mt-0.5 opacity-90">
              Clicking <strong>Authorize Payment</strong> simulates a successful GCash transaction and activates your subscription.
            </p>
            <p class="mt-1 text-[10.5px] text-blue-700">
              💡 To test the official hosted PayMongo page, paste your real <code>sk_test_...</code> key into <code>api/.env</code>.
            </p>
          </div>

          <div class="flex flex-col gap-2 pt-2">
            <button
              @click="confirmSimulatorPayment"
              class="w-full py-2.5 px-4 rounded-xl bg-[#007DFE] hover:bg-[#006ee0] text-white text-xs font-bold transition cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <span>Authorize GCash Payment</span>
            </button>
            <button
              @click="simulatorModalOpen = false"
              class="w-full py-2 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-medium hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'user',
})

const config = useRuntimeConfig()
const route  = useRoute()
const router = useRouter()

const isLoading           = ref(false)
const isProcessingCheckout = ref(false)
const checkoutPlanLoading = ref<string | null>(null)
const isCancelling        = ref(false)

const alertTitle   = ref('')
const alertMessage = ref('')
const alertType    = ref<'success' | 'warning' | 'error'>('success')

const selectedPaymentMethod = 'gcash' as const
const paymentMethodLabel = 'GCash'

const simulatorModalOpen = ref(false)
const simulatorData      = ref<any>(null)

function confirmSimulatorPayment() {
  if (simulatorData.value?.checkout_url) {
    window.location.href = simulatorData.value.checkout_url
  }
  simulatorModalOpen.value = false
}

interface SubscriptionStatus {
  user_id: number | null
  subscription_tier: string
  is_subscribed: boolean
  can_scan: boolean
  free_limit: number
  scans_used: number
  remaining_scans: number
  active_subscription: {
    id: number
    plan: string
    status: string
    price: number
    currency: string
    payment_method: string
    starts_at: string
    expires_at: string
    days_remaining: number | null
    is_cancelled: boolean
  } | null
  history: Array<any>
}

const subscriptionStatus = ref<SubscriptionStatus>({
  user_id: null,
  subscription_tier: 'free',
  is_subscribed: false,
  can_scan: true,
  free_limit: 3,
  scans_used: 0,
  remaining_scans: 3,
  active_subscription: null,
  history: [],
})

const freeScansRemaining = computed(() => {
  if (subscriptionStatus.value.is_subscribed) return -1
  return Math.max(0, 3 - (subscriptionStatus.value.scans_used || 0))
})

const currentPlanDisplayName = computed(() => {
  if (!subscriptionStatus.value.is_subscribed) return 'Free Starter'
  const plan = subscriptionStatus.value.active_subscription?.plan
  if (plan === 'annual') return 'Premium Annual'
  if (plan === 'monthly') return 'Premium Monthly'
  return 'Premium Pro'
})

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

async function fetchSubscriptionStatus() {
  const token = localStorage.getItem('token')
  if (!token) return

  isLoading.value = true
  try {
    const data: any = await $fetch(`${config.public.apiBase}/subscription/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    subscriptionStatus.value = data

    // Update stored user in localStorage
    const stored = localStorage.getItem('user')
    if (stored) {
      const u = JSON.parse(stored)
      u.is_subscribed = data.is_subscribed
      u.subscription_tier = data.subscription_tier
      u.remaining_scans = data.remaining_scans
      localStorage.setItem('user', JSON.stringify(u))
    }
  } catch (err: any) {
    console.error('Failed to load subscription status:', err)
  } finally {
    isLoading.value = false
  }
}

async function initiateCheckout(planKey: 'monthly' | 'annual') {
  const token = localStorage.getItem('token')
  if (!token) {
    await navigateTo('/login')
    return
  }

  isProcessingCheckout.value = true
  checkoutPlanLoading.value = planKey
  alertMessage.value = ''

  try {
    const redirectBase = window.location.origin + '/users/subscription'
    const res: any = await $fetch(`${config.public.apiBase}/subscription/checkout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: {
        plan: planKey,
        payment_method: selectedPaymentMethod,
        success_url: `${redirectBase}?status=success&plan=${planKey}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${redirectBase}?status=cancelled`,
      },
    })

    if (res.mode === 'sandbox_simulator') {
      // Show simulated GCash test gateway modal
      simulatorData.value = res
      simulatorModalOpen.value = true
    } else if (res.checkout_url) {
      // Redirect to official live/test PayMongo checkout page
      window.location.href = res.checkout_url
    } else {
      throw new Error('No checkout URL received from PayMongo.')
    }
  } catch (err: any) {
    console.error('Checkout error:', err)
    alertTitle.value = 'Checkout Error'
    alertMessage.value = err?.data?.message || err?.message || 'Unable to start checkout with PayMongo. Please try again.'
    alertType.value = 'error'
  } finally {
    isProcessingCheckout.value = false
    checkoutPlanLoading.value = null
  }
}

function formatPaymentMethod(method: string | null | undefined): string {
  if (!method) return 'PAYMONGO'
  const m = method.toLowerCase()
  if (m === 'qrph') return 'GCash / QR Ph'
  if (m === 'gcash') return 'GCash'
  if (m === 'paymaya') return 'Maya'
  if (m === 'card') return 'Card'
  if (m === 'grab_pay') return 'GrabPay'
  return method.toUpperCase()
}

const isSyncing = ref(false)

async function syncPaymentStatus() {
  isSyncing.value = true
  try {
    await fetchSubscriptionStatus()
    window.dispatchEvent(new CustomEvent('subscription-updated'))
    if (subscriptionStatus.value.is_subscribed) {
      alertTitle.value = '🎉 Subscription Active'
      alertMessage.value = 'Your PayMongo subscription is active! Unlimited AI mushroom scans are unlocked.'
      alertType.value = 'success'
    } else {
      alertTitle.value = 'Status Updated'
      alertMessage.value = 'Payment status checked. If you just completed payment, it may take a few seconds for PayMongo to finalize.'
      alertType.value = 'warning'
    }
  } catch (err: any) {
    console.error('Failed to sync status:', err)
  } finally {
    isSyncing.value = false
  }
}

async function verifyReturnedPayment(sessionId: string, plan: string) {
  const token = localStorage.getItem('token')
  if (!token) return

  isLoading.value = true
  try {
    const res: any = await $fetch(`${config.public.apiBase}/subscription/verify`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: {
        session_id: sessionId || undefined,
        plan: plan || undefined,
      },
    })

    alertTitle.value = '🎉 Subscription Activated!'
    alertMessage.value = res.message || 'Payment confirmed via PayMongo. Unlimited mushroom scans are now unlocked!'
    alertType.value = 'success'

    // Refresh state
    await fetchSubscriptionStatus()
    window.dispatchEvent(new CustomEvent('subscription-updated'))

    // Clean URL query
    router.replace({ path: '/users/subscription' })
  } catch (err: any) {
    console.error('Payment verification failed:', err)
    // Check if auto-sync in status endpoint already activated it
    await fetchSubscriptionStatus()
    if (subscriptionStatus.value.is_subscribed) {
      alertTitle.value = '🎉 Subscription Activated!'
      alertMessage.value = 'Payment confirmed via PayMongo. Unlimited mushroom scans are now unlocked!'
      alertType.value = 'success'
      router.replace({ path: '/users/subscription' })
    } else {
      alertTitle.value = 'Verification Pending'
      alertMessage.value = err?.data?.message || 'We could not automatically confirm your payment yet. If you have completed checkout, please click Sync Status.'
      alertType.value = 'warning'
    }
  } finally {
    isLoading.value = false
  }
}

async function confirmCancelSubscription() {
  const { confirm } = useConfirm()
  const ok = await confirm({
    title: 'Cancel auto-renewal?',
    message: 'You will keep unlimited scans until the end of your current billing period, then your plan will not renew.',
    tone: 'warning',
    confirmText: 'Cancel Auto-Renewal',
    cancelText: 'Keep Plan',
  })
  if (!ok) return

  const token = localStorage.getItem('token')
  if (!token) return

  isCancelling.value = true
  try {
    const res: any = await $fetch(`${config.public.apiBase}/subscription/cancel`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    alertTitle.value = 'Auto-Renewal Cancelled'
    alertMessage.value = res.message || 'Auto-renewal has been cancelled.'
    alertType.value = 'warning'

    await fetchSubscriptionStatus()
    window.dispatchEvent(new CustomEvent('subscription-updated'))
  } catch (err: any) {
    alertTitle.value = 'Cancellation Error'
    alertMessage.value = err?.data?.message || 'Failed to cancel auto-renewal.'
    alertType.value = 'error'
  } finally {
    isCancelling.value = false
  }
}

onMounted(async () => {
  await fetchSubscriptionStatus()

  // Handle PayMongo return query params
  const statusParam    = route.query.status as string
  const sessionIdParam = route.query.session_id as string
  const planParam      = route.query.plan as string

  if (statusParam === 'success') {
    await verifyReturnedPayment(sessionIdParam || '', planParam || '')
  } else if (statusParam === 'cancelled') {
    alertTitle.value = 'Payment Cancelled'
    alertMessage.value = 'PayMongo checkout was cancelled. Your account was not charged.'
    alertType.value = 'warning'
    router.replace({ path: '/users/subscription' })
  }
})
</script>
