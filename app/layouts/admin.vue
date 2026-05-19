<template>
  <div class="admin-shell">

    <!-- ─── Sidebar ───────────────────────────────────── -->
    <aside class="admin-sidebar" :class="{ 'admin-sidebar--collapsed': sidebarCollapsed }">

      <!-- Brand -->
      <div class="sb-brand">
        <div class="sb-brand-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/>
            <path d="M12 6c-3.3 0-6 2.7-6 6 0 1.2.4 2.4 1 3.3L12 6z" fill="currentColor" opacity=".3"/>
            <path d="M12 6l5 9.3A5.97 5.97 0 0 0 18 12c0-3.3-2.7-6-6-6z" fill="currentColor" opacity=".6"/>
          </svg>
        </div>
        <transition name="label-fade">
          <div v-if="!sidebarCollapsed" class="sb-brand-text">
            <span class="sb-brand-name">MycoVision</span>
            <span class="sb-brand-sub">Admin Portal</span>
          </div>
        </transition>
        <button class="sb-collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed" :title="sidebarCollapsed ? 'Expand' : 'Collapse'">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline v-if="!sidebarCollapsed" points="15 18 9 12 15 6"/>
            <polyline v-else points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="sb-nav">
        <p v-if="!sidebarCollapsed" class="sb-nav-label">Overview</p>

        <NuxtLink to="/admin/dashboard" class="sb-item" active-class="sb-item--active" :title="sidebarCollapsed ? 'Dashboard' : ''">
          <span class="sb-icon">
            <!-- grid/dashboard icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          </span>
          <transition name="label-fade"><span v-if="!sidebarCollapsed" class="sb-label">Dashboard</span></transition>
        </NuxtLink>

        <NuxtLink to="/admin/users" class="sb-item" active-class="sb-item--active" :title="sidebarCollapsed ? 'Users' : ''">
          <span class="sb-icon">
            <!-- users icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </span>
          <transition name="label-fade"><span v-if="!sidebarCollapsed" class="sb-label">Users</span></transition>
        </NuxtLink>

        <NuxtLink to="/admin/scans" class="sb-item" active-class="sb-item--active" :title="sidebarCollapsed ? 'Scans Log' : ''">
          <span class="sb-icon">
            <!-- camera/scan icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </span>
          <transition name="label-fade"><span v-if="!sidebarCollapsed" class="sb-label">Scans Log</span></transition>
        </NuxtLink>

        <p v-if="!sidebarCollapsed" class="sb-nav-label" style="margin-top:12px;">Management</p>

        <NuxtLink to="/admin/species" class="sb-item" active-class="sb-item--active" :title="sidebarCollapsed ? 'Species DB' : ''">
          <span class="sb-icon">
            <!-- leaf/database icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>
          </span>
          <transition name="label-fade"><span v-if="!sidebarCollapsed" class="sb-label">Species DB</span></transition>
        </NuxtLink>

        <NuxtLink to="/admin/reports" class="sb-item" active-class="sb-item--active" :title="sidebarCollapsed ? 'Reports' : ''">
          <span class="sb-icon">
            <!-- bar chart icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
              <line x1="2" y1="20" x2="22" y2="20"/>
            </svg>
          </span>
          <transition name="label-fade"><span v-if="!sidebarCollapsed" class="sb-label">Reports</span></transition>
        </NuxtLink>

        <NuxtLink to="/admin/settings" class="sb-item" active-class="sb-item--active" :title="sidebarCollapsed ? 'Settings' : ''">
          <span class="sb-icon">
            <!-- settings icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </span>
          <transition name="label-fade"><span v-if="!sidebarCollapsed" class="sb-label">Settings</span></transition>
        </NuxtLink>
      </nav>

      <!-- Footer -->
      <div class="sb-footer">
        <div class="sb-admin-info" v-if="!sidebarCollapsed">
          <div class="sb-admin-avatar">{{ adminInitials }}</div>
          <div class="sb-admin-meta">
            <span class="sb-admin-name">{{ adminName }}</span>
            <span class="sb-admin-role">Administrator</span>
          </div>
        </div>
        <div v-else class="sb-admin-avatar sb-admin-avatar--solo">{{ adminInitials }}</div>

        <button class="sb-logout-btn" @click="handleLogout" :title="sidebarCollapsed ? 'Logout' : ''">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <transition name="label-fade"><span v-if="!sidebarCollapsed">Logout</span></transition>
        </button>
      </div>
    </aside>

    <!-- ─── Main Panel ──────────────────────────────── -->
    <div class="admin-main">

      <!-- Topbar -->
      <header class="admin-topbar">
        <div class="topbar-left">
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <span class="bc-segment bc-home">Admin</span>
            <span class="bc-sep">›</span>
            <span class="bc-segment bc-current">{{ currentPageTitle }}</span>
          </nav>
        </div>
        <div class="topbar-right">
          <button class="topbar-icon-btn" title="Notifications">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="notif-dot"></span>
          </button>
          <div class="topbar-admin-chip">
            <div class="chip-avatar">{{ adminInitials }}</div>
            <span class="chip-name">{{ adminName }}</span>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="admin-content">
        <slot />
      </main>
    </div>

  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const sidebarCollapsed = ref(false)
