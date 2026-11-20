<template>
  <div class="min-h-screen bg-[#07130f] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden flex flex-col">
    <!-- Ambient Background Glow -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute -top-40 -left-40 w-[600px] h-[600px] bg-amber-600/12 rounded-full blur-[140px]" />
      <div class="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px]" />
      <div class="absolute inset-0 bg-[radial-gradient(#15382b_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
    </div>

    <!-- Navbar -->
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
        <NuxtLink to="/" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/40 transition">
          <span>Back to Home</span>
        </NuxtLink>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-[440px]">
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-xs font-medium mb-4 backdrop-blur-md">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Account Archive Authorization</span>
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight text-white">
            {{ verifying ? 'Authorizing Archive…' : (archived ? 'Account Archived' : 'Authorization Failed') }}
          </h1>
          <p class="text-sm text-slate-400 mt-2">
            Confirming your email authorization to archive your MycoVision account.
          </p>
        </div>

        <div class="relative bg-[#0d221b]/90 border border-emerald-700/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-2xl text-center">
          <!-- Loading -->
          <div v-if="verifying" class="flex flex-col items-center gap-4 py-8">
            <svg class="w-10 h-10 text-amber-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p class="text-sm text-slate-300">Verifying your archive authorization link…</p>
          </div>

          <!-- Success -->
          <div v-else-if="archived" class="flex flex-col items-center gap-4 py-6">
            <div class="w-14 h-14 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-400">
              <AppIcon name="archive" class="w-7 h-7" />
            </div>
            <div>
              <p class="text-sm font-semibold text-white">Your account has been archived</p>
              <p class="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
                {{ statusMessage }}
              </p>
            </div>
            <NuxtLink
              to="/"
              class="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-stone-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <span>Return to Home Page</span>
            </NuxtLink>
          </div>

          <!-- Error -->
          <div v-else class="flex flex-col items-center gap-4 py-4">
            <div class="w-14 h-14 rounded-2xl bg-red-500/15 flex items-center justify-center text-red-400">
              <AppIcon name="warning" class="w-7 h-7" />
            </div>
            <div>
              <p class="text-sm font-semibold text-white">Unable to Archive Account</p>
              <p class="text-xs text-red-300 mt-1.5 max-w-xs mx-auto leading-relaxed">
                {{ verifyError || 'This archive authorization link is invalid or has expired.' }}
              </p>
            </div>
            <NuxtLink
              to="/users/settings"
              class="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 transition cursor-pointer"
            >
              <span>Back to Account Settings</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: [],
})

useHead({ title: 'Confirm Account Archive — MycoVision' })

const config = useRuntimeConfig()
const route = useRoute()
const { clearSession } = useAuthSession()

const verifying = ref(true)
const archived = ref(false)
const verifyError = ref('')
const statusMessage = ref('Your account has been verified and archived. Your scans and records remain safely preserved.')

onMounted(async () => {
  const id = route.query.id
  const hash = route.query.hash
  const expires = route.query.expires
  const signature = route.query.signature

  if (!id || !hash || !expires || !signature) {
    verifying.value = false
    verifyError.value = 'Missing authorization parameters. Please request a new archive verification link from your Account Settings.'
    return
  }

  try {
    const res = await $fetch<{ message?: string; archived?: boolean }>(
      `${config.public.apiBase}/user/archive/verify/${encodeURIComponent(String(id))}/${encodeURIComponent(String(hash))}`,
      {
        query: {
          expires,
          signature,
        },
      }
    )
    clearSession()
    if (res?.message) statusMessage.value = res.message
    archived.value = true
  } catch (err: any) {
    verifyError.value = err?.data?.message || 'This archive authorization link is invalid or has expired.'
  } finally {
    verifying.value = false
  }
})
</script>
