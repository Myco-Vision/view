<template>
  <div class="settings-page">
    <h1 class="page-title">Settings</h1>

    <div class="settings-grid">

      <!-- ── LEFT COLUMN ───────────────────────────── -->
      <div class="settings-col">

        <!-- Profile Card -->
        <div class="settings-card">
          <div class="profile-row">
            <div class="avatar-wrap">
              <div class="avatar">MS</div>
              <button class="avatar-edit-btn" title="Change photo">✏️</button>
            </div>
            <div class="profile-info">
              <p class="profile-name">Maria Salem</p>
              <p class="profile-email">maria@email.com</p>
              <p class="profile-joined">Member since Apr 2026</p>
            </div>
            <button class="edit-profile-btn">Edit Profile</button>
          </div>
        </div>

        <!-- Preferences -->
        <div class="settings-card">
          <p class="card-section-title">
            <span class="section-icon">⚙️</span> Preferences
          </p>
          <div class="toggle-list">
            <div class="toggle-row">
              <div class="toggle-info">
                <p class="toggle-label">Auto-save Scans</p>
                <p class="toggle-desc">Automatically save every scan to history</p>
              </div>
              <button class="toggle" :class="{ 'toggle--on': prefs.autoSave }" @click="prefs.autoSave = !prefs.autoSave" />
            </div>
            <div class="toggle-row">
              <div class="toggle-info">
                <p class="toggle-label">Show Confidence Score</p>
                <p class="toggle-desc">Display AI confidence % on results</p>
              </div>
              <button class="toggle" :class="{ 'toggle--on': prefs.showConfidence }" @click="prefs.showConfidence = !prefs.showConfidence" />
            </div>
            <div class="toggle-row">
              <div class="toggle-info">
                <p class="toggle-label">Camera Grid</p>
                <p class="toggle-desc">Show alignment grid while capturing</p>
              </div>
              <button class="toggle" :class="{ 'toggle--on': prefs.cameraGrid }" @click="prefs.cameraGrid = !prefs.cameraGrid" />
            </div>
            <div class="toggle-row">
              <div class="toggle-info">
                <p class="toggle-label">Save Location by Default</p>
                <p class="toggle-desc">Pin mushroom location on every scan</p>
              </div>
              <button class="toggle" :class="{ 'toggle--on': prefs.saveLocation }" @click="prefs.saveLocation = !prefs.saveLocation" />
            </div>
          </div>
          <!-- Language -->
          <div class="select-row">
            <p class="toggle-label">Language</p>
            <select class="settings-select" v-model="prefs.language">
              <option>English</option>
              <option>Filipino</option>
              <option>Español</option>
            </select>
          </div>
        </div>

        <!-- Account -->
        <div class="settings-card">
          <p class="card-section-title">
            <span class="section-icon">🔐</span> Account
          </p>
          <div class="account-btns">
            <button class="account-btn">
              <span class="account-btn-icon">🔑</span>
              <span>Change Password</span>
            </button>
            <button class="account-btn">
              <span class="account-btn-icon">📱</span>
              <span>Two-Factor Auth (2FA)</span>
            </button>
            <button class="account-btn">
              <span class="account-btn-icon">✉️</span>
              <span>Email Settings</span>
            </button>
          </div>
        </div>

      </div>

      <!-- ── RIGHT COLUMN ──────────────────────────── -->
      <div class="settings-col">

        <!-- Quick Settings -->
        <div class="settings-card">
          <p class="card-section-title">
            <span class="section-icon">⚡</span> Quick Settings
          </p>
          <div class="toggle-list">
            <div class="toggle-row">
              <div class="toggle-info">
                <p class="toggle-label">Notifications</p>
                <p class="toggle-desc">Scan results and app alerts</p>
              </div>
              <button class="toggle" :class="{ 'toggle--on': quick.notifications }" @click="quick.notifications = !quick.notifications" />
            </div>
            <div class="toggle-row">
              <div class="toggle-info">
                <p class="toggle-label">Dark Mode</p>
                <p class="toggle-desc">Switch to dark interface</p>
              </div>
              <button class="toggle" :class="{ 'toggle--on': quick.darkMode }" @click="quick.darkMode = !quick.darkMode" />
            </div>
            <div class="toggle-row">
              <div class="toggle-info">
                <p class="toggle-label">Location Access</p>
                <p class="toggle-desc">Required for pinning mushroom locations</p>
              </div>
              <button class="toggle" :class="{ 'toggle--on': quick.location }" @click="quick.location = !quick.location" />
            </div>
          </div>
        </div>

        <!-- Storage -->
        <div class="settings-card">
          <p class="card-section-title">
            <span class="section-icon">💾</span> Storage
          </p>
          <p class="storage-label">{{ storageUsed }}MB of {{ storageTotal }}MB used</p>
          <div class="storage-bar-wrap">
            <div class="storage-bar" :style="{ width: storagePercent + '%' }" />
          </div>
          <p class="storage-hint">Scan images and history data</p>
          <div class="storage-actions">
            <button class="secondary-btn" @click="clearCache">Clear Cache</button>
            <button class="secondary-btn" @click="exportData">Export My Data</button>
          </div>
        </div>

        <!-- Privacy -->
        <div class="settings-card">
          <p class="card-section-title">
            <span class="section-icon">🔒</span> Privacy
          </p>
          <div class="toggle-list">
            <div class="toggle-row">
              <div class="toggle-info">
                <p class="toggle-label">Share Data for Research</p>
                <p class="toggle-desc">Help improve mushroom identification AI (anonymous)</p>
              </div>
              <button class="toggle" :class="{ 'toggle--on': privacy.shareData }" @click="privacy.shareData = !privacy.shareData" />
            </div>
            <div class="toggle-row">
              <div class="toggle-info">
                <p class="toggle-label">Public Collection</p>
                <p class="toggle-desc">Allow others to view your mushroom collection</p>
              </div>
              <button class="toggle" :class="{ 'toggle--on': privacy.publicCollection }" @click="privacy.publicCollection = !privacy.publicCollection" />
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="settings-card settings-card--danger">
          <p class="card-section-title danger-title">
            <span class="section-icon">⚠️</span> Danger Zone
          </p>
          <p class="danger-desc">Once you delete your account, all your scans, collection, and history will be permanently removed. This cannot be undone.</p>
          <button class="delete-btn">Delete Account</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user' })

