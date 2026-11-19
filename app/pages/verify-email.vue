<template>
  <div class="min-h-screen bg-[#07130f] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden flex flex-col">

    <!-- ── AMBIENT BACKGROUND GLOW ── -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-[140px]" />
      <div class="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[160px]" />
      <div class="absolute -bottom-40 left-1/3 w-[700px] h-[700px] bg-emerald-800/15 rounded-full blur-[180px]" />
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
          <div class="flex flex-col">
            <span class="text-lg font-bold tracking-tight text-white">Myco<span class="text-emerald-400">Vision</span></span>
            <span class="text-[9px] tracking-wider uppercase text-emerald-400/80 font-semibold">AI Mushroom Intelligence</span>
          </div>
        </NuxtLink>
        <NuxtLink to="/login" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/40 transition">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Login</span>
        </NuxtLink>
      </div>
    </header>

    <!-- ── MAIN CONTENT ── -->
    <main class="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-[440px]">

        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-4 backdrop-blur-md">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Email Verification</span>
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight text-white">
            {{ isVerifyAttempt ? (verified ? 'Email Verified!' : (verifyError ? 'Verification Failed' : 'Verifying Email…')) : 'Check Your Inbox' }}
          </h1>
          <p class="text-sm text-slate-400 mt-2">
            {{ isVerifyAttempt
              ? 'Confirming your MycoVision email ownership.'
              : 'Verify your legitimate email address to activate your account.' }}
          </p>
        </div>

        <div class="relative bg-[#0d221b]/90 border border-emerald-700/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-2xl">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <!-- Mode 1: Verifying link -->
          <div v-if="verifying" class="flex flex-col items-center gap-4 py-8 text-center">
            <svg class="w-10 h-10 text-emerald-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p class="text-sm text-slate-300">Verifying your email link…</p>
          </div>

          <!-- Mode 2: Verified success -->
          <div v-else-if="verified" class="flex flex-col items-center gap-4 py-6 text-center">
            <div class="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-white">Your email has been verified!</p>
              <p class="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto">{{ successMessage }}</p>
            </div>
            <button
              type="button"
              @click="goToApp"
              class="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-stone-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <span>Continue to Forager Portal</span>
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>

          <!-- Mode 3: Pending verification or link error -->
          <div v-else class="flex flex-col gap-4">
            <div v-if="verifyError" class="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs">
              <svg class="w-4 h-4 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{{ verifyError }}</span>
            </div>

            <div v-else class="flex flex-col items-center gap-3 py-3 text-center">
              <div class="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p class="text-sm font-semibold text-white">Verification link sent</p>
              <p class="text-xs text-slate-400 leading-relaxed">
                We sent a verification link
                <template v-if="emailInput"> to <span class="text-emerald-300 break-all font-medium">{{ emailInput }}</span></template>.
                Open the email and click the verification button to activate your account (valid for 60 minutes). Check Spam/Promotions if you don't see it.
              </p>
            </div>

            <div v-if="resendSuccess" class="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs">
              {{ resendSuccess }}
            </div>
            <div v-if="resendError" class="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs">
              {{ resendError }}
            </div>

            <form @submit.prevent="handleResend" class="space-y-3 pt-2 border-t border-emerald-900/30">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <input
                  v-model="emailInput"
                  type="email"
                  required
                  placeholder="e.g. forager@gmail.com"
                  class="w-full py-2.5 px-3.5 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                  :disabled="resending"
                />
              </div>

              <button
                type="submit"
                :disabled="resending || cooldown > 0"
                class="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-stone-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="resending" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                <span>
                  {{ resending ? 'Sending…' : (cooldown > 0 ? `Resend available in ${cooldown}s` : 'Resend Verification Email') }}
                </span>
              </button>
            </form>

            <div class="pt-3 text-center text-xs text-slate-400">
              Already verified?
              <NuxtLink to="/login" class="text-emerald-400 hover:underline font-semibold ml-1">Sign in here</NuxtLink>
            </div>
          </div>

        </div>
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()
const { setSession } = useAuthSession()

const emailInput = ref((route.query.email as string) || '')
const verifying = ref(false)
const verified = ref(false)
const verifyError = ref('')
const successMessage = ref('Your account is now active. You can start scanning mushrooms!')

const resending = ref(false)
const resendSuccess = ref('')
const resendError = ref('')
const cooldown = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null

const isVerifyAttempt = computed(() =>
  Boolean(route.query.id && route.query.hash && route.query.expires && route.query.signature)
)

useHead({ title: 'Verify Email — MycoVision' })

function startCooldown(seconds = 60) {
  cooldown.value = seconds
  if (cooldownTimer) clearInterval(cooldownTimer)
  cooldownTimer = setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
}

onMounted(async () => {
  if (!isVerifyAttempt.value) return
  verifying.value = true
  try {
    const id = encodeURIComponent(String(route.query.id))
    const hash = encodeURIComponent(String(route.query.hash))
    const data = await $fetch<{ message: string; user?: any; token?: string }>(
      `${config.public.apiBase}/email/verify/${id}/${hash}`,
      {
        query: {
          expires: route.query.expires,
          signature: route.query.signature,
        },
      }
    )
    if (data.token && data.user) {
      setSession(data.token, data.user)
    }
    if (data.message) successMessage.value = data.message
    verified.value = true
  } catch (err: any) {
    verifyError.value = err?.data?.message || 'This verification link is invalid or has expired.'
  } finally {
    verifying.value = false
  }
})

onBeforeUnmount(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})

async function handleResend() {
  resendSuccess.value = ''
  resendError.value = ''
  const target = emailInput.value.trim()
  if (!target) {
    resendError.value = 'Please enter your registered email address.'
    return
  }

  resending.value = true
  try {
    const res = await $fetch<{ message: string }>(`${config.public.apiBase}/email/verification-notification`, {
      method: 'POST',
      body: { email: target },
    })
    resendSuccess.value = res.message || 'Verification email sent. Please check your inbox.'
    startCooldown(60)
  } catch (err: any) {
    resendError.value = err?.data?.errors?.email?.[0] || err?.data?.message || 'Could not send verification email.'
  } finally {
    resending.value = false
  }
}

async function goToApp() {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  if (token) {
    if (role === 'admin' || role === 'super_admin') {
      await navigateTo('/admin/dashboard')
    } else {
      await navigateTo('/users/scan')
    }
    return
  }
  await navigateTo('/login')
}
</script>

