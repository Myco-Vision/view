<template>
  <div class="flex flex-col gap-[22px]">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div class="flex items-center gap-2.5 flex-wrap">
          <h1 class="text-[22px] font-bold text-[#0f172a]">System Settings</h1>
          <span v-if="!isSuperAdmin" class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full px-2.5 py-0.5">
            Admin View
          </span>
        </div>
        <p class="text-[13.5px] text-[#64748b] mt-[3px]">
          {{ isSuperAdmin ? 'Configure application behaviour and data retention preferences' : 'System preferences and platform information' }}
        </p>
      </div>
      <button v-if="isSuperAdmin" class="w-full sm:w-auto justify-center py-[9px] px-5 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] text-white border-none text-[13.5px] font-semibold font-sans cursor-pointer transition-opacity duration-[0.18s] hover:opacity-90 flex items-center gap-2" @click="saveAll" :disabled="isSavingSettings">
        <span v-if="isSavingSettings">Saving...</span>
        <span v-else class="inline-flex items-center gap-1.5"><AppIcon name="save" class="w-4 h-4" />Save Changes</span>
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
      <!-- LEFT COLUMN -->
      <div class="flex flex-col gap-4">
        <!-- Data Retention (Super Admin Only) -->
        <div v-if="isSuperAdmin" class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex flex-col gap-3.5 transition-colors duration-[0.18s]">
          <div class="flex items-center gap-2.5">
            <span class="w-[34px] h-[34px] rounded-lg flex items-center justify-center shrink-0 bg-[#fef3c7] text-[#d97706]"><AppIcon name="save" class="w-4 h-4" /></span>
            <p class="text-[14px] font-bold text-[#0f172a] flex-1">Data Retention</p>
          </div>
          <div class="flex items-center justify-between gap-4 py-2.5 border-t border-[#f1f5f9]">
            <div class="flex-1 min-w-0">
              <p class="text-[13.5px] font-medium text-[#0f172a]">Auto-delete Scan History</p>
              <p class="text-[12px] text-[#94a3b8] mt-0.5">Automatically remove old scan records</p>
            </div>
            <button class="relative w-[42px] h-6 rounded-full border-none cursor-pointer shrink-0 transition-colors duration-200" :class="retention.autoDelete ? 'bg-[#10b981]' : 'bg-[#d1d5db]'" @click="retention.autoDelete = !retention.autoDelete">
              <div class="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200" :class="retention.autoDelete ? 'translate-x-[18px]' : ''"></div>
            </button>
          </div>
          <div v-if="retention.autoDelete" class="flex items-center justify-between gap-4 py-2.5 border-t border-[#f1f5f9]">
            <div class="flex-1 min-w-0">
              <p class="text-[13.5px] font-medium text-[#0f172a]">Retention Period</p>
              <p class="text-[12px] text-[#94a3b8] mt-0.5">Days before scan records are deleted</p>
            </div>
            <div class="flex items-center gap-1.5">
              <input type="number" v-model.number="retention.days" min="30" max="365" class="w-[72px] py-[7px] px-2.5 border border-[#e2e8f0] rounded-lg text-[14px] font-sans text-center outline-none focus:border-[#10b981]"/>
              <span class="text-[13px] text-[#64748b]">days</span>
            </div>
          </div>
          <div class="flex items-center justify-between gap-4 py-2.5 border-t border-[#f1f5f9]">
            <div class="flex-1 min-w-0">
              <p class="text-[13.5px] font-medium text-[#0f172a]">Backup Frequency</p>
              <p class="text-[12px] text-[#94a3b8] mt-0.5">Database backup schedule</p>
            </div>
            <select v-model="retention.backup" class="py-[7px] px-3 border border-[#e2e8f0] rounded-lg text-[13px] font-sans bg-white cursor-pointer outline-none">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="flex flex-col gap-4">
        <!-- App Info -->
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex flex-col gap-3.5 transition-colors duration-[0.18s]">
          <div class="flex items-center gap-2.5">
            <span class="w-[34px] h-[34px] rounded-lg flex items-center justify-center shrink-0 bg-[#dbeafe] text-[#1d4ed8]"><AppIcon name="info" class="w-4 h-4" /></span>
            <p class="text-[14px] font-bold text-[#0f172a] flex-1">App Information</p>
          </div>
          <div class="flex flex-col">
            <div class="flex justify-between items-center py-[9px] border-b border-[#f8fafc] last:border-none"><span class="text-[12.5px] text-[#64748b]">App Name</span><span class="text-[13px] font-semibold text-[#0f172a]">MycoVision</span></div>
            <div class="flex justify-between items-center py-[9px] border-b border-[#f8fafc] last:border-none"><span class="text-[12.5px] text-[#64748b]">Version</span><span class="text-[13px] font-semibold text-[#0f172a]">{{ appVersion }}</span></div>
            <div class="flex justify-between items-center py-[9px] border-b border-[#f8fafc] last:border-none"><span class="text-[12.5px] text-[#64748b]">Environment</span><span class="text-[13px] font-semibold capitalize" :class="appEnv === 'production' ? 'bg-[#d1fae5] text-[#065f46] py-[2px] px-2.5 rounded-[20px]' : 'bg-[#fef3c7] text-[#92400e] py-[2px] px-2.5 rounded-[20px]'">{{ appEnv }}</span></div>
            <div class="flex justify-between items-center py-[9px] border-b border-[#f8fafc] last:border-none">
              <span class="text-[12.5px] text-[#64748b]">Backend API</span>
              <span v-if="backendOnline === null" class="text-[13px] text-[#94a3b8] font-semibold">Checking…</span>
              <span v-else-if="backendOnline" class="text-[13px] font-semibold text-[#10b981]">● Online</span>
              <span v-else class="text-[13px] font-semibold text-[#ef4444]">● Offline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ 
  layout: 'admin',
  middleware: 'role',
  roles: ['admin', 'super_admin'],
})

const { success: toastSuccess, error: toastError } = useToast()
const config = useRuntimeConfig()
const isSavingSettings = ref(false)

const SETTINGS_KEY = 'mv_admin_settings'
const retention = reactive({ autoDelete: true, days: 180, backup: 'Daily' })

// App info — read from runtime config where possible, fall back to build-time values
const appVersion = config.public.appVersion || '1.0.0-beta'
const appEnv     = config.public.appEnv     || 'development'

// Backend health — checked live
const backendOnline = ref<boolean | null>(null)
async function checkBackendHealth() {
  try {
    await $fetch(`${config.public.apiBase}/species?per_page=1`)
    backendOnline.value = true
  } catch {
    backendOnline.value = false
  }
}

const { getRole, getUser } = useAuthSession()

const isSuperAdmin = computed(() => {
  const role = getRole() || (import.meta.client ? localStorage.getItem('role') : null) || getUser()?.role
  return role === 'super_admin'
})

onMounted(async () => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY)
    if (saved) {
      const s = JSON.parse(saved)
      if (s.retention) Object.assign(retention, s.retention)
    }
  } catch {}

  checkBackendHealth()
})

function saveAll() { 
  isSavingSettings.value = true
  try {
    const payload: Record<string, any> = {
      retention: { ...retention },
    }

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload))
    toastSuccess('Settings saved.')
  } catch {
    toastError('Failed to save settings.')
  } finally {
    isSavingSettings.value = false
  }
}
</script>