const prefs = reactive({
  autoSave:       true,
  showConfidence: true,
  cameraGrid:     false,
  saveLocation:   true,
  language:       'English',
})

const quick = reactive({
  notifications: true,
  darkMode:      false,
  location:      true,
})

const privacy = reactive({
  shareData:        false,
  publicCollection: false,
})

const storageUsed    = 120
const storageTotal   = 500
const storagePercent = Math.round((storageUsed / storageTotal) * 100)

function clearCache()  { alert('Cache cleared!') }
function exportData()  { alert('Exporting data…') }
</script>

<style scoped>
/* ── Page ──────────────────────────────────────────── */
.settings-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text);
}

/* ── Two-column grid ───────────────────────────────── */
.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  align-items: start;
}

.settings-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ── Card ──────────────────────────────────────────── */
.settings-card {
  background: #fff;
  border: 1px solid var(--color-sidebar-border);
  border-radius: 14px;
  padding: 20px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card-section-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 7px;
}

.section-icon { font-size: 16px; }

/* ── Profile ───────────────────────────────────────── */
.profile-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar-wrap { position: relative; flex-shrink: 0; }

.avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-edit-btn {
  position: absolute;
  bottom: -2px; right: -2px;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid var(--color-sidebar-border);
  font-size: 10px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}

.profile-info { flex: 1; }

.profile-name  { font-size: 15px; font-weight: 600; color: var(--color-text); }
.profile-email { font-size: 12.5px; color: var(--color-text-muted); margin-top: 2px; }
.profile-joined{ font-size: 11.5px; color: var(--color-text-muted); margin-top: 2px; }

.edit-profile-btn {
  padding: 7px 16px;
  border-radius: 8px;
  border: 1px solid var(--color-sidebar-border);
  background: #fff;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  color: var(--color-text);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.18s;
  flex-shrink: 0;
}
.edit-profile-btn:hover { background: var(--color-hover-bg); }

/* ── Toggle list ───────────────────────────────────── */
.toggle-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.toggle-info { flex: 1; min-width: 0; }

.toggle-label {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--color-text);
}

.toggle-desc {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

/* Custom toggle switch */
.toggle {
  width: 42px;
  height: 24px;
  border-radius: 12px;
  background: #d1d5db;
  border: none;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  transition: background 0.2s;
}
.toggle::after {
  content: '';
  position: absolute;
  top: 3px; left: 3px;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  transition: transform 0.2s;
}
.toggle--on { background: var(--color-primary); }
.toggle--on::after { transform: translateX(18px); }

/* ── Select row ────────────────────────────────────── */
.select-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 4px;
  border-top: 1px solid var(--color-sidebar-border);
}

.settings-select {
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid var(--color-sidebar-border);
  background: #fff;
  font-family: inherit;
  font-size: 13px;
  color: var(--color-text);
  cursor: pointer;
  outline: none;
}

/* ── Account buttons ───────────────────────────────── */
.account-btns {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.account-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-radius: 10px;
  border: 1px solid var(--color-sidebar-border);
  background: #fff;
  font-size: 13.5px;
  font-weight: 500;
  font-family: inherit;
  color: var(--color-text);
  cursor: pointer;
  transition: background 0.18s;
  text-align: left;
}
.account-btn:hover { background: var(--color-hover-bg); }
.account-btn-icon  { font-size: 16px; }

/* ── Storage ───────────────────────────────────────── */
.storage-label {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--color-text);
}

.storage-bar-wrap {
  height: 8px;
  background: #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}

.storage-bar {
  height: 100%;
  background: var(--color-primary);
  border-radius: 10px;
  transition: width 0.4s ease;
}

.storage-hint {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: -6px;
}

.storage-actions {
  display: flex;
  gap: 8px;
}

.secondary-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--color-sidebar-border);
  background: #fff;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  color: var(--color-text);
  cursor: pointer;
  transition: background 0.18s;
}
.secondary-btn:hover { background: var(--color-hover-bg); }

/* ── Danger Zone ───────────────────────────────────── */
.settings-card--danger {
  border-color: #fecaca;
  background: #fff8f8;
}

.danger-title { color: #dc2626; }

.danger-desc {
  font-size: 12.5px;
  color: #7f1d1d;
  line-height: 1.6;
}

.delete-btn {
  padding: 10px 22px;
  border-radius: 9px;
  background: #dc2626;
  color: #fff;
  border: none;
  font-size: 13.5px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  align-self: flex-start;
  transition: background 0.18s;
}
.delete-btn:hover { background: #b91c1c; }
</style>
