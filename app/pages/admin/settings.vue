<template>
  <div class="flex flex-col gap-[22px]">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-[22px] font-bold text-[#0f172a]">System Settings</h1>
        <p class="text-[13.5px] text-[#64748b] mt-[3px]">Configure application behaviour and administrative preferences</p>
      </div>
      <button class="w-full sm:w-auto justify-center py-[9px] px-5 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] text-white border-none text-[13.5px] font-semibold font-sans cursor-pointer transition-opacity duration-[0.18s] hover:opacity-90 flex items-center gap-2" @click="saveAll" :disabled="isSavingSettings">
        <span v-if="isSavingSettings">Saving...</span>
        <span v-else class="inline-flex items-center gap-1.5"><AppIcon name="save" class="w-4 h-4" />Save Changes</span>
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
      <!-- LEFT COLUMN -->
      <div class="flex flex-col gap-4">
        <!-- AI Model Settings -->
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex flex-col gap-3.5 transition-colors duration-[0.18s]">
          <div class="flex items-center gap-2.5">
            <span class="w-[34px] h-[34px] rounded-lg flex items-center justify-center shrink-0 bg-[#d1fae5] text-[#059669]"><AppIcon name="cpu" class="w-4 h-4" /></span>
            <p class="text-[14px] font-bold text-[#0f172a] flex-1">AI Model Settings</p>
          </div>
          <div class="flex items-center justify-between gap-4 py-2.5 border-t border-[#f1f5f9]">
            <div class="flex-1 min-w-0">
              <p class="text-[13.5px] font-medium text-[#0f172a]">Confidence Threshold</p>
              <p class="text-[12px] text-[#94a3b8] mt-0.5">Minimum score required for a classification result</p>
            </div>
            <div class="flex items-center gap-2.5">
              <input type="range" v-model.number="model.threshold" min="50" max="99" class="w-[120px] accent-[#10b981] cursor-pointer"/>
              <span class="text-[13.5px] font-bold text-[#10b981] min-w-[36px] text-right">{{ model.threshold }}%</span>
            </div>
          </div>
          <div class="flex items-center justify-between gap-4 py-2.5 border-t border-[#f1f5f9]">
            <div class="flex-1 min-w-0">
              <p class="text-[13.5px] font-medium text-[#0f172a]">Model Version</p>
              <p class="text-[12px] text-[#94a3b8] mt-0.5">Active identification model</p>
            </div>
            <select v-model="model.version" class="py-[7px] px-3 border border-[#e2e8f0] rounded-lg text-[13px] font-sans bg-white cursor-pointer outline-none">
              <option>MycoNet v2.1 (Stable)</option>
              <option>MycoNet v2.2 (Beta)</option>
            </select>
          </div>
          <div class="flex items-center justify-between gap-4 py-2.5 border-t border-[#f1f5f9]">
            <div class="flex-1 min-w-0">
              <p class="text-[13.5px] font-medium text-[#0f172a]">Multi-label Classification</p>
              <p class="text-[12px] text-[#94a3b8] mt-0.5">Allow identification of multiple species per scan</p>
            </div>
            <button class="relative w-[42px] h-6 rounded-full border-none cursor-pointer shrink-0 transition-colors duration-200" :class="model.multiLabel ? 'bg-[#10b981]' : 'bg-[#d1d5db]'" @click="model.multiLabel = !model.multiLabel">
              <div class="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200" :class="model.multiLabel ? 'translate-x-[18px]' : ''"></div>
            </button>
          </div>
          <div class="bg-[#f8fafc] rounded-[10px] py-3 px-3.5 flex flex-col gap-1.5">
            <div class="flex justify-between items-center"><span class="text-[12.5px] text-[#64748b]">Model version:</span><span class="text-[13px] font-medium text-[#0f172a]">{{ model.version }}</span></div>
            <div class="flex justify-between items-center"><span class="text-[12.5px] text-[#64748b]">Threshold:</span><span class="text-[13px] font-medium text-[#0f172a]">{{ model.threshold }}%</span></div>
            <div class="flex justify-between items-center"><span class="text-[12.5px] text-[#64748b]">Multi-label:</span><span class="text-[13px] font-medium" :class="model.multiLabel ? 'text-[#10b981]' : 'text-[#94a3b8]'">{{ model.multiLabel ? 'Enabled' : 'Disabled' }}</span></div>
          </div>
        </div>

        <!-- Data Retention -->
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex flex-col gap-3.5 transition-colors duration-[0.18s]">
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
        <!-- Maintenance Mode -->
        <div class="border rounded-[14px] p-5 flex flex-col gap-3.5 transition-colors duration-[0.18s]" :class="maintenance.enabled ? 'bg-[#fff8f8] border-[#fca5a5]' : 'bg-white border-[#e2e8f0]'">
          <div class="flex items-center gap-2.5">
            <span class="w-[34px] h-[34px] rounded-lg flex items-center justify-center shrink-0 bg-[#fee2e2] text-[#dc2626]"><AppIcon name="wrench" class="w-4 h-4" /></span>
            <p class="text-[14px] font-bold text-[#0f172a] flex-1">Maintenance Mode</p>
            <span v-if="maintenance.enabled" class="text-[11px] font-bold text-[#dc2626] bg-[#fee2e2] py-[3px] px-2 rounded-[20px]">ACTIVE</span>
          </div>
          <div class="flex items-center justify-between gap-4 py-2.5 border-t border-[#f1f5f9]">
            <div class="flex-1 min-w-0">
              <p class="text-[13.5px] font-medium text-[#0f172a]">Enable Maintenance Mode</p>
              <p class="text-[12px] text-[#94a3b8] mt-0.5">Users will see a maintenance notice; scanning is disabled</p>
            </div>
            <button class="relative w-[42px] h-6 rounded-full border-none cursor-pointer shrink-0 transition-colors duration-200" :class="maintenance.enabled ? 'bg-[#ef4444]' : 'bg-[#d1d5db]'" @click="maintenance.enabled = !maintenance.enabled">
              <div class="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200" :class="maintenance.enabled ? 'translate-x-[18px]' : ''"></div>
            </button>
          </div>
          <div v-if="maintenance.enabled" class="flex flex-col items-stretch sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 py-2.5 border-t border-[#f1f5f9]">
            <div class="flex-1 min-w-0"><p class="text-[13.5px] font-medium text-[#0f172a]">Maintenance Message</p></div>
            <textarea v-model="maintenance.message" class="w-full py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13px] font-sans resize-y outline-none focus:border-[#ef4444]" rows="2" placeholder="We're currently performing scheduled maintenance…"/>
          </div>
        </div>

        <!-- Admin Accounts -->
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex flex-col gap-3.5 transition-colors duration-[0.18s]">
          <div class="flex items-center gap-2.5">
            <span class="w-[34px] h-[34px] rounded-lg flex items-center justify-center shrink-0 bg-[#f3e8ff] text-[#7c3aed]"><AppIcon name="crown" class="w-4 h-4" /></span>
            <p class="text-[14px] font-bold text-[#0f172a] flex-1">Admin Accounts</p>
            <NuxtLink v-if="isSuperAdmin" to="/admin/accounts" class="py-1.5 px-3.5 rounded-[7px] bg-[#f1f5f9] border border-[#e2e8f0] text-[12.5px] font-semibold cursor-pointer font-sans text-[#0f172a] transition-colors duration-[0.18s] hover:bg-[#e2e8f0] no-underline flex items-center gap-1">Manage</NuxtLink>
          </div>
          
          <div v-if="loadingAdmins" class="py-4 text-center text-[#94a3b8] text-[13px]">Loading admins...</div>
          <div v-else class="overflow-x-auto">
            <table class="w-full min-w-[420px] border-collapse">
            <thead>
              <tr>
                <th class="text-left text-[11px] font-semibold text-[#94a3b8] uppercase py-1.5 px-2 border-b border-[#f1f5f9]">Name</th>
                <th class="text-left text-[11px] font-semibold text-[#94a3b8] uppercase py-1.5 px-2 border-b border-[#f1f5f9]">Role</th>
                <th class="text-left text-[11px] font-semibold text-[#94a3b8] uppercase py-1.5 px-2 border-b border-[#f1f5f9]">Added</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in admins" :key="a.id">
                <td class="font-medium py-[9px] px-2 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">
                  <div class="flex items-center gap-2">
                    <div class="w-[26px] h-[26px] rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0" :class="a.role === 'super_admin' ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 'bg-gradient-to-br from-[#10b981] to-[#059669]'">{{ getInitials(a.name) }}</div>
                    <div>
                      <p class="leading-none">{{ a.name }}</p>
                      <p class="text-[11px] text-[#94a3b8] font-normal mt-0.5 leading-none">{{ a.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-[9px] px-2 border-b border-[#f8fafc] align-middle group-last:border-none">
                   <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize" :class="a.role === 'super_admin' ? 'bg-amber-100 text-amber-700' : 'bg-[#d1fae5] text-[#065f46]'">
                      {{ a.role.replace('_', ' ') }}
                   </span>
                </td>
                <td class="text-[#94a3b8] text-[12px] whitespace-nowrap py-[9px] px-2 border-b border-[#f8fafc] align-middle group-last:border-none">{{ formatDate(a.created_at) }}</td>
              </tr>
            </tbody>
            </table>
          </div>
          <div v-if="!isSuperAdmin" class="mt-2 text-[12px] text-[#64748b] flex items-start gap-1.5">
             <AppIcon name="warning" class="w-4 h-4 text-amber-500 mt-0.5" />
             <p>Only Super Administrators can add or remove admin accounts. Please contact a Super Admin for account changes.</p>
          </div>
        </div>

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

// Settings are persisted to localStorage (no backend settings endpoint yet).
// On mount we restore whatever was last saved, so changes survive page reloads.
const SETTINGS_KEY = 'mv_admin_settings'

const model     = reactive({ threshold: 75, version: 'MycoNet v2.1 (Stable)', multiLabel: false })
const retention = reactive({ autoDelete: true, days: 180, backup: 'Daily' })
const maintenance = reactive({ enabled: false, message: '' })

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

const admins = ref<any[]>([])
const loadingAdmins = ref(true)
const isSuperAdmin = ref(false)

const getHeaders = () => {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

onMounted(async () => {
  isSuperAdmin.value = localStorage.getItem('role') === 'super_admin'

  // Restore previously saved settings
  try {
    const saved = localStorage.getItem(SETTINGS_KEY)
    if (saved) {
      const s = JSON.parse(saved)
      if (s.model)       Object.assign(model, s.model)
      if (s.retention)   Object.assign(retention, s.retention)
      if (s.maintenance) Object.assign(maintenance, s.maintenance)
    }
  } catch {}

  fetchAdmins()
  checkBackendHealth()
})

async function fetchAdmins() {
  loadingAdmins.value = true
  try {
    // We can fetch users and filter by role=admin,super_admin
    // using the /admin/users endpoint which admins have access to.
    const res = await $fetch<any>(`${config.public.apiBase}/admin/users?per_page=100`, {
      headers: getHeaders()
    })
    
    // Filter down to admins and super_admins
    admins.value = res.data.filter((u: any) => u.role === 'admin' || u.role === 'super_admin')
  } catch (error) {
    console.error('Failed to fetch admins:', error)
  } finally {
    loadingAdmins.value = false
  }
}

function getInitials(name: string) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function saveAll() { 
  isSavingSettings.value = true
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      model:       { ...model },
      retention:   { ...retention },
      maintenance: { ...maintenance },
    }))
    toastSuccess('Settings saved.')
  } catch {
    toastError('Failed to save settings.')
  } finally {
    isSavingSettings.value = false
  }
}
</script>
