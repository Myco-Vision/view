<template>
  <div class="flex flex-col gap-[22px]">
    <!-- Action bar -->
    <div class="bg-white border border-[#e2e8f0] rounded-[14px] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-[15px] font-bold text-[#0f172a]">AI Model Retraining</h2>
        <p class="text-[12.5px] text-[#64748b] mt-0.5">
          Improve the mushroom classifier using consented scan images from foragers.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
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
      <div
        v-if="retrainState !== 'idle'"
        class="rounded-[14px] border px-5 py-4 flex items-start gap-4"
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
          <p v-if="lastResult" class="text-[12.5px] text-[#64748b]">
            Train accuracy: <strong>{{ lastResult.train_accuracy }}%</strong> ·
            Val accuracy: <strong>{{ lastResult.val_accuracy }}%</strong> ·
            {{ lastResult.total_images }} images used
            ({{ lastResult.total_edible }} edible, {{ lastResult.total_poisonous }} poisonous)
          </p>
          <p v-if="statusError" class="text-[12.5px] text-[#ef4444] font-mono">{{ statusError }}</p>
        </div>
      </div>

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
            class="flex-1 sm:flex-initial py-1.5 px-3.5 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white text-[12px] font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-xs"
            @click="autoDeselectDuplicates"
          >
            <AppIcon name="sparkles" class="w-3.5 h-3.5" />
            <span>Auto-Deselect Copies</span>
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
            <div class="flex gap-2">
              <button class="text-[12px] font-semibold hover:underline cursor-pointer" :class="panel.selectBtnClass" @click="selectAll(panel.cls)">Select All</button>
              <span class="text-[#cbd5e1]">|</span>
              <button class="text-[12px] font-semibold text-[#64748b] hover:underline cursor-pointer" @click="deselectAll(panel.cls)">Clear</button>
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
              <!-- Duplicate badge pill -->
              <div
                v-if="hasScannedDuplicates && duplicateScanMap[scan.id]"
                class="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 rounded-md text-[10px] font-bold shadow-xs flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                :class="duplicateScanMap[scan.id].has_conflict
                  ? 'bg-rose-600 text-white animate-pulse'
                  : duplicateScanMap[scan.id].is_primary
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 text-white'"
                :title="duplicateScanMap[scan.id].has_conflict ? 'Conflicting label duplicate! Click to review' : duplicateScanMap[scan.id].is_primary ? 'Original image' : 'Duplicate copy — unselected'"
                @click.stop="openDuplicatesModal(duplicateScanMap[scan.id].group_id)"
              >
                <span>{{ duplicateScanMap[scan.id].has_conflict ? '⚠️ Conflict' : duplicateScanMap[scan.id].is_primary ? '★ Primary' : 'Duplicate' }}</span>
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

      <!-- Retrain History -->
      <div class="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
        <div class="px-5 py-3.5 border-b border-[#f1f5f9]">
          <h3 class="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
            <AppIcon name="clipboard" class="w-4 h-4 text-[#64748b]" />
            <span>Retraining History</span>
          </h3>
        </div>

        <div v-if="history.length === 0" class="py-10 text-center">
          <p class="text-[13px] text-[#94a3b8]">No retraining runs yet.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[680px] text-[13px]">
            <thead class="bg-[#f8fafc]">
              <tr>
                <th class="text-left px-5 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide">Date</th>
                <th class="text-left px-4 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide">Status</th>
                <th class="text-left px-4 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide"><span class="inline-flex items-center gap-1"><AppIcon name="check-circle" class="w-3.5 h-3.5 text-[#059669]" />Edible</span></th>
                <th class="text-left px-4 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide"><span class="inline-flex items-center gap-1"><AppIcon name="skull" class="w-3.5 h-3.5 text-[#dc2626]" />Poisonous</span></th>
                <th class="text-left px-4 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide">Train Acc.</th>
                <th class="text-left px-4 py-3 text-[11.5px] font-semibold text-[#64748b] uppercase tracking-wide">Val Acc.</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(run, i) in history"
                :key="run.id ?? i"
                class="border-t border-[#f1f5f9] hover:bg-[#f8fafc]"
              >
                <td class="px-5 py-3 text-[#334155]">{{ formatDate(run.started_at) }}</td>
                <td class="px-4 py-3">
                  <span
                    class="text-[11.5px] font-semibold px-2.5 py-1 rounded-full"
                    :class="{
                      'bg-[#d1fae5] text-[#065f46]': run.status === 'done',
                      'bg-[#fee2e2] text-[#991b1b]': run.status === 'failed',
                      'bg-[#fef9c3] text-[#713f12]': run.status === 'running',
                    }"
                  >{{ run.status }}</span>
                  <p v-if="run.status === 'failed' && run.error" class="text-[11px] text-[#dc2626] mt-1 max-w-[260px] truncate" :title="run.error">
                    {{ run.error }}
                  </p>
                </td>
                <td class="px-4 py-3 text-[#334155]">{{ run.total_edible ?? run.new_edible ?? '—' }}</td>
                <td class="px-4 py-3 text-[#334155]">{{ run.total_poisonous ?? run.new_poisonous ?? '—' }}</td>
                <td class="px-4 py-3 font-semibold text-[#0f172a]">{{ run.train_accuracy != null ? run.train_accuracy + '%' : '—' }}</td>
                <td class="px-4 py-3 font-semibold text-[#0f172a]">{{ run.val_accuracy != null ? run.val_accuracy + '%' : '—' }}</td>
              </tr>
            </tbody>
          </table>
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
                class="py-1.5 px-3 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white text-[12px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                @click="autoDeselectDuplicates"
              >
                <AppIcon name="sparkles" class="w-3.5 h-3.5" />
                <span>Auto-Deselect Copies</span>
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
                    Set #{{ group.group_id.slice(-6) }}
                  </span>
                  <span class="text-[11.5px] text-[#64748b]">({{ group.total_count }} identical photos)</span>
                  <span
                    v-if="group.match_types.includes('exact_md5')"
                    class="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-[#e0f2fe] text-[#0369a1]"
                  >
                    Exact MD5
                  </span>
                  <span
                    v-else
                    class="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-[#f3e8ff] text-[#7e22ce]"
                  >
                    dHash Distance ≤ 5
                  </span>
                  <span
                    v-if="group.has_conflict"
                    class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white animate-pulse"
                  >
                    ⚠️ LABEL CONFLICT ({{ group.classifications.join(' vs ') }})
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="px-2.5 py-1 text-[11.5px] font-semibold rounded-md border border-[#fed7aa] bg-[#fff7ed] hover:bg-[#ffedd5] text-[#c2410c] cursor-pointer transition-colors"
                    title="Keep the original primary scan selected and uncheck all duplicate copies"
                    @click="keepOnlyPrimaryInGroup(group)"
                  >
                    Keep 1 Only
                  </button>
                  <button
                    type="button"
                    class="px-2.5 py-1 text-[11.5px] font-semibold rounded-md border border-[#cbd5e1] bg-white hover:bg-[#f1f5f9] text-[#475569] cursor-pointer transition-colors disabled:opacity-50"
                    :disabled="excludingDuplicates"
                    title="Archive non-primary duplicate images so they will not be used in future training runs"
                    @click="excludeScanIds(group.scans.filter(s => !s.is_primary).map(s => s.id))"
                  >
                    Archive Copies
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

                    <label class="flex items-center gap-1.5 pt-1 border-t border-[#f1f5f9] cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        class="rounded text-[#ea580c] focus:ring-orange-500 w-3.5 h-3.5"
                        :checked="isScanSelected(scan.id, scan.classification)"
                        @change="toggleScanInRetrain(scan.id, scan.classification)"
                      />
                      <span class="text-[10.5px] font-semibold" :class="isScanSelected(scan.id, scan.classification) ? 'text-[#0f172a]' : 'text-[#94a3b8]'">
                        {{ isScanSelected(scan.id, scan.classification) ? 'Included' : 'Excluded' }}
                      </span>
                    </label>
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
    </template>
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
  is_primary: boolean
  match_type: 'exact_md5' | 'near_duplicate_dhash'
  hamming_distance: number
}

