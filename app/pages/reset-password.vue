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
      <div class="w-full max-w-[460px]">

        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-4 backdrop-blur-md">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Set a New Password</span>
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight text-white">Reset your password</h1>
          <p class="text-sm text-slate-400 mt-2">Choose a new password for your MycoVision account.</p>
        </div>

        <!-- Card -->
        <div class="relative bg-[#0d221b]/90 border border-emerald-700/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-2xl">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <!-- Invalid / missing token -->
          <div v-if="!hasToken" class="flex flex-col items-center gap-4 py-6 text-center">
            <div class="w-14 h-14 rounded-2xl bg-red-500/15 flex items-center justify-center text-red-400">
              <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-white">This reset link is missing or invalid</p>
              <p class="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto">The link may have expired or was opened without the required token. Request a new one below.</p>
            </div>
            <NuxtLink to="/forgot-password" class="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-stone-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition cursor-pointer">
              Request a new link
            </NuxtLink>
          </div>

          <!-- Success state -->
          <div v-else-if="done" class="flex flex-col items-center gap-4 py-6 text-center">
            <div class="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-white">Password updated</p>
              <p class="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto">Your password has been changed. You can now sign in with your new password.</p>
            </div>
            <button type="button" @click="navigateTo('/login')" class="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-stone-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition cursor-pointer">
              Continue to Login
            </button>
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="handleSubmit" class="flex flex-col gap-4">

            <!-- Account (read-only) -->
            <div class="flex items-center gap-2.5 p-3 rounded-xl bg-stone-950/70 border border-emerald-900/50">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" /></svg>
              </div>
              <div class="min-w-0">
                <p class="text-[0.68rem] uppercase tracking-[0.06em] text-emerald-400/80 font-bold">Resetting account</p>
                <p class="text-sm text-white font-medium break-all">{{ email || '—' }}</p>
              </div>
            </div>

            <!-- Error banner -->
            <div v-if="error" class="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs">
              <svg class="w-4 h-4 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>{{ error }}</span>
            </div>

            <!-- New Password -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="flex flex-col gap-1.5">
                <label class="text-[0.75rem] font-semibold text-slate-300 tracking-wide">New Password</label>
                <div class="relative">
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    class="w-full py-2.5 pl-3.5 pr-10 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                    :disabled="loading"
                  />
                  <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-300 transition cursor-pointer" @click="showPassword = !showPassword">
                    <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </button>
                </div>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-[0.75rem] font-semibold text-slate-300 tracking-wide">Confirm Password</label>
                <div class="relative">
                  <input
                    v-model="form.confirmPassword"
                    :type="showConfirm ? 'text' : 'password'"
                    placeholder="••••••••"
                    class="w-full py-2.5 pl-3.5 pr-10 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                    :disabled="loading"
                  />
                  <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-300 transition cursor-pointer" @click="showConfirm = !showConfirm">
                    <svg v-if="!showConfirm" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Password requirements -->
            <div class="p-3 rounded-xl bg-stone-950/70 border border-emerald-900/50 flex flex-col gap-2">
              <p class="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <svg class="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Password Requirements
              </p>
              <div class="grid grid-cols-2 gap-1.5">
                <span class="flex items-center gap-1.5 text-[0.7rem] font-medium transition-colors" :class="rules.len ? 'text-emerald-400' : 'text-slate-500'">
                  <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="rules.len ? 'bg-emerald-400' : 'bg-slate-600'" />At least 8 characters
                </span>
                <span class="flex items-center gap-1.5 text-[0.7rem] font-medium transition-colors" :class="rules.upper ? 'text-emerald-400' : 'text-slate-500'">
                  <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="rules.upper ? 'bg-emerald-400' : 'bg-slate-600'" />One uppercase (A–Z)
                </span>
                <span class="flex items-center gap-1.5 text-[0.7rem] font-medium transition-colors" :class="rules.number ? 'text-emerald-400' : 'text-slate-500'">
                  <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="rules.number ? 'bg-emerald-400' : 'bg-slate-600'" />One number (0–9)
                </span>
                <span class="flex items-center gap-1.5 text-[0.7rem] font-medium transition-colors" :class="rules.special ? 'text-emerald-400' : 'text-slate-500'">
                  <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="rules.special ? 'bg-emerald-400' : 'bg-slate-600'" />One special (!@#$…)
                </span>
              </div>
            </div>

            <button type="submit" :disabled="loading" class="w-full py-3 px-4 rounded-xl font-bold text-sm text-stone-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
              <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
              <span>{{ loading ? 'Updating…' : 'Update password' }}</span>
            </button>
          </form>
        </div>
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()

const token = computed(() => (route.query.token as string) || '')
const email = computed(() => (route.query.email as string) || '')
const hasToken = computed(() => !!token.value)

const loading = ref(false)
const done = ref(false)
const error = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)

const form = reactive({ password: '', confirmPassword: '' })

useHead({ title: 'Reset Password — MycoVision' })

const rules = computed(() => ({
  len: form.password.length >= 8,
  upper: /[A-Z]/.test(form.password),
  number: /[0-9]/.test(form.password),
  special: /[^A-Za-z0-9]/.test(form.password),
}))

async function handleSubmit() {
  error.value = ''
  if (!rules.value.len) { error.value = 'Password must be at least 8 characters.'; return }
  if (!rules.value.upper) { error.value = 'Password must contain at least one uppercase letter (A–Z).'; return }
  if (!rules.value.number) { error.value = 'Password must contain at least one number (0–9).'; return }
  if (!rules.value.special) { error.value = 'Password must contain at least one special character (e.g. !@#$%).' ; return }
  if (form.password !== form.confirmPassword) { error.value = 'Passwords do not match.'; return }

  loading.value = true
  try {
    await $fetch(`${config.public.apiBase}/reset-password`, {
      method: 'POST',
      body: {
        token: token.value,
        email: email.value,
        password: form.password,
        password_confirmation: form.confirmPassword,
      },
    })
    done.value = true
  } catch (err: any) {
    error.value = err?.data?.message || err?.data?.errors?.password?.[0] || 'Reset failed. The link may have expired.'
  } finally {
    loading.value = false
  }
}
</script>
