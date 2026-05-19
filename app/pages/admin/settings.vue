<template>
  <div class="settings-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">System Settings</h1>
        <p class="page-sub">Configure application behaviour and administrative preferences</p>
      </div>
      <button class="save-all-btn" @click="saveAll">💾 Save Changes</button>
    </div>

    <div class="settings-grid">

      <!-- LEFT COLUMN -->
      <div class="settings-col">

        <!-- AI Model Settings -->
        <div class="settings-card">
          <div class="card-head">
            <span class="card-icon" style="background:#d1fae5;color:#059669">🤖</span>
            <p class="card-title">AI Model Settings</p>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Confidence Threshold</p>
              <p class="setting-desc">Minimum score required for a classification result</p>
            </div>
            <div class="slider-wrap">
              <input type="range" v-model.number="model.threshold" min="50" max="99" class="slider"/>
              <span class="slider-val">{{ model.threshold }}%</span>
            </div>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Model Version</p>
              <p class="setting-desc">Active identification model</p>
            </div>
            <select v-model="model.version" class="setting-select">
              <option>MycoNet v2.1 (Stable)</option>
              <option>MycoNet v2.2 (Beta)</option>
            </select>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Multi-label Classification</p>
              <p class="setting-desc">Allow identification of multiple species per scan</p>
            </div>
            <button class="toggle" :class="{ 'toggle--on': model.multiLabel }" @click="model.multiLabel = !model.multiLabel"/>
          </div>
          <div class="model-info-box">
            <div class="info-row">
              <span class="info-key">Last updated:</span>
              <span class="info-val">May 1, 2026</span>
            </div>
            <div class="info-row">
              <span class="info-key">Training dataset:</span>
              <span class="info-val">48,500 images</span>
            </div>
            <div class="info-row">
              <span class="info-key">Accuracy (val):</span>
              <span class="info-val" style="color:#10b981;font-weight:700">94.2%</span>
            </div>
          </div>
        </div>

        <!-- Data Retention -->
        <div class="settings-card">
          <div class="card-head">
            <span class="card-icon" style="background:#fef3c7;color:#d97706">💾</span>
            <p class="card-title">Data Retention</p>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Auto-delete Scan History</p>
              <p class="setting-desc">Automatically remove old scan records</p>
            </div>
            <button class="toggle" :class="{ 'toggle--on': retention.autoDelete }" @click="retention.autoDelete = !retention.autoDelete"/>
          </div>
          <div v-if="retention.autoDelete" class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Retention Period</p>
              <p class="setting-desc">Days before scan records are deleted</p>
            </div>
            <div class="number-input-wrap">
              <input type="number" v-model.number="retention.days" min="30" max="365" class="number-input"/>
              <span class="number-unit">days</span>
            </div>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Backup Frequency</p>
              <p class="setting-desc">Database backup schedule</p>
            </div>
            <select v-model="retention.backup" class="setting-select">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN -->
      <div class="settings-col">

        <!-- Maintenance Mode -->
        <div class="settings-card" :class="{ 'card--warning': maintenance.enabled }">
          <div class="card-head">
            <span class="card-icon" style="background:#fee2e2;color:#dc2626">🔧</span>
            <p class="card-title">Maintenance Mode</p>
            <span v-if="maintenance.enabled" class="warning-badge">ACTIVE</span>
          </div>
          <div class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Enable Maintenance Mode</p>
              <p class="setting-desc">Users will see a maintenance notice; scanning is disabled</p>
            </div>
            <button class="toggle" :class="{ 'toggle--on': maintenance.enabled, 'toggle--danger': maintenance.enabled }"
                    @click="maintenance.enabled = !maintenance.enabled"/>
          </div>
          <div v-if="maintenance.enabled" class="setting-row">
            <div class="setting-info">
              <p class="setting-label">Maintenance Message</p>
            </div>
            <textarea v-model="maintenance.message" class="maint-textarea" rows="2"
              placeholder="We're currently performing scheduled maintenance…"/>
          </div>
        </div>

        <!-- Admin Accounts -->
        <div class="settings-card">
          <div class="card-head">
            <span class="card-icon" style="background:#f3e8ff;color:#7c3aed">👑</span>
            <p class="card-title">Admin Accounts</p>
            <button class="add-admin-btn" @click="showAddAdmin = true">+ Add Admin</button>
          </div>
          <table class="admin-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Added</th><th></th></tr>
            </thead>
            <tbody>
              <tr v-for="a in admins" :key="a.id">
                <td class="td-admin-name">
                  <div class="mini-avatar" :style="{ background: a.color }">{{ a.initials }}</div>
                  {{ a.name }}
                </td>
                <td class="td-email">{{ a.email }}</td>
                <td class="td-date">{{ a.added }}</td>
                <td>
                  <button class="remove-btn" @click="removeAdmin(a)" title="Remove admin">✕</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- App Info -->
        <div class="settings-card">
          <div class="card-head">
            <span class="card-icon" style="background:#dbeafe;color:#1d4ed8">ℹ️</span>
            <p class="card-title">App Information</p>
          </div>
          <div class="info-list">
            <div class="info-row2"><span class="info-key">App Name</span><span class="info-val2">MycoVision</span></div>
            <div class="info-row2"><span class="info-key">Version</span><span class="info-val2">1.0.0-beta</span></div>
            <div class="info-row2"><span class="info-key">Environment</span><span class="info-val2 env-chip">Development</span></div>
            <div class="info-row2"><span class="info-key">Last Deploy</span><span class="info-val2">May 7, 2026</span></div>
            <div class="info-row2"><span class="info-key">Backend API</span><span class="info-val2 status-ok">● Online</span></div>
          </div>
        </div>

      </div>
    </div>

    <!-- Add Admin Modal -->
    <div v-if="showAddAdmin" class="modal-overlay" @click.self="showAddAdmin = false">
      <div class="modal">
        <div class="modal-header">
          <p class="modal-title">Add Administrator</p>
          <button class="modal-close" @click="showAddAdmin = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input v-model="newAdmin.name" class="form-input" placeholder="e.g. John Doe"/>
          </div>
          <div class="form-group">
            <label class="form-label">Email *</label>
            <input v-model="newAdmin.email" class="form-input" type="email" placeholder="admin@email.com"/>
          </div>
          <div class="form-group">
            <label class="form-label">Temporary Password *</label>
            <input v-model="newAdmin.password" class="form-input" type="password" placeholder="••••••••"/>
          </div>
          <div class="modal-actions">
            <button class="cancel-btn" @click="showAddAdmin = false">Cancel</button>
            <button class="save-btn" @click="addAdmin">Add Admin</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const model = reactive({ threshold: 75, version: 'MycoNet v2.1 (Stable)', multiLabel: false })
