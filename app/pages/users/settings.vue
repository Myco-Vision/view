<template>
<div>
  <div class="flex flex-col gap-[18px]">
    <h1 class="text-[22px] font-bold text-[#0f172a]">Settings</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-start">

      <!-- ── LEFT COLUMN ───────────────────────────── -->
      <div class="flex flex-col gap-3.5">

        <!-- Profile Card -->
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-4 sm:p-5 flex flex-col gap-3.5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            <div class="flex items-center gap-3.5 min-w-0">
              <div class="relative shrink-0">
                <div class="w-[50px] h-[50px] sm:w-[54px] sm:h-[54px] rounded-full bg-[#10b981] text-white text-[18px] font-bold flex items-center justify-center overflow-hidden">
                  <img v-if="userProfile.photo" :src="userProfile.photo" alt="Avatar" class="w-full h-full object-cover" />
                  <span v-else>{{ userProfile.initials }}</span>
                </div>
                <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="onAvatarSelected" />
                <button type="button" :disabled="uploadingAvatar" @click="avatarInput?.click()" class="absolute -bottom-0.5 -right-0.5 disabled:opacity-50 w-7 h-7 rounded-full bg-white border border-[#e2e8f0] shadow-sm cursor-pointer flex hover:bg-[#f8fafc] items-center justify-center" title="Change photo"><svg class="w-3.5 h-3.5 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.768-6.768a2.5 2.5 0 113.536 3.536L12.536 16.536 8 18l1-5z"/></svg></button>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[14.5px] sm:text-[15px] font-semibold text-[#0f172a] truncate">{{ userProfile.name }}</p>
                <p class="text-[12px] sm:text-[12.5px] text-[#64748b] truncate mt-0.5">{{ userProfile.email }}</p>
                <p class="text-[11px] sm:text-[11.5px] text-[#64748b] mt-0.5">Member since {{ userProfile.joined }}</p>
              </div>
            </div>
            <button class="py-[7px] px-4 rounded-lg border border-[#e2e8f0] bg-white text-[13px] font-medium font-sans text-[#0f172a] cursor-pointer whitespace-nowrap transition-colors duration-[0.18s] shrink-0 self-start sm:self-auto hover:bg-[#f8fafc]" @click="openEditProfile">Edit Profile</button>
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
            <button class="flex items-center justify-between gap-2.5 py-[11px] px-3.5 rounded-[10px] border border-[#e2e8f0] bg-white text-[13.5px] font-medium font-sans text-[#0f172a] cursor-not-allowed opacity-60 w-full text-left">
              <div class="flex items-center gap-2.5">
                <span class="text-[16px]">📱</span>
                <span>Two-Factor Auth (2FA)</span>
              </div>
              <span class="text-[11px] font-semibold bg-[#f1f5f9] text-[#94a3b8] px-2 py-0.5 rounded-full">Coming Soon</span>
            </button>
            <button class="flex items-center justify-between gap-2.5 py-[11px] px-3.5 rounded-[10px] border border-[#e2e8f0] bg-white text-[13.5px] font-medium font-sans text-[#0f172a] cursor-not-allowed opacity-60 w-full text-left">
              <div class="flex items-center gap-2.5">
                <span class="text-[16px]">✉️</span>
                <span>Email Settings</span>
              </div>
              <span class="text-[11px] font-semibold bg-[#f1f5f9] text-[#94a3b8] px-2 py-0.5 rounded-full">Coming Soon</span>
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
  <!-- Edit Profile Modal -->
  <Teleport to="body">
    <div
      v-if="showEditProfile"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      @click.self="closeEditProfile"
    >
      <div class="bg-white rounded-2xl w-[480px] max-w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-[#e2e8f0]">
        <!-- Header -->
        <div class="p-5 border-b border-[#f1f5f9] flex items-center justify-between bg-[#f8fafc]">
          <div>
            <h3 class="text-[16px] font-bold text-[#0f172a]">Edit Profile</h3>
            <p class="text-[12px] text-[#64748b]">Update your personal details</p>
          </div>
          <button type="button" class="text-[#94a3b8] hover:text-[#0f172a] text-xl font-bold bg-transparent border-none cursor-pointer" aria-label="Close" @click="closeEditProfile">&times;</button>
        </div>

        <!-- Body -->
        <form class="p-5 flex flex-col gap-3.5 overflow-y-auto" @submit.prevent="submitEditProfile">
          <div v-if="editError" class="flex items-start gap-2 p-3 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-[12.5px]">
            <span>{{ editError }}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div class="flex flex-col gap-1.5">
              <label class="text-[12.5px] font-semibold text-[#0f172a]">First Name</label>
              <input v-model="editForm.first_name" type="text" maxlength="255" class="w-full py-2.5 px-3.5 rounded-lg border bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#10b981]" :class="editFieldErrors.first_name ? 'border-[#fca5a5]' : 'border-[#e2e8f0]'" />
              <p v-if="editFieldErrors.first_name" class="text-[11.5px] text-[#dc2626]">{{ editFieldErrors.first_name }}</p>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[12.5px] font-semibold text-[#0f172a]">Last Name</label>
              <input v-model="editForm.last_name" type="text" maxlength="255" class="w-full py-2.5 px-3.5 rounded-lg border bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#10b981]" :class="editFieldErrors.last_name ? 'border-[#fca5a5]' : 'border-[#e2e8f0]'" />
              <p v-if="editFieldErrors.last_name" class="text-[11.5px] text-[#dc2626]">{{ editFieldErrors.last_name }}</p>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#0f172a]">Username</label>
            <input v-model="editForm.username" type="text" maxlength="255" class="w-full py-2.5 px-3.5 rounded-lg border bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#10b981]" :class="editFieldErrors.username ? 'border-[#fca5a5]' : 'border-[#e2e8f0]'" />
            <p v-if="editFieldErrors.username" class="text-[11.5px] text-[#dc2626]">{{ editFieldErrors.username }}</p>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#0f172a]">Contact Number</label>
            <input v-model="editForm.contact_number" type="tel" maxlength="20" placeholder="0917 123 4567" class="w-full py-2.5 px-3.5 rounded-lg border bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#10b981]" :class="editFieldErrors.contact_number ? 'border-[#fca5a5]' : 'border-[#e2e8f0]'" />
            <p v-if="editFieldErrors.contact_number" class="text-[11.5px] text-[#dc2626]">{{ editFieldErrors.contact_number }}</p>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#0f172a]">Address</label>
            <textarea v-model="editForm.address" name="mv-street-address" autocomplete="off" placeholder="Street, Barangay, City, Province, Region" rows="2" maxlength="500" class="w-full py-2.5 px-3.5 rounded-lg border bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#10b981] resize-none" :class="editFieldErrors.address ? 'border-[#fca5a5]' : 'border-[#e2e8f0]'"></textarea>
            <p v-if="editFieldErrors.address" class="text-[11.5px] text-[#dc2626]">{{ editFieldErrors.address }}</p>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#0f172a]">Email</label>
            <input :value="userProfile.email" type="email" disabled class="w-full py-2.5 px-3.5 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[13px] text-[#94a3b8] cursor-not-allowed" />
          </div>

          <!-- Footer -->
          <div class="pt-3 border-t border-[#f1f5f9] flex items-center justify-end gap-2.5">
            <button type="button" class="py-2 px-4 rounded-lg border border-[#e2e8f0] bg-white text-[13px] font-medium text-[#475569] hover:bg-[#f1f5f9] cursor-pointer" :disabled="savingProfile" @click="closeEditProfile">Cancel</button>
            <button type="submit" class="py-2 px-5 rounded-lg bg-gradient-to-r from-[#10b981] to-[#059669] text-white text-[13px] font-semibold cursor-pointer shadow-sm hover:opacity-90 disabled:opacity-50" :disabled="savingProfile">{{ savingProfile ? 'Saving...' : 'Save Changes' }}</button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- Adjust Avatar Modal -->
  <Teleport to="body">
    <div
      v-if="showCrop"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      @click.self="closeCrop"
    >
      <div class="bg-white rounded-2xl w-[400px] max-w-full shadow-2xl overflow-hidden border border-[#e2e8f0]">
        <div class="p-5 border-b border-[#f1f5f9] flex items-center justify-between bg-[#f8fafc]">
          <div>
            <h3 class="text-[16px] font-bold text-[#0f172a]">Adjust Photo</h3>
            <p class="text-[12px] text-[#64748b]">Drag to reposition, use the slider to zoom</p>
          </div>
          <button type="button" class="text-[#94a3b8] hover:text-[#0f172a] text-xl font-bold bg-transparent border-none cursor-pointer" aria-label="Close" @click="closeCrop">&times;</button>
        </div>

        <div class="p-5 flex flex-col items-center gap-4">
          <div
            class="relative overflow-hidden rounded-full bg-[#f1f5f9] border-2 border-[#10b981] touch-none select-none cursor-grab active:cursor-grabbing"
            :style="{ width: CROP_VIEW + 'px', height: CROP_VIEW + 'px' }"
            @pointerdown="onCropPointerDown"
            @pointermove="onCropPointerMove"
            @pointerup="onCropPointerUp"
            @pointercancel="onCropPointerUp"
            @wheel.prevent="onCropWheel"
          >
            <img :src="cropSrc" alt="Crop preview" draggable="false" class="absolute max-w-none pointer-events-none" :style="cropImgStyle" />
          </div>

          <div class="w-full flex items-center gap-3">
            <span class="text-[12px] text-[#64748b]">-</span>
            <input v-model.number="cropZoom" type="range" min="1" max="3" step="0.01" class="flex-1 accent-[#10b981]" aria-label="Zoom" />
            <span class="text-[12px] text-[#64748b]">+</span>
          </div>
          <p v-if="cropError" class="w-full text-[12.5px] text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg px-3 py-2">{{ cropError }}</p>
        </div>

        <div class="p-4 border-t border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-end gap-2.5">
          <button type="button" class="py-2 px-4 rounded-lg border border-[#e2e8f0] bg-white text-[13px] font-medium text-[#475569] hover:bg-[#f1f5f9] cursor-pointer" :disabled="uploadingAvatar" @click="closeCrop">Cancel</button>
          <button type="button" class="py-2 px-5 rounded-lg bg-gradient-to-r from-[#10b981] to-[#059669] text-white text-[13px] font-semibold cursor-pointer shadow-sm hover:opacity-90 disabled:opacity-50" :disabled="uploadingAvatar" @click="saveCroppedAvatar">{{ uploadingAvatar ? 'Uploading...' : 'Save Photo' }}</button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Delete account: password verification -->
  <AppModal v-model="showDeleteModal" title="Confirm your password" subtitle="Enter your current password to permanently delete your account." size="sm" :persistent="isDeleting">
    <form class="flex flex-col gap-3 py-2" @submit.prevent="submitDeleteAccount">
      <input
        v-model="deletePassword"
        type="password"
        autocomplete="current-password"
        placeholder="Current password"
        class="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-red-500"
      />
      <p v-if="deleteError" class="text-xs text-red-600">{{ deleteError }}</p>
      <div class="flex justify-end gap-2 pt-1">
        <button type="button" :disabled="isDeleting" class="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm border-none cursor-pointer" @click="showDeleteModal = false">Cancel</button>
        <button type="submit" :disabled="isDeleting" class="px-4 py-2 rounded-lg bg-[#dc2626] text-white text-sm font-semibold border-none cursor-pointer disabled:opacity-60">{{ isDeleting ? 'Deleting…' : 'Delete Account' }}</button>
      </div>
    </form>
  </AppModal>

  <Teleport to="body">
    <div 
      v-if="showConsentModal" 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      @click.self="closeConsentModal"
    >
      <div class="bg-white rounded-2xl w-[520px] max-w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#e2e8f0] animate-in fade-in zoom-in duration-200">

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
      <div class="bg-white rounded-2xl w-[460px] max-w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#e2e8f0]">
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
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition cursor-pointer" @click="showPw.current = !showPw.current">
                <svg v-if="!showPw.current" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#0f172a]">New Password</label>
            <div class="relative">
              <input v-model="pwForm.password" :type="showPw.password ? 'text' : 'password'" placeholder="••••••••" class="w-full py-2.5 pl-3.5 pr-10 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#10b981]" />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition cursor-pointer" @click="showPw.password = !showPw.password">
                <svg v-if="!showPw.password" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#0f172a]">Confirm New Password</label>
            <div class="relative">
              <input v-model="pwForm.confirm" :type="showPw.confirm ? 'text' : 'password'" placeholder="••••••••" class="w-full py-2.5 pl-3.5 pr-10 rounded-lg border border-[#e2e8f0] bg-white text-[13px] text-[#0f172a] outline-none focus:border-[#10b981]" />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition cursor-pointer" @click="showPw.confirm = !showPw.confirm">
                <svg v-if="!showPw.confirm" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
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
</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user', middleware: 'auth' })

const config = useRuntimeConfig()
const { updateStoredUser, clearSession } = useAuthSession()

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

// ── Edit Profile & Avatar ───────────────────────────────────────────────────
const currentUser = ref<any>({})
const showEditProfile = ref(false)
const savingProfile = ref(false)
const editError = ref('')
const editForm = reactive({ first_name: '', last_name: '', username: '', contact_number: '', address: '' })
const editFieldErrors = reactive<Record<string, string>>({})

function authHeaders() {
  const token = localStorage.getItem('token') || useCookie('token').value
  return { Authorization: `Bearer ${token}`, Accept: 'application/json' }
}

function photoUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path // e.g. Google avatar
  return `${config.public.apiBase.replace(/\/api$/, '')}/storage/${path}`
}

function syncStoredUser(user: any) {
  updateStoredUser(user)
  applyUser(user)
  window.dispatchEvent(new Event('user-updated')) // refresh the sidebar
}

function openEditProfile() {
  const u = currentUser.value || {}
  const parts = (u.name || '').split(' ')
  editForm.first_name = u.first_name || parts[0] || ''
  editForm.last_name = u.last_name || parts.slice(1).join(' ') || ''
  editForm.username = u.username || ''
  editForm.contact_number = u.contact_number || ''
  // Guard against bad data: an address that is really an email is cleared so the user re-enters it
  editForm.address = u.address && !u.address.includes('@') ? u.address : ''
  editError.value = ''
  Object.keys(editFieldErrors).forEach((k) => delete editFieldErrors[k])
  showEditProfile.value = true
}

function closeEditProfile() {
  if (savingProfile.value) return
  showEditProfile.value = false
}

async function submitEditProfile() {
  editError.value = ''
  Object.keys(editFieldErrors).forEach((k) => delete editFieldErrors[k])
  savingProfile.value = true
  try {
    const res: any = await $fetch(`${config.public.apiBase}/user/profile`, {
      method: 'POST',
      headers: authHeaders(),
      body: { ...editForm },
    })
    syncStoredUser(res.user)
    showEditProfile.value = false
    useToast().success('Profile updated!')
  } catch (err: any) {
    const errors = err?.data?.errors
    if (errors) {
      for (const [field, msgs] of Object.entries(errors)) editFieldErrors[field] = (msgs as string[])[0]
    } else {
      editError.value = err?.data?.message || 'Failed to update profile. Please try again.'
    }
  } finally {
    savingProfile.value = false
  }
}

const avatarInput = ref<HTMLInputElement | null>(null)
const uploadingAvatar = ref(false)

// Avatar cropper: pick a file, pan/zoom inside a circular viewport, then upload the cropped square
const CROP_VIEW = 240 // viewport size in px
const CROP_OUT = 512  // exported image size in px
const showCrop = ref(false)
const cropSrc = ref('')
const cropError = ref('')
const cropNat = reactive({ w: 0, h: 0 })
const cropZoom = ref(1)
const cropOffset = reactive({ x: 0, y: 0 })
let cropImg: HTMLImageElement | null = null
let dragStart: { px: number; py: number; ox: number; oy: number } | null = null

const cropScale = computed(() =>
  cropNat.w && cropNat.h ? (CROP_VIEW / Math.min(cropNat.w, cropNat.h)) * cropZoom.value : 1,
)
const cropImgStyle = computed(() => {
  const w = cropNat.w * cropScale.value
  const h = cropNat.h * cropScale.value
  return {
    width: `${w}px`,
    height: `${h}px`,
    left: `${CROP_VIEW / 2 - w / 2 + cropOffset.x}px`,
    top: `${CROP_VIEW / 2 - h / 2 + cropOffset.y}px`,
  }
})

function clampCropOffset() {
  const maxX = Math.max(0, (cropNat.w * cropScale.value - CROP_VIEW) / 2)
  const maxY = Math.max(0, (cropNat.h * cropScale.value - CROP_VIEW) / 2)
  cropOffset.x = Math.min(maxX, Math.max(-maxX, cropOffset.x))
  cropOffset.y = Math.min(maxY, Math.max(-maxY, cropOffset.y))
}
watch(cropZoom, clampCropOffset)

function onCropPointerDown(e: PointerEvent) {
  dragStart = { px: e.clientX, py: e.clientY, ox: cropOffset.x, oy: cropOffset.y }
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}
function onCropPointerMove(e: PointerEvent) {
  if (!dragStart) return
  cropOffset.x = dragStart.ox + (e.clientX - dragStart.px)
  cropOffset.y = dragStart.oy + (e.clientY - dragStart.py)
  clampCropOffset()
}
function onCropPointerUp() { dragStart = null }
function onCropWheel(e: WheelEvent) {
  cropZoom.value = Math.min(3, Math.max(1, cropZoom.value - e.deltaY * 0.002))
}

function closeCrop() {
  if (uploadingAvatar.value) return
  showCrop.value = false
  cropError.value = ''
  if (cropSrc.value) URL.revokeObjectURL(cropSrc.value)
  cropSrc.value = ''
  cropImg = null
}

function onAvatarSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = '' // allow re-selecting the same file
  if (!file) return
  const validMime = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
  const validExt = !file.type && /\.(jpe?g|png|webp)$/i.test(file.name)
  if (!validMime && !validExt) {
    useToast().error('Please choose a JPG, PNG or WebP image.')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    useToast().error('Image must be 5MB or smaller.')
    return
  }
  const url = URL.createObjectURL(file)
  const img = new Image()
  img.onload = () => {
    cropImg = img
    cropNat.w = img.naturalWidth
    cropNat.h = img.naturalHeight
    cropZoom.value = 1
    cropOffset.x = 0
    cropOffset.y = 0
    cropError.value = ''
    cropSrc.value = url
    showCrop.value = true
  }
  img.onerror = () => {
    URL.revokeObjectURL(url)
    useToast().error('That image could not be read.')
  }
  img.src = url
}

