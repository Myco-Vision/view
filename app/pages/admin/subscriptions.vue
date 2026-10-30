<template>
  <div class="flex flex-col gap-[22px]">
    <!-- Header -->
    <div class="flex items-end justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-[22px] font-bold text-[#0f172a]">Subscriptions</h1>
        <p class="text-[13.5px] text-[#64748b] mt-[3px]">Manage premium plans, grants and billing state for users</p>
      </div>
      <div class="flex items-center gap-2.5">
        <button id="refresh-subscriptions" class="py-2 px-3.5 rounded-lg border border-[#e2e8f0] bg-white text-[13px] font-medium text-[#475569] cursor-pointer transition-colors hover:bg-[#f1f5f9]" @click="refreshAll">↻ Refresh</button>
        <button id="open-grant-modal" class="py-2 px-4 rounded-lg border-none bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-[13px] font-semibold cursor-pointer shadow-[0_2px_8px_rgba(16,185,129,0.3)] transition-transform hover:-translate-y-px" @click="openGrant()">+ Grant Subscription</button>
      </div>
    </div>

    <!-- View switcher -->
    <div class="flex gap-1 bg-white border border-[#e2e8f0] rounded-[10px] p-1 w-fit" role="tablist">
      <button id="view-subscriptions" role="tab" :aria-selected="view === 'subscriptions'" class="py-1.5 px-4 rounded-[7px] border-none text-[13px] font-semibold cursor-pointer transition-colors"
        :class="view === 'subscriptions' ? 'bg-emerald-500/15 text-emerald-600' : 'bg-transparent text-[#64748b] hover:bg-[#f1f5f9]'" @click="view = 'subscriptions'">Subscriptions</button>
      <button id="view-refunds" role="tab" :aria-selected="view === 'refunds'" class="py-1.5 px-4 rounded-[7px] border-none text-[13px] font-semibold cursor-pointer transition-colors inline-flex items-center gap-2"
        :class="view === 'refunds' ? 'bg-emerald-500/15 text-emerald-600' : 'bg-transparent text-[#64748b] hover:bg-[#f1f5f9]'" @click="view = 'refunds'">
        Refunds
        <span v-if="refundStats.pending" class="min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[10.5px] font-bold inline-flex items-center justify-center">{{ refundStats.pending }}</span>
      </button>
    </div>

    <template v-if="view === 'subscriptions'">
    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div v-for="card in statCards" :key="card.label" class="bg-white border border-[#e2e8f0] rounded-[14px] p-4 transition-shadow hover:shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
        <div class="flex items-center justify-between mb-2">
          <p class="text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px]">{{ card.label }}</p>
          <span class="w-8 h-8 rounded-lg flex items-center justify-center text-[15px]" :class="card.tone">{{ card.icon }}</span>
        </div>
        <p class="text-[22px] font-bold text-[#0f172a]">{{ card.value }}</p>
        <p class="text-[12px] text-[#64748b] mt-0.5">{{ card.sub }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div class="flex gap-1 bg-white border border-[#e2e8f0] rounded-[10px] p-1 overflow-x-auto">
        <button v-for="t in statusTabs" :key="t.value" :id="`tab-${t.value || 'all'}`"
          class="py-1.5 px-3 rounded-[7px] border-none text-[12.5px] font-semibold cursor-pointer whitespace-nowrap transition-colors"
          :class="statusFilter === t.value ? 'bg-emerald-500/15 text-emerald-600' : 'bg-transparent text-[#64748b] hover:bg-[#f1f5f9]'"
          @click="statusFilter = t.value; fetchSubs()">{{ t.label }}</button>
      </div>
      <div class="flex items-center gap-2.5 flex-wrap">
        <div class="relative">
          <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#94a3b8]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input id="subscription-search" v-model="searchQuery" @input="debouncedFetch" class="py-2 pr-3 pl-8 border border-[#e2e8f0] rounded-lg text-[13.5px] text-[#0f172a] bg-white outline-none w-full sm:w-[230px] focus:border-[#10b981]" placeholder="Search user or payment ID…" />
        </div>
        <select id="plan-filter" v-model="planFilter" @change="fetchSubs()" class="py-2 px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] text-[#0f172a] bg-white outline-none cursor-pointer">
          <option value="">All Plans</option>
          <option value="monthly">Monthly</option>
          <option value="annual">Annual</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th v-for="h in ['User', 'Plan', 'Status', 'Amount', 'Payment', 'Period', 'Auto-renew', 'Actions']" :key="h"
                class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc] whitespace-nowrap">{{ h }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading"><td colspan="8" class="py-8 text-center text-[#94a3b8] text-[13.5px] animate-pulse">Loading subscriptions…</td></tr>
            <tr v-else-if="subs.length === 0"><td colspan="8" class="py-10 text-center text-[#94a3b8] text-[14px]">No subscriptions match these filters.</td></tr>
            <tr v-else v-for="s in subs" :key="s.id" class="hover:bg-[#f8fafc] border-b border-[#f8fafc] last:border-none">
              <td class="py-3 px-3.5">
                <div class="flex items-center gap-2.5">
                  <div class="w-[34px] h-[34px] rounded-full text-white text-[12px] font-bold flex items-center justify-center shrink-0 bg-gradient-to-br from-blue-500 to-blue-600">{{ initials(s.user?.name) }}</div>
                  <div class="min-w-0">
                    <p class="font-semibold text-[#0f172a] text-[13.5px] truncate">{{ s.user?.name ?? 'Deleted user' }}</p>
                    <p class="text-[11.5px] text-[#94a3b8] truncate">{{ s.user?.email }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3 px-3.5">
                <span class="py-[3px] px-[10px] rounded-[20px] text-[11.5px] font-semibold capitalize" :class="s.plan === 'annual' ? 'bg-[#f3e8ff] text-[#6d28d9]' : 'bg-[#dbeafe] text-[#1d4ed8]'">{{ s.plan }}</span>
              </td>
              <td class="py-3 px-3.5">
                <span class="inline-flex items-center gap-1.5 py-[3px] px-[10px] rounded-[20px] text-[11.5px] font-semibold" :class="stateStyle(s.state).cls">
                  <span class="w-1.5 h-1.5 rounded-full" :class="stateStyle(s.state).dot"></span>{{ stateStyle(s.state).label }}
                </span>
              </td>
              <td class="py-3 px-3.5 text-[13px] font-semibold text-[#0f172a] whitespace-nowrap">{{ peso(s.price) }}</td>
              <td class="py-3 px-3.5 text-[12px] text-[#475569]">
                <p class="capitalize">{{ (s.payment_method || '—').replace('_', ' ') }}</p>
                <p class="text-[11px] text-[#94a3b8] capitalize">{{ s.payment_status || (s.paymongo_payment_id ? 'paid' : '—') }}</p>
              </td>
              <td class="py-3 px-3.5 text-[12px] text-[#475569] whitespace-nowrap">
                <p>{{ fmtDate(s.starts_at) }} → {{ fmtDate(s.expires_at) }}</p>
                <p class="text-[11px]" :class="s.days_remaining <= 7 ? 'text-amber-600 font-semibold' : 'text-[#94a3b8]'">{{ s.days_remaining > 0 ? `${s.days_remaining} days left` : 'Ended' }}</p>
              </td>
              <td class="py-3 px-3.5">
                <button :id="`auto-renew-${s.id}`" :disabled="!isLive(s) || busy" @click="toggleAutoRenew(s)"
                  class="relative w-9 h-5 rounded-full border-none cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  :class="s.auto_renew ? 'bg-emerald-500' : 'bg-[#cbd5e1]'" :title="s.auto_renew ? 'Auto-renew on' : 'Auto-renew off'">
                  <span class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all" :class="s.auto_renew ? 'left-[18px]' : 'left-0.5'"></span>
                </button>
              </td>
              <td class="py-3 px-3.5">
                <div class="flex gap-1.5">
                  <button class="act-btn" title="View history" @click="openHistory(s.user)">👁</button>
                  <button class="act-btn hover:!bg-emerald-50 hover:!border-emerald-200" title="Extend" @click="openAction('extend', s)">⏩</button>
                  <button v-if="isLive(s) && s.state !== 'cancelling'" class="act-btn hover:!bg-amber-50 hover:!border-amber-200" title="Cancel at period end" @click="openAction('cancel', s)">⏸</button>
                  <button v-if="isLive(s)" class="act-btn hover:!bg-[#fee2e2] hover:!border-[#fecaca]" title="Revoke now" @click="openAction('revoke', s)">⛔</button>
                  <button v-if="isRefundable(s)" :id="`refund-sub-${s.id}`" class="act-btn hover:!bg-violet-50 hover:!border-violet-200" title="Open a refund request" @click="openCreateRefund(s)">💸</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex items-center justify-between py-3 px-4 border-t border-[#f1f5f9]">
        <span class="text-[12.5px] text-[#64748b]">Showing {{ pagination.from || 0 }} to {{ pagination.to || 0 }} of {{ pagination.total }}</span>
        <div class="flex items-center gap-2.5">
          <button class="pg-btn" :disabled="pagination.current_page <= 1" @click="fetchSubs(pagination.current_page - 1)">‹</button>
          <span class="text-[12.5px] text-[#475569]">Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
          <button class="pg-btn" :disabled="pagination.current_page >= pagination.last_page" @click="fetchSubs(pagination.current_page + 1)">›</button>
        </div>
      </div>
    </div>

    <!-- Activity log -->
    <div class="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
      <div class="flex items-center justify-between py-3.5 px-[18px] border-b border-[#f1f5f9]">
        <h2 class="text-[15px] font-bold text-[#0f172a]">Recent Activity</h2>
        <span class="text-[12px] text-[#94a3b8]">Audit trail of subscription changes</span>
      </div>
      <ul class="divide-y divide-[#f8fafc] max-h-[360px] overflow-y-auto">
        <li v-if="events.length === 0" class="py-6 text-center text-[13px] text-[#94a3b8]">No activity yet.</li>
        <li v-for="e in events" :key="e.id" class="flex items-start gap-3 py-3 px-[18px]">
          <span class="w-8 h-8 rounded-lg flex items-center justify-center text-[14px] shrink-0" :class="eventStyle(e.action).cls">{{ eventStyle(e.action).icon }}</span>
          <div class="flex-1 min-w-0">
            <p class="text-[13px] text-[#334155]"><b class="text-[#0f172a]">{{ e.user?.name ?? 'User' }}</b> — {{ eventStyle(e.action).label }}<span v-if="e.details?.plan"> ({{ e.details.plan }})</span><span v-if="e.details?.days"> · {{ e.details.days }} days</span></p>
            <p class="text-[11.5px] text-[#94a3b8]">{{ e.admin ? `by ${e.admin.name}` : 'System' }} · {{ fmtDateTime(e.created_at) }}<span v-if="e.details?.note"> · “{{ e.details.note }}”</span></p>
          </div>
        </li>
      </ul>
    </div>

    </template>

    <!-- ── Refunds queue ── -->
    <template v-else>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div v-for="card in refundCards" :key="card.label" class="bg-white border border-[#e2e8f0] rounded-[14px] p-4">
          <div class="flex items-center justify-between mb-2">
            <p class="text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px]">{{ card.label }}</p>
            <span class="w-8 h-8 rounded-lg flex items-center justify-center text-[15px]" :class="card.tone">{{ card.icon }}</span>
          </div>
          <p class="text-[22px] font-bold text-[#0f172a]">{{ card.value }}</p>
        </div>
      </div>

      <div class="flex items-center justify-between gap-3 flex-wrap">
        <div class="flex gap-1 bg-white border border-[#e2e8f0] rounded-[10px] p-1 overflow-x-auto">
          <button v-for="t in refundTabs" :key="t.value" :id="`refund-tab-${t.value || 'all'}`"
            class="py-1.5 px-3 rounded-[7px] border-none text-[12.5px] font-semibold cursor-pointer whitespace-nowrap transition-colors"
            :class="refundStatusFilter === t.value ? 'bg-emerald-500/15 text-emerald-600' : 'bg-transparent text-[#64748b] hover:bg-[#f1f5f9]'"
            @click="refundStatusFilter = t.value; fetchRefunds()">{{ t.label }}</button>
        </div>
        <input id="refund-search" v-model="refundSearch" @input="debouncedRefunds" class="py-2 px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] text-[#0f172a] bg-white outline-none w-full sm:w-[240px] focus:border-[#10b981]" placeholder="Search user name or email…" />
      </div>

      <div class="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr>
                <th v-for="h in ['User', 'Payment', 'Reason', 'Requested', 'Status', 'Submitted', 'Actions']" :key="h"
                  class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc] whitespace-nowrap">{{ h }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="refundsLoading"><td colspan="7" class="py-8 text-center text-[#94a3b8] text-[13.5px] animate-pulse">Loading refund requests…</td></tr>
              <tr v-else-if="refunds.length === 0"><td colspan="7" class="py-10 text-center text-[#94a3b8] text-[14px]">No refund requests match these filters.</td></tr>
              <tr v-else v-for="r in refunds" :key="r.id" class="hover:bg-[#f8fafc] border-b border-[#f8fafc] last:border-none">
                <td class="py-3 px-3.5">
                  <p class="font-semibold text-[#0f172a] text-[13.5px]">{{ r.user?.name ?? 'Deleted user' }}</p>
                  <p class="text-[11.5px] text-[#94a3b8]">{{ r.user?.email }}</p>
                </td>
                <td class="py-3 px-3.5 text-[12px] text-[#475569]">
                  <p class="capitalize font-semibold">{{ r.subscription?.plan }}</p>
                  <p class="text-[11px] text-[#94a3b8]">{{ peso(r.subscription?.price) }}</p>
                </td>
                <td class="py-3 px-3.5 text-[12.5px] text-[#334155] max-w-[220px]">
                  <p class="font-semibold">{{ reasonLabel(r.reason_type) }}</p>
                  <p class="text-[11.5px] text-[#94a3b8] truncate" :title="r.reason">{{ r.reason }}</p>
                </td>
                <td class="py-3 px-3.5 text-[13px] font-semibold text-[#0f172a] whitespace-nowrap">{{ r.requested_amount > 0 ? peso(r.requested_amount) : 'TBD' }}</td>
                <td class="py-3 px-3.5">
                  <span class="py-[3px] px-[10px] rounded-[20px] text-[11.5px] font-semibold capitalize" :class="refundStatusStyle(r.status)">{{ r.status }}</span>
                </td>
                <td class="py-3 px-3.5 text-[12px] text-[#475569] whitespace-nowrap">{{ fmtDateTime(r.created_at) }}</td>
                <td class="py-3 px-3.5">
                  <button :id="`review-refund-${r.id}`" class="py-1.5 px-3 rounded-lg border text-[12px] font-semibold cursor-pointer transition-colors"
                    :class="r.status === 'pending' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f1f5f9]'"
                    @click="openReview(r)">{{ r.status === 'pending' ? 'Review' : 'View' }}</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex items-center justify-between py-3 px-4 border-t border-[#f1f5f9]">
          <span class="text-[12.5px] text-[#64748b]">{{ refundPagination.total }} request(s)</span>
          <div class="flex items-center gap-2.5">
            <button class="pg-btn" :disabled="refundPagination.current_page <= 1" @click="fetchRefunds(refundPagination.current_page - 1)">‹</button>
            <span class="text-[12.5px] text-[#475569]">Page {{ refundPagination.current_page }} of {{ refundPagination.last_page }}</span>
            <button class="pg-btn" :disabled="refundPagination.current_page >= refundPagination.last_page" @click="fetchRefunds(refundPagination.current_page + 1)">›</button>
          </div>
        </div>
      </div>
    </template>

    <!-- Grant modal -->
    <div v-if="grantOpen" class="modal-backdrop" @click.self="grantOpen = false">
      <div class="modal-card">
        <div class="modal-head"><p class="text-[15px] font-bold text-[#0f172a]">Grant Subscription</p><button class="modal-x" @click="grantOpen = false">✕</button></div>
        <div class="p-[22px] flex flex-col gap-4">
          <div>
            <label class="field-label">User</label>
            <div v-if="grantForm.user" class="flex items-center justify-between p-2.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
              <div><p class="text-[13.5px] font-semibold text-[#0f172a]">{{ grantForm.user.name }}</p><p class="text-[11.5px] text-[#94a3b8]">{{ grantForm.user.email }}</p></div>
              <button class="text-[12px] text-emerald-600 font-semibold bg-transparent border-none cursor-pointer" @click="grantForm.user = null">Change</button>
            </div>
            <template v-else>
              <input id="grant-user-search" v-model="userQuery" @input="searchUsers" class="field-input" placeholder="Search by name or email…" />
              <ul v-if="userResults.length" class="mt-1.5 border border-[#e2e8f0] rounded-lg max-h-[180px] overflow-y-auto">
                <li v-for="u in userResults" :key="u.id" class="py-2 px-3 cursor-pointer hover:bg-[#f1f5f9] text-[13px]" @click="grantForm.user = u; userResults = []">
                  <b>{{ u.name }}</b> <span class="text-[#94a3b8]">· {{ u.email }}</span>
                </li>
              </ul>
            </template>
          </div>
          <div>
            <label class="field-label">Plan</label>
            <div class="grid grid-cols-2 gap-2.5">
              <button v-for="p in ['monthly', 'annual']" :key="p" :id="`grant-plan-${p}`"
                class="p-3 rounded-[10px] border-2 text-left cursor-pointer bg-white transition-colors"
                :class="grantForm.plan === p ? 'border-emerald-500 bg-emerald-50' : 'border-[#e2e8f0] hover:border-[#cbd5e1]'"
                @click="grantForm.plan = p; grantForm.days = p === 'annual' ? 365 : 30">
                <p class="text-[13.5px] font-semibold text-[#0f172a]">{{ stats.plans?.[p]?.name ?? p }}</p>
                <p class="text-[12px] text-[#64748b]">{{ peso(stats.plans?.[p]?.amount) }} / {{ p === 'annual' ? 'year' : 'month' }}</p>
              </button>
            </div>
          </div>
          <div>
            <label class="field-label">Duration (days)</label>
            <input id="grant-days" v-model.number="grantForm.days" type="number" min="1" class="field-input" />
            <p class="text-[11.5px] text-[#94a3b8] mt-1">Complimentary — no charge. If the user has an active plan, the grant starts when it ends.</p>
          </div>
          <div>
            <label class="field-label">Note (optional)</label>
            <input id="grant-note" v-model="grantForm.note" class="field-input" placeholder="e.g. Beta tester reward" />
          </div>
          <p v-if="formError" class="text-[12.5px] text-red-500">{{ formError }}</p>
          <button id="submit-grant" class="py-2.5 rounded-lg border-none bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-[13.5px] font-semibold cursor-pointer disabled:opacity-50" :disabled="busy || !grantForm.user" @click="submitGrant">{{ busy ? 'Granting…' : 'Grant Subscription' }}</button>
        </div>
      </div>
    </div>

    <!-- Extend / cancel / revoke modal -->
    <div v-if="action.type" class="modal-backdrop" @click.self="action.type = null">
      <div class="modal-card">
        <div class="modal-head"><p class="text-[15px] font-bold text-[#0f172a]">{{ actionMeta.title }}</p><button class="modal-x" @click="action.type = null">✕</button></div>
        <div class="p-[22px] flex flex-col gap-4">
          <p class="text-[13.5px] text-[#475569]">{{ actionMeta.desc }}</p>
          <div class="p-3 rounded-lg bg-[#f8fafc] text-[12.5px] text-[#475569]">
            <b class="text-[#0f172a]">{{ action.sub?.user?.name }}</b> · <span class="capitalize">{{ action.sub?.plan }}</span> · expires {{ fmtDate(action.sub?.expires_at) }}
          </div>
          <div v-if="action.type === 'extend'">
            <label class="field-label">Add days</label>
            <div class="flex gap-2 mb-2">
              <button v-for="d in [7, 30, 90, 365]" :key="d" class="py-1 px-2.5 rounded-md border text-[12px] cursor-pointer" :class="action.days === d ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-[#e2e8f0] bg-white text-[#475569]'" @click="action.days = d">+{{ d }}</button>
            </div>
            <input id="extend-days" v-model.number="action.days" type="number" min="1" class="field-input" />
          </div>
          <div>
            <label class="field-label">Note (optional)</label>
            <input id="action-note" v-model="action.note" class="field-input" placeholder="Reason for this change" />
          </div>
          <p v-if="formError" class="text-[12.5px] text-red-500">{{ formError }}</p>
          <button id="confirm-action" class="py-2.5 rounded-lg border-none text-white text-[13.5px] font-semibold cursor-pointer disabled:opacity-50" :class="actionMeta.btn" :disabled="busy" @click="submitAction">{{ busy ? 'Working…' : actionMeta.cta }}</button>
        </div>
      </div>
    </div>

    <!-- History drawer -->
    <div v-if="history" class="modal-backdrop !justify-end" @click.self="history = null">
      <div class="bg-white h-full w-[440px] max-w-[95vw] shadow-[0_20px_60px_rgba(0,0,0,0.2)] flex flex-col">
        <div class="modal-head"><p class="text-[15px] font-bold text-[#0f172a]">Subscription History</p><button class="modal-x" @click="history = null">✕</button></div>
        <div class="p-[22px] flex flex-col gap-5 overflow-y-auto">
          <div class="flex items-center gap-3">
            <div class="w-[48px] h-[48px] rounded-xl text-white text-[18px] font-bold flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">{{ initials(history.user.name) }}</div>
            <div>
              <p class="text-[15px] font-bold text-[#0f172a]">{{ history.user.name }}</p>
              <p class="text-[12.5px] text-[#64748b]">{{ history.user.email }}</p>
              <span class="inline-block mt-1 py-[2px] px-2 rounded-[20px] text-[11px] font-semibold capitalize bg-emerald-50 text-emerald-700">Tier: {{ history.tier }}</span>
            </div>
          </div>
          <button class="py-2 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-[13px] font-semibold cursor-pointer" @click="openGrant(history.user)">+ Grant to this user</button>
          <div>
            <p class="field-label">Subscriptions</p>
            <div v-for="s in history.subscriptions" :key="s.id" class="p-3 mb-2 rounded-lg border border-[#e2e8f0]">
              <div class="flex items-center justify-between">
                <span class="text-[13px] font-semibold capitalize text-[#0f172a]">{{ s.plan }} · {{ peso(s.price) }}</span>
                <span class="py-[2px] px-2 rounded-[20px] text-[11px] font-semibold" :class="stateStyle(s.state).cls">{{ stateStyle(s.state).label }}</span>
              </div>
              <p class="text-[11.5px] text-[#94a3b8] mt-1">{{ fmtDate(s.starts_at) }} → {{ fmtDate(s.expires_at) }} · {{ (s.payment_method || '—').replace('_', ' ') }}</p>
            </div>
            <p v-if="!history.subscriptions.length" class="text-[13px] text-[#94a3b8]">No subscriptions yet.</p>
          </div>
          <div>
            <p class="field-label">Events</p>
            <div v-for="e in history.events" :key="e.id" class="flex gap-2.5 py-2 text-[12.5px]">
              <span>{{ eventStyle(e.action).icon }}</span>
              <div><p class="text-[#334155]">{{ eventStyle(e.action).label }}</p><p class="text-[11px] text-[#94a3b8]">{{ e.admin?.name ?? 'System' }} · {{ fmtDateTime(e.created_at) }}</p></div>
            </div>
            <p v-if="!history.events.length" class="text-[13px] text-[#94a3b8]">No events recorded.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Create refund request (admin on behalf of user) -->
    <div v-if="createRefund.sub" class="modal-backdrop" @click.self="createRefund.sub = null">
      <div class="modal-card">
        <div class="modal-head"><p class="text-[15px] font-bold text-[#0f172a]">Open Refund Request</p><button class="modal-x" @click="createRefund.sub = null">✕</button></div>
        <div class="p-[22px] flex flex-col gap-4">
          <div class="p-3 rounded-lg bg-[#f8fafc] text-[12.5px] text-[#475569]">
            <b class="text-[#0f172a]">{{ createRefund.sub.user?.name }}</b> · <span class="capitalize">{{ createRefund.sub.plan }}</span> · {{ peso(createRefund.sub.price) }}
          </div>
          <div>
            <label class="field-label" for="create-refund-type">Reason</label>
            <select id="create-refund-type" v-model="createRefund.reason_type" class="field-input">
              <option v-for="(label, key) in REASON_LABELS" :key="key" :value="key">{{ label }}</option>
            </select>
          </div>
          <div>
            <label class="field-label" for="create-refund-reason">Details</label>
            <textarea id="create-refund-reason" v-model="createRefund.reason" rows="3" class="field-input resize-none" placeholder="What the user reported (min. 10 characters)" />
          </div>
          <p class="text-[11.5px] text-[#94a3b8]">This creates a pending request. A super admin still has to approve it before any money moves.</p>
          <p v-if="formError" class="text-[12.5px] text-red-500">{{ formError }}</p>
          <button id="submit-create-refund" class="py-2.5 rounded-lg border-none bg-gradient-to-br from-violet-500 to-violet-600 text-white text-[13.5px] font-semibold cursor-pointer disabled:opacity-50" :disabled="busy || createRefund.reason.trim().length < 10" @click="submitCreateRefund">{{ busy ? 'Creating…' : 'Create Request' }}</button>
        </div>
      </div>
    </div>

    <!-- Review refund modal -->
    <div v-if="review.r" class="modal-backdrop" @click.self="review.r = null">
      <div class="modal-card !w-[540px]">
        <div class="modal-head">
          <div>
            <p class="text-[15px] font-bold text-[#0f172a]">Refund Request #{{ review.r.id }}</p>
            <span class="inline-block mt-1 py-[2px] px-2 rounded-[20px] text-[11px] font-semibold capitalize" :class="refundStatusStyle(review.r.status)">{{ review.r.status }}</span>
          </div>
          <button class="modal-x" @click="review.r = null">✕</button>
        </div>
        <div class="p-[22px] flex flex-col gap-4">
          <div class="p-3 rounded-lg bg-[#f8fafc] text-[12.5px] text-[#475569] leading-relaxed">
            <b class="text-[#0f172a]">{{ review.r.user?.name }}</b> ({{ review.r.user?.email }})<br />
            <span class="capitalize">{{ review.r.subscription?.plan }}</span> · paid {{ peso(review.r.subscription?.price) }} on {{ fmtDate(review.r.subscription?.starts_at) }} · {{ (review.r.subscription?.payment_method || '—').replace('_', ' ') }}
          </div>

          <div>
            <p class="field-label">{{ reasonLabel(review.r.reason_type) }}</p>
            <p class="text-[13.5px] text-[#334155] whitespace-pre-line">{{ review.r.reason }}</p>
          </div>

          <!-- Server-side policy snapshot taken when the request was made -->
          <div v-if="review.r.eligibility">
            <p class="field-label">Policy check (at submit time)</p>
            <ul class="grid grid-cols-2 gap-2 text-[12.5px]">
              <li v-for="c in eligibilityChecks" :key="c.label" class="flex items-center gap-2 p-2 rounded-lg border" :class="c.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'">
                <span>{{ c.ok ? '✓' : '!' }}</span><span>{{ c.label }}</span>
              </li>
            </ul>
          </div>

          <!-- Decision (pending only) -->
          <template v-if="review.r.status === 'pending'">
            <div v-if="canApprove" class="grid grid-cols-2 gap-3">
              <div>
                <label class="field-label" for="refund-amount">Refund amount (₱)</label>
                <input id="refund-amount" v-model.number="review.amount" type="number" min="1" :max="review.r.subscription?.price" step="0.01" class="field-input" />
              </div>
              <div>
                <label class="field-label" for="refund-type">Type</label>
                <select id="refund-type" v-model="review.type" class="field-input"><option value="full">Full</option><option value="prorated">Prorated</option></select>
              </div>
            </div>
            <p v-else class="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[12.5px] text-amber-800">Only a super admin can approve refunds. You can still reject this request.</p>

            <div>
              <label class="field-label" for="refund-note">Note {{ review.confirmReject ? '(required to reject, shown to the user)' : '(optional)' }}</label>
              <input id="refund-note" v-model="review.note" class="field-input" placeholder="Decision note" />
            </div>
            <p v-if="formError" class="text-[12.5px] text-red-500">{{ formError }}</p>

            <div v-if="review.confirmApprove" class="p-3 rounded-lg bg-red-50 border border-red-200 text-[12.5px] text-red-800">
              This sends <b>{{ peso(review.amount) }}</b> back to the customer through PayMongo and ends their Premium access. It cannot be undone.
            </div>
            <div class="flex gap-2.5">
              <button id="reject-refund" class="flex-1 py-2.5 rounded-lg border border-red-200 bg-white text-red-600 text-[13.5px] font-semibold cursor-pointer hover:bg-red-50 disabled:opacity-50" :disabled="busy" @click="decide('reject')">{{ review.confirmReject ? 'Confirm Reject' : 'Reject' }}</button>
              <button v-if="canApprove" id="approve-refund" class="flex-1 py-2.5 rounded-lg border-none text-white text-[13.5px] font-semibold cursor-pointer disabled:opacity-50" :class="review.confirmApprove ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-emerald-500 to-emerald-600'" :disabled="busy || !(review.amount > 0)" @click="decide('approve')">{{ busy ? 'Working…' : review.confirmApprove ? 'Yes, Issue Refund' : 'Approve & Refund' }}</button>
            </div>
          </template>

          <!-- Outcome (already decided) -->
          <template v-else>
            <div class="text-[12.5px] text-[#475569] space-y-1">
              <p v-if="review.r.approved_amount">Approved amount: <b class="text-[#0f172a]">{{ peso(review.r.approved_amount) }}</b> ({{ review.r.refund_type }})</p>
              <p v-if="review.r.reviewer">Reviewed by <b class="text-[#0f172a]">{{ review.r.reviewer.name }}</b> · {{ fmtDateTime(review.r.reviewed_at) }}</p>
              <p v-if="review.r.paymongo_refund_id">PayMongo refund: <code class="text-[11.5px]">{{ review.r.paymongo_refund_id }}</code></p>
              <p v-if="review.r.admin_note" class="italic whitespace-pre-line">“{{ review.r.admin_note }}”</p>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast" class="fixed bottom-6 right-6 z-[200] py-3 px-4 rounded-xl bg-[#0f172a] text-white text-[13px] shadow-[0_10px_30px_rgba(0,0,0,0.25)]">{{ toast }}</div>
    </transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'role',
  roles: ['admin', 'super_admin'],
})
useHead({ title: 'Subscriptions · MycoVision Admin' })

const config = useRuntimeConfig()
const api = (path: string, opts: any = {}) =>
  $fetch<any>(`${config.public.apiBase}/admin/subscriptions${path}`, {
    ...opts,
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, Accept: 'application/json' },
  })

const loading = ref(true)
const busy = ref(false)
const subs = ref<any[]>([])
const events = ref<any[]>([])
const stats = ref<any>({})
const pagination = reactive({ current_page: 1, last_page: 1, total: 0, from: 0, to: 0 })
const searchQuery = ref('')
const planFilter = ref('')
const statusFilter = ref('')
const formError = ref('')
const toast = ref('')

const statusTabs = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'expiring', label: 'Expiring ≤7d' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'expired', label: 'Expired' },
  { value: 'pending', label: 'Pending' },
]

