<template>
  <div class="flex flex-col gap-[18px]">
    <h1 class="text-[22px] font-bold text-[#0f172a]">Settings</h1>

    <div class="grid grid-cols-2 gap-3.5 items-start">

      <!-- ── LEFT COLUMN ───────────────────────────── -->
      <div class="flex flex-col gap-3.5">

        <!-- Profile Card -->
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 pb-4 flex flex-col gap-3.5">
          <div class="flex items-center gap-3.5">
            <div class="relative shrink-0">
              <div class="w-[54px] h-[54px] rounded-full bg-[#10b981] text-white text-[18px] font-bold flex items-center justify-center overflow-hidden">
                <img v-if="userProfile.photo" :src="userProfile.photo" alt="Avatar" class="w-full h-full object-cover" />
                <span v-else>{{ userProfile.initials }}</span>
              </div>
              <button class="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white border border-[#e2e8f0] text-[10px] cursor-pointer flex items-center justify-center" title="Change photo">✏️</button>
            </div>
            <div class="flex-1">
              <p class="text-[15px] font-semibold text-[#0f172a]">{{ userProfile.name }}</p>
              <p class="text-[12.5px] text-[#64748b] mt-0.5">{{ userProfile.email }}</p>
              <p class="text-[11.5px] text-[#64748b] mt-0.5">Member since {{ userProfile.joined }}</p>
            </div>
            <button class="py-[7px] px-4 rounded-lg border border-[#e2e8f0] bg-white text-[13px] font-medium font-sans text-[#0f172a] cursor-pointer whitespace-nowrap transition-colors duration-[0.18s] shrink-0 hover:bg-[#f8fafc]">Edit Profile</button>
          </div>
        </div>

        <!-- Preferences -->
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 pb-4 flex flex-col gap-3.5">
          <p class="text-[14px] font-bold text-[#0f172a] flex items-center gap-[7px]">
            <span class="text-[16px]">⚙️</span> Preferences
          </p>
          <div class="flex flex-col gap-3.5">
            <div class="flex items-center justify-between gap-3">
              <div class="flex-1 min-w-0">
                <p class="text-[13.5px] font-medium text-[#0f172a]">Auto-save Scans</p>
                <p class="text-[12px] text-[#64748b] mt-0.5">Automatically save every scan to history</p>
              </div>
              <button class="relative w-[42px] h-6 rounded-full border-none cursor-pointer shrink-0 transition-colors duration-200" :class="prefs.autoSave ? 'bg-[#10b981]' : 'bg-[#d1d5db]'" @click="prefs.autoSave = !prefs.autoSave">
                <div class="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200" :class="prefs.autoSave ? 'translate-x-[18px]' : ''"></div>
              </button>
            </div>
            <div class="flex items-center justify-between gap-3">
              <div class="flex-1 min-w-0">
                <p class="text-[13.5px] font-medium text-[#0f172a]">Show Confidence Score</p>
                <p class="text-[12px] text-[#64748b] mt-0.5">Display AI confidence % on results</p>
              </div>
              <button class="relative w-[42px] h-6 rounded-full border-none cursor-pointer shrink-0 transition-colors duration-200" :class="prefs.showConfidence ? 'bg-[#10b981]' : 'bg-[#d1d5db]'" @click="prefs.showConfidence = !prefs.showConfidence">
                <div class="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200" :class="prefs.showConfidence ? 'translate-x-[18px]' : ''"></div>
              </button>
            </div>
            <div class="flex items-center justify-between gap-3">
              <div class="flex-1 min-w-0">
                <p class="text-[13.5px] font-medium text-[#0f172a]">Camera Grid</p>
                <p class="text-[12px] text-[#64748b] mt-0.5">Show alignment grid while capturing</p>
              </div>
              <button class="relative w-[42px] h-6 rounded-full border-none cursor-pointer shrink-0 transition-colors duration-200" :class="prefs.cameraGrid ? 'bg-[#10b981]' : 'bg-[#d1d5db]'" @click="prefs.cameraGrid = !prefs.cameraGrid">
                <div class="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200" :class="prefs.cameraGrid ? 'translate-x-[18px]' : ''"></div>
              </button>
            </div>
            <div class="flex items-center justify-between gap-3">
              <div class="flex-1 min-w-0">
                <p class="text-[13.5px] font-medium text-[#0f172a]">Save Location by Default</p>
                <p class="text-[12px] text-[#64748b] mt-0.5">Pin mushroom location on every scan</p>
              </div>
              <button class="relative w-[42px] h-6 rounded-full border-none cursor-pointer shrink-0 transition-colors duration-200" :class="prefs.saveLocation ? 'bg-[#10b981]' : 'bg-[#d1d5db]'" @click="prefs.saveLocation = !prefs.saveLocation">
                <div class="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200" :class="prefs.saveLocation ? 'translate-x-[18px]' : ''"></div>
              </button>
            </div>
          </div>
          <!-- Language -->
          <div class="flex items-center justify-between gap-3 pt-1 border-t border-[#f1f5f9]">
            <p class="text-[13.5px] font-medium text-[#0f172a]">Language</p>
            <select class="py-[7px] px-3 rounded-lg border border-[#e2e8f0] bg-white font-sans text-[13px] text-[#0f172a] cursor-pointer outline-none" v-model="prefs.language">
              <option>English</option>
              <option>Filipino</option>
              <option>Español</option>
            </select>
          </div>
        </div>

        <!-- Account -->
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 pb-4 flex flex-col gap-3.5">
          <p class="text-[14px] font-bold text-[#0f172a] flex items-center gap-[7px]">
            <span class="text-[16px]">🔐</span> Account
          </p>
          <div class="flex flex-col gap-2">
            <button class="flex items-center gap-2.5 py-[11px] px-3.5 rounded-[10px] border border-[#e2e8f0] bg-white text-[13.5px] font-medium font-sans text-[#0f172a] cursor-pointer transition-colors duration-[0.18s] text-left hover:bg-[#f8fafc]">
              <span class="text-[16px]">🔑</span>
              <span>Change Password</span>
            </button>
            <button class="flex items-center gap-2.5 py-[11px] px-3.5 rounded-[10px] border border-[#e2e8f0] bg-white text-[13.5px] font-medium font-sans text-[#0f172a] cursor-pointer transition-colors duration-[0.18s] text-left hover:bg-[#f8fafc]">
              <span class="text-[16px]">📱</span>
              <span>Two-Factor Auth (2FA)</span>
            </button>
            <button class="flex items-center gap-2.5 py-[11px] px-3.5 rounded-[10px] border border-[#e2e8f0] bg-white text-[13.5px] font-medium font-sans text-[#0f172a] cursor-pointer transition-colors duration-[0.18s] text-left hover:bg-[#f8fafc]">
              <span class="text-[16px]">✉️</span>
              <span>Email Settings</span>
            </button>
          </div>
        </div>

      </div>

      <!-- ── RIGHT COLUMN ──────────────────────────── -->
      <div class="flex flex-col gap-3.5">

        <!-- Quick Settings -->
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 pb-4 flex flex-col gap-3.5">
          <p class="text-[14px] font-bold text-[#0f172a] flex items-center gap-[7px]">
            <span class="text-[16px]">⚡</span> Quick Settings
          </p>
          <div class="flex flex-col gap-3.5">
            <div class="flex items-center justify-between gap-3">
              <div class="flex-1 min-w-0">
                <p class="text-[13.5px] font-medium text-[#0f172a]">Notifications</p>
                <p class="text-[12px] text-[#64748b] mt-0.5">Scan results and app alerts</p>
              </div>
              <button class="relative w-[42px] h-6 rounded-full border-none cursor-pointer shrink-0 transition-colors duration-200" :class="quick.notifications ? 'bg-[#10b981]' : 'bg-[#d1d5db]'" @click="quick.notifications = !quick.notifications">
                <div class="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200" :class="quick.notifications ? 'translate-x-[18px]' : ''"></div>
              </button>
            </div>
            <div class="flex items-center justify-between gap-3">
              <div class="flex-1 min-w-0">
                <p class="text-[13.5px] font-medium text-[#0f172a]">Dark Mode</p>
                <p class="text-[12px] text-[#64748b] mt-0.5">Switch to dark interface</p>
              </div>
              <button class="relative w-[42px] h-6 rounded-full border-none cursor-pointer shrink-0 transition-colors duration-200" :class="quick.darkMode ? 'bg-[#10b981]' : 'bg-[#d1d5db]'" @click="quick.darkMode = !quick.darkMode">
                <div class="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200" :class="quick.darkMode ? 'translate-x-[18px]' : ''"></div>
              </button>
            </div>
            <div class="flex items-center justify-between gap-3">
              <div class="flex-1 min-w-0">
                <p class="text-[13.5px] font-medium text-[#0f172a]">Location Access</p>
                <p class="text-[12px] text-[#64748b] mt-0.5">Required for pinning mushroom locations</p>
              </div>
              <button class="relative w-[42px] h-6 rounded-full border-none cursor-pointer shrink-0 transition-colors duration-200" :class="quick.location ? 'bg-[#10b981]' : 'bg-[#d1d5db]'" @click="quick.location = !quick.location">
                <div class="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200" :class="quick.location ? 'translate-x-[18px]' : ''"></div>
              </button>
            </div>
          </div>
        </div>

        <!-- Storage -->
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 pb-4 flex flex-col gap-3.5">
          <p class="text-[14px] font-bold text-[#0f172a] flex items-center gap-[7px]">
            <span class="text-[16px]">💾</span> Storage
          </p>
          <p class="text-[13.5px] font-medium text-[#0f172a]">{{ storageUsed }}MB of {{ storageTotal }}MB used</p>
          <div class="h-2 bg-[#e5e7eb] rounded-[10px] overflow-hidden">
            <div class="h-full bg-[#10b981] rounded-[10px] transition-[width] duration-400 ease-in-out" :style="{ width: storagePercent + '%' }" />
          </div>
          <p class="text-[12px] text-[#64748b] -mt-1.5">Scan images and history data</p>
          <div class="flex gap-2">
            <button class="py-2 px-4 rounded-lg border border-[#e2e8f0] bg-white text-[13px] font-medium font-sans text-[#0f172a] cursor-pointer transition-colors duration-[0.18s] hover:bg-[#f8fafc]" @click="clearCache">Clear Cache</button>
            <button class="py-2 px-4 rounded-lg border border-[#e2e8f0] bg-white text-[13px] font-medium font-sans text-[#0f172a] cursor-pointer transition-colors duration-[0.18s] hover:bg-[#f8fafc]" @click="exportData">Export My Data</button>
          </div>
        </div>

        <!-- Privacy -->
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 pb-4 flex flex-col gap-3.5">
          <p class="text-[14px] font-bold text-[#0f172a] flex items-center gap-[7px]">
            <span class="text-[16px]">🔒</span> Privacy
          </p>
          <div class="flex flex-col gap-3.5">
            <div class="flex items-center justify-between gap-3">
              <div class="flex-1 min-w-0">
                <p class="text-[13.5px] font-medium text-[#0f172a]">Share Data for Research</p>
                <p class="text-[12px] text-[#64748b] mt-0.5">Help improve mushroom identification AI (anonymous)</p>
              </div>
              <button class="relative w-[42px] h-6 rounded-full border-none cursor-pointer shrink-0 transition-colors duration-200" :class="privacy.shareData ? 'bg-[#10b981]' : 'bg-[#d1d5db]'" @click="privacy.shareData = !privacy.shareData">
                <div class="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200" :class="privacy.shareData ? 'translate-x-[18px]' : ''"></div>
              </button>
            </div>
            <div class="flex items-center justify-between gap-3">
              <div class="flex-1 min-w-0">
                <p class="text-[13.5px] font-medium text-[#0f172a]">Public Collection</p>
                <p class="text-[12px] text-[#64748b] mt-0.5">Allow others to view your mushroom collection</p>
              </div>
              <button class="relative w-[42px] h-6 rounded-full border-none cursor-pointer shrink-0 transition-colors duration-200" :class="privacy.publicCollection ? 'bg-[#10b981]' : 'bg-[#d1d5db]'" @click="privacy.publicCollection = !privacy.publicCollection">
                <div class="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200" :class="privacy.publicCollection ? 'translate-x-[18px]' : ''"></div>
              </button>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="bg-[#fff8f8] border border-[#fecaca] rounded-[14px] p-5 pb-4 flex flex-col gap-3.5">
          <p class="text-[14px] font-bold text-[#dc2626] flex items-center gap-[7px]">
            <span class="text-[16px]">⚠️</span> Danger Zone
          </p>
          <p class="text-[12.5px] text-[#7f1d1d] leading-[1.6]">Once you delete your account, all your scans, collection, and history will be permanently removed. This cannot be undone.</p>
          <button class="py-2.5 px-[22px] rounded-[9px] bg-[#dc2626] text-white border-none text-[13.5px] font-semibold font-sans cursor-pointer self-start transition-colors duration-[0.18s] hover:bg-[#b91c1c]">Delete Account</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user' })

const config = useRuntimeConfig()

const userProfile = reactive({
  name: 'User',
  email: '',
  initials: 'U',
  joined: '...',
  photo: ''
})

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    const user = JSON.parse(storedUser)
    userProfile.name = user.name || user.username || 'User'
    userProfile.email = user.email || 'No email'
    
    // Initials
    userProfile.initials = userProfile.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    // Joined date
    if (user.created_at) {
      userProfile.joined = new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }

    if (user.profile_photo) {
      userProfile.photo = `${config.public.apiBase.replace('/api', '')}/storage/${user.profile_photo}`
    }
  }
})

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
