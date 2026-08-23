<template>
  <div class="flex h-screen bg-slate-100 overflow-hidden font-sans">

    <!-- ─── Mobile Overlay ─────────────────────────────── -->
    <div
      v-if="mobileOpen"
      class="fixed inset-0 bg-black/50 z-30 lg:hidden"
      @click="mobileOpen = false"
    />

    <!-- ─── Sidebar ───────────────────────────────────── -->
    <aside
      class="flex flex-col bg-slate-900 shrink-0 transition-all duration-250 ease-in-out overflow-hidden z-40
             fixed inset-y-0 left-0 lg:static
             lg:translate-x-0"
      :class="[
        /* desktop collapsed/expanded */
        sidebarCollapsed ? 'lg:w-16 lg:min-w-[64px]' : 'lg:w-60 lg:min-w-[240px]',
        /* mobile slide-in */
        mobileOpen ? 'translate-x-0 w-60 min-w-[240px]' : '-translate-x-full lg:translate-x-0',
      ]"
      style="padding: 18px 12px; gap: 4px;"
    >
      <!-- Brand -->
      <div class="flex items-center gap-2.5 pb-[18px] border-b border-white/[0.08] mb-1 relative" style="padding: 4px 4px 18px;">
        <div class="w-9 h-9 rounded-[10px] bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(16,185,129,0.35)]">
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/>
            <path d="M12 6c-3.3 0-6 2.7-6 6 0 1.2.4 2.4 1 3.3L12 6z" fill="currentColor" opacity=".3"/>
            <path d="M12 6l5 9.3A5.97 5.97 0 0 0 18 12c0-3.3-2.7-6-6-6z" fill="currentColor" opacity=".6"/>
          </svg>
        </div>
        <transition name="label-fade">
          <div v-if="!sidebarCollapsed || mobileOpen" class="flex flex-col gap-px flex-1 overflow-hidden">
            <span class="text-[14px] font-bold text-slate-50 whitespace-nowrap">MycoVision</span>
            <span class="text-[10px] font-medium text-emerald-500 uppercase tracking-[0.8px] whitespace-nowrap">Admin Portal</span>
          </div>
        </transition>
        <!-- Desktop collapse toggle -->
        <button
          @click="sidebarCollapsed = !sidebarCollapsed"
          :title="sidebarCollapsed ? 'Expand' : 'Collapse'"
          class="hidden lg:flex bg-transparent border-none cursor-pointer text-slate-500 p-1 rounded-md items-center transition-colors duration-200 hover:text-slate-300 hover:bg-white/[0.06] shrink-0"
        >
          <svg class="w-[15px] h-[15px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline v-if="!sidebarCollapsed" points="15 18 9 12 15 6"/>
            <polyline v-else points="9 18 15 12 9 6"/>
          </svg>
        </button>
        <!-- Mobile close button -->
        <button
          @click="mobileOpen = false"
          class="lg:hidden bg-transparent border-none cursor-pointer text-slate-500 p-1 rounded-md flex items-center transition-colors duration-200 hover:text-slate-300 hover:bg-white/[0.06] shrink-0"
        >
          <svg class="w-[15px] h-[15px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 flex flex-col gap-0.5 overflow-hidden">
        <p v-if="!sidebarCollapsed || mobileOpen" class="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.8px] px-2 mt-1 mb-0.5 whitespace-nowrap">Overview</p>

        <NuxtLink v-if="isAdminOrAbove" to="/admin/dashboard" :title="(sidebarCollapsed && !mobileOpen) ? 'Dashboard' : ''" @click="mobileOpen = false"
          class="flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg text-slate-400 no-underline text-[13.5px] font-medium transition-colors duration-200 whitespace-nowrap overflow-hidden hover:bg-white/[0.06] hover:text-slate-200"
          active-class="!bg-emerald-500/15 !text-emerald-500">
          <span class="flex items-center justify-center shrink-0 w-5">
            <svg class="w-[17px] h-[17px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          </span>
          <transition name="label-fade"><span v-if="!sidebarCollapsed || mobileOpen" class="whitespace-nowrap">Dashboard</span></transition>
        </NuxtLink>

        <NuxtLink v-if="isSuperAdmin" to="/admin/users" :title="(sidebarCollapsed && !mobileOpen) ? 'Users' : ''" @click="mobileOpen = false"
          class="flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg text-slate-400 no-underline text-[13.5px] font-medium transition-colors duration-200 whitespace-nowrap overflow-hidden hover:bg-white/[0.06] hover:text-slate-200"
          active-class="!bg-emerald-500/15 !text-emerald-500">
          <span class="flex items-center justify-center shrink-0 w-5">
            <svg class="w-[17px] h-[17px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </span>
          <transition name="label-fade"><span v-if="!sidebarCollapsed || mobileOpen" class="whitespace-nowrap">Users</span></transition>
        </NuxtLink>

        <NuxtLink v-if="isAdminOrAbove" to="/admin/scans" :title="(sidebarCollapsed && !mobileOpen) ? 'Scans Log' : ''" @click="mobileOpen = false"
          class="flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg text-slate-400 no-underline text-[13.5px] font-medium transition-colors duration-200 whitespace-nowrap overflow-hidden hover:bg-white/[0.06] hover:text-slate-200"
          active-class="!bg-emerald-500/15 !text-emerald-500">
          <span class="flex items-center justify-center shrink-0 w-5">
            <svg class="w-[17px] h-[17px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </span>
          <transition name="label-fade"><span v-if="!sidebarCollapsed || mobileOpen" class="whitespace-nowrap">Scans Log</span></transition>
        </NuxtLink>

        <p v-if="!sidebarCollapsed || mobileOpen" class="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.8px] px-2 mt-3 mb-0.5 whitespace-nowrap">Management</p>

        <NuxtLink v-if="isSuperAdmin" to="/admin/species" :title="(sidebarCollapsed && !mobileOpen) ? 'Species DB' : ''" @click="mobileOpen = false"
          class="flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg text-slate-400 no-underline text-[13.5px] font-medium transition-colors duration-200 whitespace-nowrap overflow-hidden hover:bg-white/[0.06] hover:text-slate-200"
          active-class="!bg-emerald-500/15 !text-emerald-500">
          <span class="flex items-center justify-center shrink-0 w-5">
            <svg class="w-[17px] h-[17px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>
          </span>
          <transition name="label-fade"><span v-if="!sidebarCollapsed || mobileOpen" class="whitespace-nowrap">Species DB</span></transition>
        </NuxtLink>

        <NuxtLink v-if="isSuperAdmin" to="/admin/reports" :title="(sidebarCollapsed && !mobileOpen) ? 'Reports' : ''" @click="mobileOpen = false"
          class="flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg text-slate-400 no-underline text-[13.5px] font-medium transition-colors duration-200 whitespace-nowrap overflow-hidden hover:bg-white/[0.06] hover:text-slate-200"
          active-class="!bg-emerald-500/15 !text-emerald-500">
          <span class="flex items-center justify-center shrink-0 w-5">
            <svg class="w-[17px] h-[17px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
              <line x1="2" y1="20" x2="22" y2="20"/>
            </svg>
          </span>
          <transition name="label-fade"><span v-if="!sidebarCollapsed || mobileOpen" class="whitespace-nowrap">Reports</span></transition>
        </NuxtLink>

        <NuxtLink v-if="isSuperAdmin" to="/admin/settings" :title="(sidebarCollapsed && !mobileOpen) ? 'Settings' : ''" @click="mobileOpen = false"
          class="flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg text-slate-400 no-underline text-[13.5px] font-medium transition-colors duration-200 whitespace-nowrap overflow-hidden hover:bg-white/[0.06] hover:text-slate-200"
          active-class="!bg-emerald-500/15 !text-emerald-500">
          <span class="flex items-center justify-center shrink-0 w-5">
            <svg class="w-[17px] h-[17px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </span>
          <transition name="label-fade"><span v-if="!sidebarCollapsed || mobileOpen" class="whitespace-nowrap">Settings</span></transition>
        </NuxtLink>
      </nav>

      <!-- Footer -->
      <div class="flex flex-col gap-1.5 pt-3 border-t border-white/[0.08] overflow-hidden">
        <div v-if="!sidebarCollapsed || mobileOpen" class="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-white/[0.04]">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{{ adminInitials }}</div>
          <div class="flex flex-col gap-px overflow-hidden">
            <span class="text-[13px] font-semibold text-slate-200 whitespace-nowrap overflow-hidden text-ellipsis">{{ adminName }}</span>
            <span class="text-[11px] text-emerald-500 font-medium">{{ roleLabel }}</span>
          </div>
        </div>
        <div v-else class="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-xs font-bold flex items-center justify-center mx-auto">{{ adminInitials }}</div>

        <button
          @click="handleLogout"
          :title="(sidebarCollapsed && !mobileOpen) ? 'Logout' : ''"
          class="flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg bg-transparent border-none cursor-pointer text-slate-500 text-[13.5px] font-medium font-sans transition-colors duration-200 whitespace-nowrap overflow-hidden w-full text-left hover:bg-red-500/[0.12] hover:text-red-400"
        >
          <svg class="w-[17px] h-[17px] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <transition name="label-fade"><span v-if="!sidebarCollapsed || mobileOpen">Logout</span></transition>
        </button>
      </div>
    </aside>

    <!-- ─── Main Panel ──────────────────────────────── -->
    <div class="flex-1 flex flex-col overflow-hidden min-w-0">

      <!-- Topbar -->
      <header class="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-7 shrink-0 gap-4">
        <div class="flex items-center gap-3">
          <!-- Mobile hamburger -->
          <button
            @click="mobileOpen = true"
            class="lg:hidden w-9 h-9 rounded-lg bg-transparent border border-slate-200 cursor-pointer flex items-center justify-center text-slate-500 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-900"
          >
            <svg class="w-[17px] h-[17px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <nav class="flex items-center gap-1.5 text-[13.5px]" aria-label="Breadcrumb">
            <span class="text-slate-500 font-medium hidden sm:inline">Admin</span>
            <span class="text-slate-300 hidden sm:inline">›</span>
            <span class="text-slate-900 font-semibold">{{ currentPageTitle }}</span>
          </nav>
        </div>
        <div class="flex items-center gap-3">
          <button class="w-9 h-9 rounded-lg bg-transparent border border-slate-200 cursor-pointer flex items-center justify-center text-slate-500 relative transition-colors duration-200 hover:bg-slate-50 hover:text-slate-900">
            <svg class="w-[17px] h-[17px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="absolute top-[7px] right-[7px] w-[7px] h-[7px] rounded-full bg-red-500 border-[1.5px] border-white"></span>
          </button>
          <div class="flex items-center gap-2 py-[5px] px-3 pl-[5px] rounded-[20px] border border-slate-200 bg-slate-50 cursor-pointer transition-colors duration-200 hover:bg-slate-100">
            <div class="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">{{ adminInitials }}</div>
            <span class="text-[13px] font-medium text-slate-900 hidden sm:inline">{{ adminName }}</span>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-7 bg-slate-100">
        <slot />
      </main>
    </div>

  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const sidebarCollapsed = ref(false)
const mobileOpen = ref(false)
const adminName = ref('')
const userRole = ref('')

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    const user = JSON.parse(storedUser)
    adminName.value = user.name || user.username || 'Admin User'
  }
  userRole.value = localStorage.getItem('role') || ''
})

const isSuperAdmin = computed(() => userRole.value === 'super_admin')
const isAdminOrAbove = computed(() => ['admin', 'super_admin'].includes(userRole.value))

const roleLabel = computed(() => {
  const labels: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Administrator',
    forager: 'Forager',
  }
  return labels[userRole.value] ?? 'User'
})

const adminInitials = computed(() => {
  if (!adminName.value) return 'A'
  return adminName.value
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Derive current page title from route
const route = useRoute()
const pageMap: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/users':     'User Management',
  '/admin/scans':     'Scans Log',
  '/admin/species':   'Species Database',
  '/admin/reports':   'Reports & Analytics',
  '/admin/settings':  'System Settings',
}
const currentPageTitle = computed(() => pageMap[route.path] ?? 'Dashboard')

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

<style scoped>
/* Vue named transition for sidebar label collapse */
.label-fade-enter-active,
.label-fade-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.label-fade-enter-from,
.label-fade-leave-to  { opacity: 0; transform: translateX(-4px); }
</style>
