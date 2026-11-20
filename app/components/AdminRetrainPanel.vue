<template>
  <div class="flex flex-col gap-[22px]">
    <!-- Top Section Switcher: Pending Queue vs Verified Retraining Dataset -->
    <div class="flex items-center gap-2 border-b border-[#e2e8f0] pb-2 overflow-x-auto">
      <button
        type="button"
        class="py-2.5 px-4 rounded-xl text-[13.5px] font-bold cursor-pointer transition-all flex items-center gap-2 shrink-0"
        :class="retrainSectionTab === 'pending'
          ? 'bg-amber-500 text-white shadow-sm'
          : 'bg-white border border-[#e2e8f0] text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc]'"
        @click="retrainSectionTab = 'pending'"
      >
        <AppIcon name="clock" class="w-4 h-4" />
        <span>Pending Annotation Queue</span>
        <span
          class="px-2 py-0.5 rounded-full text-[11px] font-extrabold"
          :class="retrainSectionTab === 'pending' ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-800'"
        >
          {{ pendingCount }}
        </span>
      </button>

      <button
        type="button"
        class="py-2.5 px-4 rounded-xl text-[13.5px] font-bold cursor-pointer transition-all flex items-center gap-2 shrink-0"
        :class="retrainSectionTab === 'verified'
          ? 'bg-[#0f172a] text-white shadow-sm'
          : 'bg-white border border-[#e2e8f0] text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc]'"
        @click="retrainSectionTab = 'verified'"
      >
        <AppIcon name="database" class="w-4 h-4" />
        <span>Verified Dataset & Retraining</span>
        <span
          class="px-2 py-0.5 rounded-full text-[11px] font-extrabold"
          :class="retrainSectionTab === 'verified' ? 'bg-white/20 text-white' : 'bg-[#e2e8f0] text-[#334155]'"
        >
          {{ summary.total }}
        </span>
      </button>
    </div>

    <!-- TAB 1: Pending Annotation Queue (HITL Crowdsourcing) -->
    <div v-if="retrainSectionTab === 'pending'" class="flex flex-col gap-5">
      <!-- Action Bar -->
      <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 class="text-[15px] font-bold text-[#0f172a] flex items-center gap-2">
            <span>Human-in-the-Loop Annotation Queue</span>
            <span v-if="pendingCount > 0" class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
              {{ pendingCount }} pending review
            </span>
          </h2>
          <p class="text-[12.5px] text-[#64748b] mt-0.5">
            Review crowd-contributed mushroom scans, correct AI classifications, and approve to award verified points & add to retraining data.
          </p>
        </div>
        <div class="flex items-center gap-2.5">
          <button
            type="button"
            class="py-2 px-3 rounded-lg border border-[#e2e8f0] bg-white text-[12.5px] font-medium text-[#475569] cursor-pointer hover:bg-[#f1f5f9] inline-flex items-center gap-1.5 shadow-2xs"
            :disabled="pendingLoading"
            @click="fetchPendingAnnotations(pendingPagination.current_page)"
          >
            <AppIcon name="refresh" class="w-3.5 h-3.5" :class="{ 'animate-spin': pendingLoading }" />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      <!-- Pending Loading -->
      <div v-if="pendingLoading" class="flex items-center justify-center py-20 bg-white border border-[#e2e8f0] rounded-[14px]">
        <div class="w-8 h-8 border-[3px] border-[#e2e8f0] border-t-amber-500 rounded-full animate-spin" />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="pendingList.length === 0"
        class="bg-white border border-[#e2e8f0] rounded-[14px] p-12 text-center flex flex-col items-center justify-center gap-3 shadow-xs"
      >
        <div class="w-14 h-14 rounded-2xl bg-[#f0fdf4] text-[#059669] flex items-center justify-center">
          <AppIcon name="mushroom" class="w-8 h-8 text-[#059669]" />
        </div>
        <div>
          <p class="text-[15px] font-bold text-[#0f172a]">Queue is Clear!</p>
          <p class="text-[13px] text-[#64748b] max-w-[420px] mt-1">
            There are no crowd scans waiting for expert verification right now. New scans with data-sharing consent will appear here automatically.
          </p>
        </div>
        <button
          type="button"
          class="mt-2 py-2 px-4 rounded-xl bg-[#0f172a] text-white text-[12.5px] font-semibold hover:bg-[#1e293b] cursor-pointer inline-flex items-center gap-1.5"
          @click="retrainSectionTab = 'verified'"
        >
          <AppIcon name="database" class="w-4 h-4" />
          <span>Go to Verified Retraining Dataset</span>
        </button>
      </div>

      <!-- Pending List Items -->
      <div v-else class="grid grid-cols-1 gap-4">
        <div
          v-for="item in pendingList"
          :key="item.id"
          class="bg-white border border-[#e2e8f0] rounded-[14px] p-4 sm:p-5 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between shadow-xs hover:border-[#cbd5e1] transition-all"
        >
          <!-- Left: Image Thumbnail & Specimen Details -->
          <div class="flex items-start gap-4 flex-1 min-w-0">
            <div
              class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 cursor-pointer group"
              @click="previewScan = item"
            >
              <img
                :src="getImageUrl(item.image_url || item.image_path)"
                :alt="item.predicted_species"
                class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                @error="brokenImages[item.id] = true"
              />
              <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold">
                <AppIcon name="eye" class="w-4 h-4" />
              </div>
            </div>

            <div class="flex flex-col gap-1.5 min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-[14.5px] font-bold text-[#0f172a] truncate">
                  {{ item.predicted_species }}
                </span>

                <!-- Borderline Active Learning Badge vs Standard Confidence -->
                <span
                  v-if="item.is_borderline || (item.confidence_score >= 0.60 && item.confidence_score < 0.80)"
                  class="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center gap-1"
                  title="Confidence between 0.60 - 0.79: Priority active learning edge case (+10 pts bonus)"
                >
                  <AppIcon name="bolt" class="w-3 h-3 text-amber-600" />
                  <span>{{ Math.round(item.confidence_score * 100) }}% (Borderline / Active Learning)</span>
                </span>
                <span
                  v-else
                  class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {{ Math.round(item.confidence_score * 100) }}% Confidence
                </span>

                <span
                  v-if="item.is_new_species_for_user"
                  class="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1"
                >
                  <AppIcon name="sparkles" class="w-3 h-3 text-amber-500" />
                  <span>New Species Unlock (+5 pts)</span>
                </span>
              </div>

              <!-- Contributor & Points Meta -->
              <p class="text-[12px] text-[#64748b]">
                Forager: <strong class="text-[#334155]">{{ item.user?.name || item.user?.email || 'Anonymous Forager' }}</strong>
                · <span class="font-semibold text-amber-700">+{{ item.points_awarded }} Pending Pts</span>
                <span v-if="item.created_at"> · {{ formatDate(item.created_at) }}</span>
              </p>

              <!-- Relabel Dropdown -->
              <div class="flex flex-wrap items-center gap-2 mt-1">
                <label class="text-[11.5px] font-bold text-[#475569]">Verified Label:</label>
                <select
                  v-model="selectedRelabels[item.id]"
                  class="py-1 px-2.5 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] text-[12.5px] font-medium text-[#0f172a] outline-none focus:border-emerald-500 focus:bg-white transition-colors max-w-[320px]"
                >
                  <option :value="item.predicted_species">
                    Keep Prediction ({{ item.predicted_species }})
                  </option>
                  <option disabled>──────────</option>
                  <option
                    v-for="sp in speciesCatalog"
                    :key="sp.id"
                    :value="sp.name"
                  >
                    {{ sp.name }} ({{ sp.classification }})
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Right: Action Buttons -->
          <div class="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            <button
              type="button"
              class="flex-1 md:flex-initial py-2 px-3.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-[12.5px] font-bold cursor-pointer transition-colors inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
              :disabled="actionLoading[item.id]"
              @click="rejectContribution(item.id)"
            >
              <AppIcon name="x-circle" class="w-4 h-4" />
              <span>Reject</span>
            </button>
            <button
              type="button"
              class="flex-1 md:flex-initial py-2 px-4 rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] hover:opacity-90 text-white text-[12.5px] font-bold cursor-pointer transition-all inline-flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
              :disabled="actionLoading[item.id]"
              @click="approveContribution(item.id)"
            >
              <span v-if="actionLoading[item.id]" class="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <AppIcon v-else name="check-circle" class="w-4 h-4" />
              <span>Approve Scan</span>
            </button>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div v-if="pendingPagination.last_page > 1" class="flex items-center justify-between pt-2">
          <p class="text-[12px] text-[#64748b]">
            Page {{ pendingPagination.current_page }} of {{ pendingPagination.last_page }} ({{ pendingPagination.total }} items)
          </p>
          <div class="flex gap-1.5">
            <button
              type="button"
              class="py-1 px-3 rounded-lg border border-[#e2e8f0] bg-white text-[12px] font-medium disabled:opacity-50"
              :disabled="pendingPagination.current_page <= 1"
              @click="fetchPendingAnnotations(pendingPagination.current_page - 1)"
            >
              Previous
            </button>
            <button
              type="button"
              class="py-1 px-3 rounded-lg border border-[#e2e8f0] bg-white text-[12px] font-medium disabled:opacity-50"
              :disabled="pendingPagination.current_page >= pendingPagination.last_page"
              @click="fetchPendingAnnotations(pendingPagination.current_page + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: Verified Retraining Dataset -->
    <div v-show="retrainSectionTab === 'verified'" class="flex flex-col gap-[22px]">
      <!-- Action bar -->
      <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 class="text-[15px] font-bold text-[#0f172a]">AI Model Retraining</h2>
          <p class="text-[12.5px] text-[#64748b] mt-0.5">
            Improve the mushroom classifier using human-verified scan images from foragers.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            class="py-2 px-3 rounded-lg border border-[#38bdf8] bg-[#f0f9ff] text-[12.5px] font-semibold text-[#0369a1] cursor-pointer hover:bg-[#e0f2fe] inline-flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 shadow-2xs"
            :disabled="isExporting"
            title="Export all verified images organized in folders by species + metadata.csv"
            @click="exportDatasetZip"
          >
            <AppIcon name="download" class="w-3.5 h-3.5" :class="{ 'animate-bounce': isExporting }" />
            <span>{{ isExporting ? 'Exporting…' : 'Export Dataset (ZIP)' }}</span>
          </button>
          <button
            type="button"
            class="py-2 px-3 rounded-lg border border-[#e2e8f0] bg-white text-[12.5px] font-medium text-[#475569] cursor-pointer hover:bg-[#f1f5f9] inline-flex items-center justify-center gap-1.5"
            :disabled="loading"
            @click="refreshAll"
          >
            <AppIcon name="refresh" class="w-3.5 h-3.5" :class="{ 'animate-spin': loading }" />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            class="py-2 px-3 rounded-lg border border-[#fed7aa] bg-[#fff7ed] text-[12.5px] font-semibold text-[#c2410c] cursor-pointer hover:bg-[#ffedd5] inline-flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            :disabled="scanningDuplicates || loading"
            title="Scan candidate images to detect exact or near-duplicate copies"
            @click="handleDuplicateButtonClick"
          >
            <AppIcon name="copy" class="w-3.5 h-3.5" :class="{ 'animate-spin': scanningDuplicates }" />
            <span>{{ scanningDuplicates ? 'Scanning…' : (hasScannedDuplicates ? (duplicateSummary.redundant_scans_count > 0 ? 'Review Duplicates' : 'Re-scan Duplicates') : 'Scan for Duplicates') }}</span>
            <span
              v-if="hasScannedDuplicates && duplicateSummary.redundant_scans_count > 0"
              class="px-1.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#ea580c] text-white leading-none"
            >
              {{ duplicateSummary.redundant_scans_count }}
            </span>
          </button>
          <button
            type="button"
            class="py-2 px-3 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] text-[12.5px] font-semibold text-[#047857] cursor-pointer hover:bg-[#dcfce7] inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
            :disabled="refreshingMl || retrainState === 'running'"
            title="Reload Stage-1 & Stage-2 ML models on Render so new scans run against the latest weights"
            @click="refreshMlService"
          >
            <AppIcon name="sparkles" class="w-3.5 h-3.5" :class="{ 'animate-pulse': refreshingMl }" />
            <span>{{ refreshingMl ? 'Warming ML…' : 'Refresh ML' }}</span>
          </button>
          <button
            id="btn-start-retrain"
            :disabled="retrainState === 'running' || totalSelected === 0"
            class="flex-1 sm:flex-initial justify-center py-2 px-[22px] rounded-lg text-[13.5px] font-semibold text-white transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            :class="retrainState === 'running'
              ? 'bg-[#64748b] cursor-not-allowed'
              : 'bg-gradient-to-br from-[#10b981] to-[#059669] hover:opacity-90'"
            @click="startRetrain"
          >
            <span v-if="retrainState === 'running'" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
            <AppIcon v-else name="brain" class="w-4 h-4" />
            <span>{{ retrainState === 'running' ? 'Training in progress…' : `Retrain with ${totalSelected} image${totalSelected !== 1 ? 's' : ''}` }}</span>
          </button>
        </div>
      </div>

    <!-- Loading candidates -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-[3px] border-[#e2e8f0] border-t-[#10b981] rounded-full animate-spin" />
    </div>

    <template v-else>
      <!-- Status Banner -->
      <transition name="fade">
        <div
          v-if="retrainState !== 'idle' && (retrainState !== 'done' || !doneBannerDismissed)"
          class="rounded-[14px] border px-5 py-4 flex items-start gap-4 transition-all duration-300"
          :class="{
            'bg-[#fffbeb] border-[#fde68a]': retrainState === 'running',
            'bg-[#f0fdf4] border-[#bbf7d0]': retrainState === 'done',
            'bg-[#fef2f2] border-[#fecaca]': retrainState === 'failed' || retrainState === 'unknown',
          }"
        >
          <div class="mt-0.5">
            <AppIcon
              :name="retrainState === 'running' ? 'cog' : retrainState === 'done' ? 'check-circle' : 'x-circle'"
              class="w-6 h-6"
              :class="{
                'text-[#d97706] animate-spin': retrainState === 'running',
                'text-[#059669]': retrainState === 'done',
                'text-[#dc2626]': retrainState === 'failed' || retrainState === 'unknown',
              }"
            />
          </div>
          <div class="flex flex-col gap-0.5 flex-1">
            <div class="flex items-center justify-between">
              <p
                class="text-[14px] font-semibold"
                :class="{
                  'text-[#92400e]': retrainState === 'running',
                  'text-[#065f46]': retrainState === 'done',
                  'text-[#991b1b]': retrainState === 'failed' || retrainState === 'unknown',
                }"
              >
                {{ statusMessage }}
              </p>
              <button
                v-if="retrainState === 'done'"
                type="button"
                class="text-[#065f46]/60 hover:text-[#065f46] bg-transparent border-none cursor-pointer p-0.5 text-sm font-bold"
                title="Dismiss notification"
                @click="dismissDoneBanner"
              >
                ✕
              </button>
            </div>
            <p v-if="lastResult" class="text-[12.5px] text-[#64748b]">
              Train accuracy: <strong>{{ lastResult.train_accuracy }}%</strong> ·
              Val accuracy: <strong>{{ lastResult.val_accuracy }}%</strong> ·
              {{ lastResult.total_images }} images used
              ({{ lastResult.total_edible }} edible, {{ lastResult.total_poisonous }} poisonous)
            </p>
            <p v-if="statusError" class="text-[12.5px] text-[#ef4444] font-mono">{{ statusError }}</p>
            <div v-if="retrainState === 'unknown'" class="mt-2">
              <button
                type="button"
                class="py-1 px-3 rounded-lg border border-[#fecaca] bg-white hover:bg-[#fef2f2] text-[12px] font-semibold text-[#dc2626] cursor-pointer inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                @click="fetchStatus"
              >
                <AppIcon name="refresh" class="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Warning if too few images -->
      <div
        v-if="summary.total < 20"
        class="rounded-[14px] bg-[#fffbeb] border border-[#fde68a] px-5 py-4 flex items-start gap-3"
      >
        <AppIcon name="warning" class="w-5 h-5 text-[#d97706] mt-0.5" />
        <div>
          <p class="text-[13.5px] font-semibold text-[#92400e]">Low image count</p>
          <p class="text-[12.5px] text-[#78350f] mt-0.5">
            Only <strong>{{ summary.total }}</strong> consented images are available.
            We recommend at least <strong>20</strong> images (10 per class) for meaningful retraining.
            Fewer images may reduce model accuracy.
          </p>
        </div>
      </div>

      <!-- Duplicate Detection Banner -->
      <div
        v-if="hasScannedDuplicates && duplicateSummary.redundant_scans_count > 0"
        class="rounded-[14px] bg-[#fff7ed] border border-[#fed7aa] px-5 py-4 flex flex-wrap items-center justify-between gap-3 shadow-xs"
      >
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-xl bg-[#ffedd5] text-[#ea580c] flex items-center justify-center shrink-0 mt-0.5">
            <AppIcon name="copy" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-[13.5px] font-bold text-[#9a3412] flex items-center gap-2 flex-wrap">
              <span>{{ duplicateSummary.duplicate_groups_count }} Duplicate Set{{ duplicateSummary.duplicate_groups_count !== 1 ? 's' : '' }} Found ({{ duplicateSummary.redundant_scans_count }} redundant photo{{ duplicateSummary.redundant_scans_count !== 1 ? 's' : '' }})</span>
              <span
                v-if="duplicateSummary.conflict_groups_count > 0"
                class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800"
              >
                ⚠️ {{ duplicateSummary.conflict_groups_count }} conflicting label{{ duplicateSummary.conflict_groups_count !== 1 ? 's' : '' }}!
              </span>
            </p>
            <p class="text-[12px] text-[#78350f] mt-0.5">
              Identical images cause model overfitting and inflate validation accuracy. Keeping only 1 verified original per set ensures fair class representation.
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            class="flex-1 sm:flex-initial py-1.5 px-3.5 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white text-[12px] font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
            :disabled="excludingDuplicates"
            title="Permanently remove all redundant duplicate images from the active training queue"
            @click="autoDeselectDuplicates"
          >
            <AppIcon name="trash" class="w-3.5 h-3.5" />
            <span>{{ excludingDuplicates ? 'Removing Copies…' : 'Deselect & Remove Copies' }}</span>
          </button>
          <button
            type="button"
            class="flex-1 sm:flex-initial py-1.5 px-3.5 rounded-lg border border-[#fed7aa] bg-white hover:bg-[#fff7ed] text-[#9a3412] text-[12px] font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
            @click="openDuplicatesModal()"
          >
            <span>Review Sets</span>
          </button>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex items-center gap-3.5">
          <div class="w-11 h-11 rounded-xl bg-[#f0fdf4] text-[#059669] flex items-center justify-center"><AppIcon name="mushroom" class="w-6 h-6" /></div>
          <div>
            <p class="text-[24px] font-bold text-[#0f172a] leading-none">{{ summary.total }}</p>
            <p class="text-[12px] text-[#64748b] mt-1">Total Candidate Images</p>
          </div>
        </div>
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex items-center gap-3.5">
          <div class="w-11 h-11 rounded-xl bg-[#f0fdf4] text-[#10b981] flex items-center justify-center"><AppIcon name="check-circle" class="w-6 h-6" /></div>
          <div>
            <p class="text-[24px] font-bold text-[#0f172a] leading-none">{{ summary.edible_count }}</p>
            <p class="text-[12px] text-[#64748b] mt-1">Edible Images</p>
          </div>
        </div>
        <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-5 flex items-center gap-3.5">
          <div class="w-11 h-11 rounded-xl bg-[#fef2f2] text-[#dc2626] flex items-center justify-center"><AppIcon name="skull" class="w-6 h-6" /></div>
          <div>
            <p class="text-[24px] font-bold text-[#0f172a] leading-none">{{ summary.poisonous_count }}</p>
            <p class="text-[12px] text-[#64748b] mt-1">Poisonous Images</p>
          </div>
        </div>
      </div>

      <!-- Queue Switcher: Ready vs Already Trained -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="inline-flex rounded-xl border border-[#e2e8f0] bg-white p-1 gap-1">
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
            :class="queueView === 'ready' ? 'bg-[#0f172a] text-white' : 'text-[#64748b] hover:text-[#0f172a]'"
            @click="queueView = 'ready'"
          >
            <span>Ready for Training</span>
            <span
              class="text-[11px] px-1.5 py-0.5 rounded-full font-bold"
              :class="queueView === 'ready' ? 'bg-white/20 text-white' : 'bg-[#f1f5f9] text-[#475569]'"
            >{{ summary.total }}</span>
          </button>
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
            :class="queueView === 'trained' ? 'bg-[#0f172a] text-white' : 'text-[#64748b] hover:text-[#0f172a]'"
            @click="queueView = 'trained'"
          >
            <span>Already Trained</span>
            <span
              class="text-[11px] px-1.5 py-0.5 rounded-full font-bold"
              :class="queueView === 'trained' ? 'bg-white/20 text-white' : 'bg-[#f1f5f9] text-[#475569]'"
            >{{ retrainedSummary.total }}</span>
          </button>
        </div>

        <div v-if="queueView === 'trained' && retrainedSummary.total > 0" class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            :disabled="restoring || totalSelectedInView === 0"
            class="py-1.5 px-3.5 rounded-lg bg-[#059669] text-white text-[12.5px] font-semibold hover:bg-[#047857] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            @click="restoreScans(false)"
          >
            {{ restoring ? 'Restoring…' : `Restore Selected (${totalSelectedInView})` }}
          </button>
          <button
            type="button"
            :disabled="restoring"
            class="py-1.5 px-3.5 rounded-lg border border-[#e2e8f0] bg-white text-[#475569] text-[12.5px] font-semibold hover:bg-[#f8fafc] disabled:opacity-50 cursor-pointer"
            @click="restoreScans(true)"
          >
            Restore All to Queue
          </button>
        </div>
      </div>

      <!-- Dual Panels: Edible | Poisonous -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          v-for="panel in classPanels"
          :key="panel.cls"
          class="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden"
        >
          <div class="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 border-b border-[#f1f5f9]" :class="panel.headerBg">
            <div class="flex items-center gap-2">
              <AppIcon :name="panel.icon" class="w-[18px] h-[18px]" :class="panel.iconClass" />
              <h3 class="text-[14px] font-bold" :class="panel.titleClass">{{ panel.title }}</h3>
              <span class="shrink-0 whitespace-nowrap text-[11px] font-semibold px-2 py-0.5 rounded-full" :class="panel.badgeClass">
                {{ selectedIds(panel.cls).length }} / {{ visibleList(panel.cls).length }} selected
              </span>
            </div>
            <div class="flex items-center gap-2">
              <button class="text-[12px] font-semibold hover:underline cursor-pointer" :class="panel.selectBtnClass" @click="selectAll(panel.cls)">Select All</button>
              <span class="text-[#cbd5e1]">|</span>
              <button class="text-[12px] font-semibold text-[#64748b] hover:underline cursor-pointer" @click="deselectAll(panel.cls)">Clear</button>
              <template v-if="queueView === 'ready' && visibleList(panel.cls).length > selectedIds(panel.cls).length">
                <span class="text-[#cbd5e1]">|</span>
                <button
                  type="button"
                  class="text-[12px] font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer inline-flex items-center gap-1"
                  :disabled="excludingDuplicates"
                  title="Permanently remove all unselected/deselected scans in this category from the training queue"
                  @click="excludeUnselected(panel.cls)"
                >
                  <AppIcon name="trash" class="w-3 h-3" />
                  <span>Remove Deselected ({{ visibleList(panel.cls).length - selectedIds(panel.cls).length }})</span>
                </button>
              </template>
            </div>
          </div>

          <div v-if="visibleList(panel.cls).length === 0" class="flex flex-col items-center justify-center py-14 gap-2 text-center px-4">
            <AppIcon :name="panel.emptyIcon" class="w-10 h-10" :class="panel.emptyIconClass" />
            <p class="text-[13.5px] font-semibold text-[#0f172a]">
              {{ queueView === 'trained' ? `No trained ${panel.cls} scans yet` : panel.emptyTitle }}
            </p>
            <p class="text-[12px] text-[#64748b]">
              {{ queueView === 'trained'
                ? 'Images successfully used in completed retrain runs will appear here.'
                : (retrainedSummary[panel.cls === 'edible' ? 'edible_count' : 'poisonous_count'] > 0
                    ? 'Previously trained images can be viewed or restored in the Already Trained tab.'
                    : 'Foragers need to consent to data sharing for their scans to appear here.') }}
            </p>
          </div>

          <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 max-h-[420px] overflow-y-auto">
            <div
              v-for="scan in visibleList(panel.cls)"
              :key="scan.id"
              class="relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 hover:shadow-md group"
              :class="isSelected(panel.cls, scan.id) ? panel.selectedBorder : 'border-[#e2e8f0]'"
              @click="toggleSelect(panel.cls, scan.id)"
            >
              <div v-if="brokenImages[scan.id]" class="w-full h-[100px] bg-[#f1f5f9] flex flex-col items-center justify-center text-[#94a3b8] gap-1">
                <AppIcon name="mushroom" class="w-6 h-6" />
                <span class="text-[10px]">Unavailable</span>
              </div>
              <img
                v-else
                :src="getImageUrl(scan.image_url || scan.image_path)"
                :alt="scan.result_name"
                class="w-full h-[100px] object-cover bg-[#f8fafc]"
                @error="brokenImages[scan.id] = true"
              />
              <!-- Duplicate badge pill + quick remove button -->
              <div
                v-if="hasScannedDuplicates && duplicateScanMap[scan.id]"
                class="absolute top-1.5 left-1.5 z-10 flex items-center gap-1"
              >
                <div
                  class="px-1.5 py-0.5 rounded-md text-[10px] font-bold shadow-xs flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                  :class="duplicateScanMap[scan.id].has_conflict
                    ? 'bg-rose-600 text-white animate-pulse'
                    : duplicateScanMap[scan.id].is_primary
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 text-white'"
                  :title="duplicateScanMap[scan.id].has_conflict ? 'Conflicting label duplicate! Click to review' : duplicateScanMap[scan.id].is_primary ? 'Original image' : 'Duplicate copy — click to review set'"
                  @click.stop="openDuplicatesModal(duplicateScanMap[scan.id].group_id)"
                >
                  <span>{{ duplicateScanMap[scan.id].has_conflict ? '⚠️ Conflict' : duplicateScanMap[scan.id].is_primary ? '★ Primary' : 'Duplicate' }}</span>
                </div>
                <button
                  v-if="!duplicateScanMap[scan.id].is_primary && queueView === 'ready'"
                  type="button"
                  class="px-1.5 py-0.5 rounded-md text-[9.5px] font-bold shadow-xs bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
                  :disabled="excludingDuplicates"
                  title="Permanently remove this duplicate copy from the training queue"
                  @click.stop="excludeScanIds([scan.id])"
                >
                  ✕ Remove
                </button>
              </div>
              <div
                class="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
                :class="isSelected(panel.cls, scan.id) ? panel.selectedOverlay : 'opacity-0 group-hover:opacity-100 bg-black/20'"
              >
                <div
                  class="w-7 h-7 rounded-full flex items-center justify-center text-[16px] font-bold"
                  :class="isSelected(panel.cls, scan.id) ? panel.selectedCheck : 'bg-white/80 text-[#64748b]'"
                >
                  {{ isSelected(panel.cls, scan.id) ? '✓' : '+' }}
                </div>
              </div>
              <div class="p-2">
                <p class="text-[11.5px] font-semibold text-[#0f172a] truncate italic">{{ scan.result_name }}</p>
                <p class="text-[11px] text-[#94a3b8]">
                  {{ scan.confidence }}% · {{ queueView === 'trained' && scan.retrained_at ? `Trained ${scan.retrained_at}` : scan.scanned_at }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Retrain History & Archived History -->
      <div class="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
        <!-- Card Header with Tabs and Bulk Actions -->
        <div class="px-5 py-3 border-b border-[#f1f5f9] flex flex-wrap items-center justify-between gap-3 bg-[#f8fafc]/40">
          <div class="flex items-center gap-1.5 p-1 bg-[#f1f5f9] rounded-xl">
            <button
              type="button"
              class="text-[12.5px] font-semibold py-1.5 px-3.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
              :class="historyTab === 'active'
                ? 'bg-white text-[#0f172a] shadow-xs'
                : 'text-[#64748b] hover:text-[#0f172a]'"
              @click="historyTab = 'active'"
            >
              <AppIcon name="clipboard" class="w-3.5 h-3.5" :class="historyTab === 'active' ? 'text-[#059669]' : 'text-[#64748b]'" />
              <span>Active History</span>
              <span
                class="text-[11px] font-bold px-1.5 py-0.5 rounded-full"
                :class="historyTab === 'active' ? 'bg-[#d1fae5] text-[#065f46]' : 'bg-[#e2e8f0] text-[#64748b]'"
              >
                {{ history.length }}
              </span>
            </button>

            <button
              type="button"
              class="text-[12.5px] font-semibold py-1.5 px-3.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
              :class="historyTab === 'archived'
                ? 'bg-white text-[#0f172a] shadow-xs'
                : 'text-[#64748b] hover:text-[#0f172a]'"
              @click="historyTab = 'archived'"
            >
              <AppIcon name="archive" class="w-3.5 h-3.5" :class="historyTab === 'archived' ? 'text-[#d97706]' : 'text-[#64748b]'" />
              <span>Archived History</span>
              <span
                class="text-[11px] font-bold px-1.5 py-0.5 rounded-full"
                :class="historyTab === 'archived' ? 'bg-[#fef3c7] text-[#92400e]' : 'bg-[#e2e8f0] text-[#64748b]'"
              >
                {{ archivedHistory.length }}
              </span>
            </button>
          </div>

          <!-- Bulk Actions for Archived Table -->
          <div v-if="historyTab === 'archived' && selectedArchivedIds.length > 0" class="flex items-center gap-2 animate-in fade-in duration-150">
            <span class="text-[12px] text-[#475569] font-medium">
              <strong class="text-[#0f172a]">{{ selectedArchivedIds.length }}</strong> selected
            </span>
            <button
              type="button"
              class="py-1 px-3 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#059669] text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Recover selected retraining runs back to active history"
              @click="bulkRecoverArchived"
            >
              <AppIcon name="rotate-ccw" class="w-3.5 h-3.5" />
              <span>Recover ({{ selectedArchivedIds.length }})</span>
            </button>
            <button
              type="button"
              class="py-1 px-3 rounded-lg border border-[#fecaca] bg-[#fef2f2] hover:bg-[#fee2e2] text-[#dc2626] text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Permanently delete selected retraining runs"
              @click="openDeleteConfirmModal(selectedArchivedIds)"
            >
              <AppIcon name="trash" class="w-3.5 h-3.5" />
              <span>Delete ({{ selectedArchivedIds.length }})</span>
            </button>
            <button
              type="button"
              class="text-[11.5px] text-[#64748b] hover:text-[#0f172a] underline cursor-pointer ml-1"
              @click="selectedArchivedIds = []"
            >
              Clear
            </button>
          </div>
        </div>

        <!-- ACTIVE HISTORY TAB CONTENT -->
        <div v-if="historyTab === 'active'">
          <div v-if="history.length === 0" class="py-12 text-center">
            <AppIcon name="clipboard" class="w-8 h-8 text-[#cbd5e1] mx-auto mb-2" />
            <p class="text-[13px] text-[#94a3b8]">No active retraining runs.</p>
          </div>

          <div v-else>
            <div class="overflow-x-auto history-scroll-container pb-2">
              <table class="w-full text-[13px] border-separate border-spacing-0">
                <thead class="bg-[#f8fafc]">
                  <tr>
                    <th class="text-left px-4 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide min-w-[155px] border-b border-[#f1f5f9]">Date</th>
                    <th class="text-left px-3.5 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide min-w-[125px] border-b border-[#f1f5f9]">Status</th>
                    <th class="text-left px-3 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide min-w-[75px] border-b border-[#f1f5f9]">Duration</th>
                    <th class="text-left px-3 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide min-w-[75px] border-b border-[#f1f5f9]"><span class="inline-flex items-center gap-1"><AppIcon name="check-circle" class="w-3.5 h-3.5 text-[#059669]" />Edible</span></th>
                    <th class="text-left px-3 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide min-w-[80px] border-b border-[#f1f5f9]"><span class="inline-flex items-center gap-1"><AppIcon name="skull" class="w-3.5 h-3.5 text-[#dc2626]" />Poisonous</span></th>
                    <th class="text-left px-3 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide min-w-[105px] border-b border-[#f1f5f9]">Dataset</th>
                    <th class="text-left px-3 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide min-w-[75px] border-b border-[#f1f5f9]">Train Acc.</th>
                    <th class="text-left px-3 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide min-w-[75px] border-b border-[#f1f5f9]">Val Acc.</th>
                    <th class="text-right px-4 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide min-w-[90px] sticky right-0 bg-[#f8fafc] z-10 shadow-[-6px_0_10px_-3px_rgba(0,0,0,0.06)] border-b border-[#f1f5f9]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(run, i) in paginatedHistory"
                    :key="run.id ?? (historyStartIndex + i)"
                    class="hover:bg-[#f8fafc] transition-colors cursor-pointer group"
                    @click="openReportModal(run)"
                  >
                    <td class="px-4 py-3 text-[#334155] whitespace-nowrap border-b border-[#f1f5f9]">
                      <div class="flex items-center gap-1.5">
                        <AppIcon name="calendar" class="w-3.5 h-3.5 text-[#94a3b8]" />
                        <span>{{ formatDate(run.started_at) }}</span>
                      </div>
                    </td>
                    <td class="px-3.5 py-3 whitespace-nowrap border-b border-[#f1f5f9]">
                      <span
                        class="text-[11.5px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1"
                        :class="{
                          'bg-[#d1fae5] text-[#065f46]': run.status === 'done',
                          'bg-[#fee2e2] text-[#991b1b]': run.status === 'failed',
                          'bg-[#fef9c3] text-[#713f12]': run.status === 'running',
                        }"
                      >
                        <span v-if="run.status === 'done'">✓ Completed</span>
                        <span v-else-if="run.status === 'failed'">✕ Failed</span>
                        <span v-else class="flex items-center gap-1">
                          <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                          Running
                        </span>
                      </span>
                      <p v-if="run.status === 'failed' && run.error" class="text-[11px] text-[#dc2626] mt-1 max-w-[180px] truncate" :title="run.error">
                        {{ run.error }}
                      </p>
                    </td>
                    <td class="px-3 py-3 text-[#64748b] whitespace-nowrap border-b border-[#f1f5f9]">
                      <span class="inline-flex items-center gap-1">
                        <AppIcon name="hourglass" class="w-3 h-3 text-[#94a3b8]" />
                        {{ formatDuration(run) }}
                      </span>
                    </td>
                    <td class="px-3 py-3 text-[#334155] whitespace-nowrap border-b border-[#f1f5f9]">
                      <span>{{ run.total_edible ?? run.new_edible ?? '—' }}</span>
                      <span v-if="run.new_edible != null && run.total_edible != null && run.new_edible !== run.total_edible" class="text-[11px] text-[#059669] ml-1 font-medium">
                        (+{{ run.new_edible }})
                      </span>
                    </td>
                    <td class="px-3 py-3 text-[#334155] whitespace-nowrap border-b border-[#f1f5f9]">
                      <span>{{ run.total_poisonous ?? run.new_poisonous ?? '—' }}</span>
                      <span v-if="run.new_poisonous != null && run.total_poisonous != null && run.new_poisonous !== run.total_poisonous" class="text-[11px] text-[#dc2626] ml-1 font-medium">
                        (+{{ run.new_poisonous }})
                      </span>
                    </td>
                    <td class="px-3 py-3 text-[#475569] whitespace-nowrap border-b border-[#f1f5f9]">
                      <span class="font-medium text-[#0f172a]">{{ run.total_images ?? (run.new_edible != null ? (run.new_edible + (run.new_poisonous || 0)) : '—') }}</span>
                      <span v-if="(run.new_edible || 0) + (run.new_poisonous || 0) > 0" class="text-[11px] text-[#059669] font-medium block">
                        {{ (run.new_edible || 0) + (run.new_poisonous || 0) }} new ingested
                      </span>
                      <span v-else-if="run.status === 'done'" class="text-[10.5px] text-[#64748b] block font-medium">
                        Baseline test (0 new scans)
                      </span>
                      <span v-else class="text-[11px] text-[#94a3b8] block">
                        0 new ingested
                      </span>
                    </td>
                    <td class="px-3 py-3 font-semibold text-[#0f172a] whitespace-nowrap border-b border-[#f1f5f9]">
                      {{ run.train_accuracy != null ? run.train_accuracy + '%' : '—' }}
                    </td>
                    <td class="px-3 py-3 font-semibold text-[#0f172a] whitespace-nowrap border-b border-[#f1f5f9]">
                      {{ run.val_accuracy != null ? run.val_accuracy + '%' : '—' }}
                    </td>
                    <td class="px-4 py-3 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-[#f8fafc] transition-colors z-10 shadow-[-6px_0_10px_-3px_rgba(0,0,0,0.06)] border-b border-[#f1f5f9]" @click.stop>
                      <div class="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          class="w-8 h-8 rounded-lg border border-[#cbd5e1] bg-white hover:bg-[#f1f5f9] hover:border-[#94a3b8] cursor-pointer inline-flex items-center justify-center transition-colors shadow-2xs shrink-0"
                          title="View comprehensive status and performance report for this retraining run"
                          aria-label="View Report"
                          @click="openReportModal(run)"
                        >
                          <AppIcon name="clipboard" class="w-4 h-4 text-[#059669]" />
                        </button>
                        <button
                          type="button"
                          class="w-8 h-8 rounded-lg border border-[#e2e8f0] bg-white hover:bg-[#fef3c7] hover:border-[#fde68a] cursor-pointer inline-flex items-center justify-center transition-colors shadow-2xs shrink-0 disabled:opacity-50"
                          title="Archive this retraining run"
                          aria-label="Archive run"
                          :disabled="archivingId === run.id || !run.id"
                          @click="archiveRun(run)"
                        >
                          <AppIcon v-if="archivingId !== run.id" name="archive" class="w-4 h-4 text-[#d97706]" />
                          <AppIcon v-else name="cog" class="w-4 h-4 text-[#d97706] animate-spin" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Active History Pagination Bar -->
            <div class="flex flex-wrap items-center justify-between gap-3 py-3 px-5 border-t border-[#f1f5f9] bg-[#f8fafc]/50">
              <div class="flex items-center gap-3">
                <span class="text-[12.5px] text-[#64748b]">
                  Showing <strong class="text-[#334155]">{{ historyStartIndex + 1 }}</strong>–<strong class="text-[#334155]">{{ historyEndIndex }}</strong> of <strong class="text-[#334155]">{{ history.length }}</strong> runs
                </span>
                <div class="flex items-center gap-1.5 ml-1">
                  <span class="text-[11.5px] text-[#94a3b8]">Per page:</span>
                  <select
                    v-model.number="historyPerPage"
                    class="text-[12px] text-[#334155] bg-white border border-[#e2e8f0] rounded-md px-2 py-1 focus:outline-none focus:border-[#059669] cursor-pointer"
                  >
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="20">20</option>
                  </select>
                </div>
              </div>
              <div class="flex items-center gap-2.5">
                <button
                  type="button"
                  class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-white cursor-pointer text-[14px] text-[#475569] transition-colors duration-[0.18s] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white flex items-center justify-center font-bold"
                  :disabled="historyPage <= 1"
                  @click="historyPage--"
                  title="Previous page"
                >
                  ‹
                </button>
                <span class="text-[12.5px] text-[#475569] font-medium">Page {{ historyPage }} of {{ historyTotalPages }}</span>
                <button
                  type="button"
                  class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-white cursor-pointer text-[14px] text-[#475569] transition-colors duration-[0.18s] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white flex items-center justify-center font-bold"
                  :disabled="historyPage >= historyTotalPages"
                  @click="historyPage++"
                  title="Next page"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ARCHIVED HISTORY TAB CONTENT -->
        <div v-else-if="historyTab === 'archived'">
          <div v-if="archivedHistory.length === 0" class="py-12 text-center">
            <AppIcon name="archive" class="w-8 h-8 text-[#cbd5e1] mx-auto mb-2" />
            <p class="text-[13px] text-[#94a3b8]">No archived retraining runs.</p>
            <p class="text-[12px] text-[#cbd5e1] mt-0.5">Use the "Archive" action on any active run to store it here.</p>
          </div>

          <div v-else>
            <div class="overflow-x-auto history-scroll-container pb-2">
              <table class="w-full text-[13px] border-separate border-spacing-0">
                <thead class="bg-[#f8fafc]">
                  <tr>
                    <th class="w-10 px-3.5 py-3 text-left border-b border-[#f1f5f9]">
                      <input
                        type="checkbox"
                        class="w-4 h-4 rounded text-[#059669] border-[#cbd5e1] focus:ring-[#059669] cursor-pointer"
                        :checked="isAllArchivedSelected"
                        title="Select / deselect all on page"
                        @change="toggleSelectAllArchived"
                      />
                    </th>
                    <th class="text-left px-4 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide min-w-[155px] border-b border-[#f1f5f9]">Date</th>
                    <th class="text-left px-3.5 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide min-w-[125px] border-b border-[#f1f5f9]">Status</th>
                    <th class="text-left px-3 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide min-w-[75px] border-b border-[#f1f5f9]">Duration</th>
                    <th class="text-left px-3 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide min-w-[75px] border-b border-[#f1f5f9]"><span class="inline-flex items-center gap-1"><AppIcon name="check-circle" class="w-3.5 h-3.5 text-[#059669]" />Edible</span></th>
                    <th class="text-left px-3 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide min-w-[80px] border-b border-[#f1f5f9]"><span class="inline-flex items-center gap-1"><AppIcon name="skull" class="w-3.5 h-3.5 text-[#dc2626]" />Poisonous</span></th>
                    <th class="text-left px-3 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide min-w-[105px] border-b border-[#f1f5f9]">Dataset</th>
                    <th class="text-left px-3 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide min-w-[75px] border-b border-[#f1f5f9]">Train Acc.</th>
                    <th class="text-left px-3 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide min-w-[75px] border-b border-[#f1f5f9]">Val Acc.</th>
                    <th class="text-right px-4 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide min-w-[130px] sticky right-0 bg-[#f8fafc] z-10 shadow-[-6px_0_10px_-3px_rgba(0,0,0,0.06)] border-b border-[#f1f5f9]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(run, i) in paginatedArchivedHistory"
                    :key="run.id ?? (archivedStartIndex + i)"
                    class="hover:bg-[#f8fafc] transition-colors cursor-pointer group"
                    :class="{ 'bg-amber-50/40': selectedArchivedIds.includes(run.id) }"
                    @click="openReportModal(run)"
                  >
                    <td class="w-10 px-3.5 py-3 border-b border-[#f1f5f9]" @click.stop>
                      <input
                        type="checkbox"
                        class="w-4 h-4 rounded text-[#059669] border-[#cbd5e1] focus:ring-[#059669] cursor-pointer"
                        :checked="selectedArchivedIds.includes(run.id)"
                        @change="toggleSelectArchived(run.id)"
                      />
                    </td>
                    <td class="px-4 py-3 text-[#334155] whitespace-nowrap border-b border-[#f1f5f9]">
                      <div class="flex items-center gap-1.5">
                        <AppIcon name="calendar" class="w-3.5 h-3.5 text-[#94a3b8]" />
                        <span>{{ formatDate(run.started_at) }}</span>
                      </div>
                      <span v-if="run.archived_at" class="text-[10.5px] text-[#94a3b8] block">
                        Archived {{ formatDate(run.archived_at) }}
                      </span>
                    </td>
                    <td class="px-3.5 py-3 whitespace-nowrap border-b border-[#f1f5f9]">
                      <span
                        class="text-[11.5px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1"
                        :class="{
                          'bg-[#d1fae5] text-[#065f46]': run.status === 'done',
                          'bg-[#fee2e2] text-[#991b1b]': run.status === 'failed',
                          'bg-[#fef9c3] text-[#713f12]': run.status === 'running',
                        }"
                      >
                        <span v-if="run.status === 'done'">✓ Completed</span>
                        <span v-else-if="run.status === 'failed'">✕ Failed</span>
                        <span v-else>Running</span>
                      </span>
                    </td>
                    <td class="px-3 py-3 text-[#64748b] whitespace-nowrap border-b border-[#f1f5f9]">
                      <span class="inline-flex items-center gap-1">
                        <AppIcon name="hourglass" class="w-3 h-3 text-[#94a3b8]" />
                        {{ formatDuration(run) }}
                      </span>
                    </td>
                    <td class="px-3 py-3 text-[#334155] whitespace-nowrap border-b border-[#f1f5f9]">
                      <span>{{ run.total_edible ?? run.new_edible ?? '—' }}</span>
                    </td>
                    <td class="px-3 py-3 text-[#334155] whitespace-nowrap border-b border-[#f1f5f9]">
                      <span>{{ run.total_poisonous ?? run.new_poisonous ?? '—' }}</span>
                    </td>
                    <td class="px-3 py-3 text-[#475569] whitespace-nowrap border-b border-[#f1f5f9]">
                      <span class="font-medium text-[#0f172a]">{{ run.total_images ?? '—' }}</span>
                    </td>
                    <td class="px-3 py-3 font-semibold text-[#0f172a] whitespace-nowrap border-b border-[#f1f5f9]">
                      {{ run.train_accuracy != null ? run.train_accuracy + '%' : '—' }}
                    </td>
                    <td class="px-3 py-3 font-semibold text-[#0f172a] whitespace-nowrap border-b border-[#f1f5f9]">
                      {{ run.val_accuracy != null ? run.val_accuracy + '%' : '—' }}
                    </td>
                    <td class="px-4 py-3 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-[#f8fafc] transition-colors z-10 shadow-[-6px_0_10px_-3px_rgba(0,0,0,0.06)] border-b border-[#f1f5f9]" @click.stop>
                      <div class="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          class="w-8 h-8 rounded-lg border border-[#cbd5e1] bg-white hover:bg-[#f1f5f9] hover:border-[#94a3b8] cursor-pointer inline-flex items-center justify-center transition-colors shadow-2xs shrink-0"
                          title="View comprehensive status and performance report for this retraining run"
                          aria-label="View Report"
                          @click="openReportModal(run)"
                        >
                          <AppIcon name="clipboard" class="w-4 h-4 text-[#059669]" />
                        </button>
                        <button
                          type="button"
                          class="w-8 h-8 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] hover:bg-[#dcfce7] hover:border-[#86efac] cursor-pointer inline-flex items-center justify-center transition-colors shadow-2xs shrink-0 disabled:opacity-50"
                          title="Recover this run back to active history"
                          aria-label="Recover run"
                          :disabled="recoveringId === run.id"
                          @click="recoverRun(run)"
                        >
                          <AppIcon v-if="recoveringId !== run.id" name="rotate-ccw" class="w-4 h-4 text-[#059669]" />
                          <AppIcon v-else name="cog" class="w-4 h-4 text-[#059669] animate-spin" />
                        </button>
                        <button
                          type="button"
                          class="w-8 h-8 rounded-lg border border-[#fecaca] bg-[#fef2f2] hover:bg-[#fee2e2] hover:border-[#fca5a5] cursor-pointer inline-flex items-center justify-center transition-colors shadow-2xs shrink-0"
                          title="Permanently delete this run"
                          aria-label="Permanently delete run"
                          @click="openDeleteConfirmModal([run.id])"
                        >
                          <AppIcon name="trash" class="w-4 h-4 text-[#dc2626]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Archived History Pagination Bar -->
            <div class="flex flex-wrap items-center justify-between gap-3 py-3 px-5 border-t border-[#f1f5f9] bg-[#f8fafc]/50">
              <div class="flex items-center gap-3">
                <span class="text-[12.5px] text-[#64748b]">
                  Showing <strong class="text-[#334155]">{{ archivedStartIndex + 1 }}</strong>–<strong class="text-[#334155]">{{ archivedEndIndex }}</strong> of <strong class="text-[#334155]">{{ archivedHistory.length }}</strong> archived runs
                </span>
                <div class="flex items-center gap-1.5 ml-1">
                  <span class="text-[11.5px] text-[#94a3b8]">Per page:</span>
                  <select
                    v-model.number="archivedPerPage"
                    class="text-[12px] text-[#334155] bg-white border border-[#e2e8f0] rounded-md px-2 py-1 focus:outline-none focus:border-[#059669] cursor-pointer"
                  >
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="20">20</option>
                  </select>
                </div>
              </div>
              <div class="flex items-center gap-2.5">
                <button
                  type="button"
                  class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-white cursor-pointer text-[14px] text-[#475569] transition-colors duration-[0.18s] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white flex items-center justify-center font-bold"
                  :disabled="archivedPage <= 1"
                  @click="archivedPage--"
                  title="Previous page"
                >
                  ‹
                </button>
                <span class="text-[12.5px] text-[#475569] font-medium">Page {{ archivedPage }} of {{ archivedTotalPages }}</span>
                <button
                  type="button"
                  class="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-white cursor-pointer text-[14px] text-[#475569] transition-colors duration-[0.18s] hover:bg-[#f1f5f9] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white flex items-center justify-center font-bold"
                  :disabled="archivedPage >= archivedTotalPages"
                  @click="archivedPage++"
                  title="Next page"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Privacy Note -->
      <p class="text-[12px] text-[#94a3b8] text-center flex items-center justify-center gap-1.5">
        <AppIcon name="lock" class="w-3.5 h-3.5 text-[#64748b]" />
        <span>Only scan images from foragers who have opted in to data sharing (<code>allow_data_training = true</code>) are used for retraining.</span>
      </p>

      <!-- Duplicate Review & Management Modal -->
      <div
        v-if="showDuplicatesModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs"
        @click.self="closeDuplicatesModal"
      >
        <div class="bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <!-- Modal Header -->
          <div class="px-6 py-4.5 border-b border-[#e2e8f0] flex items-center justify-between gap-3 bg-[#f8fafc]">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-[#ffedd5] text-[#ea580c] flex items-center justify-center shrink-0">
                <AppIcon name="copy" class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-[16px] font-bold text-[#0f172a] flex items-center gap-2">
                  <span>Review Candidate Image Duplicates</span>
                  <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#ffedd5] text-[#c2410c]">
                    {{ duplicateSummary.duplicate_groups_count }} sets · {{ duplicateSummary.redundant_scans_count }} redundant
                  </span>
                </h3>
                <p class="text-[12px] text-[#64748b] mt-0.5">
                  Clusters grouped by MD5 exact hash and 64-bit dHash perceptual fingerprint. Keep only 1 verified photo per set to avoid dataset skew.
                </p>
              </div>
            </div>
            <button
              type="button"
              class="w-8 h-8 rounded-lg hover:bg-[#e2e8f0] text-[#64748b] flex items-center justify-center transition-colors cursor-pointer text-[18px]"
              @click="closeDuplicatesModal"
            >
              ✕
            </button>
          </div>

          <!-- Filter & Action Toolbar -->
          <div class="px-6 py-3 border-b border-[#e2e8f0] flex flex-wrap items-center justify-between gap-2.5 bg-white">
            <div class="flex items-center gap-1.5 bg-[#f1f5f9] p-1 rounded-lg text-[12px] font-medium">
              <button
                type="button"
                class="px-2.5 py-1 rounded-md transition-colors"
                :class="duplicateFilter === 'all' ? 'bg-white text-[#0f172a] shadow-xs font-semibold' : 'text-[#64748b] hover:text-[#0f172a]'"
                @click="duplicateFilter = 'all'"
              >
                All Sets ({{ duplicateGroups.length }})
              </button>
              <button
                v-if="duplicateSummary.conflict_groups_count > 0"
                type="button"
                class="px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
                :class="duplicateFilter === 'conflicts' ? 'bg-rose-50 text-rose-700 shadow-xs font-bold border border-rose-200' : 'text-rose-600 hover:text-rose-700'"
                @click="duplicateFilter = 'conflicts'"
              >
                <span>⚠️ Conflicts ({{ duplicateSummary.conflict_groups_count }})</span>
              </button>
              <button
                type="button"
                class="px-2.5 py-1 rounded-md transition-colors"
                :class="duplicateFilter === 'exact' ? 'bg-white text-[#0f172a] shadow-xs font-semibold' : 'text-[#64748b] hover:text-[#0f172a]'"
                @click="duplicateFilter = 'exact'"
              >
                Exact Hash
              </button>
              <button
                type="button"
                class="px-2.5 py-1 rounded-md transition-colors"
                :class="duplicateFilter === 'near' ? 'bg-white text-[#0f172a] shadow-xs font-semibold' : 'text-[#64748b] hover:text-[#0f172a]'"
                @click="duplicateFilter = 'near'"
              >
                Perceptual Similarity
              </button>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="py-1.5 px-3 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white text-[12px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                :disabled="excludingDuplicates"
                title="Permanently remove all redundant duplicate copies from training queue"
                @click="autoDeselectDuplicates"
              >
                <AppIcon name="trash" class="w-3.5 h-3.5" />
                <span>{{ excludingDuplicates ? 'Removing Copies…' : 'Deselect & Remove All Copies' }}</span>
              </button>
            </div>
          </div>

          <!-- Groups Content List -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <div
              v-if="filteredDuplicateGroups.length === 0"
              class="py-12 text-center text-[#64748b]"
            >
              <div class="w-12 h-12 rounded-full bg-[#f1f5f9] text-[#94a3b8] flex items-center justify-center mx-auto mb-2">
                <AppIcon name="check-circle" class="w-6 h-6 text-emerald-500" />
              </div>
              <p class="text-[14px] font-semibold text-[#0f172a]">No duplicate images found matching this filter</p>
              <p class="text-[12px] text-[#94a3b8] mt-1">Every candidate scan photo is unique in this view.</p>
            </div>

            <div
              v-for="group in filteredDuplicateGroups"
              :key="group.group_id"
              :id="`dup-group-${group.group_id}`"
              class="rounded-xl border p-4.5 transition-all"
              :class="group.has_conflict ? 'border-rose-300 bg-rose-50/40' : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1]'"
            >
              <!-- Group Subheader -->
              <div class="flex flex-wrap items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-[#f1f5f9]">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-[13px] font-bold text-[#0f172a]">
                    Set #{{ group.group_id }}
                  </span>
                  <span class="text-[11.5px] text-[#64748b]">({{ group.total_count }} identical photos)</span>
                  <span
                    v-if="group.match_type === 'exact' || (group.match_types && group.match_types.includes('exact'))"
                    class="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-[#e0f2fe] text-[#0369a1]"
                  >
                    Exact MD5
                  </span>
                  <span
                    v-else
                    class="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-[#f3e8ff] text-[#7e22ce]"
                  >
                    Visual Similarity ({{ group.similarity ?? 95 }}%)
                  </span>
                  <span
                    v-if="group.has_conflict"
                    class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white animate-pulse"
                  >
                    ⚠️ LABEL CONFLICT ({{ (group.classifications || []).join(' vs ') || 'Edible vs Poisonous' }})
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="px-2.5 py-1 text-[11.5px] font-semibold rounded-md border border-[#fed7aa] bg-[#fff7ed] hover:bg-[#ffedd5] text-[#c2410c] cursor-pointer transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                    :disabled="excludingDuplicates"
                    title="Keep the original primary scan and permanently remove duplicate copies from the training queue"
                    @click="keepOnlyPrimaryInGroup(group)"
                  >
                    <span>Keep 1 Only</span>
                  </button>
                  <button
                    type="button"
                    class="px-2.5 py-1 text-[11.5px] font-semibold rounded-md border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                    :disabled="excludingDuplicates"
                    title="Permanently remove non-primary duplicate images from the training queue"
                    @click="excludeScanIds(group.scans.filter(s => !s.is_primary).map(s => s.id))"
                  >
                    <AppIcon name="trash" class="w-3 h-3" />
                    <span>Deselect Copies</span>
                  </button>
                </div>
              </div>

              <!-- Scans Grid in Group -->
              <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                <div
                  v-for="scan in group.scans"
                  :key="scan.id"
                  class="relative rounded-lg border overflow-hidden p-2 flex flex-col justify-between transition-all"
                  :class="isScanSelected(scan.id, scan.classification)
                    ? (scan.classification === 'edible' ? 'border-emerald-500 bg-emerald-50/50 shadow-xs' : 'border-rose-500 bg-rose-50/50 shadow-xs')
                    : 'border-[#e2e8f0] bg-white opacity-70'"
                >
                  <div class="relative w-full h-[90px] rounded-md overflow-hidden bg-[#f8fafc] mb-2">
                    <img
                      :src="getImageUrl(scan.image_url || scan.image_path)"
                      :alt="scan.result_name"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-if="scan.is_primary"
                      class="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-emerald-600 text-white shadow-xs"
                    >
                      ★ Primary
                    </div>
                    <div
                      class="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9.5px] font-bold capitalize shadow-xs"
                      :class="scan.classification === 'edible' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'"
                    >
                      {{ scan.classification }}
                    </div>
                  </div>

                  <div class="space-y-1">
                    <p class="text-[11px] font-semibold text-[#0f172a] truncate italic">{{ scan.result_name }}</p>
                    <p class="text-[10px] text-[#64748b] truncate">By {{ scan.user }}</p>
                    <p class="text-[10px] text-[#94a3b8]">{{ scan.scanned_at }}</p>

                    <div class="pt-1 border-t border-[#f1f5f9] mt-1">
                      <button
                        v-if="!scan.is_primary"
                        type="button"
                        class="w-full py-1 px-1.5 rounded text-[10px] font-semibold border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors inline-flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                        :disabled="excludingDuplicates"
                        title="Permanently remove this duplicate from the active training queue"
                        @click.stop="excludeScanIds([scan.id])"
                      >
                        <AppIcon name="trash" class="w-3 h-3" />
                        <span>Deselect & Remove</span>
                      </button>
                      <label v-else class="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          class="rounded text-[#ea580c] focus:ring-orange-500 w-3.5 h-3.5"
                          :checked="isScanSelected(scan.id, scan.classification)"
                          @change="toggleScanInRetrain(scan.id, scan.classification)"
                        />
                        <span class="text-[10.5px] font-semibold" :class="isScanSelected(scan.id, scan.classification) ? 'text-[#0f172a]' : 'text-[#94a3b8]'">
                          {{ isScanSelected(scan.id, scan.classification) ? 'Included (Primary)' : 'Excluded' }}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-3.5 border-t border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
            <span class="text-[12px] text-[#64748b]">
              Selected for training: <strong class="text-[#0f172a]">{{ totalSelected }}</strong> images
            </span>
            <button
              type="button"
              class="px-4 py-2 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-white text-[12.5px] font-semibold transition-colors cursor-pointer"
              @click="closeDuplicatesModal"
            >
              Done Reviewing
            </button>
          </div>
        </div>
      </div>

      <!-- Retraining Run Status Report Modal -->
      <div
        v-if="showReportModal && selectedReportRun"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs"
        @click.self="closeReportModal"
      >
        <div class="bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <!-- Report Header -->
          <div class="px-6 py-4.5 border-b border-[#e2e8f0] flex items-center justify-between gap-3 bg-[#f8fafc]">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                :class="{
                  'bg-[#d1fae5] text-[#059669]': selectedReportRun.status === 'done',
                  'bg-[#fee2e2] text-[#dc2626]': selectedReportRun.status === 'failed',
                  'bg-[#fef9c3] text-[#d97706]': selectedReportRun.status === 'running',
                }"
              >
                <AppIcon
                  :name="selectedReportRun.status === 'done' ? 'check-circle' : selectedReportRun.status === 'failed' ? 'x-circle' : 'cog'"
                  class="w-5 h-5"
                  :class="{ 'animate-spin': selectedReportRun.status === 'running' }"
                />
              </div>
              <div>
                <h3 class="text-[16px] font-bold text-[#0f172a] flex items-center gap-2">
                  <span>Retraining Run Report {{ selectedReportRun.id ? `#${selectedReportRun.id}` : '' }}</span>
                  <span
                    class="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
                    :class="{
                      'bg-[#d1fae5] text-[#065f46]': selectedReportRun.status === 'done',
                      'bg-[#fee2e2] text-[#991b1b]': selectedReportRun.status === 'failed',
                      'bg-[#fef9c3] text-[#713f12]': selectedReportRun.status === 'running',
                    }"
                  >
                    {{ selectedReportRun.status }}
                  </span>
                </h3>
                <p class="text-[12px] text-[#64748b] mt-0.5">
                  MobileNetV2 Fine-Tuning Execution & Model Performance Audit
                </p>
              </div>
            </div>
            <button
              type="button"
              class="w-8 h-8 rounded-lg hover:bg-[#e2e8f0] text-[#64748b] flex items-center justify-center transition-colors cursor-pointer text-[18px]"
              @click="closeReportModal"
            >
              ✕
            </button>
          </div>

          <!-- Report Body -->
          <div class="flex-1 overflow-y-auto p-6 space-y-5 text-[#0f172a]">
            <!-- Meta Timeline Bar -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3.5 text-[12px]">
              <div>
                <span class="text-[#64748b] block text-[11px]">Started</span>
                <strong class="text-[#0f172a]">{{ formatDate(selectedReportRun.started_at) }}</strong>
              </div>
              <div>
                <span class="text-[#64748b] block text-[11px]">Finished</span>
                <strong class="text-[#0f172a]">{{ selectedReportRun.finished_at ? formatDate(selectedReportRun.finished_at) : (selectedReportRun.status === 'running' ? 'In progress…' : '—') }}</strong>
              </div>
              <div>
                <span class="text-[#64748b] block text-[11px]">Duration</span>
                <strong class="text-[#0f172a]">{{ formatDuration(selectedReportRun) }}</strong>
              </div>
              <div>
                <span class="text-[#64748b] block text-[11px]">Triggered By</span>
                <strong class="text-[#0f172a]">{{ selectedReportRun.triggered_by_name || 'Super Admin' }}</strong>
              </div>
            </div>

            <!-- Accuracy KPI Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="rounded-xl border p-4 bg-white border-[#e2e8f0]">
                <div class="flex items-center justify-between text-[12px] text-[#64748b] mb-1">
                  <span>Validation Accuracy</span>
                  <AppIcon name="target" class="w-4 h-4 text-[#059669]" />
                </div>
                <div class="text-[24px] font-extrabold text-[#059669]">
                  {{ selectedReportRun.val_accuracy != null ? `${selectedReportRun.val_accuracy}%` : '—' }}
                </div>
                <div class="w-full bg-[#f1f5f9] h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    class="bg-[#059669] h-full rounded-full transition-all duration-500"
                    :style="{ width: `${Math.min(100, selectedReportRun.val_accuracy || 0)}%` }"
                  />
                </div>
                <p class="text-[10.5px] text-[#64748b] mt-1.5">Evaluated on 20% clean holdout images</p>
              </div>

              <div class="rounded-xl border p-4 bg-white border-[#e2e8f0]">
                <div class="flex items-center justify-between text-[12px] text-[#64748b] mb-1">
                  <span>Training Accuracy</span>
                  <AppIcon name="chart" class="w-4 h-4 text-[#0284c7]" />
                </div>
                <div class="text-[24px] font-extrabold text-[#0284c7]">
                  {{ selectedReportRun.train_accuracy != null ? `${selectedReportRun.train_accuracy}%` : '—' }}
                </div>
                <div class="w-full bg-[#f1f5f9] h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    class="bg-[#0284c7] h-full rounded-full transition-all duration-500"
                    :style="{ width: `${Math.min(100, selectedReportRun.train_accuracy || 0)}%` }"
                  />
                </div>
                <p class="text-[10.5px] text-[#64748b] mt-1.5">Evaluated on 80% augmented field set</p>
              </div>

              <div class="rounded-xl border p-4 bg-white border-[#e2e8f0]">
                <div class="flex items-center justify-between text-[12px] text-[#64748b] mb-1">
                  <span>Total Training Dataset</span>
                  <AppIcon name="mushroom" class="w-4 h-4 text-[#7c3aed]" />
                </div>
                <div class="text-[24px] font-extrabold text-[#7c3aed]">
                  {{ selectedReportRun.total_images ?? ((selectedReportRun.new_edible || 0) + (selectedReportRun.new_poisonous || 0)) }}
                </div>
                <p class="text-[11px] font-medium text-[#475569] mt-2">
                  {{ (selectedReportRun.new_edible || 0) + (selectedReportRun.new_poisonous || 0) }} new candidate photos added
                </p>
                <p class="text-[10.5px] text-[#64748b] mt-0.5">3 Classes: Edible, Poisonous, Non-Mushroom</p>
              </div>
            </div>

            <!-- Dataset Breakdown -->
            <div class="rounded-xl border border-[#e2e8f0] p-4 bg-white">
              <h4 class="text-[13px] font-bold text-[#0f172a] mb-3 flex items-center gap-2">
                <AppIcon name="chart" class="w-4 h-4 text-[#64748b]" />
                <span>Class Distribution & Ingestion Breakdown</span>
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
                <div class="p-3 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0]">
                  <span class="text-[#065f46] block text-[11px] font-semibold">Edible Class</span>
                  <strong class="text-[18px] text-[#065f46]">{{ selectedReportRun.total_edible ?? selectedReportRun.new_edible ?? '—' }}</strong>
                  <span v-if="selectedReportRun.new_edible != null" class="block text-[10.5px] text-[#059669] mt-0.5">+{{ selectedReportRun.new_edible }} new</span>
                </div>
                <div class="p-3 rounded-lg bg-[#fef2f2] border border-[#fecaca]">
                  <span class="text-[#991b1b] block text-[11px] font-semibold">Poisonous Class</span>
                  <strong class="text-[18px] text-[#991b1b]">{{ selectedReportRun.total_poisonous ?? selectedReportRun.new_poisonous ?? '—' }}</strong>
                  <span v-if="selectedReportRun.new_poisonous != null" class="block text-[10.5px] text-[#dc2626] mt-0.5">+{{ selectedReportRun.new_poisonous }} new</span>
                </div>
                <div class="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                  <span class="text-[#475569] block text-[11px] font-semibold">Non-Mushroom Class</span>
                  <strong class="text-[18px] text-[#0f172a]">{{ selectedReportRun.total_not_mushroom ?? 409 }}</strong>
                  <span class="block text-[10.5px] text-[#64748b] mt-0.5">Negative baseline</span>
                </div>
                <div class="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                  <span class="text-[#475569] block text-[11px] font-semibold">Retrained Candidates</span>
                  <strong class="text-[18px] text-[#0f172a]">{{ (selectedReportRun.new_edible || 0) + (selectedReportRun.new_poisonous || 0) }}</strong>
                  <span class="block text-[10.5px] text-[#64748b] mt-0.5">{{ selectedReportRun.scans_marked_retrained ? 'Stroked to Already Trained' : 'Queued' }}</span>
                </div>
              </div>
            </div>

            <!-- Error diagnostics if failed -->
            <div v-if="selectedReportRun.status === 'failed'" class="rounded-xl border border-rose-300 bg-rose-50 p-4">
              <h4 class="text-[13px] font-bold text-rose-900 flex items-center gap-2 mb-2">
                <AppIcon name="warning" class="w-4 h-4 text-rose-600" />
                <span>Failure Diagnostic Analysis</span>
              </h4>
              <div class="bg-white border border-rose-200 rounded-lg p-3 text-[11.5px] font-mono text-rose-800 break-all overflow-x-auto whitespace-pre-wrap">
                {{ selectedReportRun.error || 'Unknown training error occurred.' }}
              </div>
              <p class="text-[11.5px] text-rose-700 mt-2">
                Note: Serverless container memory has been upgraded to 4 GB RAM and the full baseline dataset has been baked in to prevent missing class errors on future runs.
              </p>
            </div>

            <!-- Pipeline Specifications -->
            <div class="rounded-xl border border-[#e2e8f0] p-4 bg-[#f8fafc] text-[12px] space-y-2">
              <h4 class="text-[13px] font-bold text-[#0f172a] flex items-center gap-2">
                <AppIcon name="brain" class="w-4 h-4 text-[#64748b]" />
                <span>Model Architecture & Training Parameters</span>
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#475569] pt-1">
                <div>• <strong>Backbone:</strong> MobileNetV2 (ImageNet weights, frozen)</div>
                <div>• <strong>Input Size:</strong> 224 × 224 pixels (RGB)</div>
                <div>• <strong>Top Layers:</strong> GAP → Dense(64, ReLU) → Dropout(0.5) → Dense(3, Softmax)</div>
                <div>• <strong>Epochs:</strong> 10 with EarlyStopping (patience: 3)</div>
                <div>• <strong>Batch Size:</strong> 8 | Optimizer: Adam</div>
                <div>• <strong>Augmentations:</strong> Reflect mirror, Cutout (p=0.5), Photometry, Blur</div>
                <div>• <strong>Validation Split:</strong> 20% clean holdout (unaugmented)</div>
                <div>• <strong>Storage Volume:</strong> <code>mycovision-models-volume</code> (Modal)</div>
              </div>
            </div>
          </div>

          <!-- Report Footer -->
          <div class="px-6 py-3.5 border-t border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
            <span class="text-[12px] text-[#64748b]">
              Status: <strong class="text-[#0f172a] capitalize">{{ selectedReportRun.status }}</strong>
            </span>
            <button
              type="button"
              class="px-4 py-2 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-white text-[12.5px] font-semibold transition-colors cursor-pointer"
              @click="closeReportModal"
            >
              Close Report
            </button>
          </div>
        </div>
      </div>
    </template>
  </div> <!-- /TAB 2 Verified Retraining Dataset -->

  <!-- Modal: Full Image Preview for Pending Scan Inspection -->
  <div
    v-if="previewScan"
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-[110] backdrop-blur-[2px] p-4"
    @click.self="previewScan = null"
  >
    <div class="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150">
      <div class="flex items-center justify-between p-4 border-b border-slate-100 bg-[#f8fafc]">
        <div>
          <p class="text-[14px] font-bold text-slate-800">{{ previewScan.predicted_species }}</p>
          <p class="text-[12px] text-slate-500">Contributed by {{ previewScan.user?.name || previewScan.user?.email || 'Anonymous Forager' }}</p>
        </div>
        <button
          type="button"
          class="text-slate-400 hover:text-slate-600 text-lg font-bold px-2 cursor-pointer"
          @click="previewScan = null"
        >
          ✕
        </button>
      </div>
      <div class="p-4 bg-slate-950 flex items-center justify-center max-h-[70vh]">
        <img
          :src="getImageUrl(previewScan.image_url || previewScan.image_path)"
          :alt="previewScan.predicted_species"
          class="max-h-[60vh] max-w-full object-contain rounded-lg"
        />
      </div>
      <div class="p-4 bg-slate-50 flex items-center justify-between">
        <span class="text-[12px] text-slate-600 font-medium">
          Confidence: {{ Math.round(previewScan.confidence_score * 100) }}% · Reward: +{{ previewScan.points_awarded }} pts
        </span>
        <button
          type="button"
          class="py-1.5 px-4 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[12px] font-semibold cursor-pointer"
          @click="previewScan = null"
        >
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- Delete History Confirmation Modal -->
  <div
    v-if="deleteModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs"
    @click.self="deleteModalOpen = false"
  >
    <div class="bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div class="p-6">
        <div class="w-12 h-12 rounded-xl bg-[#fee2e2] text-[#dc2626] flex items-center justify-center mb-4 shadow-sm">
          <AppIcon name="trash" class="w-6 h-6" />
        </div>
        <h4 class="text-[17px] font-bold text-[#0f172a] mb-2">
          Delete Retraining History?
        </h4>
        <p class="text-[13.5px] text-[#64748b] leading-relaxed mb-6">
          Are you sure you want to permanently delete
          <strong class="text-[#0f172a]">{{ idsPendingDelete.length === 1 ? 'this retraining run' : `${idsPendingDelete.length} retraining runs` }}</strong>?
          This record and its performance metrics will be permanently erased. This action cannot be undone.
        </p>
        <div class="flex items-center justify-end gap-3">
          <button
            type="button"
            class="py-2 px-4 rounded-xl border border-[#e2e8f0] bg-white hover:bg-[#f1f5f9] text-[13px] font-semibold text-[#475569] cursor-pointer transition-colors"
            :disabled="deletingHistory"
            @click="deleteModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="py-2 px-4 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white text-[13px] font-semibold cursor-pointer inline-flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
            :disabled="deletingHistory"
            @click="confirmDeleteHistory"
          >
            <AppIcon v-if="deletingHistory" name="cog" class="w-4 h-4 animate-spin" />
            <span>{{ deletingHistory ? 'Deleting…' : 'Permanently Delete' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
interface ScanCandidate {
  id: number
  image_url: string
  image_path?: string
  result_name: string
  confidence: number
  classification: 'edible' | 'poisonous'
  user: string
  scanned_at: string
  retrained_at?: string | null
}

interface DuplicateScan {
  id: number
  image_url: string
  image_path?: string
  result_name: string
  classification: 'edible' | 'poisonous'
  confidence: number
  user: string
  scanned_at: string
  retrained_at?: string | null
  is_primary: boolean
  file_size?: number | null
}

interface DuplicateGroup {
  group_id: number | string
  match_type?: 'exact' | 'perceptual'
  match_types?: string[]
  similarity?: number
  has_conflict: boolean
  classification?: string
  classifications?: string[]
  total_count: number
  primary_scan_id?: number
  recommended_unselect_ids?: number[]
  scans: DuplicateScan[]
}

const emit = defineEmits<{
  'update:count': [count: number]
  'update:state': [state: string]
}>()

const config = useRuntimeConfig()
const api = config.public.apiBase
const { confirm } = useConfirm()

const classPanels: Array<{
  cls: 'edible' | 'poisonous'
  title: string
  icon: string
  iconClass: string
  headerBg: string
  titleClass: string
  badgeClass: string
  selectBtnClass: string
  emptyIcon: string
  emptyIconClass: string
  emptyTitle: string
  selectedBorder: string
  selectedOverlay: string
  selectedCheck: string
}> = [
  {
    cls: 'edible',
    title: 'Edible Scans',
    icon: 'check-circle',
    iconClass: 'text-[#059669]',
    headerBg: 'bg-[#f0fdf4]',
    titleClass: 'text-[#065f46]',
    badgeClass: 'bg-[#bbf7d0] text-[#065f46]',
    selectBtnClass: 'text-[#059669]',
    emptyIcon: 'leaf',
    emptyIconClass: 'text-[#10b981]',
    emptyTitle: 'No edible candidates yet',
    selectedBorder: 'border-[#10b981] shadow-[0_0_0_2px_#d1fae5]',
    selectedOverlay: 'bg-[#10b981]/30 opacity-100',
    selectedCheck: 'bg-[#10b981] text-white',
  },
  {
    cls: 'poisonous',
    title: 'Poisonous Scans',
    icon: 'skull',
    iconClass: 'text-[#dc2626]',
    headerBg: 'bg-[#fef2f2]',
    titleClass: 'text-[#991b1b]',
    badgeClass: 'bg-[#fecaca] text-[#991b1b]',
    selectBtnClass: 'text-[#dc2626]',
    emptyIcon: 'skull',
    emptyIconClass: 'text-[#ef4444]',
    emptyTitle: 'No poisonous candidates yet',
    selectedBorder: 'border-[#ef4444] shadow-[0_0_0_2px_#fecaca]',
    selectedOverlay: 'bg-[#ef4444]/30 opacity-100',
    selectedCheck: 'bg-[#ef4444] text-white',
  },
]

const loading = ref(true)
const restoring = ref(false)
const refreshingMl = ref(false)
const { success: toastSuccess, error: toastError } = useToast()
const queueView = ref<'ready' | 'trained'>('ready')
const brokenImages = ref<Record<number, boolean>>({})

// Human-in-the-Loop Annotation Queue & Section Tab State
const retrainSectionTab = ref<'pending' | 'verified'>('pending')
const pendingList = ref<any[]>([])
const pendingCount = ref(0)
const approvedCount = ref(0)
const speciesCatalog = ref<any[]>([])
const selectedRelabels = ref<Record<number, string>>({})
const pendingLoading = ref(false)
const actionLoading = ref<Record<number, boolean>>({})
const previewScan = ref<any | null>(null)
const pendingPagination = ref({ current_page: 1, last_page: 1, total: 0 })
const isExporting = ref(false)

const candidates = ref<{ edible: ScanCandidate[]; poisonous: ScanCandidate[] }>({
  edible: [],
  poisonous: [],
})
const retrainedCandidates = ref<{ edible: ScanCandidate[]; poisonous: ScanCandidate[] }>({
  edible: [],
  poisonous: [],
})
const summary = ref({ total: 0, edible_count: 0, poisonous_count: 0 })
const retrainedSummary = ref({ total: 0, edible_count: 0, poisonous_count: 0 })

const scanningDuplicates = ref(false)
const showDuplicatesModal = ref(false)
const selectedGroupId = ref<string | null>(null)
const duplicateFilter = ref<'all' | 'conflicts' | 'exact' | 'near'>('all')
const duplicateGroups = ref<DuplicateGroup[]>([])
const duplicateSummary = ref({
  total_scans_analyzed: 0,
  duplicate_groups_count: 0,
  redundant_scans_count: 0,
  conflict_groups_count: 0,
})
const recommendedUnselectIds = ref<number[]>([])
const duplicateScanMap = ref<Record<number, { group_id: string; is_primary: boolean; has_conflict: boolean }>>({})
const hasScannedDuplicates = ref(false)
const excludingDuplicates = ref(false)

const edibleSelected = ref<number[]>([])
const poisonousSelected = ref<number[]>([])
const trainedSelected = ref<{ edible: number[]; poisonous: number[] }>({ edible: [], poisonous: [] })

const totalSelected = computed(() => edibleSelected.value.length + poisonousSelected.value.length)
const totalSelectedInView = computed(() =>
  queueView.value === 'trained'
    ? trainedSelected.value.edible.length + trainedSelected.value.poisonous.length
    : totalSelected.value
)

const retrainState = ref<'idle' | 'running' | 'done' | 'failed' | 'unknown'>('idle')
const lastResult = ref<any>(null)
const statusError = ref<string | null>(null)
const history = ref<any[]>([])
const historyPage = ref(1)
const historyPerPage = ref(5)

const historyTab = ref<'active' | 'archived'>('active')
const archivedHistory = ref<any[]>([])
const archivedPage = ref(1)
const archivedPerPage = ref(5)
const selectedArchivedIds = ref<number[]>([])

const historyTotalPages = computed(() => Math.max(1, Math.ceil(history.value.length / historyPerPage.value)))
const paginatedHistory = computed(() => {
  const start = (historyPage.value - 1) * historyPerPage.value
  return history.value.slice(start, start + historyPerPage.value)
})
const historyStartIndex = computed(() => (history.value.length === 0 ? 0 : (historyPage.value - 1) * historyPerPage.value))
const historyEndIndex = computed(() => Math.min(history.value.length, historyPage.value * historyPerPage.value))

watch(historyTotalPages, (t) => {
  if (historyPage.value > t) historyPage.value = t
})
watch(historyPerPage, () => {
  historyPage.value = 1
})

const archivedTotalPages = computed(() => Math.max(1, Math.ceil(archivedHistory.value.length / archivedPerPage.value)))
const paginatedArchivedHistory = computed(() => {
  const start = (archivedPage.value - 1) * archivedPerPage.value
  return archivedHistory.value.slice(start, start + archivedPerPage.value)
})
const archivedStartIndex = computed(() => (archivedHistory.value.length === 0 ? 0 : (archivedPage.value - 1) * archivedPerPage.value))
const archivedEndIndex = computed(() => Math.min(archivedHistory.value.length, archivedPage.value * archivedPerPage.value))

watch(archivedTotalPages, (t) => {
  if (archivedPage.value > t) archivedPage.value = t
})
watch(archivedPerPage, () => {
  archivedPage.value = 1
})

const isAllArchivedSelected = computed(() => {
  const pageItems = paginatedArchivedHistory.value.filter(r => r.id != null)
  if (pageItems.length === 0) return false
  return pageItems.every(r => selectedArchivedIds.value.includes(r.id))
})

function toggleSelectAllArchived() {
  const pageIds = paginatedArchivedHistory.value.map(r => r.id).filter(Boolean)
  if (isAllArchivedSelected.value) {
    selectedArchivedIds.value = selectedArchivedIds.value.filter(id => !pageIds.includes(id))
  } else {
    const combined = new Set([...selectedArchivedIds.value, ...pageIds])
    selectedArchivedIds.value = Array.from(combined)
  }
}

function toggleSelectArchived(id: number) {
  const idx = selectedArchivedIds.value.indexOf(id)
  if (idx >= 0) {
    selectedArchivedIds.value.splice(idx, 1)
  } else {
    selectedArchivedIds.value.push(id)
  }
}

const archivingId = ref<number | null>(null)
const recoveringId = ref<number | null>(null)
const deleteModalOpen = ref(false)
const idsPendingDelete = ref<number[]>([])
const deletingHistory = ref(false)

async function archiveRun(run: any) {
  if (!run?.id) return
  archivingId.value = run.id
  try {
    const res = await $fetch<any>(`${api}/admin/retrain/history/archive`, {
      method: 'POST',
      headers: authHeaders(),
      body: { id: run.id },
    })
    if (res.history) history.value = res.history
    if (res.archived_history) archivedHistory.value = res.archived_history
    toastSuccess(res.message || 'Retraining run archived.')
  } catch (err: any) {
    toastError(err?.data?.message || err?.message || 'Failed to archive retraining run.')
  } finally {
    archivingId.value = null
  }
}

async function recoverRun(run: any) {
  if (!run?.id) return
  recoveringId.value = run.id
  try {
    const res = await $fetch<any>(`${api}/admin/retrain/history/recover`, {
      method: 'POST',
      headers: authHeaders(),
      body: { id: run.id },
    })
    if (res.history) history.value = res.history
    if (res.archived_history) archivedHistory.value = res.archived_history
    selectedArchivedIds.value = selectedArchivedIds.value.filter(id => id !== run.id)
    toastSuccess(res.message || 'Retraining run recovered.')
  } catch (err: any) {
    toastError(err?.data?.message || err?.message || 'Failed to recover retraining run.')
  } finally {
    recoveringId.value = null
  }
}

async function bulkRecoverArchived() {
  if (selectedArchivedIds.value.length === 0) return
  try {
    const res = await $fetch<any>(`${api}/admin/retrain/history/recover`, {
      method: 'POST',
      headers: authHeaders(),
      body: { ids: selectedArchivedIds.value },
    })
    if (res.history) history.value = res.history
    if (res.archived_history) archivedHistory.value = res.archived_history
    selectedArchivedIds.value = []
    toastSuccess(res.message || 'Selected runs recovered successfully.')
  } catch (err: any) {
    toastError(err?.data?.message || err?.message || 'Failed to recover selected runs.')
  }
}

function openDeleteConfirmModal(ids: number[]) {
  if (!ids || ids.length === 0) return
  idsPendingDelete.value = [...ids]
  deleteModalOpen.value = true
}

async function confirmDeleteHistory() {
  if (idsPendingDelete.value.length === 0) return
  deletingHistory.value = true
  try {
    const res = await $fetch<any>(`${api}/admin/retrain/history/delete`, {
      method: 'POST',
      headers: authHeaders(),
      body: { ids: idsPendingDelete.value },
    })
    if (res.history) history.value = res.history
    if (res.archived_history) archivedHistory.value = res.archived_history
    selectedArchivedIds.value = selectedArchivedIds.value.filter(id => !idsPendingDelete.value.includes(id))
    deleteModalOpen.value = false
    toastSuccess(res.message || 'Retraining history permanently deleted.')
  } catch (err: any) {
    toastError(err?.data?.message || err?.message || 'Failed to delete retraining history.')
  } finally {
    deletingHistory.value = false
    idsPendingDelete.value = []
  }
}

const selectedReportRun = ref<any>(null)
const showReportModal = ref(false)
let statusInterval: ReturnType<typeof setInterval> | null = null
let doneTimer: ReturnType<typeof setTimeout> | null = null
const doneBannerDismissed = ref(false)

function dismissDoneBanner() {
  doneBannerDismissed.value = true
  if (doneTimer) {
    clearTimeout(doneTimer)
    doneTimer = null
  }
}

watch(() => summary.value.total, n => emit('update:count', n), { immediate: true })
watch(retrainState, (s) => {
  emit('update:state', s)
  if (s === 'done') {
    doneBannerDismissed.value = false
    if (doneTimer) clearTimeout(doneTimer)
    doneTimer = setTimeout(() => {
      doneBannerDismissed.value = true
    }, 5000)
  } else if (s === 'running') {
    doneBannerDismissed.value = false
    if (doneTimer) {
      clearTimeout(doneTimer)
      doneTimer = null
    }
  }
}, { immediate: true })

const statusMessage = computed(() => {
  if (retrainState.value === 'running') return 'Retraining in progress — this may take several minutes…'
  if (retrainState.value === 'done') return 'Retraining completed successfully.'
  if (retrainState.value === 'failed') return 'Retraining failed. See error below.'
  if (retrainState.value === 'unknown') return 'ML service status unavailable.'
  return ''
})

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('token')}` }
}

function getImageUrl(path?: string): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${api.replace(/\/api\/?$/, '')}/storage/${path.replace(/^\/+/, '')}`
}

function visibleList(cls: 'edible' | 'poisonous'): ScanCandidate[] {
  return queueView.value === 'trained' ? retrainedCandidates.value[cls] : candidates.value[cls]
}

function selectionBucket(cls: 'edible' | 'poisonous'): number[] {
  if (queueView.value === 'trained') return trainedSelected.value[cls]
  return cls === 'edible' ? edibleSelected.value : poisonousSelected.value
}

function selectedIds(cls: 'edible' | 'poisonous') {
  return selectionBucket(cls)
}

function isSelected(cls: 'edible' | 'poisonous', id: number) {
  return selectedIds(cls).includes(id)
}

function toggleSelect(cls: 'edible' | 'poisonous', id: number) {
  const arr = selectionBucket(cls)
  const idx = arr.indexOf(id)
  if (idx > -1) arr.splice(idx, 1)
  else arr.push(id)
}

function selectAll(cls: 'edible' | 'poisonous') {
  const ids = visibleList(cls).map(s => s.id)
  if (queueView.value === 'trained') {
    trainedSelected.value[cls] = ids
  } else if (cls === 'edible') {
    edibleSelected.value = ids
  } else {
    poisonousSelected.value = ids
  }
}

function deselectAll(cls: 'edible' | 'poisonous') {
  if (queueView.value === 'trained') {
    trainedSelected.value[cls] = []
  } else if (cls === 'edible') {
    edibleSelected.value = []
  } else {
    poisonousSelected.value = []
  }
}

async function fetchCandidates() {
  loading.value = true
  try {
    const data = await $fetch<any>(`${api}/admin/retrain/candidates`, { headers: authHeaders() })
    candidates.value = { edible: data.edible || [], poisonous: data.poisonous || [] }
    retrainedCandidates.value = {
      edible: data.retrained_edible || [],
      poisonous: data.retrained_poisonous || [],
    }
    summary.value = data.summary || { total: 0, edible_count: 0, poisonous_count: 0 }
    retrainedSummary.value = data.retrained_summary || { total: 0, edible_count: 0, poisonous_count: 0 }

    edibleSelected.value = candidates.value.edible.map((s: ScanCandidate) => s.id)
    poisonousSelected.value = candidates.value.poisonous.map((s: ScanCandidate) => s.id)
    trainedSelected.value = { edible: [], poisonous: [] }
    brokenImages.value = {}
  } catch (err) {
    console.error('Failed to fetch retrain candidates:', err)
  } finally {
    loading.value = false
  }
}

async function restoreScans(all: boolean) {
  const ids = [...trainedSelected.value.edible, ...trainedSelected.value.poisonous]
  if (!all && ids.length === 0) return

  restoring.value = true
  try {
    await $fetch(`${api}/admin/retrain/restore`, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: all ? { all: true } : { scan_ids: ids },
    })
    await fetchCandidates()
    queueView.value = 'ready'
  } catch (err: any) {
    statusError.value = err?.data?.message || 'Failed to restore scan images.'
  } finally {
    restoring.value = false
  }
}

async function fetchStatus() {
  const previousState = retrainState.value
  try {
    const data = await $fetch<any>(`${api}/admin/retrain/status`, { headers: authHeaders() })
    const current = data.current || { state: 'idle' }
    retrainState.value = current.state
    statusError.value = current.error ?? null
    if (current.last_result) lastResult.value = current.last_result
    history.value = data.history ?? []
    archivedHistory.value = data.archived_history ?? []

    if (current.state === 'done' || current.state === 'failed') {
      stopPolling()
    }
    if (current.state === 'unknown' && previousState !== 'unknown') {
      setTimeout(() => fetchStatus(), 3500)
    }
    if (data.scans_updated || (previousState === 'running' && current.state === 'done')) {
      await fetchCandidates()
    }
  } catch {
    // silently ignore transient polling errors
  }
}

const filteredDuplicateGroups = computed(() => {
  if (duplicateFilter.value === 'conflicts') {
    return duplicateGroups.value.filter(g => g.has_conflict)
  }
  if (duplicateFilter.value === 'exact') {
    return duplicateGroups.value.filter(g => g.match_type === 'exact' || (Array.isArray(g.match_types) && g.match_types.includes('exact')))
  }
  if (duplicateFilter.value === 'near') {
    return duplicateGroups.value.filter(g => g.match_type === 'perceptual' || (Array.isArray(g.match_types) && g.match_types.includes('perceptual')))
  }
  return duplicateGroups.value
})

async function handleDuplicateButtonClick() {
  if (scanningDuplicates.value) return

  // If already scanned and found duplicate sets, open the review modal directly
  if (hasScannedDuplicates.value && duplicateSummary.value.duplicate_groups_count > 0) {
    openDuplicatesModal()
    return
  }

  // Otherwise, run manual duplicate scan
  await runManualDuplicateScan(true)
}

async function runManualDuplicateScan(openModalIfFound = true) {
  scanningDuplicates.value = true
  try {
    const data = await $fetch<any>(`${api}/admin/retrain/duplicates`, {
      headers: authHeaders(),
      query: { scope: queueView.value === 'trained' ? 'all' : 'ready' },
    })
    duplicateGroups.value = data.groups || []
    duplicateSummary.value = {
      total_scans_analyzed: data.total_scans_analyzed || 0,
      duplicate_groups_count: data.duplicate_groups_count || 0,
      redundant_scans_count: data.redundant_scans_count || 0,
      conflict_groups_count: data.conflict_groups_count || 0,
    }
    recommendedUnselectIds.value = data.recommended_unselect_ids || []
    duplicateScanMap.value = data.duplicate_scan_ids_map || {}
    hasScannedDuplicates.value = true

    // Auto-uncheck redundant duplicate copies from current selection so they are not sent to retrain
    if (recommendedUnselectIds.value.length > 0) {
      const unselectSet = new Set(recommendedUnselectIds.value)
      edibleSelected.value = edibleSelected.value.filter(id => !unselectSet.has(id))
      poisonousSelected.value = poisonousSelected.value.filter(id => !unselectSet.has(id))
    }

    if (duplicateSummary.value.duplicate_groups_count > 0) {
      toastSuccess(`Scan complete: Found ${duplicateSummary.value.duplicate_groups_count} duplicate set(s) (${duplicateSummary.value.redundant_scans_count} redundant copy/copies).`)
      if (openModalIfFound) {
        openDuplicatesModal()
      }
    } else {
      toastSuccess('Scan complete: No duplicate images found. All candidate images are unique.')
    }
  } catch (err: any) {
    console.warn('Failed to fetch duplicate scans:', err)
    toastError(err?.data?.message || 'Failed to scan for duplicate images.')
  } finally {
    scanningDuplicates.value = false
  }
}

async function fetchDuplicates() {
  await runManualDuplicateScan(false)
}

function openDuplicatesModal(targetGroupId?: string) {
  if (targetGroupId) {
    selectedGroupId.value = targetGroupId
    setTimeout(() => {
      const el = document.getElementById(`dup-group-${targetGroupId}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }
  showDuplicatesModal.value = true
}

function closeDuplicatesModal() {
  showDuplicatesModal.value = false
  selectedGroupId.value = null
}

function isScanSelected(id: number, classification: string): boolean {
  return classification === 'edible'
    ? edibleSelected.value.includes(id)
    : poisonousSelected.value.includes(id)
}

function toggleScanInRetrain(id: number, classification: string) {
  if (classification === 'edible') {
    if (edibleSelected.value.includes(id)) {
      edibleSelected.value = edibleSelected.value.filter(x => x !== id)
    } else {
      edibleSelected.value.push(id)
    }
  } else {
    if (poisonousSelected.value.includes(id)) {
      poisonousSelected.value = poisonousSelected.value.filter(x => x !== id)
    } else {
      poisonousSelected.value.push(id)
    }
  }
}

async function keepOnlyPrimaryInGroup(group: DuplicateGroup) {
  const redundantIds = group.scans.filter(s => !s.is_primary).map(s => s.id)
  if (redundantIds.length === 0) {
    toastSuccess('This set already has only the primary scan selected.')
    return
  }
  await excludeScanIds(redundantIds)
}

async function autoDeselectDuplicates() {
  const unselectSet = Array.from(new Set(recommendedUnselectIds.value))
  if (unselectSet.length === 0) {
    toastSuccess('No redundant duplicate copies found to remove.')
    return
  }

  const ok = await confirm({
    title: 'Permanently Remove Duplicate Images?',
    message: `Remove ${unselectSet.length} redundant duplicate image${unselectSet.length !== 1 ? 's' : ''} from the active training candidates? (Original photos remain stored safely in scan logs; only duplicates are removed from the training queue).`,
    tone: 'warning',
    confirmText: 'Remove Duplicates',
  })
  if (!ok) return

  excludingDuplicates.value = true
  try {
    const res = await $fetch<any>(`${api}/admin/retrain/exclude`, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: { scan_ids: unselectSet },
    })
    const idSet = new Set(unselectSet)
    edibleSelected.value = edibleSelected.value.filter(id => !idSet.has(id))
    poisonousSelected.value = poisonousSelected.value.filter(id => !idSet.has(id))

    toastSuccess(res?.message || `Permanently removed ${unselectSet.length} duplicate copy/copies from the training candidates.`)
    await refreshAll()
    hasScannedDuplicates.value = false
    duplicateGroups.value = []
    closeDuplicatesModal()
  } catch (err: any) {
    toastError(err?.data?.message || 'Failed to remove duplicate images.')
  } finally {
    excludingDuplicates.value = false
  }
}

async function excludeUnselected(cls: 'edible' | 'poisonous') {
  const selected = new Set(selectionBucket(cls))
  const unselectedIds = visibleList(cls).filter(s => !selected.has(s.id)).map(s => s.id)
  if (unselectedIds.length === 0) return
  await excludeScanIds(unselectedIds)
}

async function excludeScanIds(ids: number[]) {
  if (!ids || ids.length === 0) return
  const ok = await confirm({
    title: 'Remove Duplicate Images from Queue?',
    message: `Permanently remove ${ids.length} duplicate image${ids.length !== 1 ? 's' : ''} from the images to be trained? (They can be reviewed or restored anytime from the Already Trained tab).`,
    tone: 'warning',
    confirmText: 'Remove Duplicates',
  })
  if (!ok) return

  excludingDuplicates.value = true
  try {
    const res = await $fetch<any>(`${api}/admin/retrain/exclude`, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: { scan_ids: ids },
    })
    const idSet = new Set(ids)
    edibleSelected.value = edibleSelected.value.filter(id => !idSet.has(id))
    poisonousSelected.value = poisonousSelected.value.filter(id => !idSet.has(id))

    toastSuccess(res?.message || 'Duplicates permanently removed from the training queue.')
    await refreshAll()
    await runManualDuplicateScan(false)
  } catch (err: any) {
    toastError(err?.data?.message || 'Failed to remove duplicates.')
  } finally {
    excludingDuplicates.value = false
  }
}

function openReportModal(run: any) {
  selectedReportRun.value = run
  showReportModal.value = true
}

function closeReportModal() {
  showReportModal.value = false
  selectedReportRun.value = null
}

function formatDuration(run: any): string {
  if (!run) return '—'
  if (run.duration_seconds != null) {
    const s = Number(run.duration_seconds)
    if (s < 60) return `${s}s`
    const m = Math.floor(s / 60)
    const rem = s % 60
    return `${m}m ${rem}s`
  }
  if (run.started_at && run.finished_at) {
    const s = Math.round((new Date(run.finished_at).getTime() - new Date(run.started_at).getTime()) / 1000)
    if (s >= 0) {
      if (s < 60) return `${s}s`
      return `${Math.floor(s / 60)}m ${s % 60}s`
    }
  }
  if (run.status === 'running') return 'In progress…'
  return '—'
}

watch(queueView, async () => {
  // Always fetch fresh candidates and retrained images when switching tabs
  await fetchCandidates()
  hasScannedDuplicates.value = false
  duplicateGroups.value = []
  duplicateSummary.value = {
    total_scans_analyzed: 0,
    duplicate_groups_count: 0,
    redundant_scans_count: 0,
    conflict_groups_count: 0,
  }
  duplicateScanMap.value = {}
  recommendedUnselectIds.value = []
})

async function fetchPendingAnnotations(page = 1) {
  pendingLoading.value = true
  try {
    const data = await $fetch<any>(`${api}/admin/annotations/pending?page=${page}`, {
      headers: authHeaders(),
    })
    const list = data?.contributions?.data || []
    pendingList.value = list
    pendingCount.value = Number(data?.pending_count || 0)
    approvedCount.value = Number(data?.approved_count || 0)
    speciesCatalog.value = data?.species_list || []
    pendingPagination.value = {
      current_page: data?.contributions?.current_page || 1,
      last_page: data?.contributions?.last_page || 1,
      total: data?.contributions?.total || 0,
    }

    // Default relabel dropdown to current verified species or prediction
    list.forEach((item: any) => {
      if (!selectedRelabels.value[item.id]) {
        selectedRelabels.value[item.id] = item.verified_species || item.predicted_species
      }
    })
  } catch (err: any) {
    console.error('Failed to fetch pending annotations:', err)
  } finally {
    pendingLoading.value = false
  }
}

async function approveContribution(id: number) {
  actionLoading.value[id] = true
  try {
    const verifiedSpecies = selectedRelabels.value[id] || undefined
    const res = await $fetch<any>(`${api}/admin/annotations/${id}/approve`, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: { verified_species: verifiedSpecies },
    })
    toastSuccess(res?.message || 'Scan approved and points awarded to user!')
    await Promise.all([
      fetchPendingAnnotations(pendingPagination.value.current_page),
      fetchCandidates(),
    ])
  } catch (err: any) {
    toastError(err?.data?.message || err?.message || 'Failed to approve scan.')
  } finally {
    actionLoading.value[id] = false
  }
}

async function rejectContribution(id: number) {
  const ok = await confirm({
    title: 'Reject Contribution?',
    message: 'This will reject the scan, forfeit pending reward points, and exclude this photo from model retraining.',
    tone: 'danger',
    confirmText: 'Reject Scan',
  })
  if (!ok) return

  actionLoading.value[id] = true
  try {
    const res = await $fetch<any>(`${api}/admin/annotations/${id}/reject`, {
      method: 'POST',
      headers: authHeaders(),
    })
    toastSuccess(res?.message || 'Scan rejected.')
    await Promise.all([
      fetchPendingAnnotations(pendingPagination.value.current_page),
      fetchCandidates(),
    ])
  } catch (err: any) {
    toastError(err?.data?.message || err?.message || 'Failed to reject scan.')
  } finally {
    actionLoading.value[id] = false
  }
}

async function exportDatasetZip() {
  isExporting.value = true
  try {
    const response = await fetch(`${api}/admin/annotations/export`, {
      headers: authHeaders(),
    })
    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.message || `Export failed with status ${response.status}`)
    }
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `mycovision_verified_dataset_${new Date().toISOString().slice(0, 10)}.zip`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    toastSuccess('Verified dataset ZIP downloaded successfully!')
  } catch (err: any) {
    toastError(err.message || 'Failed to export verified dataset.')
  } finally {
    isExporting.value = false
  }
}

async function refreshAll() {
  await Promise.all([fetchCandidates(), fetchStatus(), fetchPendingAnnotations()])
}

function showVerifiedTab() {
  retrainSectionTab.value = 'verified'
  queueView.value = 'ready'
}

defineExpose({
  refreshAll,
  fetchCandidates,
  showVerifiedTab,
})

async function refreshMlService() {
  refreshingMl.value = true
  try {
    const res = await $fetch<any>(`${api}/admin/retrain/refresh`, {
      method: 'POST',
      headers: authHeaders(),
    })
    toastSuccess(res?.message || 'ML inference models refreshed and ready for new scans.')
    await fetchStatus()
  } catch (err: any) {
    toastError(err?.data?.message || 'Could not reach ML service.')
  } finally {
    refreshingMl.value = false
  }
}

async function startRetrain() {
  if (totalSelected.value === 0) return
  const totalAvailable = candidates.value.edible.length + candidates.value.poisonous.length
  const unselectedCount = totalAvailable - totalSelected.value
  const unselectedNote = unselectedCount > 0
    ? ` Note: ${unselectedCount} unselected candidate image${unselectedCount !== 1 ? 's' : ''} (including duplicate copies) will remain in the queue unless permanently excluded.`
    : ''

  const ok = await confirm({
    title: 'Start AI Model Retraining?',
    message: `Train the model using ${edibleSelected.value.length} edible and ${poisonousSelected.value.length} poisonous scan images.${unselectedNote}`,
    tone: 'info',
    confirmText: 'Start Retrain',
  })
  if (!ok) return

  retrainState.value = 'running'
  statusError.value = null

  try {
    await $fetch(`${api}/admin/retrain`, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: {
        edible_ids: edibleSelected.value,
        poisonous_ids: poisonousSelected.value,
      },
    })
    await fetchStatus()
    startPolling()
  } catch (err: any) {
    retrainState.value = 'failed'
    statusError.value = err?.data?.message || String(err)
    await fetchStatus()
  }
}

function startPolling() {
  if (statusInterval) return
  statusInterval = setInterval(fetchStatus, 3000)
}

function stopPolling() {
  if (statusInterval) {
    clearInterval(statusInterval)
    statusInterval = null
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

onMounted(async () => {
  await refreshAll()
  if (pendingCount.value === 0 && summary.value.total > 0) {
    retrainSectionTab.value = 'verified'
  }
  if (retrainState.value === 'running') startPolling()
})

onUnmounted(() => {
  stopPolling()
  if (doneTimer) {
    clearTimeout(doneTimer)
    doneTimer = null
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.history-scroll-container {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: #94a3b8 #f1f5f9;
  -webkit-overflow-scrolling: touch;
}

/* Force visible, smooth custom horizontal scrollbar */
.history-scroll-container::-webkit-scrollbar {
  height: 9px;
  background-color: #f1f5f9;
}

.history-scroll-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 9999px;
  margin: 0 8px;
}

.history-scroll-container::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 9999px;
  border: 2px solid #f1f5f9;
}

.history-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>