interface DuplicateGroup {
  group_id: string
  representative_id: number
  total_count: number
  has_conflict: boolean
  classifications: string[]
  match_types: string[]
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
let statusInterval: ReturnType<typeof setInterval> | null = null

watch(() => summary.value.total, n => emit('update:count', n), { immediate: true })
watch(retrainState, s => emit('update:state', s), { immediate: true })

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

    if (current.state === 'done' || current.state === 'failed') {
      stopPolling()
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
    return duplicateGroups.value.filter(g => g.match_types.includes('exact_md5'))
  }
  if (duplicateFilter.value === 'near') {
    return duplicateGroups.value.filter(g => g.match_types.includes('near_duplicate_dhash'))
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

function keepOnlyPrimaryInGroup(group: DuplicateGroup) {
  for (const scan of group.scans) {
    if (scan.is_primary) {
      if (!isScanSelected(scan.id, scan.classification)) {
        toggleScanInRetrain(scan.id, scan.classification)
      }
    } else {
      if (isScanSelected(scan.id, scan.classification)) {
        toggleScanInRetrain(scan.id, scan.classification)
      }
    }
  }
  toastSuccess(`Kept primary scan #${group.representative_id} and unselected duplicate copies.`)
}

function autoDeselectDuplicates() {
  const unselectSet = new Set(recommendedUnselectIds.value)
  const initialCount = edibleSelected.value.length + poisonousSelected.value.length

  edibleSelected.value = edibleSelected.value.filter(id => !unselectSet.has(id))
  poisonousSelected.value = poisonousSelected.value.filter(id => !unselectSet.has(id))

  const deselected = initialCount - (edibleSelected.value.length + poisonousSelected.value.length)
  toastSuccess(`Deselected ${deselected} redundant duplicate images from the retraining queue.`)
}

async function excludeScanIds(ids: number[]) {
  if (!ids || ids.length === 0) return
  const ok = await confirm({
    title: 'Archive Duplicate Images?',
    message: `Mark ${ids.length} duplicate image${ids.length !== 1 ? 's' : ''} as archived so they will not be used in future model training? (Original photos will not be deleted from scans).`,
    tone: 'warning',
    confirmText: 'Archive Duplicates',
  })
  if (!ok) return

  excludingDuplicates.value = true
  try {
    const res = await $fetch<any>(`${api}/admin/retrain/exclude`, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: { scan_ids: ids },
    })
    toastSuccess(res?.message || 'Duplicates archived successfully.')
    await refreshAll()
  } catch (err: any) {
    toastError(err?.data?.message || 'Failed to archive duplicates.')
  } finally {
    excludingDuplicates.value = false
  }
}

watch(queueView, () => {
  // Do NOT auto-scan when switching queue tabs; reset state so user triggers manually if desired
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

async function refreshAll() {
  await Promise.all([fetchCandidates(), fetchStatus()])
}

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
  const ok = await confirm({
    title: 'Start AI Model Retraining?',
    message: `Train the model using ${edibleSelected.value.length} edible and ${poisonousSelected.value.length} poisonous scan images.`,
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
  if (retrainState.value === 'running') startPolling()
})

onUnmounted(() => stopPolling())
</script>