async function saveCroppedAvatar() {
  if (!cropImg) return
  cropError.value = ''
  const canvas = document.createElement('canvas')
  canvas.width = CROP_OUT
  canvas.height = CROP_OUT
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    cropError.value = 'Could not initialize image cropper.'
    useToast().error(cropError.value)
    return
  }
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, CROP_OUT, CROP_OUT)
  const ratio = CROP_OUT / CROP_VIEW
  const w = cropNat.w * cropScale.value
  const h = cropNat.h * cropScale.value
  ctx.drawImage(
    cropImg,
    (CROP_VIEW / 2 - w / 2 + cropOffset.x) * ratio,
    (CROP_VIEW / 2 - h / 2 + cropOffset.y) * ratio,
    w * ratio,
    h * ratio,
  )
  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9))
  if (!blob) {
    cropError.value = 'Could not process the image.'
    useToast().error(cropError.value)
    return
  }

  uploadingAvatar.value = true
  try {
    const body = new FormData()
    body.append('avatar', blob, 'avatar.jpg')
    const res: any = await $fetch(`${config.public.apiBase}/user/avatar`, {
      method: 'POST',
      headers: authHeaders(),
      body,
    })
    syncStoredUser(res.user)
    uploadingAvatar.value = false
    closeCrop()
    useToast().success('Profile photo updated!')
  } catch (err: any) {
    cropError.value = err?.data?.errors?.avatar?.[0] || err?.data?.message || 'Failed to upload photo.'
    useToast().error(cropError.value)
  } finally {
    uploadingAvatar.value = false
  }
}

