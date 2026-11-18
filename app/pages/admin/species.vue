<template>
  <div class="flex flex-col gap-[22px]">
    <!-- Page Header -->
    <div class="flex items-end justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-[22px] font-bold text-[#0f172a]">Species DB &amp; AI Retrain</h1>
        <p class="text-[13.5px] text-[#64748b] mt-[3px]">
          Manage verified species, promote consented field scans, and retrain the mushroom classifier.
        </p>
      </div>
      <div v-if="activeTab !== 'retrain'" class="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
        <div class="relative w-full sm:w-auto">
          <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#94a3b8]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="searchQuery" @input="debouncedFilter" class="py-2 pr-3 pl-8 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none w-full sm:w-[200px] transition-colors duration-[0.18s] focus:border-[#10b981]" placeholder="Search species…" />
        </div>
        <select v-model="clsFilter" @change="filterSpecies" class="w-full sm:w-auto py-2 px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans bg-white cursor-pointer outline-none">
          <option value="">All Classifications</option>
          <option value="edible">Edible</option>
          <option value="poisonous">Poisonous</option>
          <option value="unknown">Unknown</option>
        </select>
        <button v-if="activeTab === 'verified'" class="flex-1 sm:flex-initial justify-center py-2 px-3.5 rounded-lg border border-[#e2e8f0] bg-white text-[#334155] text-[13.5px] font-semibold font-sans cursor-pointer transition-colors duration-[0.18s] hover:bg-[#f8fafc] flex items-center gap-1.5 whitespace-nowrap" @click="exportCatalogPdf"><AppIcon name="file" class="w-4 h-4 text-[#64748b]" /><span>Export Catalog PDF</span></button>
        <button v-if="activeTab === 'verified'" class="flex-1 sm:flex-initial justify-center py-2 px-4 rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] text-white border-none text-[13.5px] font-bold font-sans cursor-pointer transition-opacity duration-[0.18s] hover:opacity-90 whitespace-nowrap shadow-xs flex items-center gap-1.5" @click="openAdd">
          <AppIcon name="plus" class="w-4 h-4" />
          <span>Add Specimen to Unlock</span>
        </button>
      </div>
    </div>

    <!-- Tabs Navigation Bar -->
    <div class="flex items-center gap-2 border-b border-[#e2e8f0] overflow-x-auto">
      <button
        class="shrink-0 py-2.5 px-4 text-[14px] font-semibold transition-colors duration-200 border-b-2 -mb-[1px] cursor-pointer flex items-center gap-2"
        :class="activeTab === 'verified' ? 'border-[#10b981] text-[#10b981]' : 'border-transparent text-[#64748b] hover:text-[#0f172a]'"
        @click="selectTab('verified')"
      >
        <span class="whitespace-nowrap inline-flex items-center gap-1.5"><AppIcon name="book" class="w-4 h-4" />Verified Species (In DB)</span>
        <span class="py-0.5 px-2 rounded-full text-[11px] bg-[#f1f5f9] text-[#475569]">{{ species.length }}</span>
      </button>

      <button
        class="shrink-0 py-2.5 px-4 text-[14px] font-semibold transition-colors duration-200 border-b-2 -mb-[1px] cursor-pointer flex items-center gap-2"
        :class="activeTab === 'candidates' ? 'border-[#10b981] text-[#10b981]' : 'border-transparent text-[#64748b] hover:text-[#0f172a]'"
        @click="selectTab('candidates')"
      >
        <span class="whitespace-nowrap inline-flex items-center gap-1.5"><AppIcon name="microscope" class="w-4 h-4" />Candidate Scans (Review)</span>
        <span class="py-0.5 px-2 rounded-full text-[11px] bg-[#d1fae5] text-[#065f46] font-bold">{{ candidateScans.length }}</span>
      </button>

      <button
        class="shrink-0 py-2.5 px-4 text-[14px] font-semibold transition-colors duration-200 border-b-2 -mb-[1px] cursor-pointer flex items-center gap-2"
        :class="activeTab === 'retrain' ? 'border-[#10b981] text-[#10b981]' : 'border-transparent text-[#64748b] hover:text-[#0f172a]'"
        @click="selectTab('retrain')"
      >
        <span class="whitespace-nowrap inline-flex items-center gap-1.5"><AppIcon name="brain" class="w-4 h-4" />AI Model Retraining</span>
        <span class="py-0.5 px-2 rounded-full text-[11px] font-bold" :class="retrainState === 'running' ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-[#f1f5f9] text-[#475569]'">
          {{ retrainState === 'running' ? 'Training…' : retrainCount }}
        </span>
      </button>
    </div>

    <!-- Tab 1: Verified Species -->
    <div v-if="activeTab === 'verified'" class="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">#</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Specimen</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Classification</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Rarity & Reward</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">MycoDex Unlocks</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Habitat / Region</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Added</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="animate-pulse">
              <td colspan="8" class="py-8 text-center text-[#94a3b8] text-[13.5px]">Loading species database...</td>
            </tr>
            <tr v-else-if="filteredSpecies.length === 0">
              <td colspan="8" class="py-8 text-center text-[#94a3b8] text-[13.5px]">No verified species found on record.</td>
            </tr>
            <template v-else>
              <tr v-for="sp in paginatedSpecies" :key="sp.id" class="hover:bg-[#f8fafc] group">
                <td class="py-2.5 px-3.5 text-[12px] text-[#94a3b8] border-b border-[#f8fafc] align-middle font-mono group-last:border-none">{{ sp.id }}</td>
                <td class="py-2.5 px-3.5 border-b border-[#f8fafc] align-middle group-last:border-none">
                  <div class="flex items-center gap-3">
                    <img :src="getImageUrl(sp.image_url || sp.image_path)" class="w-10 h-10 rounded-lg object-cover border border-[#e2e8f0] shrink-0" alt="Specimen" />
                    <div>
                      <p class="font-bold text-[#0f172a] text-[13.5px] leading-tight">{{ sp.name }}</p>
                      <p class="text-[11.5px] text-[#64748b] italic font-serif mt-0.5">{{ sp.scientific_name || '-' }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">
                  <span class="py-[3px] px-2.5 rounded-[20px] text-[11.5px] font-semibold capitalize" :class="sp.classification === 'edible' ? 'bg-[#d1fae5] text-[#065f46]' : (sp.classification === 'poisonous' ? 'bg-[#fee2e2] text-[#991b1b]' : 'bg-[#fef3c7] text-[#92400e]')">{{ sp.classification }}</span>
                </td>
                <td class="py-2.5 px-3.5 border-b border-[#f8fafc] align-middle group-last:border-none">
                  <span
                    class="py-[3px] px-2.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide inline-flex items-center gap-1 border"
                    :class="{
                      'bg-slate-50 text-slate-700 border-slate-200': (sp.rarity || 'common') === 'common',
                      'bg-emerald-50 text-emerald-800 border-emerald-200': sp.rarity === 'uncommon',
                      'bg-purple-50 text-purple-800 border-purple-200': sp.rarity === 'rare',
                      'bg-amber-50 text-amber-900 border-amber-200': sp.rarity === 'legendary',
                    }"
                  >
                    <span>{{ sp.rarity || 'common' }}</span>
                    <span class="font-bold text-[10.5px] opacity-80">(+{{ sp.unlock_points || 5 }} pts)</span>
                  </span>
                </td>
                <td class="py-2.5 px-3.5 border-b border-[#f8fafc] align-middle group-last:border-none">
                  <span class="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0f172a]">
                    <AppIcon name="users" class="w-3.5 h-3.5 text-emerald-600" />
                    <span>{{ sp.unlock_count || 0 }} forager{{ (sp.unlock_count || 0) === 1 ? '' : 's' }}</span>
                  </span>
                </td>
                <td class="py-2.5 px-3.5 text-[12.5px] text-[#64748b] border-b border-[#f8fafc] align-middle group-last:border-none max-w-[180px] truncate" :title="sp.habitat || '-'">{{ sp.habitat || '-' }}</td>
                <td class="py-2.5 px-3.5 text-[12.5px] text-[#94a3b8] border-b border-[#f8fafc] align-middle whitespace-nowrap group-last:border-none">{{ formatDate(sp.created_at) }}</td>
                <td class="py-2.5 px-3.5 text-[13px] text-[#334155] border-b border-[#f8fafc] align-middle group-last:border-none">
                  <div class="flex gap-1.5">
                    <button class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-[#f8fafc] text-[#475569] cursor-pointer flex items-center justify-center transition-colors duration-[0.18s] hover:bg-[#e0f2fe] hover:border-[#bae6fd] hover:text-[#0284c7]" title="Generate PDF" @click="exportSpeciesPdf(sp)"><AppIcon name="file" class="w-3.5 h-3.5" /></button>
                    <button class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-[#f8fafc] text-[#475569] cursor-pointer flex items-center justify-center transition-colors duration-[0.18s] hover:bg-[#f1f5f9]" title="Edit" @click="openEdit(sp)"><AppIcon name="pencil" class="w-3.5 h-3.5" /></button>
                    <button class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-[#f8fafc] text-[#475569] cursor-pointer flex items-center justify-center transition-colors duration-[0.18s] hover:bg-[#fee2e2] hover:border-[#fecaca] hover:text-[#dc2626]" title="Delete" @click="deleteSpecies(sp)"><AppIcon name="trash" class="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class="flex items-center justify-between py-3 px-4 border-t border-[#f1f5f9]">
        <span class="text-[12.5px] text-[#64748b]">{{ filteredSpecies.length }} of {{ species.length }} species</span>
        <div class="flex items-center gap-2.5">
          <button class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-white cursor-pointer text-[14px] text-[#475569] transition-colors duration-[0.18s] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white" :disabled="page <= 1" @click="page--">‹</button>
          <span class="text-[12.5px] text-[#475569]">Page {{ page }} of {{ totalPages }}</span>
          <button class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-white cursor-pointer text-[14px] text-[#475569] transition-colors duration-[0.18s] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white" :disabled="page >= totalPages" @click="page++">›</button>
        </div>
      </div>
    </div>

    <!-- Tab 2: Candidate Scans -->
    <div v-if="activeTab === 'candidates'" class="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
      <div class="bg-[#f8fafc] p-3.5 border-b border-[#f1f5f9] flex flex-wrap items-center justify-between gap-2.5">
        <p class="text-[12.5px] text-[#475569] flex-1 min-w-[200px]">
          Showing user scans where <strong class="text-[#059669]">Share Data for Research</strong> is enabled. Admins can promote valid candidate scans into official DB species.
        </p>
        <button class="w-full sm:w-auto justify-center py-1.5 px-3 rounded-lg border border-[#e2e8f0] bg-white text-[12px] font-medium text-[#475569] cursor-pointer hover:bg-[#f1f5f9] inline-flex items-center gap-1.5 shrink-0" @click="fetchCandidateScans"><AppIcon name="refresh" class="w-3.5 h-3.5" /><span>Refresh</span></button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Image</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Detected Species</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Classification</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Scanned By</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Location / Coords</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Consent Status</th>
              <th class="text-left text-[11.5px] font-semibold text-[#94a3b8] uppercase tracking-[0.5px] py-3 px-3.5 border-b border-[#f1f5f9] bg-[#f8fafc]">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loadingCandidates" class="text-center">
              <td colspan="7" class="py-8 text-[#64748b] text-[13.5px]">Loading consented research candidate scans...</td>
            </tr>
            <tr v-else-if="filteredCandidates.length === 0" class="text-center">
              <td colspan="7" class="py-8 text-[#64748b] text-[13.5px]">No candidate scans found from opted-in users yet.</td>
            </tr>
            <template v-else>
              <tr v-for="scan in filteredCandidates" :key="scan.id" class="hover:bg-[#f8fafc] group">
                <td class="py-2.5 px-3.5 border-b border-[#f8fafc] align-middle">
                  <img :src="getImageUrl(scan.image_url || scan.image_path)" class="w-11 h-11 rounded-lg object-cover border border-[#e2e8f0]" alt="Scan" />
                </td>
                <td class="py-2.5 px-3.5 border-b border-[#f8fafc] align-middle">
                  <p class="font-semibold text-[#0f172a] text-[13.5px]">{{ scan.result_name }}</p>
                  <p class="text-[11.5px] text-[#64748b]">Confidence: {{ scan.confidence_level }}%</p>
                </td>
                <td class="py-2.5 px-3.5 border-b border-[#f8fafc] align-middle">
                  <span class="py-[3px] px-2.5 rounded-[20px] text-[11.5px] font-semibold capitalize" :class="scan.result_classification === 'edible' ? 'bg-[#d1fae5] text-[#065f46]' : (scan.result_classification === 'poisonous' ? 'bg-[#fee2e2] text-[#991b1b]' : 'bg-[#fef3c7] text-[#92400e]')">{{ scan.result_classification }}</span>
                </td>
                <td class="py-2.5 px-3.5 border-b border-[#f8fafc] align-middle text-[12.5px] text-[#334155]">
                  <p class="font-medium text-[#0f172a]">{{ scan.user?.name || 'Anonymous User' }}</p>
                  <p class="text-[11.5px] text-[#94a3b8]">{{ scan.user?.email }}</p>
                </td>
                <td class="py-2.5 px-3.5 border-b border-[#f8fafc] align-middle text-[12px] text-[#64748b]">
                  <span v-if="scan.latitude && scan.longitude" class="inline-flex items-center gap-1"><AppIcon name="map-pin" class="w-3.5 h-3.5" />{{ scan.latitude }}, {{ scan.longitude }}</span>
                  <span v-else class="text-[#94a3b8]">No GPS Data</span>
                </td>
                <td class="py-2.5 px-3.5 border-b border-[#f8fafc] align-middle">
                  <span class="py-1 px-2.5 rounded-full text-[11px] font-bold bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] inline-flex items-center gap-1">
                    ✓ Consented for ML
                  </span>
                </td>
                <td class="py-2.5 px-3.5 border-b border-[#f8fafc] align-middle">
                  <button
                    class="py-1.5 px-3 rounded-lg bg-[#10b981] text-white text-[12px] font-semibold border-none cursor-pointer hover:bg-[#059669] transition-colors inline-flex items-center gap-1"
                    @click="openPromoteModal(scan)"
                  >
                    <AppIcon name="plus" class="w-3.5 h-3.5" /><span>Add to Species DB</span>
                  </button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tab 3: AI Model Retraining -->
    <AdminRetrainPanel
      v-show="activeTab === 'retrain'"
      @update:count="retrainCount = $event"
      @update:state="retrainState = $event"
    />

    <!-- Add / Edit / Promote Specimen Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-[2px] p-4" @click.self="closeModal">
      <div class="bg-white rounded-2xl w-[640px] max-w-[95vw] max-h-[92vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between py-4 px-6 border-b border-[#f1f5f9] bg-[#f8fafc]">
          <div>
            <p class="text-[15px] font-bold text-[#0f172a] flex items-center gap-2">
              <AppIcon name="mushroom" class="w-4 h-4 text-emerald-600" />
              <span>{{ promoteScanId ? 'Promote Scan to Official Species DB' : (editingId ? 'Edit Specimen Details' : 'Add New Specimen for Foragers to Unlock') }}</span>
            </p>
            <p class="text-[12px] text-[#64748b] mt-0.5">
              Specimens added here appear in the MycoDex field catalog for foragers to discover and unlock.
            </p>
          </div>
          <button class="bg-transparent border-none cursor-pointer text-[18px] text-[#94a3b8] hover:text-[#ef4444] px-1" @click="closeModal">✕</button>
        </div>

        <!-- Scrollable Body -->
        <div class="p-6 flex flex-col gap-4 overflow-y-auto">
          <div v-if="formError" class="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px] font-medium">{{ formError }}</div>

          <!-- Specimen Photo Upload & Preview -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#475569] flex items-center justify-between">
              <span>Specimen Photo / Reference Image</span>
              <span class="text-[11px] text-[#94a3b8] font-normal">JPG, PNG, WebP (auto-optimized)</span>
            </label>

            <!-- When image is selected / exists -->
            <div v-if="previewImage" class="relative rounded-xl border border-[#cbd5e1] overflow-hidden bg-[#0f172a] flex items-center justify-center h-44 group">
              <img :src="previewImage" class="h-full w-full object-contain" alt="Specimen reference" />
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <label class="py-1.5 px-3 rounded-lg bg-white/90 hover:bg-white text-slate-800 text-[12px] font-semibold cursor-pointer shadow-sm">
                  Change Photo
                  <input type="file" accept="image/*" class="hidden" @change="handleFileSelect" />
                </label>
                <button
                  type="button"
                  class="py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[12px] font-semibold cursor-pointer shadow-sm"
                  @click="removeSelectedFile"
                >
                  Remove
                </button>
              </div>
            </div>

            <!-- Upload drop area when no image -->
            <label
              v-else
              class="border-2 border-dashed border-[#cbd5e1] hover:border-emerald-500 rounded-xl p-5 flex flex-col items-center justify-center gap-2 bg-[#f8fafc] hover:bg-emerald-50/40 transition-colors cursor-pointer text-center"
            >
              <input type="file" accept="image/*" class="hidden" @change="handleFileSelect" />
              <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <AppIcon name="camera" class="w-5 h-5" />
              </div>
              <div>
                <p class="text-[13px] font-semibold text-[#0f172a]">Click to upload specimen photo</p>
                <p class="text-[11.5px] text-[#64748b]">Foragers will see this photo once they discover and unlock this mushroom.</p>
              </div>
            </label>
          </div>

          <!-- Names: Common & Scientific -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div class="flex flex-col gap-1.5">
              <label class="text-[12.5px] font-semibold text-[#475569]">Common Name *</label>
              <input v-model="form.name" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none transition-colors duration-[0.18s] focus:border-[#10b981]" placeholder="e.g. Golden Chanterelle" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[12.5px] font-semibold text-[#475569]">Scientific Name</label>
              <input v-model="form.scientific_name" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none transition-colors duration-[0.18s] focus:border-[#10b981]" placeholder="e.g. Cantharellus cibarius" />
            </div>
          </div>

          <!-- Classification & Habitat -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div class="flex flex-col gap-1.5">
              <label class="text-[12.5px] font-semibold text-[#475569]">Classification *</label>
              <select v-model="form.classification" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none transition-colors duration-[0.18s] focus:border-[#10b981]">
                <option value="edible">Edible</option>
                <option value="poisonous">Poisonous</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[12.5px] font-semibold text-[#475569]">Habitat / Region</label>
              <input v-model="form.habitat" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13.5px] font-sans text-[#0f172a] bg-white outline-none transition-colors duration-[0.18s] focus:border-[#10b981]" placeholder="e.g. Moist deciduous forest floors" />
            </div>
          </div>

          <!-- Rarity & Unlock Points -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-[#f8fafc] p-3.5 rounded-xl border border-[#e2e8f0]">
            <div class="flex flex-col gap-1.5">
              <label class="text-[12.5px] font-semibold text-[#475569]">Specimen Rarity</label>
              <select v-model="form.rarity" @change="onRarityChange(form.rarity)" class="py-[8px] px-3 border border-[#cbd5e1] rounded-lg text-[13px] font-sans text-[#0f172a] bg-white outline-none focus:border-[#10b981]">
                <option value="common">Common (Standard +5 pts)</option>
                <option value="uncommon">Uncommon (+10 pts bonus)</option>
                <option value="rare">Rare (+15 pts bonus)</option>
                <option value="legendary">Legendary (+25 pts bonus)</option>
              </select>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[12.5px] font-semibold text-[#475569]">Forager Discovery Reward</label>
              <div class="flex items-center gap-2">
                <input v-model.number="form.unlock_points" type="number" min="1" max="500" class="py-[8px] px-3 border border-[#cbd5e1] rounded-lg text-[13px] font-sans text-[#0f172a] bg-white outline-none focus:border-[#10b981] w-24" />
                <span class="text-[12px] text-[#64748b] font-medium">Pending pts on first unlock</span>
              </div>
            </div>
          </div>

          <!-- Forager Unlock Hint / Discovery Clue -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#475569] flex items-center justify-between">
              <span>Forager Discovery Clue (Unlock Hint)</span>
              <span class="text-[11px] text-amber-700 font-normal">Shown in MycoDex while locked</span>
            </label>
            <textarea
              v-model="form.unlock_hint"
              class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13px] font-sans text-[#0f172a] bg-white outline-none resize-y transition-colors duration-[0.18s] focus:border-[#10b981]"
              rows="2"
              placeholder="e.g. Look on rotting hardwood logs in shaded mossy gullies after heavy summer rain."
            />
          </div>

          <!-- Description -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-[#475569]">Botanical Description & Notes</label>
            <textarea v-model="form.description" class="py-[9px] px-3 border border-[#e2e8f0] rounded-lg text-[13px] font-sans text-[#0f172a] bg-white outline-none resize-y transition-colors duration-[0.18s] focus:border-[#10b981]" rows="2" placeholder="Brief field description, cap texture, gill attachment, etc." />
          </div>

          <!-- Active in MycoDex Toggle -->
          <div class="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <div>
              <p class="text-[12.5px] font-bold text-emerald-950">Active in Forager MycoDex</p>
              <p class="text-[11.5px] text-emerald-800/80">Make this specimen visible in the field encyclopedia for all foragers to discover.</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.is_active_mycodex" class="sr-only peer" />
              <div class="w-10 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-between items-center py-3.5 px-6 border-t border-[#f1f5f9] bg-[#f8fafc]">
          <button v-if="editingId" class="py-[9px] px-4 rounded-lg border border-[#e2e8f0] bg-white text-[13px] font-semibold text-[#0f172a] cursor-pointer hover:bg-[#e2e8f0] flex items-center gap-1.5" @click="exportCurrentFormPdf">
            <AppIcon name="file" class="w-4 h-4 text-[#64748b]" /><span>Generate PDF</span>
          </button>
          <div v-else></div>
          <div class="flex gap-2.5">
            <button class="py-[9px] px-5 rounded-lg border border-[#e2e8f0] bg-white text-[13.5px] font-medium font-sans cursor-pointer text-[#475569] transition-colors duration-[0.18s] hover:bg-[#f1f5f9]" @click="closeModal">Cancel</button>
            <button class="py-[9px] px-5 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] text-white border-none text-[13.5px] font-semibold font-sans cursor-pointer transition-opacity duration-[0.18s] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]" @click="saveSpecies" :disabled="isSaving">
              <span v-if="isSaving" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              <span v-else>{{ promoteScanId ? 'Confirm & Save to DB' : (editingId ? 'Update Specimen' : 'Add to MycoDex') }}</span>
            </button>
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

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
// Composables must be called synchronously in setup (before any await)
const toast = useToast()
const { confirm } = useConfirm()

type SpeciesTab = 'verified' | 'candidates' | 'retrain'
function parseTab(val: unknown): SpeciesTab {
  return val === 'candidates' || val === 'retrain' ? val : 'verified'
}
const activeTab = ref<SpeciesTab>(parseTab(route.query.tab))
watch(() => route.query.tab, (t) => {
  activeTab.value = parseTab(t)
})
function selectTab(tab: SpeciesTab) {
  activeTab.value = tab
  router.replace({ query: tab === 'verified' ? {} : { tab } })
}

const retrainCount = ref(0)
const retrainState = ref('idle')
const isSaving = ref(false)
const formError = ref('')
const page = ref(1)
const perPage = 15

const searchQuery = ref('')
const clsFilter = ref('')
const loading = ref(false)
const loadingCandidates = ref(false)
const showModal = ref(false)
const editingId = ref<number | null>(null)
const promoteScanId = ref<number | null>(null)

interface Species {
  id: number
  name: string
  scientific_name?: string
  classification: string
  habitat?: string
  description?: string
  image_path?: string
  image_url?: string
  rarity?: string
  unlock_points?: number
  unlock_hint?: string
  is_active_mycodex?: boolean
  unlock_count?: number
  created_at?: string
}

interface ScanCandidate {
  id: number
  result_name: string
  result_classification: string
  confidence_level: number
  latitude?: number
  longitude?: number
  image_path: string
  image_url?: string
  created_at: string
  user?: { id: number; name: string; email: string }
}

const species = ref<Species[]>([])
const candidateScans = ref<ScanCandidate[]>([])

const selectedFile = ref<File | null>(null)
const previewImage = ref<string | null>(null)

const form = reactive({
  name: '',
  scientific_name: '',
  classification: 'edible',
  habitat: '',
  description: '',
  image_path: '',
  image_url: '',
  rarity: 'common',
  unlock_points: 5,
  unlock_hint: '',
  is_active_mycodex: true
})

function onRarityChange(val: string) {
  if (val === 'common') form.unlock_points = 5
  else if (val === 'uncommon') form.unlock_points = 10
  else if (val === 'rare') form.unlock_points = 15
  else if (val === 'legendary') form.unlock_points = 25
}

// Automatically optimize/compress images client-side before sending to server
async function compressImage(file: File, maxDim = 1280, quality = 0.85): Promise<File> {
  // If already under 800KB and is a standard web format, skip canvas overhead
  if (file.size <= 800 * 1024 && !file.type.includes('heic')) {
    return file
  }

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let width = img.width
        let height = img.height

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          } else {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(file)
          return
        }

        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file)
              return
            }
            const cleanName = (file.name || 'specimen').replace(/\.[^.]+$/, '') + '.jpg'
            const compressed = new File([blob], cleanName, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            resolve(compressed)
          },
          'image/jpeg',
          quality
        )
      }
      img.onerror = () => resolve(file)
      img.src = e.target?.result as string
    }
    reader.onerror = () => resolve(file)
    reader.readAsDataURL(file)
  })
}

async function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.size > 20 * 1024 * 1024) {
    toast.error('Image size must be less than 20MB')
    return
  }

  try {
    const optimized = await compressImage(file)
    selectedFile.value = optimized
    previewImage.value = URL.createObjectURL(optimized)
  } catch (err) {
    selectedFile.value = file
    previewImage.value = URL.createObjectURL(file)
  }
}

function removeSelectedFile() {
  selectedFile.value = null
  previewImage.value = null
  form.image_path = ''
  form.image_url = ''
}

const getHeaders = () => {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

// Escape user-provided text before putting it into the PDF print windows
const esc = (s: any) =>
  String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))

onMounted(() => {
  fetchVerifiedSpecies()
  fetchCandidateScans()
})

async function fetchVerifiedSpecies() {
  loading.value = true
  try {
    const data = await $fetch<Species[]>(`${config.public.apiBase}/admin/species`, {
      headers: getHeaders(),
    })
    species.value = data
  } catch (err) {
    console.error('Failed to fetch verified species:', err)
  } finally {
    loading.value = false
  }
}

async function fetchCandidateScans() {
  loadingCandidates.value = true
  try {
    const res = await $fetch<any>(`${config.public.apiBase}/admin/scans?only_consented=1`, {
      headers: getHeaders(),
    })
    const rawData = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : [])
    candidateScans.value = rawData
  } catch (err) {
    console.error('Failed to fetch candidate scans:', err)
  } finally {
    loadingCandidates.value = false
  }
}

