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
      <div class="w-full max-w-[420px]">

        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-4 backdrop-blur-md">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Account Recovery</span>
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight text-white">Forgot your password?</h1>
          <p class="text-sm text-slate-400 mt-2">Enter your email and we'll send you a reset link.</p>
        </div>

        <!-- Card -->
        <div class="relative bg-[#0d221b]/90 border border-emerald-700/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-2xl">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <!-- Error banner -->
          <div v-if="error" class="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs">
            <svg class="w-4 h-4 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{{ error }}</span>
          </div>

          <!-- Success state -->
          <div v-if="sent" class="flex flex-col items-center gap-4 py-6 text-center">
            <div class="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-semibold text-white">Check your inbox</p>
              <p class="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto">If an account exists for <span class="text-emerald-300 break-all">{{ form.email }}</span>, a password reset link is on its way. The link expires in 60 minutes.</p>
            </div>
            <NuxtLink to="/login" class="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:underline">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Login
            </NuxtLink>
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div class="relative">
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="e.g. forager@example.com"
                  class="w-full py-2.5 pl-10 pr-4 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                  :disabled="loading"
                  @keyup.enter="handleSubmit"
                />
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" /></svg>
                </div>
              </div>
            </div>

            <button type="submit" :disabled="loading" class="w-full py-3 px-4 rounded-xl font-bold text-sm text-stone-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2">
              <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
              <span>{{ loading ? 'Sending…' : 'Send reset link' }}</span>
            </button>
          </form>

          <div class="mt-6 pt-5 border-t border-emerald-900/30 text-center text-xs text-slate-400">
            Remembered it?
            <NuxtLink to="/login" class="text-emerald-400 hover:underline font-semibold ml-1">Back to login</NuxtLink>
          </div>
        </div>
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const loading = ref(false)
const error = ref('')
const sent = ref(false)
const form = reactive({ email: '' })

useHead({ title: 'Forgot Password — MycoVision' })

async function handleSubmit() {
  error.value = ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    error.value = 'Please enter a valid email address.'
    return
  }
  loading.value = true
  try {
    await $fetch(`${config.public.apiBase}/forgot-password`, {
      method: 'POST',
      body: { email: form.email.trim() },
    })
    sent.value = true
  } catch (err: any) {
    error.value = err?.data?.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
