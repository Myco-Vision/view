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

        <NuxtLink
          to="/"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/40 transition"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Home</span>
        </NuxtLink>
      </div>
    </header>

    <!-- ── MAIN CONTENT ── -->
    <main class="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-[420px]">

        <!-- Header Text -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-4 backdrop-blur-md">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Secure Member Portal</span>
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight text-white">
            Welcome back to <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">MycoVision</span>
          </h1>
          <p class="text-sm text-slate-400 mt-2">Sign in as a Forager or Administrator</p>
        </div>

        <!-- Login Card -->
        <div class="relative bg-[#0d221b]/90 border border-emerald-700/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-2xl">

          <!-- Ambient card glow -->
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <!-- Role Selector Tabs -->
          <div class="flex items-center p-1 bg-stone-950/70 rounded-2xl border border-emerald-900/50 mb-6">
            <button
              type="button"
              @click="activeRole = 'user'; error = ''"
              :class="activeRole === 'user'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                : 'text-slate-400 hover:text-slate-200'"
              class="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Forager / User</span>
            </button>
            <button
              type="button"
              @click="activeRole = 'admin'; error = ''"
              :class="activeRole === 'admin'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/50'
                : 'text-slate-400 hover:text-slate-200'"
              class="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Admin &amp; Staff</span>
            </button>
          </div>

          <!-- Role context label -->
          <div class="mb-5">
            <div class="flex items-center justify-between">
              <h2 class="text-base font-bold text-white">
                <span v-if="activeRole === 'user'">Forager Sign In</span>
                <span v-else class="text-amber-300">Administrator Portal</span>
              </h2>
              <span
                class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                :class="activeRole === 'user'
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/40'
                  : 'bg-amber-900/60 text-amber-300 border border-amber-700/40'"
              >
                {{ activeRole === 'user' ? 'Member Portal' : 'Secure Admin' }}
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-1">
              {{ activeRole === 'user'
                ? 'Scan mushrooms, view history, and manage your subscription.'
                : 'Access dataset moderation, species taxonomy, and user metrics.' }}
            </p>
          </div>

          <!-- Error Banner -->
          <div v-if="error" class="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs">
            <svg class="w-4 h-4 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{{ error }}</span>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleLogin" class="space-y-4">
            <!-- Email -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div class="relative">
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="e.g. forager@example.com"
                  class="w-full py-2.5 pl-10 pr-4 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                  :disabled="loading"
                />
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="w-full py-2.5 pl-10 pr-10 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                  :disabled="loading"
                  @keyup.enter="handleLogin"
                />
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-300 transition cursor-pointer"
                >
                  <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
            </div>

            <!-- Forgot password link -->
            <div class="flex justify-end -mt-1 mb-3">
              <NuxtLink to="/forgot-password" class="text-[11px] text-emerald-400 hover:underline font-semibold">Forgot password?</NuxtLink>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 px-4 rounded-xl font-bold text-sm text-stone-950 transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              :class="activeRole === 'user'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-emerald-500/20'
                : 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 shadow-amber-500/20'"
            >
              <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>{{ loading ? 'Authenticating…' : (activeRole === 'user' ? 'Login as Forager' : 'Enter Admin Console') }}</span>
            </button>
          </form>

          <!-- Google Sign-In (User only) -->
          <div v-if="activeRole === 'user'" class="mt-4">
            <!-- Divider -->
            <div class="flex items-center gap-3 my-1">
              <div class="flex-1 h-px bg-emerald-900/50" />
              <span class="text-[11px] text-slate-500 font-medium">or continue with</span>
              <div class="flex-1 h-px bg-emerald-900/50" />
            </div>

            <!-- Custom themed Google button -->
            <button
              type="button"
              @click="handleGoogleLogin"
              :disabled="googleLoading"
              class="mt-3 w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 border bg-[#0d1f19] hover:bg-emerald-950/80 border-emerald-700/50 hover:border-emerald-500/60 text-slate-200 hover:text-white shadow-sm hover:shadow-emerald-900/30 hover:shadow-md"
            >
              <svg v-if="googleLoading" class="w-4 h-4 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <svg v-else viewBox="0 0 24 24" class="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>{{ googleLoading ? 'Signing in…' : 'Sign in with Google' }}</span>
            </button>
          </div>

          <!-- Footer -->
          <div class="mt-6 pt-5 border-t border-emerald-900/30 flex items-center justify-between text-xs text-slate-400">
            <span v-if="activeRole === 'user'">
              New to MycoVision?
              <NuxtLink to="/register" class="text-emerald-400 hover:underline font-semibold ml-1">Create free account</NuxtLink>
            </span>
            <span v-else class="text-amber-300/80 font-medium">
              Need admin access? Contact Super Admin
            </span>
            <span class="text-[10px] text-slate-600">v2.4 Core</span>
          </div>

        </div>
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const activeRole  = ref<'user' | 'admin'>('user')
const showPassword = ref(false)
const loading     = ref(false)
const googleLoading = ref(false)
const error       = ref('')

