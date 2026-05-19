<template>
  <div class="users-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">User Management</h1>
        <p class="page-sub">{{ users.length }} registered users</p>
      </div>
      <div class="header-actions">
        <div class="search-wrap">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="searchQuery" class="search-input" placeholder="Search users…" />
        </div>
        <select v-model="roleFilter" class="filter-select">
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select v-model="statusFilter" class="filter-select">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>
    </div>

    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th><input type="checkbox" @change="toggleAll" /></th>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Total Scans</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td><input type="checkbox" /></td>
            <td class="td-user">
              <div class="user-avatar" :style="{ background: user.avatarColor }">{{ user.initials }}</div>
              <div>
                <p class="user-name">{{ user.name }}</p>
                <p class="user-id">ID: #{{ user.id }}</p>
              </div>
            </td>
            <td class="td-email">{{ user.email }}</td>
            <td>
              <span class="role-chip" :class="`role-chip--${user.role}`">{{ user.role }}</span>
            </td>
            <td class="td-muted">{{ user.joined }}</td>
            <td class="td-scans">{{ user.scans }}</td>
            <td>
              <span class="status-dot" :class="user.status === 'active' ? 'dot--active' : 'dot--disabled'">
                {{ user.status }}
              </span>
            </td>
            <td>
              <div class="action-btns">
                <button class="act-btn act-btn--view" title="View profile" @click="openUser(user)">👁</button>
                <button class="act-btn" :title="user.status === 'active' ? 'Disable' : 'Enable'"
                        @click="toggleStatus(user)">
                  {{ user.status === 'active' ? '🔒' : '🔓' }}
                </button>
                <button class="act-btn act-btn--del" title="Delete user" @click="deleteUser(user)">🗑</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="table-footer">
        <span class="table-count">Showing {{ filteredUsers.length }} of {{ users.length }} users</span>
        <div class="pagination">
          <button class="page-btn" :disabled="page === 1" @click="page--">‹</button>
          <span class="page-info">Page {{ page }} of {{ totalPages }}</span>
          <button class="page-btn" :disabled="page === totalPages" @click="page++">›</button>
        </div>
      </div>
    </div>

    <!-- User Detail Modal -->
    <div v-if="selectedUser" class="modal-overlay" @click.self="selectedUser = null">
      <div class="modal">
        <div class="modal-header">
          <p class="modal-title">User Profile</p>
          <button class="modal-close" @click="selectedUser = null">✕</button>
        </div>
        <div class="modal-body">
          <div class="profile-row">
            <div class="profile-avatar" :style="{ background: selectedUser.avatarColor }">{{ selectedUser.initials }}</div>
            <div>
              <p class="profile-name">{{ selectedUser.name }}</p>
              <p class="profile-email">{{ selectedUser.email }}</p>
              <span class="role-chip" :class="`role-chip--${selectedUser.role}`">{{ selectedUser.role }}</span>
            </div>
          </div>
          <div class="detail-grid">
            <div class="detail-item"><p class="detail-label">User ID</p><p class="detail-val">#{{ selectedUser.id }}</p></div>
            <div class="detail-item"><p class="detail-label">Joined</p><p class="detail-val">{{ selectedUser.joined }}</p></div>
            <div class="detail-item"><p class="detail-label">Total Scans</p><p class="detail-val">{{ selectedUser.scans }}</p></div>
            <div class="detail-item"><p class="detail-label">Status</p><p class="detail-val">{{ selectedUser.status }}</p></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const searchQuery  = ref('')
const roleFilter   = ref('')
const statusFilter = ref('')
const page         = ref(1)
const perPage      = 8
const selectedUser = ref<any>(null)

const users = ref([
  { id: 1001, name: 'Maria Salem',    initials: 'MS', email: 'maria@email.com',    role: 'user',  joined: 'Apr 12, 2026', scans: 47,  status: 'active',   avatarColor: '#10b981' },
  { id: 1002, name: 'Juan Dela Cruz', initials: 'JD', email: 'juan@email.com',     role: 'user',  joined: 'Mar 28, 2026', scans: 23,  status: 'active',   avatarColor: '#3b82f6' },
  { id: 1003, name: 'Ana Reyes',      initials: 'AR', email: 'ana@email.com',      role: 'admin', joined: 'Feb 14, 2026', scans: 112, status: 'active',   avatarColor: '#8b5cf6' },
  { id: 1004, name: 'Carlo Mendoza',  initials: 'CM', email: 'carlo@email.com',    role: 'user',  joined: 'Apr 01, 2026', scans: 8,   status: 'disabled', avatarColor: '#f59e0b' },
  { id: 1005, name: 'Lisa Torres',    initials: 'LT', email: 'lisa@email.com',     role: 'user',  joined: 'Jan 20, 2026', scans: 65,  status: 'active',   avatarColor: '#ef4444' },
  { id: 1006, name: 'Ben Santos',     initials: 'BS', email: 'ben@email.com',      role: 'user',  joined: 'Mar 05, 2026', scans: 31,  status: 'active',   avatarColor: '#06b6d4' },
  { id: 1007, name: 'Grace Lim',      initials: 'GL', email: 'grace@email.com',    role: 'user',  joined: 'Apr 22, 2026', scans: 4,   status: 'active',   avatarColor: '#ec4899' },
  { id: 1008, name: 'Ramon Flores',   initials: 'RF', email: 'ramon@email.com',    role: 'user',  joined: 'Feb 09, 2026', scans: 19,  status: 'disabled', avatarColor: '#f97316' },
  { id: 1009, name: 'Joy Castillo',   initials: 'JC', email: 'joy@email.com',      role: 'user',  joined: 'Mar 17, 2026', scans: 55,  status: 'active',   avatarColor: '#14b8a6' },
  { id: 1010, name: 'Mark Bautista',  initials: 'MB', email: 'mark@email.com',     role: 'admin', joined: 'Jan 05, 2026', scans: 200, status: 'active',   avatarColor: '#6366f1' },
])

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const q = searchQuery.value.toLowerCase()
    const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    const matchR = !roleFilter.value   || u.role   === roleFilter.value
    const matchS = !statusFilter.value || u.status === statusFilter.value
    return matchQ && matchR && matchS
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / perPage)))

