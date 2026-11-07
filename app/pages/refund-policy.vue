<template>
  <div class="min-h-screen bg-[#07130f] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden flex flex-col">

    <!-- ── AMBIENT BACKGROUND GLOW ── -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-[140px]" />
      <div class="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[160px]" />
      <div class="absolute inset-0 bg-[radial-gradient(#15382b_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
    </div>

    <!-- ── NAVBAR ── -->
    <header class="relative z-40 backdrop-blur-xl bg-[#081712]/85 border-b border-emerald-900/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C7.03 2 3 6.03 3 11c0 1.25.26 2.44.73 3.52C4.1 15.35 4.8 16 5.6 16h12.8c.8 0 1.5-.65 1.87-1.48.47-1.08.73-2.27.73-3.52 0-4.97-4.03-9-9-9zm-1.5 15h3v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-5z" />
            </svg>
          </div>
          <span class="text-lg font-bold tracking-tight text-white">Myco<span class="text-emerald-400">Vision</span></span>
        </NuxtLink>
        <NuxtLink :to="backTo" id="refund-policy-back" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/40 transition">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span>{{ isLoggedIn ? 'Back to Subscription' : 'Back to Home' }}</span>
        </NuxtLink>
      </div>
    </header>

    <!-- ── CONTENT ── -->
    <main class="relative z-10 flex-1 px-4 py-12">
      <article class="max-w-3xl mx-auto">

        <div class="mb-10">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400/90 mb-2">Policy</p>
          <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Refund Policy</h1>
          <p class="mt-2 text-sm text-slate-400">Last updated: {{ lastUpdated }}</p>
        </div>

        <!-- Quick facts -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          <div v-for="f in quickFacts" :key="f.label" class="rounded-2xl border border-emerald-900/40 bg-emerald-950/30 p-4">
            <p class="text-2xl font-extrabold text-emerald-300">{{ f.value }}</p>
            <p class="text-xs text-slate-400 mt-0.5">{{ f.label }}</p>
          </div>
        </div>

        <div class="space-y-8 text-[14px] leading-relaxed text-slate-300">

          <section id="overview" aria-labelledby="h-overview">
            <h2 id="h-overview" class="sec-title">1. Overview</h2>
            <p>MycoVision Premium is a digital subscription that gives you unlimited AI mushroom scans and premium features. The Free plan lets you try the core scanning features before you pay ({{ P.freeScans }} free scans), so we encourage you to use it first.</p>
            <p class="mt-3">This policy explains when you can get a refund for <strong class="text-white">Premium Monthly (₱{{ P.monthly }}/month)</strong> and <strong class="text-white">Premium Annual (₱{{ P.annual }}/year)</strong>.</p>
          </section>

          <section id="eligible" aria-labelledby="h-eligible">
            <h2 id="h-eligible" class="sec-title">2. Eligible refunds</h2>
            <div class="overflow-x-auto rounded-2xl border border-emerald-900/40">
              <table class="w-full text-left text-[13px]">
                <thead>
                  <tr class="bg-emerald-950/60 text-emerald-300 text-[11px] uppercase tracking-wider">
                    <th class="py-3 px-4 font-bold">Situation</th>
                    <th class="py-3 px-4 font-bold whitespace-nowrap">Refund</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-emerald-900/30">
                  <tr v-for="row in eligible" :key="row.title" class="align-top">
                    <td class="py-3 px-4"><strong class="text-white">{{ row.title }}</strong> <span class="text-slate-400">{{ row.detail }}</span></td>
                    <td class="py-3 px-4 text-emerald-200">{{ row.refund }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="non-refundable" aria-labelledby="h-nonrefundable">
            <h2 id="h-nonrefundable" class="sec-title">3. Non-refundable cases</h2>
            <ul class="list-disc pl-5 space-y-1.5 marker:text-emerald-600">
              <li>Monthly plans after the {{ P.guaranteeDays }}-day window. Cancel anytime to stop future charges, and you keep access until the end of the paid period.</li>
              <li>Annual plans after <strong class="text-white">{{ P.annualDays }} days</strong>.</li>
              <li>Unused time left on a plan after you cancel (except as described in Section 2).</li>
              <li>Accounts suspended or terminated for breaking our Terms of Service (for example abuse, fraud or scraping).</li>
              <li>Disagreement with an AI identification result. MycoVision is an identification aid, <strong class="text-white">not</strong> a guarantee of edibility or safety.</li>
              <li>Complimentary or promotional plans granted by MycoVision.</li>
              <li>Requests made after a chargeback has been filed for the same payment.</li>
            </ul>
          </section>

          <section id="how-to-request" aria-labelledby="h-request">
            <h2 id="h-request" class="sec-title">4. How to request a refund</h2>
            <ol class="list-decimal pl-5 space-y-1.5 marker:text-emerald-500 marker:font-bold">
              <li>Go to <strong class="text-white">Subscription → Request Refund</strong> in your account, or email <a :href="`mailto:${P.supportEmail}`" class="link">{{ P.supportEmail }}</a>.</li>
              <li>Include your registered email, the payment date, and the reason for the request.</li>
              <li>We will reply within <strong class="text-white">{{ P.replyDays }} business days</strong>.</li>
            </ol>
          </section>

          <section id="processing" aria-labelledby="h-processing">
            <h2 id="h-processing" class="sec-title">5. Processing time</h2>
            <ul class="list-disc pl-5 space-y-1.5 marker:text-emerald-600">
              <li>Approved refunds go back to the <strong class="text-white">original payment method</strong> (GCash, Maya, card, etc.) through our payment provider, PayMongo.</li>
              <li>Depending on the method and your bank or e-wallet, you should see it in <strong class="text-white">5–10 business days</strong> for e-wallets and <strong class="text-white">up to 30 days</strong> for cards.</li>
              <li>If the original method can no longer accept a refund, we will contact you to arrange another option.</li>
            </ul>
          </section>

          <section id="account-effect" aria-labelledby="h-effect">
            <h2 id="h-effect" class="sec-title">6. Effect on your account</h2>
            <ul class="list-disc pl-5 space-y-1.5 marker:text-emerald-600">
              <li><strong class="text-white">Full refund:</strong> Premium access ends immediately and your account returns to the Free plan.</li>
              <li><strong class="text-white">Prorated refund:</strong> Premium access ends when the refund is processed.</li>
              <li>Your scan history and collections are <strong class="text-white">kept</strong>, but premium-only features (for example PDF export) become locked.</li>
            </ul>
          </section>

          <section id="one-refund" aria-labelledby="h-one">
            <h2 id="h-one" class="sec-title">7. One refund per user</h2>
            <p>The {{ P.guaranteeDays }}-day guarantee applies to your <strong class="text-white">first</strong> Premium purchase only. We may decline repeated refund requests from the same person, device or payment method.</p>
          </section>

          <section id="chargebacks" aria-labelledby="h-chargebacks">
            <h2 id="h-chargebacks" class="sec-title">8. Chargebacks</h2>
            <p>Please contact us before you dispute a charge with your bank or e-wallet. We may suspend Premium access while a dispute is open.</p>
          </section>

          <section id="changes" aria-labelledby="h-changes">
            <h2 id="h-changes" class="sec-title">9. Changes to this policy</h2>
            <p>We may update this policy. Changes do not affect refund requests submitted before the update.</p>
          </section>

          <section id="contact" aria-labelledby="h-contact">
            <h2 id="h-contact" class="sec-title">10. Contact</h2>
            <p>Questions about a refund? Email <a :href="`mailto:${P.supportEmail}`" class="link">{{ P.supportEmail }}</a>.</p>
          </section>
        </div>

        <div class="mt-12 rounded-2xl border border-emerald-700/30 bg-gradient-to-br from-emerald-950/60 to-[#0a1d16] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p class="font-bold text-white">Need a refund?</p>
            <p class="text-xs text-slate-400 mt-0.5">Check your eligibility and submit a request from your Subscription page.</p>
          </div>
          <NuxtLink :to="isLoggedIn ? '/users/subscription#refunds' : '/login'" id="refund-policy-cta" class="shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-sm font-semibold shadow-lg shadow-emerald-950/50 hover:-translate-y-px transition-transform">
            {{ isLoggedIn ? 'Request a Refund' : 'Log in to Request' }}
          </NuxtLink>
        </div>
      </article>
    </main>

    <footer class="relative z-10 border-t border-emerald-900/40 bg-[#050e0b] py-6 text-center text-[11px] text-slate-500">
      © {{ new Date().getFullYear() }} MycoVision. This policy is provided for transparency and is not legal advice.
    </footer>
  </div>
</template>

<script setup lang="ts">
// Public page (no auth middleware) so it can be linked from the landing page and terms.
// Values mirror the server rules in api/app/Services/RefundPolicyService.php. Keep them in sync.
useHead({
  title: 'Refund Policy · MycoVision',
  meta: [
    { name: 'description', content: 'MycoVision refund policy: 7-day money-back guarantee, prorated annual refunds, how to request one, and how long refunds take.' },
  ],
})

const P = {
  freeScans: 3,
  monthly: 149,
  annual: '1,299',
  guaranteeDays: 7,
  scanCap: 20,
  annualDays: 30,
  annualFee: 100,
  failureHours: 72,
  replyDays: 3,
  supportEmail: 'support@mycovision.app',
}

const lastUpdated = 'October 29, 2026'

const isLoggedIn = ref(false)
onMounted(() => { isLoggedIn.value = !!localStorage.getItem('token') })
const backTo = computed(() => (isLoggedIn.value ? '/users/subscription' : '/'))

const quickFacts = [
  { value: `${P.guaranteeDays} days`, label: 'Money-back guarantee on your first Premium purchase' },
  { value: `${P.annualDays} days`, label: 'Prorated refund window for Annual plans' },
  { value: `${P.replyDays} business days`, label: 'Typical time for us to review your request' },
]

const eligible = [
  { title: `First-time purchase, ${P.guaranteeDays}-day guarantee:`, detail: `you ask within ${P.guaranteeDays} days of your first Premium payment and have used no more than ${P.scanCap} premium scans.`, refund: 'Full refund' },
  { title: 'Duplicate or accidental charge:', detail: 'you were charged twice for the same period.', refund: 'Full refund of the duplicate' },
  { title: 'Service failure:', detail: `Premium features were unavailable for ${P.failureHours}+ consecutive hours because of a problem on our side.`, refund: 'Prorated refund or free extension (your choice)' },
  { title: 'Charged after cancelling:', detail: 'a renewal went through after you had already cancelled.', refund: 'Full refund of that renewal' },
  { title: `Annual plan, after ${P.guaranteeDays} days but within ${P.annualDays} days:`, detail: '', refund: `Prorated refund for unused full months, minus a ₱${P.annualFee} processing fee` },
]
</script>

<style scoped>
.sec-title { @apply text-lg font-bold text-white mb-3; }
.link { @apply text-emerald-400 underline underline-offset-2 hover:text-emerald-300; }
</style>