const form = reactive({ email: '', password: '' })

// Load Google Identity Services script
useHead({
  script: [
    {
      src: 'https://accounts.google.com/gsi/client',
      async: true,
      defer: true,
    },
  ],
})

// Redirect if already logged in
onMounted(() => {
  const token = localStorage.getItem('token')
  const role  = localStorage.getItem('role')
  if (token) {
    if (role === 'admin' || role === 'super_admin') {
      navigateTo('/admin/dashboard')
    } else {
      navigateTo('/users/scan')
    }
  }
})

// Custom Google button — opens Google account picker popup on click
function handleGoogleLogin() {
  error.value = ''
  const gsi = (window as any).google
  if (!gsi) {
    error.value = 'Google Sign-In is not available. Please refresh and try again.'
    return
  }
  const tokenClient = gsi.accounts.oauth2.initTokenClient({
    client_id: config.public.googleClientId,
    scope: 'email profile',
    prompt: 'select_account',
    callback: async (resp: any) => {
      if (resp.error) {
        error.value = 'Google sign-in was cancelled or failed.'
        googleLoading.value = false
        return
      }
      await processGoogleToken(resp.access_token)
    },
  })
  googleLoading.value = true
  tokenClient.requestAccessToken()
}

async function handleLogin() {
  error.value = ''

  if (!form.email || !form.password) {
    error.value = 'Please fill in all fields.'
    return
  }

  loading.value = true
  try {
    const data = await $fetch<{ user: any; token: string }>(`${config.public.apiBase}/login`, {
      method: 'POST',
      body: { email: form.email, password: form.password },
    })

    // Persist auth data
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('role', data.user.role)

    // Redirect based on role
    if (data.user.role === 'admin' || data.user.role === 'super_admin') {
      await navigateTo('/admin/dashboard')
    } else {
      await navigateTo('/users/scan')
    }
  } catch (err: any) {
    const msg = err?.data?.message || err?.data?.errors?.email?.[0]
    error.value = msg || 'Invalid email or password.'
  } finally {
    loading.value = false
  }
}


async function processGoogleToken(accessToken: string) {
  googleLoading.value = true
  error.value = ''
  try {
    const data = await $fetch<{ user: any; token: string; needs_completion: boolean }>(`${config.public.apiBase}/auth/google`, {
      method: 'POST',
      body: { access_token: accessToken },
    })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('role', data.user.role)

    // Gate: force profile completion for new / incomplete Google accounts
    if (data.needs_completion) {
      await navigateTo('/complete-profile', { external: true })
      return
    }

    // Full-page redirect (not a client-side route change): the Google popup callback runs outside
    // Vue's lifecycle, so an SPA transition left the old page stuck under the new layout.
    const isAdmin = data.user.role === 'admin' || data.user.role === 'super_admin'
    await navigateTo(isAdmin ? '/admin/dashboard' : '/users/scan', { external: true })
  } catch (err: any) {
    error.value = err?.data?.message || 'Google sign-in failed. Please try again.'
  } finally {
    googleLoading.value = false
  }
}
</script>