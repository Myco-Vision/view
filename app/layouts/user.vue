<template>
  <div class="flex h-screen bg-content overflow-hidden font-sans">

    <!-- ─── Mobile Overlay ─────────────────────────────── -->
    <div
      v-if="mobileOpen"
      class="fixed inset-0 bg-black/50 z-30 lg:hidden"
      @click="mobileOpen = false"
    />

    <!-- ─── Sidebar ─────────────────────────────────────── -->
    <aside class="w-[220px] min-w-[220px] bg-sidebar-bg border-r border-sidebar-border flex flex-col pt-5 pb-5 px-3 gap-2
                  fixed inset-y-0 left-0 z-40 transition-transform duration-250
                  lg:static lg:translate-x-0"
           :class="mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'">

      <!-- Brand -->
      <div class="flex items-center gap-2.5 px-1.5 pb-4 border-b border-sidebar-border mb-2">
        <div class="w-9 h-9 rounded-full bg-sidebar-text text-white flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
        </div>
        <span class="text-[15px] font-bold text-sidebar-text tracking-[-0.3px] flex-1">MycoVision</span>
        <!-- Mobile close -->
        <button @click="mobileOpen = false" class="lg:hidden bg-transparent border-none cursor-pointer text-sidebar-muted p-1 rounded-md flex items-center">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 flex flex-col gap-0.5">
        <NuxtLink to="/users/scan" @click="mobileOpen = false" class="flex items-center gap-2.5 py-[9px] px-3 rounded-[10px] text-sidebar-muted no-underline text-[13.5px] font-medium transition-colors duration-200 hover:bg-sidebar-hover hover:text-sidebar-text" active-class="!bg-primary !text-white">
          <span class="flex items-center justify-center shrink-0"><svg class="w-[17px] h-[17px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></span>
          <span class="whitespace-nowrap">Scan Mushroom</span>
        </NuxtLink>

        <NuxtLink to="/users/history" @click="mobileOpen = false" class="flex items-center gap-2.5 py-[9px] px-3 rounded-[10px] text-sidebar-muted no-underline text-[13.5px] font-medium transition-colors duration-200 hover:bg-sidebar-hover hover:text-sidebar-text" active-class="!bg-primary !text-white">
          <span class="flex items-center justify-center shrink-0"><svg class="w-[17px] h-[17px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></span>
          <span class="whitespace-nowrap">Scan History</span>
        </NuxtLink>

        <NuxtLink to="/users/collection" @click="mobileOpen = false" class="flex items-center gap-2.5 py-[9px] px-3 rounded-[10px] text-sidebar-muted no-underline text-[13.5px] font-medium transition-colors duration-200 hover:bg-sidebar-hover hover:text-sidebar-text" active-class="!bg-primary !text-white">
          <span class="flex items-center justify-center shrink-0"><svg class="w-[17px] h-[17px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg></span>
          <span class="whitespace-nowrap">Collection</span>
        </NuxtLink>

        <NuxtLink to="/users/settings" @click="mobileOpen = false" class="flex items-center gap-2.5 py-[9px] px-3 rounded-[10px] text-sidebar-muted no-underline text-[13.5px] font-medium transition-colors duration-200 hover:bg-sidebar-hover hover:text-sidebar-text" active-class="!bg-primary !text-white">
          <span class="flex items-center justify-center shrink-0"><svg class="w-[17px] h-[17px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15 1.65 1.65 0 0 0 3.17 14H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68 1.65 1.65 0 0 0 10 3.17V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9 1.65 1.65 0 0 0 20.83 10H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span>
          <span class="whitespace-nowrap">Settings</span>
        </NuxtLink>
      </nav>

      <!-- Footer: User + Logout -->
      <div class="flex flex-col gap-1.5 pt-3 border-t border-sidebar-border">
        <div class="flex items-center gap-2.5 py-1.5 px-2.5 rounded-[10px]">
          <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold overflow-hidden shrink-0">
            <img v-if="userAvatar" :src="userAvatar" alt="User avatar" class="w-full h-full object-cover" />
            <span v-else>{{ userInitials }}</span>
          </div>
          <span class="text-[13px] font-medium text-sidebar-text whitespace-nowrap overflow-hidden text-ellipsis">{{ userName }}</span>
        </div>

        <button class="flex items-center gap-2.5 py-[9px] px-3 rounded-[10px] bg-transparent border-none cursor-pointer text-sidebar-muted text-[13.5px] font-medium font-sans transition-colors duration-200 w-full text-left hover:bg-red-50 hover:text-red-700" @click="handleLogout">
          <svg class="w-[17px] h-[17px] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- ─── Main Content ───────────────────────────────── -->
    <div class="flex-1 flex flex-col overflow-hidden min-w-0">
      <!-- Mobile topbar with hamburger -->
      <header class="lg:hidden h-14 bg-sidebar-bg border-b border-sidebar-border flex items-center px-4 gap-3 shrink-0">
        <button @click="mobileOpen = true" class="w-9 h-9 rounded-lg bg-transparent border border-sidebar-border cursor-pointer flex items-center justify-center text-sidebar-muted">
          <svg class="w-[17px] h-[17px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <span class="text-[15px] font-bold text-sidebar-text">MycoVision</span>
      </header>
      <main class="flex-1 overflow-y-auto bg-content py-5 px-4 sm:py-7 sm:px-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const mobileOpen = ref(false)
const userName   = ref('')
const userAvatar = ref('')

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    const user = JSON.parse(storedUser)
    userName.value = user.name || user.username || 'User'
    userAvatar.value = user.profile_photo ? `${config.public.apiBase.replace('/api', '')}/storage/${user.profile_photo}` : ''
  }
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