const statCards = computed(() => [
  { label: 'Active Subscribers', value: stats.value.active ?? 0, sub: `${stats.value.monthly ?? 0} monthly · ${stats.value.annual ?? 0} annual`, icon: '⭐', tone: 'bg-emerald-50 text-emerald-600' },
  { label: 'Monthly Recurring', value: peso(stats.value.mrr), sub: `${peso(stats.value.revenue_30d)} collected last 30d`, icon: '📈', tone: 'bg-blue-50 text-blue-600' },
  { label: 'Expiring Soon', value: stats.value.expiring_soon ?? 0, sub: 'Within the next 7 days', icon: '⏳', tone: 'bg-amber-50 text-amber-600' },
  { label: 'Total Revenue', value: peso(stats.value.total_revenue), sub: `${stats.value.free_users ?? 0} free users · ${stats.value.pending ?? 0} pending`, icon: '💰', tone: 'bg-violet-50 text-violet-600' },
])

let timer: any
function debouncedFetch() { clearTimeout(timer); timer = setTimeout(() => fetchSubs(), 300) }

async function fetchSubs(page = 1) {
  loading.value = true
  try {
    const q = new URLSearchParams({ page: String(page) })
    if (searchQuery.value) q.set('search', searchQuery.value)
    if (planFilter.value) q.set('plan', planFilter.value)
    if (statusFilter.value) q.set('status', statusFilter.value)
    const res = await api(`?${q}`)
    subs.value = res.data
    Object.assign(pagination, { current_page: res.current_page, last_page: res.last_page, total: res.total, from: res.from, to: res.to })
  } catch (e) {
    console.error('Failed to load subscriptions', e)
  } finally {
    loading.value = false
  }
}
async function fetchStats() { try { stats.value = await api('/stats') } catch (e) { console.error(e) } }
async function fetchEvents() { try { events.value = (await api('/events?per_page=15')).data } catch (e) { console.error(e) } }
function refreshAll() { fetchSubs(pagination.current_page); fetchStats(); fetchEvents(); fetchRefunds(refundPagination.current_page); fetchRefundStats() }
onMounted(refreshAll)

