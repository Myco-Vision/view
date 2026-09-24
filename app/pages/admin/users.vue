<template>
  <div class="flex flex-col gap-[22px]">
    <div class="flex items-end justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-[22px] font-bold text-[#0f172a]">User Management</h1>
        <p class="text-[13.5px] text-[#64748b] mt-[3px]">{{ pagination.total }} registered users</p>
      </div>
      <div class="flex items-center gap-2.5 flex-wrap">
        <div class="relative">
          <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#94a3b8]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="searchQuery" @input="debouncedFetch" class="py-2 pr-3 pl-8 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none w-full sm:w-[220px] transition-colors duration-[0.18s] focus:border-[#10b981]" placeholder="Search users…" />
        </div>
        <select v-model="roleFilter" @change="fetchUsers()" class="py-2 px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none cursor-pointer">
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
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
            <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="animate-pulse">
            <td colspan="7" class="py-8 text-center text-[#94a3b8] text-[13.5px]">Loading users...</td>
          </tr>
          <tr v-else-if="users.length === 0">
            <td colspan="7" class="py-8 text-center text-[#94a3b8] text-[14px]">No users found.</td>
          </tr>
          <tr v-else v-for="user in users" :key="user.id" class="hover:bg-[#f8fafc] group">
            <td class="py-3 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none"><input type="checkbox" /></td>
            <td class="py-3 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">
              <div class="flex items-center gap-2.5">
                <div class="w-[34px] h-[34px] rounded-full text-white text-[12px] font-bold flex items-center justify-center shrink-0" :style="{ background: avatarColor(user.role) }">{{ getInitials(user.name) }}</div>
                <div>
                  <p class="font-semibold text-[#0f172a] text-[13.5px]">{{ user.name }}</p>
                  <p class="text-[11.5px] text-[#94a3b8]">ID: #{{ user.id }}</p>
                </div>
              </div>
            </td>
            <td class="py-3 px-3.5 text-[13px] text-[#475569] border-b border-[#f8fafc] align-middle group-last:border-none">{{ user.email }}</td>
            <td class="py-3 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">
              <span class="py-[3px] px-[10px] rounded-[20px] text-[11.5px] font-semibold capitalize" :class="user.role === 'admin' ? 'bg-[#f3e8ff] text-[#6d28d9]' : (user.role === 'super_admin' ? 'bg-amber-100 text-amber-700' : 'bg-[#dbeafe] text-[#1d4ed8]')">{{ user.role }}</span>
            </td>
            <td class="py-3 px-3.5 text-[13px] text-[#94a3b8] border-b border-[#f8fafc] align-middle group-last:border-none">{{ formatDate(user.created_at) }}</td>
            <td class="py-3 px-3.5 text-[13px] font-semibold text-[#0f172a] border-b border-[#f8fafc] align-middle group-last:border-none">{{ user.scans_count ?? 0 }}</td>
            <td class="py-3 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">
              <div class="flex gap-1.5">
                <button class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-[#f8fafc] cursor-pointer text-[13px] flex items-center justify-center transition-colors duration-[0.18s] hover:bg-[#f1f5f9]" title="View profile" @click="openUser(user)">👁</button>
                <button v-if="user.role === 'user'" class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-[#f8fafc] cursor-pointer text-[13px] flex items-center justify-center transition-colors duration-[0.18s] hover:bg-[#fee2e2] hover:border-[#fecaca]" title="Delete user" @click="deleteUser(user)">🗑</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </div>

      <div class="flex items-center justify-between py-3 px-4 border-t border-[#f1f5f9]">
        <span class="text-[12.5px] text-[#64748b]">Showing {{ pagination.from || 0 }} to {{ pagination.to || 0 }} of {{ pagination.total }} users</span>
        <div class="flex items-center gap-2.5">
          <button class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-white cursor-pointer text-[14px] text-[#475569] transition-colors duration-[0.18s] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white" :disabled="pagination.current_page === 1" @click="fetchUsers(pagination.current_page - 1)">‹</button>
          <span class="text-[12.5px] text-[#475569]">Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
          <button class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-white cursor-pointer text-[14px] text-[#475569] transition-colors duration-[0.18s] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white" :disabled="pagination.current_page === pagination.last_page" @click="fetchUsers(pagination.current_page + 1)">›</button>
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
            <div class="w-[54px] h-[54px] rounded-xl text-white text-[20px] font-bold flex items-center justify-center" :style="{ background: avatarColor(selectedUser.role) }">{{ getInitials(selectedUser.name) }}</div>
            <div>
              <p class="text-[16px] font-bold text-[#0f172a]">{{ selectedUser.name }}</p>
              <p class="text-[13px] text-[#64748b] my-[2px] mb-1.5">{{ selectedUser.email }}</p>
              <span class="py-[3px] px-[10px] rounded-[20px] text-[11.5px] font-semibold capitalize" :class="selectedUser.role === 'admin' ? 'bg-[#f3e8ff] text-[#6d28d9]' : 'bg-[#dbeafe] text-[#1d4ed8]'">{{ selectedUser.role }}</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-[#f8fafc] rounded-[10px] py-3 px-3.5"><p class="text-[11.5px] text-[#94a3b8] mb-1 font-medium uppercase tracking-[0.4px]">User ID</p><p class="text-[14px] font-semibold text-[#0f172a]">#{{ selectedUser.id }}</p></div>
            <div class="bg-[#f8fafc] rounded-[10px] py-3 px-3.5"><p class="text-[11.5px] text-[#94a3b8] mb-1 font-medium uppercase tracking-[0.4px]">Joined</p><p class="text-[14px] font-semibold text-[#0f172a]">{{ formatDate(selectedUser.created_at) }}</p></div>
            <div class="bg-[#f8fafc] rounded-[10px] py-3 px-3.5"><p class="text-[11.5px] text-[#94a3b8] mb-1 font-medium uppercase tracking-[0.4px]">Total Scans</p><p class="text-[14px] font-semibold text-[#0f172a]">{{ selectedUser.scans_count ?? 0 }}</p></div>
            <div class="bg-[#f8fafc] rounded-[10px] py-3 px-3.5"><p class="text-[11.5px] text-[#94a3b8] mb-1 font-medium uppercase tracking-[0.4px]">Username</p><p class="text-[14px] font-semibold text-[#0f172a]">{{ selectedUser.username || '-' }}</p></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const config = useRuntimeConfig()
const loading = ref(true)
const searchQuery  = ref('')
const roleFilter   = ref('')
const selectedUser = ref<any>(null)

const users = ref<any[]>([])
const pagination = reactive({ current_page: 1, last_page: 1, total: 0, from: 0, to: 0 })

const getHeaders = () => {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

let debounceTimer: any = null
function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => fetchUsers(), 300)
}

async function fetchUsers(page = 1) {
  loading.value = true
  try {
    const query = new URLSearchParams({
      page: page.toString(),
      ...(searchQuery.value && { search: searchQuery.value }),
      ...(roleFilter.value && { role: roleFilter.value }),
    }).toString()

    const res = await $fetch<any>(`${config.public.apiBase}/admin/users?${query}`, {
      headers: getHeaders(),
    })

    users.value = res.data
    pagination.current_page = res.current_page
    pagination.last_page = res.last_page
    pagination.total = res.total
    pagination.from = res.from
    pagination.to = res.to
  } catch (error) {
    console.error('Failed to fetch users:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => { fetchUsers() })

function getInitials(name: string) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function avatarColor(role: string) {
  if (role === 'admin') return 'linear-gradient(135deg, #7c3aed, #6d28d9)'
  if (role === 'super_admin') return 'linear-gradient(135deg, #f59e0b, #d97706)'
  return 'linear-gradient(135deg, #3b82f6, #2563eb)'
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function toggleAll(e: Event) {
  // stub: select all checkboxes
}

function openUser(user: any) { selectedUser.value = user }

async function deleteUser(user: any) {
  if (!confirm(`Delete user ${user.name}?`)) return
  try {
    await $fetch(`${config.public.apiBase}/admin/users/${user.id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    fetchUsers(pagination.current_page)
  } catch (err: any) {
    alert(err?.data?.message || 'Failed to delete user.')
  }
}
</script>