function toggleAll(e: Event) {
  // stub: select all checkboxes
}
function openUser(user: any) { selectedUser.value = user }
function toggleStatus(user: any) {
  user.status = user.status === 'active' ? 'disabled' : 'active'
}
function deleteUser(user: any) {
  if (confirm(`Delete user ${user.name}?`)) {
    users.value = users.value.filter(u => u.id !== user.id)
  }
}
</script>

<style scoped>
.users-page { display: flex; flex-direction: column; gap: 22px; }
.page-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.page-title  { font-size: 22px; font-weight: 700; color: #0f172a; }
.page-sub    { font-size: 13.5px; color: #64748b; margin-top: 3px; }
.header-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.search-wrap { position: relative; }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); width: 15px; height: 15px; color: #94a3b8; }
.search-input { padding: 8px 12px 8px 32px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13.5px; font-family: inherit; color: #0f172a; background: #fff; outline: none; width: 220px; transition: border-color .18s; }
.search-input:focus { border-color: #10b981; }
.filter-select { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13.5px; font-family: inherit; color: #0f172a; background: #fff; outline: none; cursor: pointer; }

.table-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; }
.data-table  { width: 100%; border-collapse: collapse; }
.data-table th { text-align: left; font-size: 11.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: .5px; padding: 12px 14px; border-bottom: 1px solid #f1f5f9; background: #f8fafc; }
.data-table td { padding: 12px 14px; font-size: 13px; color: #334155; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: #f8fafc; }

.td-user  { display: flex; align-items: center; gap: 10px; }
.td-muted { color: #94a3b8; }
.td-email { color: #475569; }
.td-scans { font-weight: 600; color: #0f172a; }
.user-avatar { width: 34px; height: 34px; border-radius: 50%; color: #fff; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.user-name   { font-weight: 600; color: #0f172a; font-size: 13.5px; }
.user-id     { font-size: 11.5px; color: #94a3b8; }

.role-chip { padding: 3px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; text-transform: capitalize; }
.role-chip--user  { background: #dbeafe; color: #1d4ed8; }
.role-chip--admin { background: #f3e8ff; color: #6d28d9; }

.status-dot { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 20px; text-transform: capitalize; }
.dot--active   { background: #d1fae5; color: #065f46; }
.dot--disabled { background: #fee2e2; color: #991b1b; }

.action-btns { display: flex; gap: 6px; }
.act-btn { width: 30px; height: 30px; border-radius: 7px; border: 1px solid #e2e8f0; background: #f8fafc; cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; transition: background .18s; }
.act-btn:hover     { background: #f1f5f9; }
.act-btn--del:hover { background: #fee2e2; border-color: #fecaca; }

.table-footer { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-top: 1px solid #f1f5f9; }
.table-count  { font-size: 12.5px; color: #64748b; }
.pagination   { display: flex; align-items: center; gap: 10px; }
.page-btn     { width: 30px; height: 30px; border-radius: 7px; border: 1px solid #e2e8f0; background: #fff; cursor: pointer; font-size: 14px; color: #475569; transition: background .18s; }
.page-btn:disabled { opacity: .4; cursor: not-allowed; }
.page-btn:not(:disabled):hover { background: #f1f5f9; }
.page-info    { font-size: 12.5px; color: #475569; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(2px); }
.modal { background: #fff; border-radius: 16px; width: 420px; max-width: 90vw; box-shadow: 0 20px 60px rgba(0,0,0,.2); overflow: hidden; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #f1f5f9; }
.modal-title  { font-size: 15px; font-weight: 700; color: #0f172a; }
.modal-close  { background: transparent; border: none; cursor: pointer; font-size: 16px; color: #94a3b8; padding: 4px; transition: color .18s; }
.modal-close:hover { color: #ef4444; }
.modal-body   { padding: 22px; display: flex; flex-direction: column; gap: 18px; }
.profile-row  { display: flex; align-items: center; gap: 14px; }
.profile-avatar { width: 54px; height: 54px; border-radius: 12px; color: #fff; font-size: 20px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.profile-name   { font-size: 16px; font-weight: 700; color: #0f172a; }
.profile-email  { font-size: 13px; color: #64748b; margin: 2px 0 6px; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.detail-item { background: #f8fafc; border-radius: 10px; padding: 12px 14px; }
.detail-label { font-size: 11.5px; color: #94a3b8; margin-bottom: 4px; font-weight: 500; text-transform: uppercase; letter-spacing: .4px; }
.detail-val   { font-size: 14px; font-weight: 600; color: #0f172a; }
</style>
