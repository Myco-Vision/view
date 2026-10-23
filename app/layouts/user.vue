<template>
  <div class="flex h-screen bg-[#07130f] overflow-hidden font-sans relative">

    <!-- ── Background ambient glows ── -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px]" />
      <div class="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-500/8 rounded-full blur-[160px]" />
      <div class="absolute inset-0 bg-[radial-gradient(#15382b_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.12]" />
    </div>

    <!-- ── Mobile Overlay ── -->
    <div
      v-if="mobileOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
      @click="mobileOpen = false"
    />

    <!-- ── Sidebar ── -->
    <aside
      class="w-[230px] min-w-[230px] relative z-40 flex flex-col pt-5 pb-4 px-3 gap-1
             bg-[#081712]/95 border-r border-emerald-900/40 backdrop-blur-xl
             fixed inset-y-0 left-0 transition-transform duration-300
             lg:static lg:translate-x-0"
      :class="mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <!-- Brand -->
      <div class="flex items-center gap-2.5 px-2 pb-4 border-b border-emerald-900/40 mb-2">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/50 shrink-0">
          <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C7.03 2 3 6.03 3 11c0 1.25.26 2.44.73 3.52C4.1 15.35 4.8 16 5.6 16h12.8c.8 0 1.5-.65 1.87-1.48.47-1.08.73-2.27.73-3.52 0-4.97-4.03-9-9-9zm-1.5 15h3v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-5z" />
          </svg>
        </div>
        <div class="flex flex-col flex-1 min-w-0">
          <span class="text-[15px] font-bold text-white tracking-tight">Myco<span class="text-emerald-400">Vision</span></span>
          <span class="text-[9px] tracking-wider uppercase text-emerald-400/70 font-semibold">Forager Portal</span>
        </div>
        <!-- Mobile close -->
        <button @click="mobileOpen = false" class="lg:hidden bg-transparent border-none cursor-pointer text-slate-400 p-1 rounded-md flex items-center hover:text-white">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 flex flex-col gap-0.5">
        <NuxtLink
          to="/users/scan"
          @click="mobileOpen = false"
          class="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-slate-400 no-underline text-[13px] font-medium transition-all duration-200 hover:bg-emerald-900/30 hover:text-emerald-300"
          active-class="!bg-emerald-600/20 !text-emerald-300 !border !border-emerald-500/30 shadow-sm"
        >
          <span class="flex items-center justify-center shrink-0 w-4 h-4">
            <svg class="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </span>
          <span class="whitespace-nowrap">Scan Mushroom</span>
        </NuxtLink>

        <NuxtLink
          to="/users/history"
          @click="mobileOpen = false"
          class="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-slate-400 no-underline text-[13px] font-medium transition-all duration-200 hover:bg-emerald-900/30 hover:text-emerald-300"
          active-class="!bg-emerald-600/20 !text-emerald-300 !border !border-emerald-500/30 shadow-sm"
        >
          <span class="flex items-center justify-center shrink-0 w-4 h-4">
            <svg class="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </span>
          <span class="whitespace-nowrap">Scan History</span>
        </NuxtLink>

        <NuxtLink
          to="/users/collection"
          @click="mobileOpen = false"
          class="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-slate-400 no-underline text-[13px] font-medium transition-all duration-200 hover:bg-emerald-900/30 hover:text-emerald-300"
          active-class="!bg-emerald-600/20 !text-emerald-300 !border !border-emerald-500/30 shadow-sm"
        >
          <span class="flex items-center justify-center shrink-0 w-4 h-4">
            <svg class="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
          </span>
          <span class="whitespace-nowrap">Collection</span>
        </NuxtLink>

        <NuxtLink
          to="/users/subscription"
          @click="mobileOpen = false"
          class="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-slate-400 no-underline text-[13px] font-medium transition-all duration-200 hover:bg-emerald-900/30 hover:text-emerald-300"
          active-class="!bg-emerald-600/20 !text-emerald-300 !border !border-emerald-500/30 shadow-sm"
        >
          <span class="flex items-center justify-center shrink-0 w-4 h-4">
            <svg class="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          </span>
          <span class="whitespace-nowrap flex-1">Subscription</span>
          <span v-if="isSubscribed" class="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">PRO</span>
          <span v-else-if="remainingScans !== null" class="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/20">{{ remainingScans }}/3</span>
        </NuxtLink>

        <NuxtLink
          to="/users/settings"
          @click="mobileOpen = false"
          class="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-slate-400 no-underline text-[13px] font-medium transition-all duration-200 hover:bg-emerald-900/30 hover:text-emerald-300"
          active-class="!bg-emerald-600/20 !text-emerald-300 !border !border-emerald-500/30 shadow-sm"
        >
          <span class="flex items-center justify-center shrink-0 w-4 h-4">
            <svg class="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15 1.65 1.65 0 0 0 3.17 14H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68 1.65 1.65 0 0 0 10 3.17V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9 1.65 1.65 0 0 0 20.83 10H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </span>
          <span class="whitespace-nowrap">Settings</span>
        </NuxtLink>
      </nav>

      <!-- Footer: User + Logout -->
      <div class="flex flex-col gap-1.5 pt-3 border-t border-emerald-900/40 mt-1">
        <!-- User info -->
        <div class="flex items-center gap-2.5 py-2 px-2.5 rounded-xl bg-emerald-950/40 border border-emerald-900/30">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center text-xs font-bold overflow-hidden shrink-0 shadow-md">
            <img v-if="userAvatar" :src="userAvatar" alt="User avatar" class="w-full h-full object-cover" />
            <span v-else>{{ userInitials }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <span class="text-[12.5px] font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis block">{{ userName }}</span>
            <span class="text-[10px] text-emerald-400/80">{{ isSubscribed ? 'Premium Member' : 'Free Tier' }}</span>
          </div>
        </div>

        <!-- Logout -->
        <button
          class="flex items-center gap-2.5 py-2 px-3 rounded-xl bg-transparent border-none cursor-pointer text-slate-400 text-[13px] font-medium font-sans transition-all duration-200 w-full text-left hover:bg-red-950/40 hover:text-red-400"
          @click="handleLogout"
        >
          <svg class="w-[15px] h-[15px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- ── Main Content ── -->
    <div class="flex-1 flex flex-col overflow-hidden min-w-0 relative z-10">
      <!-- Mobile topbar -->
      <header class="lg:hidden h-14 bg-[#081712]/90 border-b border-emerald-900/40 backdrop-blur-xl flex items-center px-4 gap-3 shrink-0">
        <button @click="mobileOpen = true" class="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-800/40 cursor-pointer flex items-center justify-center text-slate-300 hover:text-white transition">
          <svg class="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C7.03 2 3 6.03 3 11c0 1.25.26 2.44.73 3.52C4.1 15.35 4.8 16 5.6 16h12.8c.8 0 1.5-.65 1.87-1.48.47-1.08.73-2.27.73-3.52 0-4.97-4.03-9-9-9zm-1.5 15h3v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-5z" />
            </svg>
          </div>
          <span class="text-[14px] font-bold text-white">Myco<span class="text-emerald-400">Vision</span></span>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto py-6 px-4 sm:py-8 sm:px-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const mobileOpen     = ref(false)
const userName       = ref('')
const userAvatar     = ref('')
const isSubscribed   = ref(false)
const remainingScans = ref<number | null>(null)

async function refreshUserSubscription() {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser)
      userName.value = user.name || user.username || 'User'
      userAvatar.value = user.profile_photo ? `${config.public.apiBase.replace('/api', '')}/storage/${user.profile_photo}` : ''
      if (typeof user.is_subscribed !== 'undefined') {
        isSubscribed.value = !!user.is_subscribed
      }
      if (typeof user.remaining_scans !== 'undefined') {
        remainingScans.value = user.remaining_scans
      }
    } catch (e) {
      console.error(e)
    }
  }

  const token = localStorage.getItem('token')
  if (token) {
    try {
      const data: any = await $fetch(`${config.public.apiBase}/subscription/status`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      isSubscribed.value = !!data.is_subscribed
      remainingScans.value = data.remaining_scans

      if (storedUser) {
        const u = JSON.parse(storedUser)
        u.is_subscribed = data.is_subscribed
        u.remaining_scans = data.remaining_scans
        u.subscription_tier = data.subscription_tier
        localStorage.setItem('user', JSON.stringify(u))
      }
    } catch (e) {
      // Ignore network errors on background refresh
    }
  }
}

onMounted(() => {
  refreshUserSubscription()
  window.addEventListener('subscription-updated', refreshUserSubscription)
})

onUnmounted(() => {
  window.removeEventListener('subscription-updated', refreshUserSubscription)
})

const userInitials = computed(() => {
  if (!userName.value) return 'U'
  return userName.value
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

async function handleLogout() {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      await $fetch(`${config.public.apiBase}/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
    }
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    localStorage.removeItem('uuid')
    await navigateTo('/login')
  }
}
</script>