function notify(msg: string) { toast.value = msg; setTimeout(() => (toast.value = ''), 2800) }
function errMsg(e: any) {
  const d = e?.data
  return d?.errors ? Object.values(d.errors).flat().join(' ') : d?.message || 'Something went wrong.'
}

// ── Grant ─────────────────────────────
const grantOpen = ref(false)
const grantForm = reactive<any>({ user: null, plan: 'monthly', days: 30, note: '' })
const userQuery = ref('')
const userResults = ref<any[]>([])
let userTimer: any

function openGrant(user: any = null) {
  Object.assign(grantForm, { user, plan: 'monthly', days: 30, note: '' })
  userQuery.value = ''; userResults.value = []; formError.value = ''
  history.value = null
  grantOpen.value = true
}
function searchUsers() {
  clearTimeout(userTimer)
  userTimer = setTimeout(async () => {
    if (!userQuery.value.trim()) { userResults.value = []; return }
    const res = await $fetch<any>(`${config.public.apiBase}/admin/users?role=forager&search=${encodeURIComponent(userQuery.value)}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    userResults.value = (res.data ?? []).slice(0, 8)
  }, 250)
}
async function submitGrant() {
  busy.value = true; formError.value = ''
  try {
    const res = await api('/grant', { method: 'POST', body: { user_id: grantForm.user.id, plan: grantForm.plan, days: grantForm.days, note: grantForm.note || null } })
    grantOpen.value = false
    notify(res.message)
    refreshAll()
  } catch (e) { formError.value = errMsg(e) } finally { busy.value = false }
}

// ── Extend / cancel / revoke ─────────
const action = reactive<any>({ type: null, sub: null, days: 30, note: '' })
const actionMeta = computed(() => ({
  extend: { title: 'Extend Subscription', desc: 'Add days to this subscription. Expired or cancelled subscriptions will be reactivated.', cta: 'Extend', btn: 'bg-gradient-to-br from-emerald-500 to-emerald-600' },
  cancel: { title: 'Cancel at Period End', desc: 'Turns off renewal. The user keeps premium access until the current period ends.', cta: 'Cancel Renewal', btn: 'bg-gradient-to-br from-amber-500 to-amber-600' },
  revoke: { title: 'Revoke Access Now', desc: 'Immediately ends premium access. This does not issue a refund through PayMongo.', cta: 'Revoke Now', btn: 'bg-gradient-to-br from-red-500 to-red-600' },
} as any)[action.type] ?? {})

function openAction(type: string, sub: any) { Object.assign(action, { type, sub, days: 30, note: '' }); formError.value = '' }
async function submitAction() {
  busy.value = true; formError.value = ''
  try {
    const body: any = { note: action.note || null }
    if (action.type === 'extend') body.days = action.days
    const res = await api(`/${action.sub.id}/${action.type}`, { method: 'POST', body })
    action.type = null
    notify(res.message)
    refreshAll()
  } catch (e) { formError.value = errMsg(e) } finally { busy.value = false }
}

async function toggleAutoRenew(s: any) {
  busy.value = true
  try {
    const res = await api(`/${s.id}/auto-renew`, { method: 'PATCH', body: { auto_renew: !s.auto_renew } })
    Object.assign(s, res.subscription)
    notify(res.message); fetchEvents()
  } catch (e) { notify(errMsg(e)) } finally { busy.value = false }
}

// ── History ──────────────────────────
const history = ref<any>(null)
async function openHistory(user: any) {
  if (!user) return
  try { history.value = await api(`/user/${user.id}`) } catch (e) { notify(errMsg(e)) }
}

// ── Helpers ──────────────────────────
// ── Refunds ────────────────────────────────────
const view = ref<'subscriptions' | 'refunds'>('subscriptions')
const isSuperAdmin = ref(false)
onMounted(() => { isSuperAdmin.value = localStorage.getItem('role') === 'super_admin' })

const rapi = (path: string, opts: any = {}) =>
  $fetch<any>(`${config.public.apiBase}/admin/refunds${path}`, {
    ...opts,
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, Accept: 'application/json' },
  })

const REASON_LABELS: Record<string, string> = {
  first_time_guarantee: '7-day money-back guarantee',
  duplicate_charge:     'Duplicate or accidental charge',
  service_failure:      'Service failure',
  charged_after_cancel: 'Charged after cancelling',
  annual_prorated:      'Annual plan, prorated',
  other:                'Other',
}
const reasonLabel = (k: string) => REASON_LABELS[k] ?? k

const refunds = ref<any[]>([])
const refundsLoading = ref(true)
const refundStats = ref<any>({})
const refundSearch = ref('')
const refundStatusFilter = ref('')
const refundPagination = reactive({ current_page: 1, last_page: 1, total: 0 })
const refundTabs = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'failed', label: 'Failed' },
]
const refundCards = computed(() => [
  { label: 'Pending Review', value: refundStats.value.pending ?? 0, icon: '⏳', tone: 'bg-amber-50 text-amber-600' },
  { label: 'Processing', value: refundStats.value.processing ?? 0, icon: '🔄', tone: 'bg-blue-50 text-blue-600' },
  { label: 'Refunded', value: refundStats.value.refunded ?? 0, icon: '✅', tone: 'bg-emerald-50 text-emerald-600' },
  { label: 'Total Refunded', value: peso(refundStats.value.total_refunded), icon: '💸', tone: 'bg-violet-50 text-violet-600' },
])

let refundTimer: any
function debouncedRefunds() { clearTimeout(refundTimer); refundTimer = setTimeout(() => fetchRefunds(), 300) }

async function fetchRefunds(page = 1) {
  refundsLoading.value = true
  try {
    const q = new URLSearchParams({ page: String(page) })
    if (refundSearch.value) q.set('search', refundSearch.value)
    if (refundStatusFilter.value) q.set('status', refundStatusFilter.value)
    const res = await rapi(`?${q}`)
    refunds.value = res.data
    Object.assign(refundPagination, { current_page: res.current_page, last_page: res.last_page, total: res.total })
  } catch (e) {
    console.error('Failed to load refunds', e)
  } finally {
    refundsLoading.value = false
  }
}
async function fetchRefundStats() { try { refundStats.value = await rapi('/stats') } catch (e) { console.error(e) } }

function refundStatusStyle(status: string) {
  return ({
    pending:    'bg-amber-50 text-amber-700',
    processing: 'bg-blue-50 text-blue-700',
    refunded:   'bg-emerald-50 text-emerald-700',
    rejected:   'bg-red-50 text-red-700',
    failed:     'bg-red-50 text-red-700',
    withdrawn:  'bg-slate-100 text-slate-600',
  } as Record<string, string>)[status] ?? 'bg-slate-100 text-slate-600'
}

// Paid through the gateway and not already refunded (admin grants / complimentary / pending never qualify)
const isRefundable = (s: any) =>
  !!s.paymongo_payment_id
  && s.payment_method !== 'admin_grant'
  && !['refunded', 'partially_refunded', 'complimentary'].includes(s.payment_status ?? '')
  && Number(s.price) > 0
  && s.state !== 'pending'

// Admin opens a request on a user's behalf
const createRefund = reactive<any>({ sub: null, reason_type: 'other', reason: '' })
function openCreateRefund(sub: any) {
  Object.assign(createRefund, { sub, reason_type: 'other', reason: '' })
  formError.value = ''
}
async function submitCreateRefund() {
  busy.value = true; formError.value = ''
  try {
    const res = await api(`/${createRefund.sub.id}/refund`, { method: 'POST', body: { reason_type: createRefund.reason_type, reason: createRefund.reason.trim() } })
    createRefund.sub = null
    notify(res.message)
    view.value = 'refunds'
    await Promise.all([fetchRefunds(), fetchRefundStats(), fetchEvents()])
    openReview(res.request)
  } catch (e) { formError.value = errMsg(e) } finally { busy.value = false }
}

// Review a request: approve (super admin only) or reject
const review = reactive<any>({ r: null, amount: 0, type: 'full', note: '', confirmApprove: false, confirmReject: false })
const canApprove = computed(() => isSuperAdmin.value)
function openReview(r: any) {
  Object.assign(review, {
    r,
    amount: r.requested_amount > 0 ? r.requested_amount : (r.subscription?.price ?? 0),
    type: r.refund_type ?? 'full',
    note: '',
    confirmApprove: false,
    confirmReject: false,
  })
  formError.value = ''
}
const eligibilityChecks = computed(() => {
  const e = review.r?.eligibility
  if (!e) return []
  return [
    { ok: e.days_since_purchase !== null && e.days_since_purchase < 7, label: `${e.days_since_purchase ?? '?'} day(s) since purchase` },
    { ok: !!e.is_first_purchase, label: e.is_first_purchase ? 'First Premium purchase' : 'Not the first purchase' },
    { ok: e.premium_scans_used <= e.scan_cap, label: `${e.premium_scans_used} of ${e.scan_cap} scans used` },
    { ok: !e.prior_guarantee_used, label: e.prior_guarantee_used ? 'Guarantee already used' : 'No earlier guarantee refund' },
  ]
})

// Two-step: the first click arms the action (shows what will happen), the second performs it
async function decide(kind: 'approve' | 'reject') {
  formError.value = ''
  if (kind === 'approve') {
    review.confirmReject = false
    if (!review.confirmApprove) { review.confirmApprove = true; return }
  } else {
    review.confirmApprove = false
    if (!review.confirmReject) { review.confirmReject = true; return }
    if (review.note.trim().length < 5) { formError.value = 'Add a short note (at least 5 characters). The user will see it.'; return }
  }

  busy.value = true
  try {
    const body = kind === 'approve'
      ? { amount: review.amount, refund_type: review.type, note: review.note || null }
      : { note: review.note.trim() }
    const res = await rapi(`/${review.r.id}/${kind}`, { method: 'POST', body })
    review.r = null
    notify(res.message)
  } catch (e) {
    formError.value = errMsg(e)
  } finally {
    busy.value = false
    // A gateway failure still changes the request (to 'failed'), so always resync
    fetchRefunds(refundPagination.current_page); fetchRefundStats(); fetchSubs(pagination.current_page); fetchEvents()
  }
}

const isLive = (s: any) => ['active', 'expiring', 'cancelling'].includes(s.state)
const initials = (n?: string) => (n ? n.split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2) : '?')
const peso = (v: any) => `₱${Number(v ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—')
const fmtDateTime = (d?: string) => (d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—')

function stateStyle(state: string) {
  const map: Record<string, any> = {
    active:     { label: 'Active',     cls: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
    expiring:   { label: 'Expiring',   cls: 'bg-amber-50 text-amber-700',     dot: 'bg-amber-500' },
    cancelling: { label: 'Cancelling', cls: 'bg-orange-50 text-orange-700',   dot: 'bg-orange-500' },
    cancelled:  { label: 'Cancelled',  cls: 'bg-red-50 text-red-700',         dot: 'bg-red-500' },
    expired:    { label: 'Expired',    cls: 'bg-slate-100 text-slate-600',    dot: 'bg-slate-400' },
    pending:    { label: 'Pending',    cls: 'bg-blue-50 text-blue-700',       dot: 'bg-blue-500' },
  }
  return map[state] ?? { label: state, cls: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' }
}
function eventStyle(a: string) {
  const map: Record<string, any> = {
    activated:      { label: 'Subscription activated', icon: '✅', cls: 'bg-emerald-50' },
    granted:        { label: 'Complimentary plan granted', icon: '🎁', cls: 'bg-violet-50' },
    extended:       { label: 'Subscription extended', icon: '⏩', cls: 'bg-blue-50' },
    cancelled:      { label: 'Renewal cancelled', icon: '⏸', cls: 'bg-amber-50' },
    revoked:        { label: 'Access revoked', icon: '⛔', cls: 'bg-red-50' },
    auto_renew_on:  { label: 'Auto-renew turned on', icon: '🔁', cls: 'bg-emerald-50' },
    auto_renew_off: { label: 'Auto-renew turned off', icon: '⏹', cls: 'bg-slate-100' },
    synced:         { label: 'Synced with gateway', icon: '🔄', cls: 'bg-slate-100' },
    refund_requested: { label: 'Refund requested', icon: '💸', cls: 'bg-violet-50' },
    refunded:         { label: 'Refund issued', icon: '✅', cls: 'bg-emerald-50' },
    refund_rejected:  { label: 'Refund rejected', icon: '🚫', cls: 'bg-red-50' },
    refund_failed:    { label: 'Refund failed at gateway', icon: '⚠️', cls: 'bg-red-50' },
  }
  return map[a] ?? { label: a, icon: '•', cls: 'bg-slate-100' }
}
</script>

<style scoped>
.act-btn { @apply w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-[#f8fafc] cursor-pointer text-[13px] flex items-center justify-center transition-colors hover:bg-[#f1f5f9]; }
.pg-btn { @apply w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-white cursor-pointer text-[14px] text-[#475569] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed; }
.modal-backdrop { @apply fixed inset-0 bg-black/40 flex items-center justify-center z-[100] backdrop-blur-[2px]; }
.modal-card { @apply bg-white rounded-2xl w-[460px] max-w-[92vw] max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.2)]; }
.modal-head { @apply flex items-center justify-between py-[18px] px-[22px] border-b border-[#f1f5f9]; }
.modal-x { @apply bg-transparent border-none cursor-pointer text-[16px] text-[#94a3b8] p-1 hover:text-[#ef4444]; }
.field-label { @apply block text-[11.5px] font-semibold text-[#64748b] uppercase tracking-[0.4px] mb-1.5; }
.field-input { @apply w-full py-2 px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] text-[#0f172a] bg-white outline-none focus:border-[#10b981]; }
.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(10px); }
</style>