const adminName = ref('')

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    const user = JSON.parse(storedUser)
    adminName.value = user.name || user.username || 'Admin User'
  }
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
/* ── Shell ──────────────────────────────────────────── */
.admin-shell {
  display: flex;
  height: 100vh;
  background: #f1f5f9;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

/* ── Sidebar ────────────────────────────────────────── */
.admin-sidebar {
  width: 240px;
  min-width: 240px;
  background: #0f172a;
  display: flex;
  flex-direction: column;
  padding: 18px 12px;
  gap: 4px;
  transition: width 0.25s ease, min-width 0.25s ease;
  overflow: hidden;
}

.admin-sidebar--collapsed {
  width: 64px;
  min-width: 64px;
}

/* Brand */
.sb-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 4px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  margin-bottom: 4px;
  position: relative;
}

.sb-brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(16,185,129,0.35);
}

.sb-brand-icon svg { width: 20px; height: 20px; }

.sb-brand-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  overflow: hidden;
}

.sb-brand-name {
  font-size: 14px;
  font-weight: 700;
  color: #f8fafc;
  white-space: nowrap;
}

.sb-brand-sub {
  font-size: 10px;
  font-weight: 500;
  color: #10b981;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  white-space: nowrap;
}

.sb-collapse-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: color 0.18s, background 0.18s;
  flex-shrink: 0;
}
.sb-collapse-btn:hover { color: #cbd5e1; background: rgba(255,255,255,0.06); }
.sb-collapse-btn svg { width: 15px; height: 15px; }

/* Nav */
.sb-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.sb-nav-label {
  font-size: 10px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding: 0 8px;
  margin-top: 4px;
  margin-bottom: 2px;
  white-space: nowrap;
}

.sb-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 500;
  transition: background 0.18s, color 0.18s;
  white-space: nowrap;
  overflow: hidden;
}

.sb-item:hover {
  background: rgba(255,255,255,0.06);
  color: #e2e8f0;
}

.sb-item--active {
  background: rgba(16,185,129,0.15);
  color: #10b981;
}

.sb-item--active .sb-icon { color: #10b981; }

.sb-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
}

.sb-icon svg { width: 17px; height: 17px; }

.sb-label { white-space: nowrap; }

/* Footer */
.sb-footer {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.08);
  overflow: hidden;
}

.sb-admin-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 8px;
  background: rgba(255,255,255,0.04);
}

.sb-admin-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sb-admin-avatar--solo { margin: 0 auto; }

.sb-admin-meta {
  display: flex;
  flex-direction: column;
  gap: 1px;
  overflow: hidden;
}

.sb-admin-name {
  font-size: 13px;
  font-weight: 600;
  color: #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sb-admin-role {
  font-size: 11px;
  color: #10b981;
  font-weight: 500;
}

.sb-logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #64748b;
  font-size: 13.5px;
  font-weight: 500;
  font-family: inherit;
  transition: background 0.18s, color 0.18s;
  white-space: nowrap;
  overflow: hidden;
}

.sb-logout-btn:hover {
  background: rgba(239,68,68,0.12);
  color: #f87171;
}

.sb-logout-btn svg { width: 17px; height: 17px; flex-shrink: 0; }

/* ── Main Panel ─────────────────────────────────────── */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

/* Topbar */
.admin-topbar {
  height: 56px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  flex-shrink: 0;
  gap: 16px;
}

.topbar-left { display: flex; align-items: center; gap: 12px; }
.topbar-right { display: flex; align-items: center; gap: 12px; }

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
}

.bc-segment { color: #64748b; }
.bc-home    { font-weight: 500; }
.bc-sep     { color: #cbd5e1; }
.bc-current { color: #0f172a; font-weight: 600; }

.topbar-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  position: relative;
  transition: background 0.18s, color 0.18s;
}
.topbar-icon-btn:hover { background: #f8fafc; color: #0f172a; }
.topbar-icon-btn svg { width: 17px; height: 17px; }

.notif-dot {
  position: absolute;
  top: 7px; right: 7px;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #ef4444;
  border: 1.5px solid #fff;
}

.topbar-admin-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px 5px 5px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  cursor: pointer;
  transition: background 0.18s;
}
.topbar-admin-chip:hover { background: #f1f5f9; }

.chip-avatar {
  width: 26px; height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chip-name {
  font-size: 13px;
  font-weight: 500;
  color: #0f172a;
}

/* Content */
.admin-content {
  flex: 1;
  overflow-y: auto;
  padding: 28px 32px;
  background: #f1f5f9;
}

/* Fade transition for sidebar labels */
.label-fade-enter-active,
.label-fade-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.label-fade-enter-from,
.label-fade-leave-to  { opacity: 0; transform: translateX(-4px); }
</style>
