<template>
  <div class="flex flex-col gap-[22px]">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h1 class="text-[22px] font-bold text-[#0f172a]">System Settings</h1>
        <p class="text-[13.5px] text-[#64748b] mt-[3px]">Configure application behaviour and administrative preferences</p>
      </div>
      <button class="py-[9px] px-5 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] text-white border-none text-[13.5px] font-semibold font-sans cursor-pointer transition-opacity duration-[0.18s] hover:opacity-90" @click="saveAll">💾 Save Changes</button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
      <!-- LEFT COLUMN -->
      <div class="flex flex-col gap-4">
        <!-- AI Model Settings -->
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex flex-col gap-3.5 transition-colors duration-[0.18s]">
          <div class="flex items-center gap-2.5">
            <span class="w-[34px] h-[34px] rounded-lg text-[17px] flex items-center justify-center shrink-0 bg-[#d1fae5] text-[#059669]">🤖</span>
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
            <div class="flex justify-between items-center"><span class="text-[12.5px] text-[#64748b]">Last updated:</span><span class="text-[13px] font-medium text-[#0f172a]">May 1, 2026</span></div>
            <div class="flex justify-between items-center"><span class="text-[12.5px] text-[#64748b]">Training dataset:</span><span class="text-[13px] font-medium text-[#0f172a]">48,500 images</span></div>
            <div class="flex justify-between items-center"><span class="text-[12.5px] text-[#64748b]">Accuracy (val):</span><span class="text-[13px] font-bold text-[#10b981]">94.2%</span></div>
          </div>
        </div>

        <!-- Data Retention -->
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex flex-col gap-3.5 transition-colors duration-[0.18s]">
          <div class="flex items-center gap-2.5">
            <span class="w-[34px] h-[34px] rounded-lg text-[17px] flex items-center justify-center shrink-0 bg-[#fef3c7] text-[#d97706]">💾</span>
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
            <span class="w-[34px] h-[34px] rounded-lg text-[17px] flex items-center justify-center shrink-0 bg-[#fee2e2] text-[#dc2626]">🔧</span>
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
          <div v-if="maintenance.enabled" class="flex items-center justify-between gap-4 py-2.5 border-t border-[#f1f5f9]">
            <div class="flex-1 min-w-0"><p class="text-[13.5px] font-medium text-[#0f172a]">Maintenance Message</p></div>
            <textarea v-model="maintenance.message" class="w-full py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13px] font-sans resize-y outline-none shrink-0 focus:border-[#ef4444]" rows="2" placeholder="We're currently performing scheduled maintenance…"/>
          </div>
        </div>

        <!-- Admin Accounts -->
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex flex-col gap-3.5 transition-colors duration-[0.18s]">
          <div class="flex items-center gap-2.5">
            <span class="w-[34px] h-[34px] rounded-lg text-[17px] flex items-center justify-center shrink-0 bg-[#f3e8ff] text-[#7c3aed]">👑</span>
            <p class="text-[14px] font-bold text-[#0f172a] flex-1">Admin Accounts</p>
            <button class="py-1.5 px-3.5 rounded-[7px] bg-[#f1f5f9] border border-[#e2e8f0] text-[12.5px] font-semibold cursor-pointer font-sans text-[#0f172a] transition-colors duration-[0.18s] hover:bg-[#e2e8f0]" @click="showAddAdmin = true">+ Add Admin</button>
          </div>
          <table class="w-full border-collapse">
            <thead>
              <tr>
                <th class="text-left text-[11px] font-semibold text-[#94a3b8] uppercase py-1.5 px-2 border-b border-[#f1f5f9]">Name</th>
                <th class="text-left text-[11px] font-semibold text-[#94a3b8] uppercase py-1.5 px-2 border-b border-[#f1f5f9]">Email</th>
                <th class="text-left text-[11px] font-semibold text-[#94a3b8] uppercase py-1.5 px-2 border-b border-[#f1f5f9]">Added</th>
                <th class="text-left text-[11px] font-semibold text-[#94a3b8] uppercase py-1.5 px-2 border-b border-[#f1f5f9]"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in admins" :key="a.id">
                <td class="flex items-center gap-2 font-medium py-[9px] px-2 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">
                  <div class="w-[26px] h-[26px] rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0" :style="{ background: a.color }">{{ a.initials }}</div>
                  {{ a.name }}
                </td>
                <td class="text-[#64748b] text-[12.5px] py-[9px] px-2 border-b border-[#f8fafc] align-middle group-last:border-none">{{ a.email }}</td>
                <td class="text-[#94a3b8] text-[12px] whitespace-nowrap py-[9px] px-2 border-b border-[#f8fafc] align-middle group-last:border-none">{{ a.added }}</td>
                <td class="py-[9px] px-2 border-b border-[#f8fafc] align-middle group-last:border-none">
                  <button class="w-6 h-6 rounded-md border border-[#e2e8f0] bg-[#f8fafc] cursor-pointer text-[11px] text-[#94a3b8] transition-all duration-[0.18s] hover:bg-[#fee2e2] hover:border-[#fca5a5] hover:text-[#ef4444]" @click="removeAdmin(a)" title="Remove admin">✕</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- App Info -->
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex flex-col gap-3.5 transition-colors duration-[0.18s]">
          <div class="flex items-center gap-2.5">
            <span class="w-[34px] h-[34px] rounded-lg text-[17px] flex items-center justify-center shrink-0 bg-[#dbeafe] text-[#1d4ed8]">ℹ️</span>
            <p class="text-[14px] font-bold text-[#0f172a] flex-1">App Information</p>
          </div>
          <div class="flex flex-col">
            <div class="flex justify-between items-center py-[9px] border-b border-[#f8fafc] last:border-none"><span class="text-[12.5px] text-[#64748b]">App Name</span><span class="text-[13px] font-semibold text-[#0f172a]">MycoVision</span></div>
            <div class="flex justify-between items-center py-[9px] border-b border-[#f8fafc] last:border-none"><span class="text-[12.5px] text-[#64748b]">Version</span><span class="text-[13px] font-semibold text-[#0f172a]">1.0.0-beta</span></div>
            <div class="flex justify-between items-center py-[9px] border-b border-[#f8fafc] last:border-none"><span class="text-[12.5px] text-[#64748b]">Environment</span><span class="bg-[#fef3c7] text-[#92400e] py-[2px] px-2.5 rounded-[20px] text-[12px] font-semibold">Development</span></div>
            <div class="flex justify-between items-center py-[9px] border-b border-[#f8fafc] last:border-none"><span class="text-[12.5px] text-[#64748b]">Last Deploy</span><span class="text-[13px] font-semibold text-[#0f172a]">May 7, 2026</span></div>
            <div class="flex justify-between items-center py-[9px] border-b border-[#f8fafc] last:border-none"><span class="text-[12.5px] text-[#64748b]">Backend API</span><span class="text-[13px] font-semibold text-[#10b981]">● Online</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Admin Modal -->
    <div v-if="showAddAdmin" class="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] backdrop-blur-[2px]" @click.self="showAddAdmin = false">
      <div class="bg-white rounded-2xl w-[440px] max-w-[90vw] shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
        <div class="flex items-center justify-between py-[18px] px-[22px] border-b border-[#f1f5f9]">
          <p class="text-[15px] font-bold text-[#0f172a]">Add Administrator</p>
          <button class="bg-transparent border-none cursor-pointer text-[16px] text-[#94a3b8] hover:text-[#ef4444]" @click="showAddAdmin = false">✕</button>
        </div>
        <div class="p-[22px] flex flex-col gap-3.5">
          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#475569]">Full Name *</label>
            <input v-model="newAdmin.name" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] outline-none focus:border-[#10b981]" placeholder="e.g. John Doe"/>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#475569]">Email *</label>
            <input v-model="newAdmin.email" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] outline-none focus:border-[#10b981]" type="email" placeholder="admin@email.com"/>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#475569]">Temporary Password *</label>
            <input v-model="newAdmin.password" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] outline-none focus:border-[#10b981]" type="password" placeholder="••••••••"/>
          </div>
          <div class="flex justify-end gap-2.5 pt-1">
            <button class="py-[9px] px-5 rounded-lg border border-[#e2e8f0] bg-white text-[13.5px] font-medium font-sans cursor-pointer text-[#475569]" @click="showAddAdmin = false">Cancel</button>
            <button class="py-[9px] px-5 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] text-white border-none text-[13.5px] font-semibold font-sans cursor-pointer" @click="addAdmin">Add Admin</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const model = reactive({ threshold: 75, version: 'MycoNet v2.1 (Stable)', multiLabel: false })
const retention = reactive({ autoDelete: true, days: 180, backup: 'Daily' })
const maintenance = reactive({ enabled: false, message: '' })
const showAddAdmin = ref(false)
const newAdmin = reactive({ name: '', email: '', password: '' })

const admins = ref<any[]>([])

let nextAdminId = 3

function addAdmin() {
  if (!newAdmin.name || !newAdmin.email) { alert('Please fill in required fields.'); return }
  const initials = newAdmin.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  admins.value.push({ id: nextAdminId++, name: newAdmin.name, initials, email: newAdmin.email, added: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), color: '#10b981' })
  Object.assign(newAdmin, { name: '', email: '', password: '' })
  showAddAdmin.value = false
}

function removeAdmin(a: any) {
  if (confirm(`Remove ${a.name} from administrators?`)) {
    admins.value = admins.value.filter(x => x.id !== a.id)
  }
}

function saveAll() { alert('Settings saved successfully!') }
definePageMeta({ layout: 'admin' })
</script>
