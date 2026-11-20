<template>
  <div class="min-h-screen bg-[#07130f] text-slate-100 font-sans flex flex-col justify-center items-center p-4 relative overflow-hidden">
    <!-- Ambient Background Glow -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute -top-40 -left-40 w-[500px] h-[500px] bg-amber-600/12 rounded-full blur-[140px]" />
      <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-600/12 rounded-full blur-[160px]" />
      <div class="absolute inset-0 bg-[radial-gradient(#15382b_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
    </div>

    <div class="relative z-10 w-full max-w-md">
      <!-- Brand Header -->
      <div class="flex flex-col items-center mb-6 text-center">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-amber-950/50 mb-3">
          <svg class="w-7 h-7 text-stone-950" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C7.03 2 3 6.03 3 11c0 1.25.26 2.44.73 3.52C4.1 15.35 4.8 16 5.6 16h12.8c.8 0 1.5-.65 1.87-1.48.47-1.08.73-2.27.73-3.52 0-4.97-4.03-9-9-9zm-1.5 15h3v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-5z" />
          </svg>
        </div>
        <span class="text-2xl font-bold tracking-tight text-white">
          Myco<span class="text-emerald-400">Vision</span>
        </span>
        <span class="text-[11px] tracking-widest uppercase text-amber-400 font-bold mt-1">
          Staff &amp; Administrator Console
        </span>
      </div>

      <!-- Admin Login Card -->
      <div class="bg-[#0d221b]/95 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-2xl">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h1 class="text-xl font-bold text-white">Administrator Sign In</h1>
            <p class="text-xs text-slate-300 mt-1">
              Restricted portal for authorized administrators and curatorial staff.
            </p>
          </div>
          <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-900/60 text-amber-300 border border-amber-700/40 shrink-0">
            Admin Only
          </span>
        </div>

        <!-- Error Alert -->
        <div v-if="loginError" class="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-start gap-2">
          <svg class="w-4 h-4 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div class="flex-1 min-w-0">
            <p>{{ loginError }}</p>
            <NuxtLink
              v-if="unverifiedEmail"
              :to="`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`"
              class="inline-block mt-1.5 font-semibold text-amber-300 hover:text-amber-200 underline"
            >
              Resend verification link →
            </NuxtLink>
          </div>
        </div>

        <form @submit.prevent="handleAdminLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">
              Administrator Email
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="admin@mycovision.com"
              class="w-full py-2.5 px-3.5 rounded-xl bg-stone-950/80 border border-amber-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition"
              :disabled="isSubmitting"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="w-full py-2.5 pl-3.5 pr-10 rounded-xl bg-stone-950/80 border border-amber-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition"
                :disabled="isSubmitting"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer bg-transparent border-none"
              >
                <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex justify-end -mt-1">
            <NuxtLink
              to="/forgot-password"
              class="text-[12.5px] text-amber-400 hover:text-amber-300 hover:underline font-semibold transition-colors"
            >
              Forgot password?
            </NuxtLink>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full py-3 px-4 rounded-xl font-bold text-sm text-stone-950 transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 shadow-amber-500/20 disabled:opacity-60"
          >
            <svg v-if="isSubmitting" class="w-4 h-4 animate-spin text-stone-950" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>{{ isSubmitting ? 'Authenticating...' : 'Enter Admin Console' }}</span>
          </button>
        </form>

        <div class="mt-6 pt-5 border-t border-emerald-900/40 flex items-center justify-between text-xs text-slate-400">
          <NuxtLink to="/" class="text-emerald-400 hover:underline font-semibold">
            ← Back to Forager Portal
          </NuxtLink>
          <span class="text-[11px] text-slate-500">Admin Console</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: [],
})

useHead({
  title: 'Admin Login — MycoVision Staff Console',
})

const config = useRuntimeConfig()
const { getToken, setSession, restoreAndValidateSession } = useAuthSession()

const form = reactive({
  email: '',
  password: '',
})
const showPassword = ref(false)
const isSubmitting = ref(false)
const loginError = ref('')
const unverifiedEmail = ref('')

onMounted(async () => {
  if (!getToken()) return
  const user = await restoreAndValidateSession()
  if (user && (user.role === 'admin' || user.role === 'super_admin')) {
    await navigateTo('/admin/dashboard', { replace: true })
  }
})

async function handleAdminLogin() {
  loginError.value = ''
  unverifiedEmail.value = ''

  if (!form.email || !form.password) {
    loginError.value = 'Please enter both your administrator email and password.'
    return
  }

  isSubmitting.value = true
  try {
    const data = await $fetch<{ user: any; token: string }>(`${config.public.apiBase}/admin/login`, {
      method: 'POST',
      body: {
        email: form.email,
        password: form.password,
      },
    })

    if (data.user?.role !== 'admin' && data.user?.role !== 'super_admin') {
      loginError.value = 'Access denied. Regular user accounts cannot sign in through the Admin Portal.'
      return
    }

    setSession(data.token, data.user)
    await navigateTo('/admin/dashboard')
  } catch (err: any) {
    if (err?.data?.error === 'EMAIL_NOT_VERIFIED') {
      unverifiedEmail.value = err?.data?.email || form.email.trim()
    }
    const msg = err?.data?.message || err?.data?.errors?.email?.[0]
    loginError.value = msg || 'Invalid administrator credentials. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
