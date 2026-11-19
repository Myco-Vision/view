<template>
  <div class="flex flex-col gap-[18px]">

    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-2.5">
      <div>
        <h1 class="text-[22px] font-normal text-white">Welcome, <strong class="font-bold">{{ firstName }}!</strong></h1>
        <p class="text-[13px] text-emerald-300/80 mt-0.5">Your Mushroom Collection</p>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <button
          v-if="filtered.length"
          class="py-1.5 px-3.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-[12.5px] font-semibold cursor-pointer flex items-center gap-1.5 transition-all backdrop-blur-md"
          title="Export current collection log to PDF"
          @click="exportCollectionPdf"
        >
          <AppIcon name="file" class="w-3.5 h-3.5 text-emerald-400" />
          <span>Export Collection (PDF)</span>
        </button>
        <span class="text-[12.5px] font-medium bg-[#f8fafc] text-[#64748b] py-1 px-3.5 rounded-[20px] whitespace-nowrap shrink-0">{{ filtered.length }} mushrooms</span>
      </div>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="flex items-center gap-3.5 py-3.5 px-[18px] rounded-xl bg-white border border-[#e2e8f0] border-l-[3px] border-l-[#a78bfa]">
        <AppIcon name="mushroom" class="w-7 h-7 text-[#8b5cf6]" />
        <div class="min-w-0">
          <p class="text-[22px] font-bold text-[#0f172a] leading-none">{{ collection.length }}</p>
          <p class="text-[12px] text-[#64748b] mt-[3px] truncate whitespace-nowrap">Total Collected</p>
        </div>
      </div>
      <div class="flex items-center gap-3.5 py-3.5 px-[18px] rounded-xl bg-white border border-[#e2e8f0] border-l-[3px] border-l-[#22c55e]">
        <AppIcon name="check-circle" class="w-7 h-7 text-[#22c55e]" />
        <div>
          <p class="text-[22px] font-bold text-[#0f172a] leading-none">{{ edibleCount }}</p>
          <p class="text-[12px] text-[#64748b] mt-[3px]">Edible</p>
        </div>
      </div>
      <div class="flex items-center gap-3.5 py-3.5 px-[18px] rounded-xl bg-white border border-[#e2e8f0] border-l-[3px] border-l-[#ef4444]">
        <AppIcon name="skull" class="w-7 h-7 text-[#ef4444]" />
        <div>
          <p class="text-[22px] font-bold text-[#0f172a] leading-none">{{ poisonousCount }}</p>
          <p class="text-[12px] text-[#64748b] mt-[3px]">Poisonous</p>
        </div>
      </div>
      <div class="flex items-center gap-3.5 py-3.5 px-[18px] rounded-xl bg-white border border-[#e2e8f0] border-l-[3px] border-l-[#ec4899]">
        <AppIcon name="heart-solid" class="w-7 h-7 text-[#ec4899]" />
        <div>
          <p class="text-[22px] font-bold text-[#0f172a] leading-none">{{ favorites.length }}</p>
          <p class="text-[12px] text-[#64748b] mt-[3px]">Favorites Saved</p>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:flex-wrap">
      <!-- Search -->
      <div class="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-[10px] py-2 px-3.5 w-full sm:flex-1 sm:min-w-[180px]">
        <svg class="w-[15px] h-[15px] text-[#94a3b8] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input v-model="search" type="text" placeholder="Search mushrooms…" class="border-none outline-none font-sans text-[13.5px] text-[#0f172a] bg-transparent w-full placeholder:text-[#94a3b8]" />
      </div>

      <!-- Filter chips -->
      <div class="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full sm:w-auto">
        <button
          v-for="f in filters"
          :key="f.value"
          class="py-[7px] px-3.5 rounded-[20px] border text-[13px] font-sans cursor-pointer transition-all duration-[0.18s] font-medium whitespace-nowrap inline-flex items-center justify-center gap-1.5"
          :class="activeFilter === f.value ? 'bg-[#10b981] border-[#10b981] text-white' : 'bg-white border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]'"
          @click="activeFilter = f.value"
        ><AppIcon v-if="f.icon" :name="f.icon" class="w-3.5 h-3.5" :class="activeFilter === f.value ? 'text-white' : f.iconClass" />{{ f.label }}</button>
      </div>

      <!-- Sort -->
      <select v-model="sortBy" class="w-full sm:w-auto py-2 px-3.5 rounded-[10px] border border-[#e2e8f0] bg-white font-sans text-[13px] text-[#0f172a] cursor-pointer outline-none">
        <option value="date">Newest first</option>
        <option value="name">Name A–Z</option>
        <option value="confidence">Confidence ↓</option>
      </select>
    </div>

    <!-- Grid -->
    <div v-if="filtered.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      <div
        v-for="item in filtered"
        :key="item.id"
        class="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden transition-all duration-200 group hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)] hover:-translate-y-[2px]"
      >
        <!-- Image area -->
        <div class="relative h-[160px] overflow-hidden bg-[#e8f0e8]">
          <img :src="item.image" :alt="item.name" class="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-[1.04]" />
          <!-- classification ribbon -->
          <span
            class="absolute top-2.5 left-2.5 text-[11.5px] font-semibold py-[3px] px-2.5 rounded-[20px] backdrop-blur-[4px] inline-flex items-center gap-1"
            :class="item.classification === 'Edible' ? 'bg-[#dcfce7eb] text-[#166534]' : 'bg-[#fee2e2eb] text-[#991b1b]'"
          >
            <AppIcon :name="item.classification === 'Edible' ? 'check-circle' : 'skull'" class="w-3.5 h-3.5" />
            <span>{{ item.classification === 'Edible' ? 'Edible' : 'Poisonous' }}</span>
          </span>
          <!-- Heart Button -->
          <button 
            class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full border-none flex items-center justify-center cursor-pointer transition-transform duration-200 backdrop-blur-md z-10"
            :class="isFavorite(item.id) ? 'bg-[#fef2f2]/90 text-[#ef4444]' : 'bg-black/40 text-white hover:bg-black/60'"
            :title="isFavorite(item.id) ? 'Remove favorite' : 'Add to favorites'"
            @click.stop="toggleFavorite(item)"
          >
            <svg class="w-4 h-4" :fill="isFavorite(item.id) ? '#ef4444' : 'none'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <!-- hover overlay -->
          <div class="absolute inset-0 bg-black/45 flex items-center justify-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 p-2">
            <button 
              class="flex items-center gap-1.5 py-[7px] px-3 rounded-lg border-none text-[12px] font-semibold font-sans cursor-pointer bg-white text-[#0f172a] transition-colors duration-[0.18s] hover:bg-[#f0fdf4]" 
              title="View details"
              @click="openDetails(item)"
            >
              <svg class="w-[14px] h-[14px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              View
            </button>
            <button 
              class="flex items-center gap-1.5 py-[7px] px-3 rounded-lg border-none text-[12px] font-semibold font-sans cursor-pointer bg-emerald-600 text-white transition-colors duration-[0.18s] hover:bg-emerald-700 shadow-sm" 
              title="Export Mushroom Datasheet (PDF)"
              @click.stop="exportScanPdf(item)"
            >
              <svg class="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <polyline points="9 15 12 18 15 15"/>
              </svg>
              PDF
            </button>
            <button 
              class="flex items-center gap-1.5 py-[7px] px-2.5 rounded-lg border-none text-[12px] font-semibold font-sans cursor-pointer bg-[#fee2e2] text-[#991b1b] transition-colors duration-[0.18s] hover:bg-[#fecaca]" 
              title="Remove from collection"
              @click="deleteItem(item)"
            >
              <svg class="w-[14px] h-[14px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Card body -->
        <div class="p-3.5 pb-3 flex flex-col gap-2 cursor-pointer" @click="openDetails(item)">
          <p class="text-[13.5px] font-semibold text-[#0f172a] italic whitespace-nowrap overflow-hidden text-ellipsis">{{ item.name }}</p>

          <!-- Confidence bar -->
          <div class="flex items-center gap-2">
            <span class="text-[11px] text-[#64748b] min-w-[64px]">Confidence</span>
            <div class="flex-1 h-1.5 bg-[#e8f0e8] rounded-[10px] overflow-hidden">
              <div
                class="h-full rounded-[10px] transition-[width] duration-400 ease-in-out"
                :style="{ width: item.confidence + '%' }"
                :class="item.confidence >= 90 ? 'bg-[#22c55e]' : item.confidence >= 75 ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'"
              />
            </div>
            <span class="text-[12px] font-semibold text-[#0f172a] min-w-[32px] text-right">{{ item.confidence }}%</span>
          </div>

          <!-- Footer meta -->
          <div class="flex items-center justify-between pt-2 border-t border-[#f1f5f9] mt-1">
            <span class="inline-flex items-center gap-1 text-[11.5px] text-[#94a3b8] truncate max-w-[130px]">
              <AppIcon name="map-pin" class="w-3.5 h-3.5 shrink-0" />{{ item.location }}
            </span>
            <button
              class="py-1 px-2.5 rounded-lg border border-emerald-500/30 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11.5px] font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
              title="Export Mushroom Datasheet (PDF)"
              @click.stop="exportScanPdf(item)"
            >
              <svg class="w-3 h-3 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <polyline points="9 15 12 18 15 15"/>
              </svg>
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="flex-1 flex flex-col items-center justify-center gap-2.5 py-[60px] px-5 text-center bg-white border border-[#e2e8f0] rounded-[14px]">
      <AppIcon name="mushroom" class="w-12 h-12 text-[#10b981]" />
      <p class="text-[17px] font-semibold text-[#0f172a]">No mushrooms found</p>
      <p class="text-[13.5px] text-[#64748b]">Start scanning mushrooms and save them to your collection!</p>
      <NuxtLink to="/users/scan" class="mt-2 py-2.5 px-6 rounded-[10px] bg-[#10b981] text-white text-[14px] font-semibold no-underline transition-colors duration-[0.18s] hover:bg-[#059669]">Scan a Mushroom</NuxtLink>
    </div>

    <!-- Complete Detail Modal -->
    <Teleport to="body">
      <div v-if="showModal && selectedItem" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" @click.self="showModal = false">
        <div class="bg-white rounded-2xl w-[540px] max-w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#e2e8f0] animate-in fade-in zoom-in duration-200">
          
          <!-- Image Header -->
          <div class="relative h-[220px] bg-[#0f172a]">
            <img :src="selectedItem.image" :alt="selectedItem.name" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40 flex flex-col justify-between p-4 sm:p-5">
              <div class="flex items-center justify-end gap-2">
                <button 
                  class="py-1 px-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-[11.5px] sm:text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                  title="Export Mushroom Information (PDF)"
                  @click="exportScanPdf(selectedItem)"
                >
                  <svg class="w-3.5 h-3.5 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <polyline points="9 15 12 18 15 15"/>
                  </svg>
                  <span>Export PDF</span>
                </button>
                <button 
                  class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-base hover:bg-white/40 cursor-pointer"
                  @click="showModal = false"
                >✕</button>
              </div>
              <div>
                <span
                  class="text-[11px] sm:text-[11.5px] font-bold py-0.5 px-2.5 rounded-full mb-1.5 inline-flex items-center gap-1.5 backdrop-blur-md"
                  :class="selectedItem.classification === 'Edible' ? 'bg-[#dcfce7]/90 text-[#166534]' : 'bg-[#fee2e2]/90 text-[#991b1b]'"
                >
                  <AppIcon :name="selectedItem.classification === 'Edible' ? 'check-circle' : 'skull'" class="w-3.5 h-3.5" />
                  <span>{{ selectedItem.classification === 'Edible' ? 'Edible Species' : 'Poisonous Species' }}</span>
                </span>
                <h2 class="text-[18px] sm:text-[20px] font-bold text-white italic drop-shadow-md truncate">{{ selectedItem.name }}</h2>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-5 flex flex-col gap-4">
            <div class="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3.5 flex flex-col gap-2">
              <div class="flex items-center justify-between text-[13px]">
                <span class="font-semibold text-[#334155] inline-flex items-center gap-1.5"><AppIcon name="target" class="w-4 h-4 text-[#10b981]" />AI Confidence Score</span>
                <span class="font-bold text-[#10b981] text-[14px]">{{ selectedItem.confidence }}%</span>
              </div>
              <div class="w-full bg-[#e2e8f0] h-2.5 rounded-full overflow-hidden">
                <div class="bg-gradient-to-r from-[#10b981] to-[#059669] h-full rounded-full" :style="{ width: `${selectedItem.confidence}%` }"></div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-[#f8fafc] border border-[#f1f5f9] rounded-xl flex flex-col gap-1">
                <span class="text-[11.5px] font-semibold text-[#94a3b8] uppercase inline-flex items-center gap-1"><AppIcon name="calendar" class="w-3.5 h-3.5" />Collection Date</span>
                <span class="text-[13px] font-semibold text-[#0f172a]">{{ selectedItem.date }}</span>
              </div>
              <div class="p-3 bg-[#f8fafc] border border-[#f1f5f9] rounded-xl flex flex-col gap-1">
                <span class="text-[11.5px] font-semibold text-[#94a3b8] uppercase inline-flex items-center gap-1"><AppIcon name="map-pin" class="w-3.5 h-3.5" />Location</span>
                <span class="text-[13px] font-semibold text-[#0f172a] truncate">{{ selectedItem.location }}</span>
              </div>
            </div>

            <!-- Brief Information (Wikipedia Description, Habitat & Reference Link) -->
            <div class="flex flex-col gap-1.5 bg-[#f8fafc] p-3.5 rounded-xl border border-[#f1f5f9]">
              <span class="text-[12px] font-semibold text-[#475569] uppercase tracking-wider">Brief Information</span>
              <p class="text-[12.5px] text-[#0f172a] leading-[1.65] text-justify">
                <em class="italic underline font-semibold">{{ selectedItem.name }}</em>{{ selectedItem.descriptionRest }}
              </p>
              <p v-if="selectedItem.habitat" class="text-[12px] text-[#334155] leading-[1.5]">
                <strong class="text-[#0f172a]">Habitat:</strong> {{ selectedItem.habitat }}
              </p>
              <a :href="selectedItem.reference" target="_blank" rel="noopener noreferrer" class="text-[11px] text-[#059669] break-all no-underline leading-normal hover:underline">{{ selectedItem.reference }}</a>
            </div>

            <!-- PDF Export Quick Action Card inside modal -->
            <div class="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <polyline points="9 15 12 18 15 15"/>
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="text-[12.5px] font-bold text-emerald-950 truncate">Mushroom Information Datasheet</p>
                  <p class="text-[11px] text-emerald-700 truncate">Export printable specimen PDF with field data &amp; safety advice</p>
                </div>
              </div>
              <button 
                class="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold cursor-pointer transition-all shadow-sm shrink-0 flex items-center gap-1.5 active:scale-95"
                @click="exportScanPdf(selectedItem)"
              >
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-4 border-t border-[#f1f5f9] bg-[#f8fafc] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <button 
              class="w-full sm:w-auto justify-center py-2 px-4 rounded-xl border text-[13px] font-semibold cursor-pointer flex items-center gap-1.5"
              :class="isFavorite(selectedItem.id) ? 'bg-[#fef2f2] border-[#fecaca] text-[#ef4444]' : 'bg-white border-[#e2e8f0] text-[#475569] hover:text-[#ef4444]'"
              @click="toggleFavorite(selectedItem)"
            >
              <span class="inline-flex items-center gap-1.5">
                <AppIcon :name="isFavorite(selectedItem.id) ? 'heart-solid' : 'heart'" class="w-4 h-4" />
                {{ isFavorite(selectedItem.id) ? 'Favorite' : 'Add to Favorites' }}
              </span>
            </button>
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <button 
                class="w-full sm:w-auto justify-center py-2 px-4 rounded-xl border border-emerald-500/30 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[13px] font-semibold cursor-pointer flex items-center gap-1.5 transition-all shadow-sm"
                title="Export Mushroom Datasheet (PDF)"
                @click="exportScanPdf(selectedItem)"
              >
                <svg class="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/>
                  <polyline points="9 15 12 18 15 15"/>
                </svg>
                <span>Export PDF</span>
              </button>
              <button class="w-full sm:w-auto py-2 px-5 rounded-xl bg-[#0f172a] text-white text-[13px] font-semibold cursor-pointer hover:bg-[#334155] text-center" @click="showModal = false">
                Close
              </button>
            </div>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user', middleware: 'auth' })

const config = useRuntimeConfig()

// User info
const firstName = ref('Explorer')

// Filters & sort
const filters = [
  { label: 'All',       value: 'all',       icon: '',             iconClass: '' },
  { label: 'Edible',    value: 'Edible',    icon: 'check-circle', iconClass: 'text-[#16a34a]' },
  { label: 'Poisonous', value: 'Poisonous', icon: 'skull',        iconClass: 'text-[#dc2626]' },
  { label: 'Favorites', value: 'favorites', icon: 'heart-solid',  iconClass: 'text-[#ef4444]' },
]
const activeFilter = ref('all')
const search = ref('')
const sortBy = ref('date')

interface Mushroom {
  id: number;
  name: string;
  classification: string;
  confidence: number;
  location: string;
  date: string;
  image: string;
  notes?: string;
  descriptionRest: string;
  habitat: string;
  reference: string;
}

const collection = ref<Mushroom[]>([])
const favorites = ref<number[]>([])
const showModal = ref(false)
const selectedItem = ref<Mushroom | null>(null)

onMounted(async () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    const user = JSON.parse(storedUser)
    firstName.value = user.first_name || user.name?.split(' ')[0] || 'Explorer'
  }
  loadFavorites()
  fetchCollection()
})

function loadFavorites() {
  const stored = localStorage.getItem('myco_favorites')
  if (stored) {
    try {
      favorites.value = JSON.parse(stored)
    } catch (e) {
      favorites.value = []
    }
  }
}

function saveFavorites() {
  localStorage.setItem('myco_favorites', JSON.stringify(favorites.value))
}

function isFavorite(id: number): boolean {
  return favorites.value.includes(id)
}

function toggleFavorite(item: Mushroom) {
  const index = favorites.value.indexOf(item.id)
  if (index > -1) {
    favorites.value.splice(index, 1)
    // Remove from collection list since it's no longer a favorite
    collection.value = collection.value.filter(m => m.id !== item.id)
    if (selectedItem.value?.id === item.id) {
      showModal.value = false
    }
  } else {
    favorites.value.push(item.id)
  }
  saveFavorites()
}

function openDetails(item: Mushroom) {
  selectedItem.value = item
  showModal.value = true
}

async function fetchCollection() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return

    const data = await $fetch<any[]>(`${config.public.apiBase}/scans`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    // ONLY include mushrooms that have been added to favorites
    collection.value = data
      .filter(scan => isFavorite(scan.id))
      .map(scan => {
        const brief = resolveSpeciesBrief(scan)
        return {
          id: scan.id,
          name: brief.name,
          classification: brief.classification,
          confidence: brief.confidence,
          location: scan.location_name || (scan.latitude && scan.longitude ? `${scan.latitude}, ${scan.longitude}` : 'Unknown Location'),
          date: new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          image: scan.image_url || (scan.image_path ? `${config.public.apiBase.replace(/\/api$/, '')}/storage/${scan.image_path}` : 'https://placehold.co/400x400/e8f0e8/a3a3a3?text=No+Image'),
          notes: scan.notes,
          descriptionRest: brief.descriptionRest,
          habitat: brief.habitat,
          reference: brief.reference,
        }
      })
  } catch (error) {
    console.error('Failed to fetch collection:', error)
  }
}