const retention = reactive({ autoDelete: true, days: 180, backup: 'Daily' })
const maintenance = reactive({ enabled: false, message: '' })
const showAddAdmin = ref(false)
const newAdmin = reactive({ name: '', email: '', password: '' })

const admins = ref([
  { id: 1, name: 'Ana Reyes',    initials: 'AR', email: 'ana@email.com',  added: 'Feb 14, 2026', color: '#8b5cf6' },
  { id: 2, name: 'Mark Bautista',initials: 'MB', email: 'mark@email.com', added: 'Jan 05, 2026', color: '#6366f1' },
])

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
</script>

<style scoped>
.settings-page { display: flex; flex-direction: column; gap: 22px; }
.page-header   { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.page-title    { font-size: 22px; font-weight: 700; color: #0f172a; }
.page-sub      { font-size: 13.5px; color: #64748b; margin-top: 3px; }
.save-all-btn  { padding: 9px 20px; border-radius: 8px; background: linear-gradient(135deg,#10b981,#059669); color: #fff; border: none; font-size: 13.5px; font-weight: 600; font-family: inherit; cursor: pointer; transition: opacity .18s; }
.save-all-btn:hover { opacity: .88; }

.settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
.settings-col  { display: flex; flex-direction: column; gap: 16px; }
.settings-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 14px; transition: border-color .18s; }
.card--warning { border-color: #fca5a5; background: #fff8f8; }

.card-head  { display: flex; align-items: center; gap: 10px; }
.card-icon  { width: 34px; height: 34px; border-radius: 8px; font-size: 17px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.card-title { font-size: 14px; font-weight: 700; color: #0f172a; flex: 1; }
.warning-badge { font-size: 11px; font-weight: 700; color: #dc2626; background: #fee2e2; padding: 3px 8px; border-radius: 20px; }

.setting-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 10px 0; border-top: 1px solid #f1f5f9; }
.setting-info { flex: 1; min-width: 0; }
.setting-label { font-size: 13.5px; font-weight: 500; color: #0f172a; }
.setting-desc  { font-size: 12px; color: #94a3b8; margin-top: 2px; }

.slider-wrap { display: flex; align-items: center; gap: 10px; }
.slider      { width: 120px; accent-color: #10b981; cursor: pointer; }
.slider-val  { font-size: 13.5px; font-weight: 700; color: #10b981; min-width: 36px; text-align: right; }
.setting-select { padding: 7px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; font-family: inherit; background: #fff; cursor: pointer; outline: none; }
.number-input-wrap { display: flex; align-items: center; gap: 6px; }
.number-input { width: 72px; padding: 7px 10px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; font-family: inherit; text-align: center; outline: none; }
.number-input:focus { border-color: #10b981; }
.number-unit { font-size: 13px; color: #64748b; }

.toggle { width: 42px; height: 24px; border-radius: 12px; background: #d1d5db; border: none; cursor: pointer; position: relative; flex-shrink: 0; transition: background .2s; }
.toggle::after { content: ''; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.2); transition: transform .2s; }
.toggle--on { background: #10b981; }
.toggle--on::after { transform: translateX(18px); }
.toggle--danger { background: #ef4444; }

.model-info-box { background: #f8fafc; border-radius: 10px; padding: 12px 14px; display: flex; flex-direction: column; gap: 6px; }
.info-row  { display: flex; justify-content: space-between; align-items: center; }
.info-key  { font-size: 12.5px; color: #64748b; }
.info-val  { font-size: 13px; color: #0f172a; font-weight: 500; }

.maint-textarea { width: 100%; padding: 9px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; font-family: inherit; resize: vertical; outline: none; flex-shrink: 0; }
.maint-textarea:focus { border-color: #ef4444; }

.add-admin-btn { padding: 6px 14px; border-radius: 7px; background: #f1f5f9; border: 1px solid #e2e8f0; font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: inherit; color: #0f172a; transition: background .18s; }
.add-admin-btn:hover { background: #e2e8f0; }

.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th { text-align: left; font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; padding: 6px 8px; border-bottom: 1px solid #f1f5f9; }
.admin-table td { padding: 9px 8px; font-size: 13px; color: #334155; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
.admin-table tr:last-child td { border-bottom: none; }
.td-admin-name { display: flex; align-items: center; gap: 8px; font-weight: 500; }
.td-email { color: #64748b; font-size: 12.5px; }
.td-date  { color: #94a3b8; font-size: 12px; white-space: nowrap; }
.mini-avatar { width: 26px; height: 26px; border-radius: 50%; color: #fff; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.remove-btn  { width: 24px; height: 24px; border-radius: 6px; border: 1px solid #e2e8f0; background: #f8fafc; cursor: pointer; font-size: 11px; color: #94a3b8; transition: all .18s; }
.remove-btn:hover { background: #fee2e2; border-color: #fca5a5; color: #ef4444; }

.info-list { display: flex; flex-direction: column; gap: 0; }
.info-row2 { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; border-bottom: 1px solid #f8fafc; }
.info-row2:last-child { border-bottom: none; }
.info-val2   { font-size: 13px; font-weight: 600; color: #0f172a; }
.env-chip    { background: #fef3c7; color: #92400e; padding: 2px 10px; border-radius: 20px; font-size: 12px; }
.status-ok   { color: #10b981; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(2px); }
.modal  { background: #fff; border-radius: 16px; width: 440px; max-width: 90vw; box-shadow: 0 20px 60px rgba(0,0,0,.2); }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #f1f5f9; }
.modal-title  { font-size: 15px; font-weight: 700; color: #0f172a; }
.modal-close  { background: transparent; border: none; cursor: pointer; font-size: 16px; color: #94a3b8; }
.modal-close:hover { color: #ef4444; }
.modal-body   { padding: 22px; display: flex; flex-direction: column; gap: 14px; }
.form-group   { display: flex; flex-direction: column; gap: 6px; }
.form-label   { font-size: 12.5px; font-weight: 600; color: #475569; }
.form-input   { padding: 9px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13.5px; font-family: inherit; color: #0f172a; outline: none; }
.form-input:focus { border-color: #10b981; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; }
.cancel-btn   { padding: 9px 20px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; font-size: 13.5px; font-weight: 500; font-family: inherit; cursor: pointer; color: #475569; }
.save-btn     { padding: 9px 20px; border-radius: 8px; background: linear-gradient(135deg,#10b981,#059669); color: #fff; border: none; font-size: 13.5px; font-weight: 600; font-family: inherit; cursor: pointer; }
</style>
