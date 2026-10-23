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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14" />
          </svg>
          <span>Back to Login</span>
        </NuxtLink>
      </div>
    </header>

    <!-- ── MAIN CONTENT ── -->
    <main class="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-lg">

        <!-- Header Text -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-4 backdrop-blur-md">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Free Account — 3 Lifetime Scans Included</span>
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight text-white">
            Join <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">MycoVision</span>
          </h1>
          <p class="text-sm text-slate-400 mt-2">Create your forager account in seconds</p>
        </div>

        <!-- Registration Card -->
        <div class="relative bg-[#0d221b]/90 border border-emerald-700/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-2xl">

          <!-- Ambient top-right glow -->
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <!-- Step Progress -->
          <div class="flex items-center gap-0 mb-7">
            <!-- Step 1 bubble -->
            <div
              class="w-8 h-8 rounded-full border-2 text-[0.78rem] font-bold flex items-center justify-center shrink-0 transition-all duration-300"
              :class="step >= 1 ? 'border-emerald-400 bg-emerald-500 text-white shadow-lg shadow-emerald-500/40' : 'border-emerald-900 text-slate-500 bg-transparent'"
            >
              <span v-if="step <= 1">1</span>
              <span v-else class="text-sm">✓</span>
            </div>
            <!-- Connector -->
            <div class="flex-1 h-[2px] bg-emerald-900/60 rounded-sm mx-2 overflow-hidden">
              <div class="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-sm transition-all duration-500 ease-in-out" :style="{ width: step > 1 ? '100%' : '0%' }" />
            </div>
            <!-- Step 2 bubble -->
            <div
              class="w-8 h-8 rounded-full border-2 text-[0.78rem] font-bold flex items-center justify-center shrink-0 transition-all duration-300"
              :class="step >= 2 ? 'border-emerald-400 bg-emerald-500 text-white shadow-lg shadow-emerald-500/40' : 'border-emerald-900 text-slate-500 bg-transparent'"
            >2</div>
          </div>

          <!-- ── STEP 1 ── -->
          <div v-if="step === 1" class="flex flex-col gap-4">

            <!-- Error Banner -->
            <div v-if="error" class="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs">
              <svg class="w-4 h-4 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{{ error }}</span>
            </div>

            <!-- Name Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="flex flex-col gap-1.5">
                <label class="text-[0.75rem] font-semibold text-slate-300 tracking-wide">First Name</label>
                <input
                  v-model="form.firstName"
                  type="text"
                  placeholder="Maria"
                  class="w-full py-2.5 px-3.5 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                  :disabled="loading"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-[0.75rem] font-semibold text-slate-300 tracking-wide">Last Name</label>
                <input
                  v-model="form.lastName"
                  type="text"
                  placeholder="Salem"
                  class="w-full py-2.5 px-3.5 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Username -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[0.75rem] font-semibold text-slate-300 tracking-wide">Username</label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">@</span>
                <input
                  v-model="form.username"
                  type="text"
                  placeholder="maria_salem"
                  class="w-full py-2.5 pl-8 pr-3.5 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Email + Contact Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="flex flex-col gap-1.5">
                <label class="text-[0.75rem] font-semibold text-slate-300 tracking-wide">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="maria@example.com"
                  class="w-full py-2.5 px-3.5 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                  :disabled="loading"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-[0.75rem] font-semibold text-slate-300 tracking-wide">Contact No.</label>
                <input
                  v-model="form.contact"
                  type="text"
                  placeholder="+63 955 123 5566"
                  class="w-full py-2.5 px-3.5 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Address -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[0.75rem] font-semibold text-slate-300 tracking-wide">Complete Address</label>
              <input
                v-model="form.address"
                type="text"
                placeholder="123 Rizal Street, Barangay San Roque..."
                class="w-full py-2.5 px-3.5 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                :disabled="loading"
              />
            </div>

            <!-- Password Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="flex flex-col gap-1.5">
                <label class="text-[0.75rem] font-semibold text-slate-300 tracking-wide">Password</label>
                <input
                  v-model="form.password"
                  type="password"
                  placeholder="••••••••"
                  class="w-full py-2.5 px-3.5 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                  :disabled="loading"
                />
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
                  <button
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-300 transition cursor-pointer"
                    type="button"
                    @click="showConfirm = !showConfirm"
                  >
                    <svg v-if="!showConfirm" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Next Button -->
            <button
              class="w-full mt-1 py-3 px-4 rounded-xl font-bold text-sm text-stone-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              @click="goNext"
            >
              <span>Continue to Review</span>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          <!-- ── STEP 2 ── -->
          <div v-if="step === 2" class="flex flex-col gap-4">
            <p class="text-xs text-slate-400">Almost there! Review your details before submitting.</p>

            <!-- Summary Card -->
            <div class="grid grid-cols-2 gap-3 bg-stone-950/60 border border-emerald-900/40 rounded-2xl py-5 px-5">
              <div class="flex flex-col gap-1">
                <span class="text-[0.68rem] uppercase tracking-[0.06em] text-emerald-400/80 font-bold">Full Name</span>
                <span class="text-sm text-white font-medium">{{ form.firstName }} {{ form.lastName }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[0.68rem] uppercase tracking-[0.06em] text-emerald-400/80 font-bold">Username</span>
                <span class="text-sm text-white font-medium">@{{ form.username }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[0.68rem] uppercase tracking-[0.06em] text-emerald-400/80 font-bold">Email</span>
                <span class="text-sm text-white font-medium break-all">{{ form.email }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[0.68rem] uppercase tracking-[0.06em] text-emerald-400/80 font-bold">Contact</span>
                <span class="text-sm text-white font-medium">{{ form.contact }}</span>
              </div>
              <div class="flex flex-col gap-1 col-span-2">
                <span class="text-[0.68rem] uppercase tracking-[0.06em] text-emerald-400/80 font-bold">Address</span>
                <span class="text-sm text-white font-medium">{{ form.address }}</span>
              </div>
            </div>

            <!-- Free Plan Badge -->
            <div class="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/30">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-semibold text-emerald-300">Free Starter Account</p>
                <p class="text-[11px] text-slate-400">3 lifetime AI mushroom scans • No credit card required</p>
              </div>
            </div>

            <!-- Error Banner -->
            <div v-if="error" class="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs">
              <svg class="w-4 h-4 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{{ error }}</span>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 mt-1">
              <button
                class="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm text-emerald-300 bg-transparent border border-emerald-700/50 hover:bg-emerald-900/30 transition cursor-pointer"
                @click="step = 1"
                :disabled="loading"
              >
                ← Back
              </button>
              <button
                class="flex-[2] py-2.5 px-4 rounded-xl font-bold text-sm text-stone-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                @click="handleRegister"
                :disabled="loading"
              >
                <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>{{ loading ? 'Creating Account…' : 'Create Free Account' }}</span>
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-6 pt-5 border-t border-emerald-900/30 text-center text-xs text-slate-400">
            Already have an account?
            <NuxtLink to="/login" class="text-emerald-400 hover:underline font-semibold ml-1">Sign in here</NuxtLink>
          </div>

        </div>
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const step = ref(1)
const showConfirm = ref(false)
const loading = ref(false)
const error = ref('')

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

const form = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  contact: '',
  address: '',
})

function goNext() {
  error.value = ''
  if (!form.firstName || !form.lastName || !form.username || !form.email || !form.contact || !form.address || !form.password || !form.confirmPassword) {
    error.value = 'Please fill out all required fields.'
    return
  }
  if (form.password.length < 8) {
    error.value = 'Password must be at least 8 characters.'
    return
  }
  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match.'
    return
  }
  step.value = 2
}

async function handleRegister() {
  error.value = ''
  loading.value = true

  try {
    const data = await $fetch<{ user: any; token: string }>(`${config.public.apiBase}/register`, {
      method: 'POST',
      body: {
        first_name: form.firstName,
        last_name: form.lastName,
        username: form.username,
        email: form.email,
        contact_number: form.contact,
        address: form.address,
        password: form.password,
        password_confirmation: form.confirmPassword,
      },
    })

    // Persist auth data
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('role', data.user.role)

    await navigateTo('/users/scan')
  } catch (err: any) {
    let msg = err?.data?.message || 'Registration failed.'
    if (err?.data?.errors) {
      const firstErrorKey = Object.keys(err.data.errors)[0]
      if (firstErrorKey) {
        msg = err.data.errors[firstErrorKey][0]
      }
    }
    error.value = msg
    step.value = 1 // Go back to step 1 to let them fix the error
  } finally {
    loading.value = false
  }
}
</script>