async function deleteItem(item: Mushroom) {
  const { confirm } = useConfirm()
  const toast = useToast()
  const ok = await confirm({
    title: 'Remove from collection?',
    message: `"${item.name}" will be permanently deleted, including its scan record.`,
    tone: 'danger',
    confirmText: 'Remove',
  })
  if (!ok) return
  try {
    const token = localStorage.getItem('token')
    await $fetch(`${config.public.apiBase}/scans/${item.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    collection.value = collection.value.filter(m => m.id !== item.id)
    toast.success('Removed from your collection.')
  } catch (error) {
    toast.error('Failed to delete item.')
  }
}

// Computed
const edibleCount    = computed(() => collection.value.filter(m => m.classification === 'Edible').length)
const poisonousCount = computed(() => collection.value.filter(m => m.classification === 'Poisonous').length)

const filtered = computed(() => {
  let list = collection.value.filter(m => {
    let matchFilter = true
    if (activeFilter.value === 'favorites') {
      matchFilter = isFavorite(m.id)
    } else if (activeFilter.value !== 'all') {
      matchFilter = m.classification === activeFilter.value
    }
    const matchSearch = m.name.toLowerCase().includes(search.value.toLowerCase())
    return matchFilter && matchSearch
  })

  return list.sort((a, b) => {
    if (sortBy.value === 'name') return a.name.localeCompare(b.name)
    if (sortBy.value === 'confidence') return b.confidence - a.confidence
    return b.id - a.id
  })
})

// ── PDF Export Utilities ──────────────────────────────
function esc(s: any): string {
  if (s == null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const PRINT_MUSHROOM_SVG = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="color: #059669; display: inline-block; vertical-align: middle;"><path d="M12 2C7.03 2 3 6.03 3 11c0 1.25.26 2.44.73 3.52C4.1 15.35 4.8 16 5.6 16h12.8c.8 0 1.5-.65 1.87-1.48.47-1.08.73-2.27.73-3.52 0-4.97-4.03-9-9-9zm-1.5 15h3v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-5z"/></svg>'

function exportScanPdf(item: Mushroom | null) {
  if (!item) return
  const printWindow = window.open('', '_blank', 'width=880,height=960')
  if (!printWindow) {
    alert('Please allow popups to export the mushroom PDF report.')
    return
  }

  const cls = (item.classification || '').toLowerCase()
  const isEdible = cls === 'edible'
  const isPoisonous = cls === 'poisonous'
  const badgeBg = isEdible ? '#dcfce7' : (isPoisonous ? '#fee2e2' : '#fef3c7')
  const badgeColor = isEdible ? '#166534' : (isPoisonous ? '#991b1b' : '#92400e')
  const badgeBorder = isEdible ? '#bbf7d0' : (isPoisonous ? '#fecaca' : '#fde68a')

  const descriptionFull = `${item.name}${item.descriptionRest || ''}`

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${esc(item.name)} - MycoVision Forager Observation Report</title>
  <style>
    @page { size: A4; margin: 15mm; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0; padding: 24px; color: #0f172a; background: #ffffff; line-height: 1.5; font-size: 13px;
    }
    .header {
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-bottom: 20px;
    }
    .brand {
      display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 800; color: #065f46; letter-spacing: -0.5px;
    }
    .brand-tag { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #059669; letter-spacing: 1px; }
    .doc-meta { text-align: right; font-size: 11px; color: #64748b; }
    .doc-meta strong { color: #0f172a; }
    
    .title-banner {
      background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
      border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px 20px; margin-bottom: 20px;
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
    }
    .species-title { font-size: 24px; font-weight: 800; color: #064e3b; margin: 0; font-style: italic; }
    .species-subtitle { font-size: 12.5px; color: #047857; margin-top: 3px; font-weight: 500; }
    
    .badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: 20px; font-size: 12.5px; font-weight: 700;
      background: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeBorder};
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    
    .confidence-meter {
      background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 14px;
      display: inline-flex; align-items: center; gap: 8px; margin-top: 8px;
    }
    .confidence-val { font-size: 15px; font-weight: 800; color: #059669; }
    
    .content-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;
    }
    .card {
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px;
    }
    .card-title {
      font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;
      color: #475569; margin: 0 0 10px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;
    }
    .info-row { display: flex; justify-content: space-between; margin-bottom: 7px; font-size: 12.5px; }
    .info-label { color: #64748b; font-weight: 500; }
    .info-val { color: #0f172a; font-weight: 600; text-align: right; max-width: 65%; word-break: break-word; }
    
    .photo-section {
      text-align: center; margin-bottom: 20px;
    }
    .photo-box {
      display: inline-block; max-width: 100%; border: 1px solid #cbd5e1; border-radius: 12px;
      overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); background: #f1f5f9;
    }
    .photo-box img {
      max-height: 260px; max-width: 100%; width: auto; height: auto; object-fit: contain; display: block;
    }
    .photo-caption { font-size: 11px; color: #64748b; margin-top: 6px; font-style: italic; }
    
    .section-box {
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; margin-bottom: 16px;
    }
    .section-title {
      font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;
      color: #334155; margin: 0 0 8px 0;
    }
    .desc-p { margin: 0 0 8px 0; font-size: 12.5px; line-height: 1.6; color: #334155; text-align: justify; }
    
    .disclaimer-box {
      background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 10px; padding: 12px 14px;
      margin-top: 20px; font-size: 11px; line-height: 1.5; color: #92400e;
    }
    .disclaimer-box strong { color: #78350f; font-weight: 700; }
    
    .footer {
      border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 24px;
      display: flex; justify-content: space-between; font-size: 10.5px; color: #94a3b8;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <!-- Top Action Bar (Hidden during print) -->
  <div class="no-print" style="position: sticky; top: 0; z-index: 100; background: #0f172a; color: white; padding: 12px 24px; margin: -24px -24px 20px -24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-weight: 700; font-size: 14px;">MycoVision Mushroom Information Datasheet</span>
      <span style="font-size: 11px; background: rgba(16,185,129,0.2); color: #34d399; padding: 2px 8px; border-radius: 12px; font-weight: 600;">Specimen #COL-${esc(item.id)}</span>
    </div>
    <div style="display: flex; gap: 8px;">
      <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 7px 16px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer;">
        Save as PDF / Print
      </button>
      <button onclick="window.close()" style="background: rgba(255,255,255,0.1); color: #cbd5e1; border: 1px solid rgba(255,255,255,0.2); padding: 7px 14px; border-radius: 8px; font-size: 12px; cursor: pointer;">
        Close
      </button>
    </div>
  </div>

  <div class="header">
    <div>
      <div class="brand">${PRINT_MUSHROOM_SVG} MycoVision</div>
      <div class="brand-tag">Wild Mushroom Intelligence &amp; Forager Biosafety</div>
    </div>
    <div class="doc-meta">
      <div>Collection ID: <strong>#COL-${esc(item.id)}</strong></div>
      <div>Printed: <strong>${esc(new Date().toLocaleString())}</strong></div>
    </div>
  </div>

  <div class="title-banner">
    <div>
      <h1 class="species-title">${esc(item.name)}</h1>
      <div class="species-subtitle">Specimen Record • Forager Saved Collection</div>
      <div class="confidence-meter">
        <span style="font-size: 12px; color: #64748b; font-weight: 600;">AI Confidence:</span>
        <span class="confidence-val">${esc(item.confidence)}%</span>
      </div>
    </div>
    <div>
      <div class="badge">${esc(item.classification)}</div>
    </div>
  </div>

  <div class="content-grid">
    <div class="card">
      <div class="card-title">Observation Details</div>
      <div class="info-row"><span class="info-label">Discovery Date:</span><span class="info-val">${esc(item.date)}</span></div>
      <div class="info-row"><span class="info-label">Field Location:</span><span class="info-val">${esc(item.location || 'Unknown Coordinates')}</span></div>
      <div class="info-row"><span class="info-label">Identification Model:</span><span class="info-val">MycoVision Two-Stage Vision</span></div>
      <div class="info-row"><span class="info-label">Collection Status:</span><span class="info-val">Saved in Forager Favorites</span></div>
    </div>

    <div class="card">
      <div class="card-title">Botanical &amp; Field Context</div>
      <div class="info-row"><span class="info-label">Classification:</span><span class="info-val">${esc(item.classification)}</span></div>
      <div class="info-row"><span class="info-label">Habitat:</span><span class="info-val">${esc(item.habitat || 'Forest floor / Decaying timber')}</span></div>
      ${item.notes ? `<div class="info-row"><span class="info-label">Field Notes:</span><span class="info-val">${esc(item.notes)}</span></div>` : ''}
    </div>
  </div>

  ${item.image ? `
  <div class="photo-section">
    <div class="photo-box">
      <img src="${esc(item.image)}" alt="${esc(item.name)}" />
    </div>
    <div class="photo-caption">Field photograph captured by forager during AI identification scan</div>
  </div>
  ` : ''}

  <div class="section-box">
    <div class="section-title">Species Description &amp; Taxonomic Information</div>
    <p class="desc-p">${esc(descriptionFull || 'Detailed characteristics logged via MycoVision botanical database.')}</p>
    ${item.reference ? `<p style="font-size: 11px; margin: 4px 0 0 0; color: #059669; word-break: break-all;">Reference Source: ${esc(item.reference)}</p>` : ''}
  </div>

  <div class="disclaimer-box">
    <strong>⚠️ FORAGER BIOSAFETY NOTICE:</strong> This identification report is generated through computer vision and machine learning models for educational, research, and informational reference only. Fungal morphology in tropical climates displays notable phenotypic plasticity. Never harvest or ingest wild mushrooms without positive in-person confirmation from a certified mycologist.
  </div>

  <div class="footer">
    <span>MycoVision Field Biosafety Platform • https://mycovision.app</span>
    <span>Page 1 of 1</span>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  <\/script>
</body>
</html>`

  printWindow.document.write(html)
  printWindow.document.close()
}

function exportCollectionPdf() {
  if (!filtered.value.length) return
  const printWindow = window.open('', '_blank', 'width=900,height=960')
  if (!printWindow) {
    alert('Please allow popups to export the collection PDF.')
    return
  }

  const edibleCount = filtered.value.filter(s => s.classification === 'Edible').length
  const poisonousCount = filtered.value.filter(s => s.classification === 'Poisonous').length
  const otherCount = filtered.value.length - edibleCount - poisonousCount

  const rowsHtml = filtered.value.map((s, idx) => {
    const isEd = s.classification === 'Edible'
    const isPo = s.classification === 'Poisonous'
    const color = isEd ? '#166534' : (isPo ? '#991b1b' : '#92400e')
    const bg = isEd ? '#dcfce7' : (isPo ? '#fee2e2' : '#fef3c7')
    return `
      <tr style="border-bottom: 1px solid #e2e8f0; font-size: 12px;">
        <td style="padding: 10px 8px; text-align: center; color: #64748b;">${idx + 1}</td>
        <td style="padding: 10px 8px; text-align: center;">
          <img src="${esc(s.image)}" style="width: 46px; height: 46px; object-fit: cover; border-radius: 8px; border: 1px solid #cbd5e1;" />
        </td>
        <td style="padding: 10px 8px; font-weight: 700; color: #0f172a; font-style: italic;">
          ${esc(s.name)}
        </td>
        <td style="padding: 10px 8px; text-align: center;">
          <span style="display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; background: ${bg}; color: ${color};">
            ${esc(s.classification)}
          </span>
        </td>
        <td style="padding: 10px 8px; text-align: center; font-weight: 700; color: #059669;">
          ${esc(s.confidence)}%
        </td>
        <td style="padding: 10px 8px; color: #475569; font-size: 11.5px;">
          ${esc(s.location || 'Unknown')}
        </td>
        <td style="padding: 10px 8px; color: #64748b; font-size: 11.5px; white-space: nowrap;">
          ${esc(s.date)}
        </td>
      </tr>
    `
  }).join('')

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>MycoVision - Forager Saved Mushroom Collection</title>
  <style>
    @page { size: A4 landscape; margin: 12mm; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0; padding: 20px; color: #0f172a; background: #ffffff; line-height: 1.4;
    }
    .header {
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-bottom: 16px;
    }
    .brand { font-size: 20px; font-weight: 800; color: #065f46; display: flex; align-items: center; gap: 8px; }
    .stats-row {
      display: flex; gap: 12px; margin-bottom: 16px;
    }
    .stat-chip {
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 14px; font-size: 12px;
    }
    .stat-chip strong { color: #0f172a; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th {
      background: #f1f5f9; color: #334155; font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px;
      padding: 9px 8px; text-align: left; border-bottom: 2px solid #cbd5e1;
    }
    .footer {
      border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 20px;
      display: flex; justify-content: space-between; font-size: 10.5px; color: #94a3b8;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <!-- Top Action Bar (Hidden during print) -->
  <div class="no-print" style="position: sticky; top: 0; z-index: 100; background: #0f172a; color: white; padding: 12px 24px; margin: -20px -20px 20px -20px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-weight: 700; font-size: 14px;">MycoVision Forager Saved Collection Log</span>
      <span style="font-size: 11px; background: rgba(16,185,129,0.2); color: #34d399; padding: 2px 8px; border-radius: 12px; font-weight: 600;">${filtered.value.length} Total Saved Specimens</span>
    </div>
    <div style="display: flex; gap: 8px;">
      <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 7px 16px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer;">
        Save as PDF / Print
      </button>
      <button onclick="window.close()" style="background: rgba(255,255,255,0.1); color: #cbd5e1; border: 1px solid rgba(255,255,255,0.2); padding: 7px 14px; border-radius: 8px; font-size: 12px; cursor: pointer;">
        Close
      </button>
    </div>
  </div>

  <div class="header">
    <div>
      <div class="brand">${PRINT_MUSHROOM_SVG} MycoVision</div>
      <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #059669; letter-spacing: 1px;">Forager Saved Collection Log</div>
    </div>
    <div style="text-align: right; font-size: 11px; color: #64748b;">
      <div>Filter: <strong>${esc(activeFilter.value === 'all' ? 'All Records' : activeFilter.value)}</strong></div>
      <div>Generated: <strong>${esc(new Date().toLocaleString())}</strong></div>
    </div>
  </div>

  <div class="stats-row">
    <div class="stat-chip">Total Specimens: <strong>${filtered.value.length}</strong></div>
    <div class="stat-chip">Edible Species: <strong style="color: #166534;">${edibleCount}</strong></div>
    <div class="stat-chip">Poisonous Species: <strong style="color: #991b1b;">${poisonousCount}</strong></div>
    ${otherCount > 0 ? `<div class="stat-chip">Other: <strong>${otherCount}</strong></div>` : ''}
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 35px; text-align: center;">#</th>
        <th style="width: 60px; text-align: center;">Photo</th>
        <th>Species Name</th>
        <th style="text-align: center;">Classification</th>
        <th style="text-align: center;">Match %</th>
        <th>Field Location</th>
        <th>Collection Date</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="footer">
    <span>MycoVision Field Biosafety Platform • Generated by Forager Portal</span>
    <span>Total Specimens Logged: ${filtered.value.length}</span>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  <\/script>
</body>
</html>`

  printWindow.document.write(html)
  printWindow.document.close()
}
</script>
