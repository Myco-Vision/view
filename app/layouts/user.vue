<template>
  <div class="app-shell">
    <!-- ─── Sidebar ─────────────────────────────────────── -->
    <aside class="sidebar">

      <!-- Brand -->
      <div class="sidebar__brand">
        <div class="brand-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </div>
        <span class="brand-name">MycoVision</span>
      </div>

      <!-- Navigation -->
      <nav class="sidebar__nav">
        <NuxtLink to="/scan" class="nav-item" active-class="nav-item--active">
          <span class="nav-icon">
            <!-- scan / camera icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8
                       a2 2 0 0 1 2-2h4l2-3h6l2 3h4
                       a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </span>
          <span class="nav-label">Scan Mushroom</span>
        </NuxtLink>

        <NuxtLink to="/history" class="nav-item" active-class="nav-item--active">
          <span class="nav-icon">
            <!-- history / file icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16
                       a2 2 0 0 0 2 2h12
                       a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </span>
          <span class="nav-label">Scan History</span>
        </NuxtLink>

        <NuxtLink to="/collection" class="nav-item" active-class="nav-item--active">
          <span class="nav-icon">
            <!-- collection / layers icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>
          </span>
          <span class="nav-label">Collection</span>
        </NuxtLink>

        <NuxtLink to="/settings" class="nav-item" active-class="nav-item--active">
          <span class="nav-icon">
            <!-- settings / gear icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06
                       a2 2 0 0 1-2.83 2.83l-.06-.06
                       a1.65 1.65 0 0 0-1.82-.33
                       1.65 1.65 0 0 0-1 1.51V21
                       a2 2 0 0 1-4 0v-.09
                       A1.65 1.65 0 0 0 9 19.4
                       a1.65 1.65 0 0 0-1.82.33l-.06.06
                       a2 2 0 0 1-2.83-2.83l.06-.06
                       A1.65 1.65 0 0 0 4.68 15
                       1.65 1.65 0 0 0 3.17 14H3
                       a2 2 0 0 1 0-4h.09
                       A1.65 1.65 0 0 0 4.6 9
                       a1.65 1.65 0 0 0-.33-1.82l-.06-.06
                       a2 2 0 0 1 2.83-2.83l.06.06
                       A1.65 1.65 0 0 0 9 4.68
                       1.65 1.65 0 0 0 10 3.17V3
                       a2 2 0 0 1 4 0v.09
                       a1.65 1.65 0 0 0 1 1.51
                       1.65 1.65 0 0 0 1.82-.33l.06-.06
                       a2 2 0 0 1 2.83 2.83l-.06.06
                       A1.65 1.65 0 0 0 19.4 9
                       1.65 1.65 0 0 0 20.83 10H21
                       a2 2 0 0 1 0 4h-.09
                       a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </span>
          <span class="nav-label">Settings</span>
        </NuxtLink>
      </nav>

      <!-- Footer: User + Logout -->
      <div class="sidebar__footer">
        <div class="user-info">
          <div class="user-avatar">
            <img v-if="userAvatar" :src="userAvatar" alt="User avatar" />
            <span v-else class="user-initials">{{ userInitials }}</span>
          </div>
          <span class="user-name">{{ userName }}</span>
        </div>

        <button class="logout-btn" @click="handleLogout">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- ─── Main Content ───────────────────────────────── -->
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const userName   = ref('Maria Salem')
const userAvatar = ref('')   // set to a URL string to show a photo

const userInitials = computed(() => {
  return userName.value
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

async function handleLogout() {
  // TODO: call your AuthService logout here
  localStorage.removeItem('token')
  await navigateTo('/login')
}
</script>

<style scoped>
/* ── Shell ─────────────────────────────────────────── */
.app-shell {
  display: flex;
  height: 100vh;
  background: var(--color-content-bg);
  overflow: hidden;
}

/* ── Sidebar ───────────────────────────────────────── */
.sidebar {
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  background: var(--color-sidebar-bg);
  border-right: 1px solid var(--color-sidebar-border);
  display: flex;
  flex-direction: column;
  padding: 20px 12px;
  gap: 8px;
}

/* Brand */
.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 6px 16px;
  border-bottom: 1px solid var(--color-sidebar-border);
  margin-bottom: 8px;
}

.brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-text);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-icon svg {
  width: 20px;
  height: 20px;
}

.brand-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.3px;
}

/* Nav */
.sidebar__nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: var(--radius);
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 500;
  transition: background var(--transition), color var(--transition);
}

.nav-item:hover {
  background: var(--color-hover-bg);
  color: var(--color-text);
}

.nav-item--active {
  background: var(--color-active-bg);
  color: var(--color-active-text);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-icon svg {
  width: 17px;
  height: 17px;
}

.nav-label {
  white-space: nowrap;
}

/* Footer */
.sidebar__footer {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 12px;
  border-top: 1px solid var(--color-sidebar-border);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: var(--radius);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  overflow: hidden;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: var(--radius);
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  font-size: 13.5px;
  font-weight: 500;
  font-family: inherit;
  transition: background var(--transition), color var(--transition);
  width: 100%;
  text-align: left;
}

.logout-btn:hover {
  background: #fde8e8;
  color: #b91c1c;
}

.logout-btn svg {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
}

/* ── Main content ──────────────────────────────────── */
.main-content {
  flex: 1;
  overflow-y: auto;
  background: var(--color-content-bg);
  padding: 28px 32px;
}
</style>