function applyUser(user: any) {
  currentUser.value = user
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
    userProfile.photo = photoUrl(user.profile_photo)
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
      const [user, scansRes] = await Promise.all([
        $fetch<any>(`${config.public.apiBase}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        $fetch<any>(`${config.public.apiBase}/scans?per_page=1`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])
      applyUser(user)
      localStorage.setItem('user', JSON.stringify(user))
      scansCount.value = scansRes?.total ?? scansRes?.meta?.total ?? 0
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

// Storage — fetched from the API (scan count × average image size)
const scansCount     = ref(0)
const BYTES_PER_SCAN = 0.5 // MB estimate per scan
const STORAGE_CAP_MB = 500
const storageUsed    = computed(() => Math.min(Math.round(scansCount.value * BYTES_PER_SCAN), STORAGE_CAP_MB))
const storageTotal   = STORAGE_CAP_MB
const storagePercent = computed(() => Math.round((storageUsed.value / storageTotal) * 100))

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

async function exportData() {
  const token = localStorage.getItem('token')
  if (!token) return
  useToast().info('Preparing your data export…')
  try {
    // Fetch all scans (up to 500) and export as CSV
    const res = await $fetch<any>(`${config.public.apiBase}/scans?per_page=500`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const rows: string[][] = [['ID', 'Species', 'Classification', 'Confidence', 'Latitude', 'Longitude', 'Date']]
    for (const s of (res.data ?? [])) {
      rows.push([
        s.id,
        s.result_name || 'Unknown',
        s.result_classification || 'unknown',
        Math.round(s.confidence_level || 0) + '%',
        s.latitude || '',
        s.longitude || '',
        s.created_at ? new Date(s.created_at).toLocaleDateString() : '',
      ])
    }
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `mycovision_data_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    useToast().success('Data exported successfully.')
  } catch {
    useToast().error('Export failed. Please try again.')
  }
}

async function deleteAccount() {
  const { confirm } = useConfirm()

  // Check the live subscription state (cached user may be stale) so we can warn about it
  let subscribed = false
  let tier = ''
  try {
    const token = localStorage.getItem('token') || useCookie('token').value
    const config = useRuntimeConfig()
    const me: any = await $fetch(`${config.public.apiBase}/me`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
    subscribed = !!me.is_subscribed && !['admin', 'free'].includes(me.subscription_tier)
    tier = me.subscription_tier || ''
  } catch {
    const cached = JSON.parse(localStorage.getItem('user') || '{}')
    subscribed = !!cached.is_subscribed && !['admin', 'free'].includes(cached.subscription_tier)
    tier = cached.subscription_tier || ''
  }

  const baseMsg = 'All your scans, collection, and history will be permanently removed. This cannot be undone.'
  const subWarning = subscribed
    ? ' Your Premium plan will end immediately and is Not Refundable.'
    : ''
  const ok = await confirm({
    title: 'Delete your account?',
    message: baseMsg + subWarning,
    emphasis: subscribed ? 'Not Refundable' : undefined,
    tone: 'danger',
    confirmText: 'Delete My Account',
    requireText: 'DELETE',
  })
  if (!ok) return
  deletePassword.value = ''
  deleteError.value = ''
  showDeleteModal.value = true
}

const showDeleteModal = ref(false)
const deletePassword = ref('')
const deleteError = ref('')
const isDeleting = ref(false)

async function submitDeleteAccount() {
  if (!deletePassword.value) {
    deleteError.value = 'Please enter your current password.'
    return
  }
  const token = localStorage.getItem('token') || useCookie('token').value
  if (!token) {
    deleteError.value = 'No authentication token found. Please log in again.'
    return
  }
  const config = useRuntimeConfig()
  isDeleting.value = true
  deleteError.value = ''
  try {
    await $fetch(`${config.public.apiBase}/user`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      body: { password: deletePassword.value },
    })
    clearSession()
    showDeleteModal.value = false
    useToast().success('Your account has been deleted.')
    await navigateTo('/login')
  } catch (err: any) {
    deleteError.value =
      err?.data?.errors?.password?.[0] || err?.data?.message || 'Failed to delete account. Please try again.'
  } finally {
    isDeleting.value = false
  }
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
>
