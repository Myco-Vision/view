<template>
  <div class="flex flex-col gap-[22px]">
    <!-- Header -->
    <div class="flex items-end justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-[22px] font-bold text-[#0f172a] flex items-center gap-2">
          <span v-if="isSuperAdmin" class="text-amber-500">👑</span> User Account Management
        </h1>
        <p class="text-[13.5px] text-[#64748b] mt-[3px]">{{ pagination.total }} registered accounts</p>
      </div>
      <button v-if="isSuperAdmin" class="py-[9px] px-5 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none text-[13.5px] font-semibold font-sans cursor-pointer transition-opacity duration-[0.18s] hover:opacity-90 flex items-center gap-2" @click="openCreateModal">
        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Add Account
      </button>
    </div>

    <!-- Stats (only when the API returns aggregates) -->
    <div v-if="isSuperAdmin && stats" class="grid grid-cols-2 md:grid-cols-4 gap-3.5">
      <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-4 flex flex-col gap-1">
        <span class="text-[12px] font-semibold text-[#64748b] uppercase tracking-[0.5px]">Total</span>
        <span class="text-[22px] font-bold text-[#0f172a]">{{ stats.total }}</span>
      </div>
      <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-4 flex flex-col gap-1">
        <span class="text-[12px] font-semibold text-amber-600 uppercase tracking-[0.5px]">Super Admins</span>
        <span class="text-[22px] font-bold text-[#0f172a]">{{ stats.super_admins }}</span>
      </div>
      <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-4 flex flex-col gap-1">
        <span class="text-[12px] font-semibold text-emerald-600 uppercase tracking-[0.5px]">Admins</span>
        <span class="text-[22px] font-bold text-[#0f172a]">{{ stats.admins }}</span>
      </div>
      <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-4 flex flex-col gap-1">
        <span class="text-[12px] font-semibold text-blue-600 uppercase tracking-[0.5px]">Foragers</span>
        <span class="text-[22px] font-bold text-[#0f172a]">{{ stats.foragers }}</span>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="flex items-center justify-between gap-3 bg-white p-3 rounded-[14px] border border-[#e2e8f0] flex-wrap">
      <div class="relative flex-1 min-w-[200px] max-w-[320px]">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#94a3b8]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="filters.search" @input="debouncedFetch" :class="[inputCls, 'pl-9 bg-[#f8fafc] focus:bg-white w-full']" placeholder="Search by name, email, or username…" />
      </div>
      <div class="flex items-center gap-2.5">
        <select v-model="filters.role" @change="fetchUsers(1)" :class="[inputCls, 'bg-[#f8fafc] cursor-pointer focus:bg-white']">
          <option value="">All Roles</option>
          <option v-if="isSuperAdmin" value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="forager">Forager</option>
        </select>
        <button class="w-[38px] h-[38px] rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-center text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#0f172a]" title="Refresh" @click="fetchUsers(pagination.current_page)">
          <svg class="w-[15px] h-[15px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th :class="thCls">User</th>
              <th :class="thCls">Email &amp; Username</th>
              <th :class="thCls">Role</th>
              <th :class="thCls">Joined</th>
              <th :class="thCls">Scans</th>
              <th :class="[thCls, 'text-right']">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="animate-pulse">
              <td colspan="6" class="py-8 text-center text-[#94a3b8] text-[13.5px]">Loading accounts...</td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="6" class="py-8 text-center text-[#94a3b8] text-[14px]">No accounts found.</td>
            </tr>
            <tr v-else v-for="user in users" :key="user.id" class="hover:bg-[#f8fafc]/50 transition-colors duration-150 group">
              <td :class="tdCls">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-[10px] text-white text-[13px] font-bold flex items-center justify-center shrink-0 shadow-sm" :class="getAvatarColor(user.role)">{{ getInitials(user.name) }}</div>
                  <div>
                    <p class="font-bold text-[#0f172a] text-[14px]">{{ user.name }}</p>
                    <p class="text-[12px] text-[#94a3b8] font-medium">ID: #{{ user.id }}</p>
                  </div>
                </div>
              </td>
              <td :class="tdCls">
                <div class="flex flex-col gap-0.5">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="text-[13.5px] text-[#334155] font-medium">{{ user.email }}</span>
                    <span
                      v-if="user.email_verified_at"
                      class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >Verified</span>
                    <template v-else>
                      <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Unverified</span>
                      <button
                        v-if="isSuperAdmin"
                        type="button"
                        class="text-[10.5px] font-semibold text-emerald-600 hover:text-emerald-700 underline bg-transparent border-none cursor-pointer p-0"
                        @click="resendUserVerification(user)"
                      >Resend</button>
                    </template>
                  </div>
                  <span class="text-[12px] text-[#64748b]">@{{ user.username || 'unknown' }}</span>
                </div>
              </td>
              <td :class="tdCls">
                <span class="py-[4px] px-[10px] rounded-[6px] text-[11.5px] font-bold tracking-[0.3px]" :class="getRoleBadgeStyle(user.role)">{{ formatRole(user.role) }}</span>
              </td>
              <td :class="[tdCls, 'text-[13px] text-[#64748b] font-medium']">{{ formatDate(user.created_at) }}</td>
              <td :class="tdCls">
                <span class="inline-flex items-center justify-center min-w-[28px] h-[28px] px-2 rounded-full bg-[#f1f5f9] text-[#475569] text-[12.5px] font-bold">{{ user.scans_count ?? 0 }}</span>
              </td>
              <td :class="[tdCls, 'text-right']">
                <div class="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button class="w-[32px] h-[32px] rounded-[8px] border border-[#e2e8f0] bg-white cursor-pointer text-[#64748b] flex items-center justify-center transition-colors hover:bg-slate-100 hover:text-[#0f172a]" title="View profile" @click="selectedUser = user">
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                  <button v-if="isSuperAdmin" class="w-[32px] h-[32px] rounded-[8px] border border-[#e2e8f0] bg-white cursor-pointer text-[#64748b] flex items-center justify-center transition-colors hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200" title="Edit account" @click="openEditModal(user)">
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button v-if="canDelete(user)" class="w-[32px] h-[32px] rounded-[8px] border border-[#e2e8f0] bg-white cursor-pointer text-[#64748b] flex items-center justify-center transition-colors hover:bg-red-50 hover:text-red-600 hover:border-red-200" title="Delete account" @click="confirmDelete(user)">
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between py-3.5 px-4 border-t border-[#e2e8f0] bg-[#f8fafc] flex-wrap gap-2">
        <span class="text-[13px] text-[#64748b] font-medium">Showing <span class="text-[#0f172a] font-bold">{{ pagination.from || 0 }}</span> to <span class="text-[#0f172a] font-bold">{{ pagination.to || 0 }}</span> of <span class="text-[#0f172a] font-bold">{{ pagination.total }}</span> accounts</span>
        <div class="flex items-center gap-2.5">
          <button class="py-1.5 px-3 rounded-[8px] border border-[#e2e8f0] bg-white text-[13px] font-medium text-[#475569] hover:bg-[#f1f5f9] disabled:opacity-50 disabled:cursor-not-allowed" :disabled="pagination.current_page <= 1" @click="fetchUsers(pagination.current_page - 1)">Previous</button>
          <span class="text-[12.5px] text-[#475569]">Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
          <button class="py-1.5 px-3 rounded-[8px] border border-[#e2e8f0] bg-white text-[13px] font-medium text-[#475569] hover:bg-[#f1f5f9] disabled:opacity-50 disabled:cursor-not-allowed" :disabled="pagination.current_page >= pagination.last_page" @click="fetchUsers(pagination.current_page + 1)">Next</button>
        </div>
      </div>
    </div>

    <!-- Profile Modal -->
    <div v-if="selectedUser" class="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] backdrop-blur-[2px]" @click.self="selectedUser = null">
      <div class="bg-white rounded-2xl w-[420px] max-w-[90vw] shadow-[0_20px_60px_rgba(0,0,0,0.2)] overflow-hidden">
        <div class="flex items-center justify-between py-[18px] px-[22px] border-b border-[#f1f5f9]">
          <p class="text-[15px] font-bold text-[#0f172a]">User Profile</p>
          <button class="bg-transparent border-none cursor-pointer text-[16px] text-[#94a3b8] p-1 transition-colors hover:text-[#ef4444]" @click="selectedUser = null">✕</button>
        </div>
        <div class="p-[22px] flex flex-col gap-[18px]">
          <div class="flex items-center gap-3.5">
            <div class="w-[54px] h-[54px] rounded-xl text-white text-[20px] font-bold flex items-center justify-center" :class="getAvatarColor(selectedUser.role)">{{ getInitials(selectedUser.name) }}</div>
            <div>
              <p class="text-[16px] font-bold text-[#0f172a]">{{ selectedUser.name }}</p>
              <p class="text-[13px] text-[#64748b] my-[2px] mb-1.5">{{ selectedUser.email }}</p>
              <span class="py-[3px] px-[10px] rounded-[6px] text-[11.5px] font-bold" :class="getRoleBadgeStyle(selectedUser.role)">{{ formatRole(selectedUser.role) }}</span>
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

    <!-- Create/Edit Modal (super admin only) -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[100] backdrop-blur-[2px] p-4" @click.self="closeModal">
      <div class="bg-white rounded-2xl w-full max-w-[560px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col max-h-[90vh]">
        <div class="flex items-center justify-between py-[18px] px-6 border-b border-[#f1f5f9] shrink-0">
          <div>
            <h2 class="text-[17px] font-bold text-[#0f172a]">{{ isEditing ? 'Edit Account' : 'Create New Account' }}</h2>
            <p class="text-[12.5px] text-[#64748b] mt-0.5">{{ isEditing ? 'Update user details and permissions.' : 'Add a new user or administrator to the system.' }}</p>
          </div>
          <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-transparent border-none cursor-pointer text-[#94a3b8] hover:bg-slate-100 hover:text-slate-700 transition-colors" @click="closeModal">✕</button>
        </div>

        <div class="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div v-if="formError" class="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px] font-medium flex items-start gap-2">
            <svg class="w-4 h-4 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {{ formError }}
          </div>

          <div class="grid grid-cols-2 gap-x-4 gap-y-5">
            <div class="col-span-2"><h3 class="text-[12px] font-bold text-[#94a3b8] uppercase tracking-[0.5px] border-b border-[#f1f5f9] pb-2">Personal Information</h3></div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[13px] font-semibold text-[#334155]">First Name <span class="text-red-500">*</span></label>
              <input v-model="form.first_name" :class="inputCls" placeholder="Jane" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[13px] font-semibold text-[#334155]">Last Name <span class="text-red-500">*</span></label>
              <input v-model="form.last_name" :class="inputCls" placeholder="Doe" />
            </div>

            <div class="col-span-2 mt-2"><h3 class="text-[12px] font-bold text-[#94a3b8] uppercase tracking-[0.5px] border-b border-[#f1f5f9] pb-2">Account Details</h3></div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[13px] font-semibold text-[#334155]">Username <span class="text-red-500">*</span></label>
              <input v-model="form.username" :class="inputCls" placeholder="janedoe" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[13px] font-semibold text-[#334155]">Email Address <span class="text-red-500">*</span></label>
              <input v-model="form.email" type="email" :class="inputCls" placeholder="jane@gmail.com" />
              <p class="text-[11px] text-[#64748b]">Must be a legitimate email. A verification link will be sent to confirm it.</p>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[13px] font-semibold text-[#334155]">Role <span class="text-red-500">*</span></label>
              <select v-model="form.role" :class="[inputCls, 'bg-white cursor-pointer']" :disabled="isEditing && isSelf(form)">
                <option value="forager">Forager</option>
                <option value="admin">Admin</option>
                <option v-if="!isEditing || form.role === 'super_admin'" value="super_admin">Super Admin</option>
              </select>
              <p v-if="isEditing && isSelf(form)" class="text-[11px] text-amber-600 mt-0.5 font-medium">You cannot change your own role.</p>
            </div>

            <div v-if="!isEditing" class="flex flex-col gap-1.5">
              <label class="text-[13px] font-semibold text-[#334155]">Password <span class="text-red-500">*</span></label>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  :class="[inputCls, 'w-full pr-10']"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#0f172a] transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center"
                >
                  <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
            </div>
            <div v-else class="flex flex-col gap-1.5">
              <label class="text-[13px] font-semibold text-[#334155]">Reset Password</label>
              <button class="py-[9px] px-3.5 border border-[#e2e8f0] rounded-[10px] bg-[#f8fafc] text-[13.5px] font-semibold text-[#475569] text-left hover:bg-[#f1f5f9] transition-colors flex items-center gap-2" @click.prevent="openResetPasswordModal">
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Set new password
              </button>
            </div>

            <div class="col-span-2 mt-2"><h3 class="text-[12px] font-bold text-[#94a3b8] uppercase tracking-[0.5px] border-b border-[#f1f5f9] pb-2">Contact details (Optional)</h3></div>
            <div class="flex flex-col gap-1.5 col-span-2 md:col-span-1">
              <label class="text-[13px] font-semibold text-[#334155]">Contact Number</label>
              <input v-model="form.contact_number" :class="inputCls" placeholder="+63 900 000 0000" />
            </div>
            <div class="flex flex-col gap-1.5 col-span-2">
              <label class="text-[13px] font-semibold text-[#334155]">Address</label>
              <textarea v-model="form.address" rows="2" :class="[inputCls, 'resize-y']" placeholder="123 Main St, City, Country"></textarea>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 p-5 border-t border-[#f1f5f9] bg-[#f8fafc] rounded-b-2xl shrink-0">
          <button class="py-2 px-4 rounded-[8px] bg-white border border-[#e2e8f0] text-[13.5px] font-semibold text-[#475569] hover:bg-[#f1f5f9] transition-colors" :disabled="isSubmitting" @click="closeModal">Cancel</button>
          <button class="py-2 px-5 rounded-[8px] bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none text-[13.5px] font-bold shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center min-w-[100px]" :disabled="isSubmitting" @click="saveAccount">
            <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
            <span v-else>{{ isEditing ? 'Save Changes' : 'Create Account' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Password Reset Modal -->
    <div v-if="isResetModalOpen" class="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[110] backdrop-blur-[2px] p-4" @click.self="isResetModalOpen = false">
      <div class="bg-white rounded-xl w-full max-w-[400px] shadow-2xl overflow-hidden">
        <div class="p-5 border-b border-[#f1f5f9]">
          <h3 class="text-[16px] font-bold text-[#0f172a]">Reset Password</h3>
          <p class="text-[13px] text-[#64748b] mt-1">Set a new password for {{ formDisplayName }}. They will be forced to re-login.</p>
        </div>
        <div class="p-5">
          <div v-if="resetError" class="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-[13px] font-medium">{{ resetError }}</div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-semibold text-[#334155]">New Password</label>
            <div class="relative">
              <input
                v-model="resetPasswordVal"
                :type="showResetPassword ? 'text' : 'password'"
                :class="[inputCls, 'w-full pr-10']"
                placeholder="••••••••"
              />
              <button
                type="button"
                :aria-label="showResetPassword ? 'Hide password' : 'Show password'"
                @click="showResetPassword = !showResetPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#0f172a] transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center"
              >
                <svg v-if="!showResetPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>
        </div>
        <div class="p-4 bg-[#f8fafc] flex justify-end gap-2 border-t border-[#f1f5f9]">
          <button class="py-1.5 px-4 rounded-[6px] text-[#475569] text-[13px] font-semibold hover:bg-[#e2e8f0] transition-colors" :disabled="isResetting" @click="isResetModalOpen = false">Cancel</button>
          <button class="py-1.5 px-4 rounded-[6px] bg-[#0f172a] text-white text-[13px] font-bold hover:bg-black transition-colors flex items-center justify-center min-w-[80px]" :disabled="isResetting" @click="submitPasswordReset">
            <span v-if="isResetting" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
            <span v-else>Reset</span>
          </button>
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

// Shared class strings
const inputCls = 'py-[9px] px-3.5 border border-[#e2e8f0] rounded-[10px] text-[13.5px] font-sans text-[#0f172a] outline-none transition-colors focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)]'
const thCls = 'text-left text-[11.5px] font-semibold text-[#64748b] uppercase tracking-[0.5px] py-3.5 px-4 border-b border-[#e2e8f0] bg-[#f8fafc]'
const tdCls = 'py-3 px-4 border-b border-[#f1f5f9] align-middle group-last:border-none'

// Auth / role
const currentRole = ref('')
const currentUser = ref<any>(null)
const isSuperAdmin = computed(() => currentRole.value === 'super_admin')

// Admins use the read/limited-delete endpoint, super admins use the full accounts endpoint.
// Adjust if your backend exposes /admin/accounts differently.
const endpoint = computed(() => isSuperAdmin.value ? '/admin/accounts' : '/admin/users')

// List state
const users = ref<any[]>([])
const loading = ref(true)
const selectedUser = ref<any>(null)
const stats = ref<{ total: number, super_admins: number, admins: number, foragers: number } | null>(null)
const filters = reactive({ search: '', role: '' })
const pagination = reactive({ current_page: 1, last_page: 1, total: 0, from: 0, to: 0 })

// Form state
const isModalOpen = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const showPassword = ref(false)
const formError = ref('')
const emptyForm = () => ({ id: null, name: '', first_name: '', last_name: '', username: '', email: '', role: 'forager', password: '', contact_number: '', address: '' })
const form = reactive<any>(emptyForm())
const formDisplayName = computed(() => form.name || `${form.first_name} ${form.last_name}`.trim())

// Password reset state
const isResetModalOpen = ref(false)
const isResetting = ref(false)
const showResetPassword = ref(false)
const resetPasswordVal = ref('')
const resetError = ref('')

onMounted(() => {
  currentRole.value = localStorage.getItem('role') || ''
  const u = localStorage.getItem('user')
  if (u) currentUser.value = JSON.parse(u)
  fetchUsers()
})

const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

// Fetching
let debounceTimer: any = null
function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => fetchUsers(1), 300)
}

async function fetchUsers(page = 1) {
  loading.value = true
  try {
    const query = new URLSearchParams({
      page: String(page),
      ...(filters.search && { search: filters.search }),
      ...(filters.role && { role: filters.role }),
    }).toString()

    const res = await $fetch<any>(`${config.public.apiBase}${endpoint.value}?${query}`, { headers: getHeaders() })

    users.value = res.data
    pagination.current_page = res.current_page
    pagination.last_page = res.last_page
    pagination.total = res.total
    pagination.from = res.from
    pagination.to = res.to
    // Expects optional server-side aggregates: { total, super_admins, admins, foragers }
    if (res.stats) stats.value = res.stats
  } catch (error) {
    console.error('Failed to fetch users:', error)
  } finally {
    loading.value = false
  }
}

// Permissions
function isSelf(user: any) {
  return !!currentUser.value && currentUser.value.id === user.id
}

function canDelete(user: any) {
  if (isSelf(user) || user.role === 'super_admin') return false
  return isSuperAdmin.value || user.role === 'forager'
}

// Modal actions
function openCreateModal() {
  isEditing.value = false
  showPassword.value = false
  formError.value = ''
  Object.assign(form, emptyForm())
  isModalOpen.value = true
}

function openEditModal(user: any) {
  isEditing.value = true
  formError.value = ''
  Object.assign(form, {
    id: user.id,
    name: user.name,
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    username: user.username || '',
    email: user.email,
    role: user.role,
    password: '',
    contact_number: user.contact_number || '',
    address: user.address || '',
  })
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

async function saveAccount() {
  formError.value = ''
  if (!form.first_name || !form.last_name || !form.username || !form.email || !form.role) {
    formError.value = 'Please fill in all required fields.'
    return
  }
  if (!isEditing.value && (!form.password || form.password.length < 8)) {
    formError.value = 'Password must be at least 8 characters for new accounts.'
    return
  }

  const editing = isEditing.value
  isSubmitting.value = true
  try {
    const payload = { ...form }
    let res: any
    if (editing) {
      delete payload.password
      res = await $fetch(`${config.public.apiBase}/admin/accounts/${form.id}`, { method: 'PUT', headers: getHeaders(), body: payload })
    } else {
      res = await $fetch(`${config.public.apiBase}/admin/accounts`, { method: 'POST', headers: getHeaders(), body: payload })
    }
    closeModal()
    toastSuccess(res?.message || (editing ? 'Account updated.' : 'Account created. Verification email sent.'))
    fetchUsers(editing ? pagination.current_page : 1)
  } catch (err: any) {
    const errors = err?.data?.errors
    const firstErr = errors ? Object.values(errors).flat()[0] : null
    formError.value = (firstErr as string) || err?.data?.message || err?.message || 'An error occurred while saving the account.'
  } finally {
    isSubmitting.value = false
  }
}

async function resendUserVerification(user: any) {
  try {
    const res = await $fetch<any>(`${config.public.apiBase}/admin/accounts/${user.id}/resend-verification`, {
      method: 'POST',
      headers: getHeaders(),
    })
    toastSuccess(res?.message || `Verification email sent to ${user.email}.`)
  } catch (err: any) {
    toastError(err?.data?.message || 'Failed to send verification email.')
  }
}

async function confirmDelete(user: any) {
  if (!confirm(`Permanently delete account for ${user.name}? This cannot be undone.`)) return
  try {
    await $fetch(`${config.public.apiBase}${endpoint.value}/${user.id}`, { method: 'DELETE', headers: getHeaders() })
    toastSuccess(`Account for ${user.name} deleted.`)
    // Step back a page if we just deleted the last row on a non-first page
    const page = users.value.length === 1 && pagination.current_page > 1 ? pagination.current_page - 1 : pagination.current_page
    fetchUsers(page)
  } catch (err: any) {
    toastError(err?.data?.message || 'Failed to delete account.')
  }
}

// Password reset
function openResetPasswordModal() {
  resetPasswordVal.value = ''
  showResetPassword.value = false
  resetError.value = ''
  isResetModalOpen.value = true
}

async function submitPasswordReset() {
  if (resetPasswordVal.value.length < 8) {
    resetError.value = 'Password must be at least 8 characters.'
    return
  }
  isResetting.value = true
  try {
    await $fetch(`${config.public.apiBase}/admin/accounts/${form.id}/reset-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: { password: resetPasswordVal.value },
    })
    isResetModalOpen.value = false
    toastSuccess(`Password for ${formDisplayName.value} has been reset successfully.`)
  } catch (err: any) {
    resetError.value = err?.data?.message || 'Failed to reset password.'
  } finally {
    isResetting.value = false
  }
}

// Utilities
function getInitials(name: string) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function getAvatarColor(role: string) {
  if (role === 'super_admin') return 'bg-gradient-to-br from-amber-500 to-amber-600'
  if (role === 'admin') return 'bg-gradient-to-br from-emerald-500 to-emerald-600'
  return 'bg-gradient-to-br from-blue-500 to-blue-600'
}

function formatRole(role: string) {
  return (role || '').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function getRoleBadgeStyle(role: string) {
  if (role === 'super_admin') return 'bg-amber-100 text-amber-700 border border-amber-200'
  if (role === 'admin') return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
  return 'bg-blue-100 text-blue-700 border border-blue-200'
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
  const { confirm } = useConfirm()
  const ok = await confirm({
    title: 'Delete this user?',
    message: `${user.name} and all of their scans will be permanently deleted. This cannot be undone.`,
    tone: 'danger',
    confirmText: 'Delete User',
  })
  if (!ok) return
  try {
    await $fetch(`${config.public.apiBase}/admin/users/${user.id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    toastSuccess(`User ${user.name} deleted successfully.`)
    fetchUsers(pagination.current_page)
  } catch (err: any) {
    toastError(err?.data?.message || 'Failed to delete user.')
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
</style>