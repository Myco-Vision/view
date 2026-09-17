<template>
  <div class="flex flex-col gap-[22px]">
    <div class="flex items-end justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-[22px] font-bold text-[#0f172a]">User Management</h1>
        <p class="text-[13.5px] text-[#64748b] mt-[3px]">{{ users.length }} registered users</p>
      </div>
      <div class="flex items-center gap-2.5 flex-wrap">
        <div class="relative">
          <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#94a3b8]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="searchQuery" class="py-2 pr-3 pl-8 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none w-full sm:w-[220px] transition-colors duration-[0.18s] focus:border-[#10b981]" placeholder="Search users…" />
        </div>
        <select v-model="roleFilter" class="py-2 px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none cursor-pointer">
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select v-model="statusFilter" class="py-2 px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none cursor-pointer">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>
    </div>

    <div class="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
      <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]"><input type="checkbox" @change="toggleAll" /></th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">User</th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Email</th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Role</th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Joined</th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Total Scans</th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Status</th>
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-[#f8fafc] group">
            <td class="py-3 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none"><input type="checkbox" /></td>
            <td class="py-3 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">
              <div class="flex items-center gap-2.5">
                <div class="w-[34px] h-[34px] rounded-full text-white text-[12px] font-bold flex items-center justify-center shrink-0" :style="{ background: user.avatarColor }">{{ user.initials }}</div>
                <div>
                  <p class="font-semibold text-[#0f172a] text-[13.5px]">{{ user.name }}</p>
                  <p class="text-[11.5px] text-[#94a3b8]">ID: #{{ user.id }}</p>
                </div>
              </div>
            </td>
            <td class="py-3 px-3.5 text-[13px] text-[#475569] border-b border-[#f8fafc] align-middle group-last:border-none">{{ user.email }}</td>
            <td class="py-3 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">
              <span class="py-[3px] px-[10px] rounded-[20px] text-[11.5px] font-semibold capitalize" :class="user.role === 'admin' ? 'bg-[#f3e8ff] text-[#6d28d9]' : 'bg-[#dbeafe] text-[#1d4ed8]'">{{ user.role }}</span>
            </td>
            <td class="py-3 px-3.5 text-[13px] text-[#94a3b8] border-b border-[#f8fafc] align-middle group-last:border-none">{{ user.joined }}</td>
            <td class="py-3 px-3.5 text-[13px] font-semibold text-[#0f172a] border-b border-[#f8fafc] align-middle group-last:border-none">{{ user.scans }}</td>
            <td class="py-3 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">
              <span class="text-[12px] font-semibold py-1 px-[10px] rounded-[20px] capitalize" :class="user.status === 'active' ? 'bg-[#d1fae5] text-[#065f46]' : 'bg-[#fee2e2] text-[#991b1b]'">
                {{ user.status }}
              </span>
            </td>
            <td class="py-3 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">
              <div class="flex gap-1.5">
                <button class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-[#f8fafc] cursor-pointer text-[13px] flex items-center justify-center transition-colors duration-[0.18s] hover:bg-[#f1f5f9]" title="View profile" @click="openUser(user)">👁</button>
                <button class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-[#f8fafc] cursor-pointer text-[13px] flex items-center justify-center transition-colors duration-[0.18s] hover:bg-[#f1f5f9]" :title="user.status === 'active' ? 'Disable' : 'Enable'"
                        @click="toggleStatus(user)">
                  {{ user.status === 'active' ? '🔒' : '🔓' }}
                </button>
                <button class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-[#f8fafc] cursor-pointer text-[13px] flex items-center justify-center transition-colors duration-[0.18s] hover:bg-[#fee2e2] hover:border-[#fecaca]" title="Delete user" @click="deleteUser(user)">🗑</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </div>

      <div class="flex items-center justify-between py-3 px-4 border-t border-[#f1f5f9]">
        <span class="text-[12.5px] text-[#64748b]">Showing {{ filteredUsers.length }} of {{ users.length }} users</span>
        <div class="flex items-center gap-2.5">
          <button class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-white cursor-pointer text-[14px] text-[#475569] transition-colors duration-[0.18s] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white" :disabled="page === 1" @click="page--">‹</button>
          <span class="text-[12.5px] text-[#475569]">Page {{ page }} of {{ totalPages }}</span>
          <button class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-white cursor-pointer text-[14px] text-[#475569] transition-colors duration-[0.18s] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white" :disabled="page === totalPages" @click="page++">›</button>
        </div>
      </div>
    </div>

    <!-- User Detail Modal -->
    <div v-if="selectedUser" class="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] backdrop-blur-[2px]" @click.self="selectedUser = null">
      <div class="bg-white rounded-2xl w-[420px] max-w-[90vw] shadow-[0_20px_60px_rgba(0,0,0,0.2)] overflow-hidden">
        <div class="flex items-center justify-between py-[18px] px-[22px] border-b border-[#f1f5f9]">
          <p class="text-[15px] font-bold text-[#0f172a]">User Profile</p>
          <button class="bg-transparent border-none cursor-pointer text-[16px] text-[#94a3b8] p-1 transition-colors duration-[0.18s] hover:text-[#ef4444]" @click="selectedUser = null">✕</button>
        </div>
        <div class="p-[22px] flex flex-col gap-[18px]">
          <div class="flex items-center gap-3.5">
            <div class="w-[54px] h-[54px] rounded-xl text-white text-[20px] font-bold flex items-center justify-center" :style="{ background: selectedUser.avatarColor }">{{ selectedUser.initials }}</div>
            <div>
              <p class="text-[16px] font-bold text-[#0f172a]">{{ selectedUser.name }}</p>
              <p class="text-[13px] text-[#64748b] my-[2px] mb-1.5">{{ selectedUser.email }}</p>
              <span class="py-[3px] px-[10px] rounded-[20px] text-[11.5px] font-semibold capitalize" :class="selectedUser.role === 'admin' ? 'bg-[#f3e8ff] text-[#6d28d9]' : 'bg-[#dbeafe] text-[#1d4ed8]'">{{ selectedUser.role }}</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-[#f8fafc] rounded-[10px] py-3 px-3.5"><p class="text-[11.5px] text-[#94a3b8] mb-1 font-medium uppercase tracking-[0.4px]">User ID</p><p class="text-[14px] font-semibold text-[#0f172a]">#{{ selectedUser.id }}</p></div>
            <div class="bg-[#f8fafc] rounded-[10px] py-3 px-3.5"><p class="text-[11.5px] text-[#94a3b8] mb-1 font-medium uppercase tracking-[0.4px]">Joined</p><p class="text-[14px] font-semibold text-[#0f172a]">{{ selectedUser.joined }}</p></div>
            <div class="bg-[#f8fafc] rounded-[10px] py-3 px-3.5"><p class="text-[11.5px] text-[#94a3b8] mb-1 font-medium uppercase tracking-[0.4px]">Total Scans</p><p class="text-[14px] font-semibold text-[#0f172a]">{{ selectedUser.scans }}</p></div>
            <div class="bg-[#f8fafc] rounded-[10px] py-3 px-3.5"><p class="text-[11.5px] text-[#94a3b8] mb-1 font-medium uppercase tracking-[0.4px]">Status</p><p class="text-[14px] font-semibold text-[#0f172a] capitalize">{{ selectedUser.status }}</p></div>
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

const searchQuery  = ref('')
const roleFilter   = ref('')
const statusFilter = ref('')
const page         = ref(1)
const perPage      = 8
const selectedUser = ref<any>(null)

const users = ref<any[]>([])

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