const filteredSpecies = computed(() => species.value.filter(s => {
  const q = searchQuery.value.toLowerCase()
  const sName = (s.scientific_name || '').toLowerCase()
  const cName = (s.name || '').toLowerCase()
  const matchQ = !q || sName.includes(q) || cName.includes(q)
  const matchC = !clsFilter.value || s.classification === clsFilter.value
  return matchQ && matchC
}))

const filteredCandidates = computed(() => candidateScans.value.filter(c => {
  const q = searchQuery.value.toLowerCase()
  const matchQ = !q || (c.result_name || '').toLowerCase().includes(q)
  const matchC = !clsFilter.value || c.result_classification === clsFilter.value
  return matchQ && matchC
}))

const totalPages = computed(() => Math.max(1, Math.ceil(filteredSpecies.value.length / perPage)))
const paginatedSpecies = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredSpecies.value.slice(start, start + perPage)
})

// Keep the current page valid after deletes / filter changes
watch(totalPages, t => { if (page.value > t) page.value = t })

let debounceTimer: any = null
function debouncedFilter() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { page.value = 1 }, 300)
}
function filterSpecies() { page.value = 1 }

function getImageUrl(path?: string) {
  if (!path) return 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=150&q=80'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${config.public.apiBase.replace(/\/api\/?$/, '')}/storage/${path.replace(/^\/+/, '')}`
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function openAdd() {
  editingId.value = null
  promoteScanId.value = null
  selectedFile.value = null
  previewImage.value = null
  formError.value = ''
  Object.assign(form, {
    name: '',
    scientific_name: '',
    classification: 'edible',
    habitat: '',
    description: '',
    image_path: '',
    image_url: '',
    rarity: 'common',
    unlock_points: 5,
    unlock_hint: '',
    is_active_mycodex: true
  })
  showModal.value = true
}

function openEdit(sp: Species) {
  editingId.value = sp.id
  promoteScanId.value = null
  selectedFile.value = null
  previewImage.value = sp.image_url || (sp.image_path ? getImageUrl(sp.image_path) : null)
  formError.value = ''
  Object.assign(form, {
    name: sp.name,
    scientific_name: sp.scientific_name || '',
    classification: sp.classification,
    habitat: sp.habitat || '',
    description: sp.description || '',
    image_path: sp.image_path || '',
    image_url: sp.image_url || '',
    rarity: sp.rarity || 'common',
    unlock_points: sp.unlock_points ?? 5,
    unlock_hint: sp.unlock_hint || '',
    is_active_mycodex: sp.is_active_mycodex !== false
  })
  showModal.value = true
}

function openPromoteModal(scan: ScanCandidate) {
  promoteScanId.value = scan.id
  editingId.value = null
  selectedFile.value = null
  previewImage.value = scan.image_url || (scan.image_path ? getImageUrl(scan.image_path) : null)
  formError.value = ''
  // Deliberately NOT copying GPS coordinates or the user's name into public species fields.
  Object.assign(form, {
    name: scan.result_name,
    scientific_name: '',
    classification: scan.result_classification,
    habitat: '',
    description: '',
    image_path: scan.image_path,
    image_url: scan.image_url || '',
    rarity: 'uncommon',
    unlock_points: 10,
    unlock_hint: '',
    is_active_mycodex: true
  })
  showModal.value = true
}

async function saveSpecies() {
  if (!form.name || !form.classification) {
    formError.value = 'Please fill in required fields (Common Name and Classification).'
    return
  }
  formError.value = ''

  isSaving.value = true

  // Capture before closeModal() resets them
  const promotedScanId = promoteScanId.value
  const wasEditing = !!editingId.value
  const editId = editingId.value

  try {
    const formData = new FormData()
    formData.append('name', form.name)
    if (form.scientific_name) formData.append('scientific_name', form.scientific_name)
    formData.append('classification', form.classification)
    if (form.habitat) formData.append('habitat', form.habitat)
    if (form.description) formData.append('description', form.description)
    if (form.rarity) formData.append('rarity', form.rarity)
    formData.append('unlock_points', String(form.unlock_points ?? 5))
    if (form.unlock_hint) formData.append('unlock_hint', form.unlock_hint)
    formData.append('is_active_mycodex', form.is_active_mycodex ? '1' : '0')

    if (selectedFile.value) {
      formData.append('image', selectedFile.value)
    } else if (form.image_path) {
      formData.append('image_path', form.image_path)
    }

    if (promotedScanId) {
      formData.append('scan_id', String(promotedScanId))
    }

    const token = localStorage.getItem('token')
    if (!token) {
      formError.value = 'Your session has expired. Please sign in again.'
      isSaving.value = false
      return
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }

    if (editId) {
      formData.append('_method', 'PUT')
      await $fetch(`${config.public.apiBase}/admin/species/${editId}`, {
        method: 'POST',
        headers,
        body: formData
      })
    } else {
      await $fetch(`${config.public.apiBase}/admin/species`, {
        method: 'POST',
        headers,
        body: formData
      })
    }

    closeModal()
    fetchVerifiedSpecies()
    if (promotedScanId) {
      // Remove the promoted scan so it can't be promoted twice
      candidateScans.value = candidateScans.value.filter(c => c.id !== promotedScanId)
      toast.success('Candidate scan successfully promoted & saved to Species DB!')
    } else {
      toast.success(wasEditing ? 'Species updated.' : 'New specimen added to MycoDex!')
    }
  } catch (err: any) {
    console.error('Failed to save species:', err)
    if (err?.status === 413 || err?.message?.includes('413') || err?.message?.includes('Load failed')) {
      formError.value = 'The uploaded photo was too large for the server. Please try a smaller photo or let the auto-optimizer resize it.'
    } else if (err?.status === 401) {
      formError.value = 'Your admin session has expired. Please sign in again.'
    } else {
      formError.value = err?.data?.message || err?.message || 'Failed to save species.'
    }
  } finally {
    isSaving.value = false
  }
}

function closeModal() {
  showModal.value = false
  promoteScanId.value = null
  editingId.value = null
  selectedFile.value = null
  previewImage.value = null
  formError.value = ''
}

async function deleteSpecies(sp: Species) {
  const ok = await confirm({
    title: 'Delete species?',
    message: `"${sp.name}" will be permanently removed from the species database.`,
    tone: 'danger',
    confirmText: 'Delete',
  })
  if (!ok) return
  try {
    await $fetch(`${config.public.apiBase}/admin/species/${sp.id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    fetchVerifiedSpecies()
    toast.success('Species deleted.')
  } catch (err: any) {
    toast.error(err?.data?.message || 'Failed to delete species.')
  }
}

function exportCurrentFormPdf() {
  exportSpeciesPdf({
    id: editingId.value || 0,
    name: form.name,
    scientific_name: form.scientific_name,
    classification: form.classification,
    habitat: form.habitat,
    description: form.description,
    image_path: form.image_path,
    image_url: form.image_url,
  })
}

const PRINT_BRAND_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3C7.03 3 3 7.03 3 12c0 1.1.3 2.15.82 3h16.36c.52-.85.82-1.9.82-3 0-4.97-4.03-9-9-9zm-2.5 12v5a1.5 1.5 0 0 0 1.5 1.5h2a1.5 1.5 0 0 0 1.5-1.5v-5h-5z"/></svg>'

function exportSpeciesPdf(sp: Species) {
  const printWindow = window.open('', '_blank', 'width=850,height=950')
  if (!printWindow) {
    alert('Please allow popups to generate PDF.')
    return
  }

  const cls = (sp.classification || '').toLowerCase()
  const isEdible = cls === 'edible'
  const isPoisonous = cls === 'poisonous'
  const badgeBg = isEdible ? '#d1fae5' : (isPoisonous ? '#fee2e2' : '#fef3c7')
  const badgeColor = isEdible ? '#065f46' : (isPoisonous ? '#991b1b' : '#92400e')

  const imgSrc = sp.image_url || sp.image_path
  const imgHtml = imgSrc ? `
    <div style="text-align: center; margin-top: 25px;">
      <img src="${esc(getImageUrl(imgSrc))}" style="max-width: 100%; max-height: 280px; border-radius: 12px; border: 1px solid #cbd5e1; object-fit: cover; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" alt="${esc(sp.name)}" />
    </div>
  ` : ''

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${esc(sp.name)} - Mushroom Species Datasheet</title>
      <style>
        body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 40px; color: #1e293b; background: #fff; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2.5px solid #10b981; padding-bottom: 15px; margin-bottom: 25px; }
        .brand { font-size: 22px; font-weight: 800; color: #065f46; display: flex; align-items: center; gap: 8px; }
        .doc-title { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1.2px; }
        .title-section { margin-bottom: 24px; }
        .common-name { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0; }
        .scientific-name { font-size: 16px; font-style: italic; color: #475569; margin-top: 4px; font-weight: 500; }
        .badge { display: inline-block; padding: 5px 14px; border-radius: 20px; font-size: 13px; font-weight: 700; text-transform: capitalize; background: ${badgeBg}; color: ${badgeColor}; margin-top: 12px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; }
        .card h3 { margin-top: 0; font-size: 14px; font-weight: 700; color: #334155; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .info-row { display: flex; margin-bottom: 8px; font-size: 13.5px; }
        .info-label { width: 140px; color: #64748b; font-weight: 500; flex-shrink: 0; }
        .info-val { color: #0f172a; font-weight: 600; flex: 1; }
        .desc-text { font-size: 13.5px; color: #334155; line-height: 1.65; margin: 0; text-align: justify; }
        .footer { margin-top: 45px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
        @media print {
          body { margin: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">${PRINT_BRAND_SVG} MycoVision</div>
        <div class="doc-title">Mushroom Species Datasheet</div>
      </div>

      <div class="title-section">
        <h1 class="common-name">${esc(sp.name)}</h1>
        <div class="scientific-name">${esc(sp.scientific_name || '-')}</div>
        <div class="badge">${esc(sp.classification || 'Unknown')}</div>
      </div>

      <div class="grid">
        <div class="card">
          <h3>Species Specifications</h3>
          <div class="info-row"><span class="info-label">Database ID:</span><span class="info-val">#${esc(sp.id || 'N/A')}</span></div>
          <div class="info-row"><span class="info-label">Common Name:</span><span class="info-val">${esc(sp.name)}</span></div>
          <div class="info-row"><span class="info-label">Scientific Name:</span><span class="info-val"><em>${esc(sp.scientific_name || '-')}</em></span></div>
          <div class="info-row"><span class="info-label">Classification:</span><span class="info-val" style="text-transform: capitalize;">${esc(sp.classification)}</span></div>
          <div class="info-row"><span class="info-label">Habitat / Region:</span><span class="info-val">${esc(sp.habitat || '-')}</span></div>
          <div class="info-row"><span class="info-label">Cataloged On:</span><span class="info-val">${esc(formatDate(sp.created_at))}</span></div>
        </div>

        <div class="card">
          <h3>Description &amp; Research Notes</h3>
          <p class="desc-text">${esc(sp.description || 'No detailed description recorded for this mushroom species.')}</p>
        </div>
      </div>

      ${imgHtml}

      <div class="footer">
        <span>MycoVision Official Species Database Report</span>
        <span>Generated: ${esc(new Date().toLocaleString())}</span>
      </div>

      \x3Cscript\x3E
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      \x3C/script\x3E
    </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()
}

function exportCatalogPdf() {
  const printWindow = window.open('', '_blank', 'width=950,height=1000')
  if (!printWindow) {
    alert('Please allow popups to generate PDF.')
    return
  }

  const rowsHtml = filteredSpecies.value.map(sp => {
    const clsKey = ['edible', 'poisonous'].includes(sp.classification) ? sp.classification : 'unknown'
    return `
    <tr>
      <td style="font-family: monospace;">#${esc(sp.id)}</td>
      <td><strong>${esc(sp.name)}</strong><br><em style="color: #64748b; font-size: 12px;">${esc(sp.scientific_name || '-')}</em></td>
      <td><span class="badge ${clsKey}">${esc(sp.classification)}</span></td>
      <td>${esc(sp.habitat || '-')}</td>
      <td>${esc(formatDate(sp.created_at))}</td>
    </tr>
  `
  }).join('')

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>MycoVision Species Catalog Report</title>
      <style>
        body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 35px; color: #1e293b; background: #fff; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2.5px solid #10b981; padding-bottom: 12px; margin-bottom: 20px; }
        .brand { font-size: 22px; font-weight: 800; color: #065f46; display: flex; align-items: center; gap: 8px; }
        .doc-title { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
        .summary-bar { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 13.5px; color: #475569; display: flex; justify-content: space-between; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { text-align: left; background: #f1f5f9; padding: 10px 12px; font-size: 11.5px; border-bottom: 2px solid #cbd5e1; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
        td { padding: 11px 12px; font-size: 13px; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
        .badge { padding: 4px 10px; border-radius: 14px; font-size: 11.5px; font-weight: 700; text-transform: capitalize; display: inline-block; }
        .edible { background: #d1fae5; color: #065f46; }
        .poisonous { background: #fee2e2; color: #991b1b; }
        .unknown { background: #fef3c7; color: #92400e; }
        .footer { margin-top: 35px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 12px; }
        @media print {
          body { margin: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">${PRINT_BRAND_SVG} MycoVision Species Catalog</div>
        <div class="doc-title">Official Database Summary</div>
      </div>
      <div class="summary-bar">
        <span>Verified Records Shown: <strong>${filteredSpecies.value.length}</strong> / Total: <strong>${species.value.length}</strong></span>
        <span>Date: <strong>${esc(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }))}</strong></span>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Species Name</th>
            <th>Classification</th>
            <th>Habitat / Region</th>
            <th>Date Added</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || '<tr><td colspan="5" style="text-align: center; color: #64748b;">No species entries found.</td></tr>'}
        </tbody>
      </table>
      <div class="footer">
        <span>MycoVision Admin Systems Export</span>
        <span>Generated: ${esc(new Date().toLocaleString())}</span>
      </div>
      \x3Cscript\x3E
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      \x3C/script\x3E
    </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()
}
</script>