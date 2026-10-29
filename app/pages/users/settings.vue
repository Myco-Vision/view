<template>
  <div class="flex flex-col gap-[18px]">
    <h1 class="text-[22px] font-bold text-[#0f172a]">Settings</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-start">

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
            <button class="flex items-center gap-2.5 py-[11px] px-3.5 rounded-[10px] border border-[#e2e8f0] bg-white text-[13.5px] font-medium font-sans text-[#0f172a] cursor-pointer transition-colors duration-[0.18s] text-left hover:bg-[#f8fafc]" @click="openChangePassword">
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
              <button 
  class="relative w-[42px] h-6 rounded-full border-none cursor-pointer shrink-0 transition-colors duration-200" 
  :class="privacy.shareData ? 'bg-[#10b981]' : 'bg-[#d1d5db]'" 
  @click="handleToggleClick">
    <div 
      class="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200" 
      :class="privacy.shareData ? 'translate-x-[18px]' : ''">
    </div>
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
          <button class="py-2.5 px-[22px] rounded-[9px] bg-[#dc2626] text-white border-none text-[13.5px] font-semibold font-sans cursor-pointer self-start transition-colors duration-[0.18s] hover:bg-[#b91c1c]" @click="deleteAccount">Delete Account</button>
        </div>

      </div>
    </div>
  </div>

  <!-- 🟢 PLACE TELEPORT HERE (INSIDE TEMPLATE) -->
  <Teleport to="body">
    <div 
      v-if="showConsentModal" 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      @click.self="closeConsentModal"
    >
      <div class="bg-white rounded-2xl w-[520px] max-w-full shadow-2xl overflow-hidden border border-[#e2e8f0] animate-in fade-in zoom-in duration-200">
        
        <!-- Modal Header -->
        <div class="p-5 border-b border-[#f1f5f9] flex items-center justify-between bg-[#f8fafc]">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-full bg-[#d1fae5] text-[#059669] flex items-center justify-center font-bold text-lg">
              🧬
            </div>
            <div>
              <h3 class="text-[16px] font-bold text-[#0f172a]">Data Sharing Permission</h3>
              <p class="text-[12px] text-[#64748b]">Help train Myco-Vision mushroom AI</p>
            </div>
          </div>
          <button 
            class="text-[#94a3b8] hover:text-[#0f172a] text-xl font-bold bg-transparent border-none cursor-pointer"
            @click="closeConsentModal"
          >✕</button>
        </div>

        <!-- Modal Body -->
        <div class="p-5 flex flex-col gap-4">
          <p class="text-[13px] text-[#475569] leading-relaxed">
            By granting permission, your scanned mushroom data will be included in our anonymized dataset to help retrain and improve AI accuracy for species identification.
          </p>

          <!-- Included Data Section -->
          <div class="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3.5 flex flex-col gap-2.5">
            <p class="text-[12px] font-bold text-[#0f172a] uppercase tracking-wider">Data Included for AI Training:</p>
            
            <ul class="flex flex-col gap-2 text-[12.5px] text-[#334155]">
              <li class="flex items-start gap-2">
                <span class="text-[15px]">📸</span>
                <span><strong>Mushroom Images:</strong> High-quality photos of scanned mushroom specimens.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-[15px]">📍</span>
                <span><strong>Geolocation Data:</strong> Latitude, longitude, and region where the specimen was scanned.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-[15px]">🏷️</span>
                <span><strong>Species Name & Details:</strong> Identified scientific name, common name, and classification.</span>
              </li>
            </ul>
          </div>

          <!-- Privacy Shield Guarantee -->
          <div class="flex items-center gap-2.5 p-3 rounded-lg bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-[12px]">
            <span class="text-[16px]">🔒</span>
            <span><strong>Your Privacy is Protected:</strong> Your personal identity, email address, and account details are <u>never</u> attached or shared.</span>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-4 border-t border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-end gap-2.5">
          <button 
            class="py-2 px-4 rounded-lg border border-[#e2e8f0] bg-white text-[13px] font-medium text-[#475569] hover:bg-[#f1f5f9] cursor-pointer"
            @click="closeConsentModal"
          >
            Cancel
          </button>
          <button 
            class="py-2 px-5 rounded-lg bg-gradient-to-r from-[#10b981] to-[#059669] text-white text-[13px] font-semibold cursor-pointer shadow-sm hover:opacity-90 disabled:opacity-50"
            :disabled="isSavingConsent"
            @click="confirmPermission"
          >
            {{ isSavingConsent ? 'Saving...' : 'I Permit & Share Data' }}
          </button>
        </div>

      </div>
    </div>
  </Teleport>

  <!-- Change Password Modal -->
  <Teleport to="body">
    <div
      v-if="showPasswordModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      @click.self="closePasswordModal"
    >
      <div class="bg-white rounded-2xl w-[460px] max-w-full shadow-2xl overflow-hidden border border-[#e2e8f0]">
        <!-- Header -->
        <div class="p-5 border-b border-[#f1f5f9] flex items-center justify-between bg-[#f8fafc]">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-full bg-[#d1fae5] text-[#059669] flex items-center justify-center font-bold text-lg">🔑</div>
            <div>
              <h3 class="text-[16px] font-bold text-[#0f172a]">Change Password</h3>
              <p class="text-[12px] text-[#64748b]">Update your account password</p>
            </div>
          </div>
          <button class="text-[#94a3b8] hover:text-[#0f172a] text-xl font-bold bg-transparent border-none cursor-pointer" @click="closePasswordModal">✕</button>
        </div>

        <!-- Body -->
        <div class="p-5 flex flex-col gap-3.5">
          <div v-if="passwordError" class="flex items-start gap-2 p-3 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-[12.5px]">
            <span>⚠️</span><span>{{ passwordError }}</span>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#0f172a]">Current Password</label>
            <div class="relative">
              <input v-model="pwForm.current" :type="showPw.current ? 'text' : 'password'" placeholder="••••••••" class="w-full py-2.5 pl-3.5 pr-10 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#10b981]" />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] cursor-pointer" @click="showPw.current = !showPw.current">{{ showPw.current ? '🙈' : '👁️' }}</button>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#0f172a]">New Password</label>
            <div class="relative">
              <input v-model="pwForm.password" :type="showPw.password ? 'text' : 'password'" placeholder="••••••••" class="w-full py-2.5 pl-3.5 pr-10 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#10b981]" />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] cursor-pointer" @click="showPw.password = !showPw.password">{{ showPw.password ? '🙈' : '👁️' }}</button>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#0f172a]">Confirm New Password</label>
            <div class="relative">
              <input v-model="pwForm.confirm" :type="showPw.confirm ? 'text' : 'password'" placeholder="••••••••" class="w-full py-2.5 pl-3.5 pr-10 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#10b981]" />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] cursor-pointer" @click="showPw.confirm = !showPw.confirm">{{ showPw.confirm ? '🙈' : '👁️' }}</button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-1.5 p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
            <span class="flex items-center gap-1.5 text-[11.5px]" :class="pwRules.len ? 'text-[#059669]' : 'text-[#94a3b8]'"><span :class="pwRules.len ? 'text-[#059669]' : 'text-[#cbd5e1]'">●</span>8+ characters</span>
            <span class="flex items-center gap-1.5 text-[11.5px]" :class="pwRules.upper ? 'text-[#059669]' : 'text-[#94a3b8]'"><span :class="pwRules.upper ? 'text-[#059669]' : 'text-[#cbd5e1]'">●</span>Uppercase A–Z</span>
            <span class="flex items-center gap-1.5 text-[11.5px]" :class="pwRules.number ? 'text-[#059669]' : 'text-[#94a3b8]'"><span :class="pwRules.number ? 'text-[#059669]' : 'text-[#cbd5e1]'">●</span>Number 0–9</span>
            <span class="flex items-center gap-1.5 text-[11.5px]" :class="pwRules.special ? 'text-[#059669]' : 'text-[#94a3b8]'"><span :class="pwRules.special ? 'text-[#059669]' : 'text-[#cbd5e1]'">●</span>Special char</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-end gap-2.5">
          <button class="py-2 px-4 rounded-lg border border-[#e2e8f0] bg-white text-[13px] font-medium text-[#475569] hover:bg-[#f1f5f9] cursor-pointer" @click="closePasswordModal">Cancel</button>
          <button class="py-2 px-5 rounded-lg bg-gradient-to-r from-[#10b981] to-[#059669] text-white text-[13px] font-semibold cursor-pointer shadow-sm hover:opacity-90 disabled:opacity-50" :disabled="changingPassword" @click="submitChangePassword">{{ changingPassword ? 'Saving...' : 'Update Password' }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user', middleware: 'auth' })

const config = useRuntimeConfig()

// User Profile State
const userProfile = reactive({
  name: 'User',
  email: '',
  initials: 'U',
  joined: '...',
  photo: ''
})

// Privacy Modal State
const showConsentModal = ref(false)
const isSavingConsent  = ref(false)

const privacy = reactive({
  shareData: false,
})

// ── Change Password ──
const showPasswordModal = ref(false)
const changingPassword  = ref(false)
const passwordError      = ref('')
const pwForm = reactive({ current: '', password: '', confirm: '' })
const showPw = reactive({ current: false, password: false, confirm: false })

const pwRules = computed(() => ({
  len:     pwForm.password.length >= 8,
  upper:   /[A-Z]/.test(pwForm.password),
  number:  /[0-9]/.test(pwForm.password),
  special: /[^A-Za-z0-9]/.test(pwForm.password),
}))

function openChangePassword() {
  passwordError.value = ''
  pwForm.current = ''
  pwForm.password = ''
  pwForm.confirm = ''
  showPw.current = false
  showPw.password = false
  showPw.confirm = false
  showPasswordModal.value = true
}

function closePasswordModal() {
  showPasswordModal.value = false
}

async function submitChangePassword() {
  passwordError.value = ''
  if (!pwForm.current) {
    passwordError.value = 'Enter your current password.'
    return
  }
  if (!pwRules.value.len) {
    passwordError.value = 'New password must be at least 8 characters.'
    return
  }
  if (!pwRules.value.upper) {
    passwordError.value = 'New password must contain an uppercase letter (A–Z).'
    return
  }
  if (!pwRules.value.number) {
    passwordError.value = 'New password must contain a number (0–9).'
    return
  }
  if (!pwRules.value.special) {
    passwordError.value = 'New password must contain a special character (e.g. !@#$%).'
    return
  }
  if (pwForm.password !== pwForm.confirm) {
    passwordError.value = 'New passwords do not match.'
    return
  }

  changingPassword.value = true
  try {
    const token = localStorage.getItem('token')
    await $fetch(`${config.public.apiBase}/change-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        current_password: pwForm.current,
        password: pwForm.password,
        password_confirmation: pwForm.confirm,
      },
    })
    useToast().success('Password updated successfully.')
    closePasswordModal()
  } catch (err: any) {
    passwordError.value =
      err?.data?.errors?.current_password?.[0] ||
      err?.data?.errors?.password?.[0] ||
      err?.data?.message ||
      'Failed to update password.'
  } finally {
    changingPassword.value = false
  }
}

function applyUser(user: any) {
  userProfile.name = user.name || user.username || 'User'
  userProfile.email = user.email || 'No email'
  privacy.shareData = Boolean(user.allow_data_training)
  userProfile.initials = userProfile.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  if (user.created_at) {
    userProfile.joined = new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  if (user.profile_photo) {
    userProfile.photo = `${config.public.apiBase.replace('/api', '')}/storage/${user.profile_photo}`
  }
}

onMounted(async () => {
  // 1) Render instantly from cached user
  const storedUser = localStorage.getItem('user')
  if (storedUser) applyUser(JSON.parse(storedUser))

  // 2) Load persisted toggles (prefs/quick are defined below; this runs after setup)
  const savedPrefs = localStorage.getItem('mv_settings_prefs')
  if (savedPrefs) Object.assign(prefs, JSON.parse(savedPrefs))
  const savedQuick = localStorage.getItem('mv_settings_quick')
  if (savedQuick) Object.assign(quick, JSON.parse(savedQuick))

  // 3) Refresh profile from the backend so it's never stale
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const user = await $fetch(`${config.public.apiBase}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      applyUser(user)
      localStorage.setItem('user', JSON.stringify(user))
    } catch {
      // keep cached user if the request fails
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

// Persist toggles so they survive reloads (client-side only)
watch(prefs, (v) => localStorage.setItem('mv_settings_prefs', JSON.stringify(v)), { deep: true })
watch(quick, (v) => localStorage.setItem('mv_settings_quick', JSON.stringify(v)), { deep: true })

const storageUsed    = 120
const storageTotal   = 500
const storagePercent = Math.round((storageUsed / storageTotal) * 100)

async function clearCache() {
  const { confirm } = useConfirm()
  const ok = await confirm({
    title: 'Clear cache?',
    message: 'Temporary scan images stored on this device will be removed. Your saved scans and history are not affected.',
    tone: 'warning',
    confirmText: 'Clear Cache',
  })
  if (ok) useToast().success('Cache cleared!')
}

function exportData() { useToast().info('Exporting data…') }

async function deleteAccount() {
  const { confirm } = useConfirm()
  const ok = await confirm({
    title: 'Delete your account?',
    message: 'All your scans, collection, and history will be permanently removed. This cannot be undone.',
    tone: 'danger',
    confirmText: 'Delete My Account',
    requireText: 'DELETE',
  })
  if (!ok) return
  // TODO: no self-service delete endpoint exists on the backend yet
  useToast().info('Account deletion is not available yet. Please contact support to delete your account.')
}

// ── Consent Toggle & Modal Handlers ──────────────────────────────────────────

function handleToggleClick() {
  if (!privacy.shareData) {
    // If turning ON -> Open modal for consent confirmation
    showConsentModal.value = true
  } else {
    // If turning OFF -> Revoke consent directly
    revokePermission()
  }
}

function closeConsentModal() {
  showConsentModal.value = false
}

// User clicks "I Permit & Share Data" in Modal
async function confirmPermission() {
  isSavingConsent.value = true
  try {
    await saveConsentApi(true)
    privacy.shareData = true
    showConsentModal.value = false
  } catch (err) {
    alert('Failed to update data sharing permission.')
  } finally {
    isSavingConsent.value = false
  }
}

// User revokes data sharing
async function revokePermission() {
  try {
    await saveConsentApi(false)
    privacy.shareData = false
  } catch (err) {
    alert('Failed to update data sharing permission.')
  }
}

// API Helper to send PUT request
async function saveConsentApi(allow: boolean) {
  const token = localStorage.getItem('token') || useCookie('token').value
  if (!token) {
    throw new Error('No authentication token found. Please log in again.')
  }
  const config = useRuntimeConfig()

  const res = await $fetch<{ user: any }>(`${config.public.apiBase}/user/consent`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: { allow_data_training: allow }
  })

  // Update cached user in localStorage
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    const user = JSON.parse(storedUser)
    user.allow_data_training = res.user.allow_data_training
    localStorage.setItem('user', JSON.stringify(user))
  }
}
</script>
