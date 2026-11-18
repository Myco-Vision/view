<template>
  <div class="flex flex-col gap-6 max-w-6xl mx-auto pb-12">

    <!-- ── 1. HERO / WELCOME BANNER ────────────────────────────────────────── -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-[#071912] border border-emerald-500/25 p-5 sm:p-7 shadow-xl">
      <!-- Glow ambient decorative orbs -->
      <div class="absolute -top-16 -right-16 w-52 h-52 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute -bottom-16 left-1/3 w-40 h-40 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <!-- Text greetings -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2.5 flex-wrap mb-1.5">
            <span class="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Forager Portal
            </span>
            <span
              v-if="isSubscribed"
              class="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1"
            >
              ★ Pro Pass
            </span>
            <span
              v-else
              class="text-xs uppercase font-medium tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/15"
            >
              Free Plan ({{ remainingScans ?? 3 }}/3 scans left)
            </span>
          </div>

          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl overflow-hidden shadow-md shrink-0 hidden sm:flex items-center justify-center bg-emerald-950/60 border border-emerald-500/30">
              <img src="/myco-logo.png" alt="MycoVision Logo" class="w-full h-full object-contain" />
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, <span class="text-emerald-400">{{ firstName }}</span>! 🍄
              </h1>
              <p class="text-sm sm:text-[14.5px] text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Track your mushroom discoveries, monitor your field sightings, and explore Philippine fungal biodiversity with AI identification.
              </p>
            </div>
          </div>
        </div>

        <!-- Action CTAs -->
        <div class="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
          <NuxtLink
            to="/users/scan"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 transition-all duration-200 no-underline cursor-pointer active:scale-[0.98]"
          >
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <span>Scan Mushroom</span>
          </NuxtLink>

          <NuxtLink
            to="/users/map"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm border border-white/15 transition-colors no-underline cursor-pointer"
          >
            <svg class="w-4 h-4 text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
              <line x1="8" y1="2" x2="8" y2="18"/>
              <line x1="16" y1="6" x2="16" y2="22"/>
            </svg>
            <span>View Map</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- ── 2. QUICK METRIC STATS ──────────────────────────────────────────── -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      <!-- Total Scans -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Scans</span>
          <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
        </div>
        <div>
          <p class="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            <span v-if="loadingStats" class="text-slate-300">...</span>
            <span v-else>{{ stats.totalScans }}</span>
          </p>
          <p class="text-xs text-slate-500 mt-0.5">Recorded in field logs</p>
        </div>
      </div>

      <!-- Unique Species -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Species Found</span>
          <div class="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>
          </div>
        </div>
        <div>
          <p class="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            <span v-if="loadingStats" class="text-slate-300">...</span>
            <span v-else>{{ stats.uniqueSpecies }}</span>
          </p>
          <p class="text-xs text-slate-500 mt-0.5">Distinct varieties classified</p>
        </div>
      </div>

      <!-- Edible Species -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Edible Found</span>
          <div class="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
        </div>
        <div>
          <p class="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            <span v-if="loadingStats" class="text-slate-300">...</span>
            <span v-else>{{ stats.edibleCount }}</span>
          </p>
          <p class="text-xs text-slate-500 mt-0.5">Safe culinary specimens</p>
        </div>
      </div>

      <!-- Reward Points -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Forager Points</span>
          <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
        </div>
        <div>
          <p class="text-2xl sm:text-3xl font-extrabold text-amber-600 leading-tight">
            <span v-if="loadingStats" class="text-slate-300">...</span>
            <span v-else>{{ rewardPoints }}</span>
          </p>
          <p class="text-xs text-slate-500 mt-0.5">
            <NuxtLink to="/users/rewards" class="text-emerald-600 font-semibold hover:underline">
              Redeem perks →
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>

    <!-- ── 3. QUICK NAVIGATION SHORTCUTS ──────────────────────────────────── -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      <NuxtLink
        to="/users/scan"
        class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-start gap-3 no-underline group hover:border-emerald-400 hover:shadow-md transition-all duration-200"
      >
        <div class="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
        <div>
          <p class="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">Camera Scanner</p>
          <p class="text-xs text-slate-500 mt-0.5 line-clamp-1">AI instant identifier</p>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/mycodex"
        class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-start gap-3 no-underline group hover:border-teal-400 hover:shadow-md transition-all duration-200"
      >
        <div class="w-10 h-10 rounded-xl bg-teal-100/70 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>
        <div>
          <p class="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">MycoDex Library</p>
          <p class="text-xs text-slate-500 mt-0.5 line-clamp-1">Species encyclopedia</p>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/users/map"
        class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-start gap-3 no-underline group hover:border-blue-400 hover:shadow-md transition-all duration-200"
      >
        <div class="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
            <line x1="8" y1="2" x2="8" y2="18"/>
            <line x1="16" y1="6" x2="16" y2="22"/>
          </svg>
        </div>
        <div>
          <p class="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Foraging Map</p>
          <p class="text-xs text-slate-500 mt-0.5 line-clamp-1">GPS sighting pins</p>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/users/rewards"
        class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-start gap-3 no-underline group hover:border-amber-400 hover:shadow-md transition-all duration-200"
      >
        <div class="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <div>
          <p class="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">Rewards Shop</p>
          <p class="text-xs text-slate-500 mt-0.5 line-clamp-1">Perks & badge rewards</p>
        </div>
      </NuxtLink>
    </div>

    <!-- ── 4. RECENT SCANS SECTION ────────────────────────────────────────── -->
    <div class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 class="text-base sm:text-lg font-bold text-slate-900">Recent Discoveries</h2>
          <p class="text-xs text-slate-500">Your latest field mushroom scans and AI classifications</p>
        </div>
        <NuxtLink
          to="/users/history"
          class="text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 no-underline inline-flex items-center gap-1"
        >
          <span>View all scans ({{ stats.totalScans }})</span>
          <span>→</span>
        </NuxtLink>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loadingScans" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="border border-slate-100 rounded-xl p-3 animate-pulse flex flex-col gap-2.5">
          <div class="h-32 bg-slate-200 rounded-lg"></div>
          <div class="h-4 bg-slate-200 rounded w-3/4"></div>
          <div class="h-3 bg-slate-100 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="recentScans.length === 0"
        class="py-12 px-4 text-center flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/60"
      >
        <div class="w-14 h-14 rounded-2xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center mb-3">
          <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
        <p class="text-base font-bold text-slate-800">No scans recorded yet</p>
        <p class="text-xs text-slate-500 max-w-sm mt-1 mb-4">
          Head out on a trail or snap a mushroom in your garden to start building your personal field collection.
        </p>
        <NuxtLink
          to="/users/scan"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-sm hover:bg-emerald-700 transition-colors no-underline"
        >
          Take First Scan
        </NuxtLink>
      </div>

      <!-- Recent Scans Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="scan in recentScans"
          :key="scan.id"
          @click="openScanDetails(scan)"
          class="border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-emerald-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col group"
        >
          <!-- Image -->
          <div class="relative h-36 bg-slate-100 overflow-hidden">
            <img
              :src="scan.image"
              :alt="scan.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <!-- Toxicity badge -->
            <span
              class="absolute top-2 left-2 text-[10.5px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md shadow-sm"
              :class="scan.classification === 'Edible' ? 'bg-emerald-500/90 text-white' : (scan.classification === 'Poisonous' ? 'bg-red-500/90 text-white' : 'bg-amber-500/90 text-white')"
            >
              {{ scan.classification }}
            </span>
            <!-- Confidence badge -->
            <span class="absolute bottom-2 right-2 text-[10.5px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm">
              {{ scan.confidence }}% Match
            </span>
          </div>

          <!-- Content -->
          <div class="p-3.5 flex-1 flex flex-col justify-between">
            <div>
              <p class="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                {{ scan.name }}
              </p>
              <p class="text-xs text-slate-400 italic truncate mt-0.5">
                {{ scan.location || 'Local Foraging Site' }}
              </p>
            </div>
            <div class="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-[11px] text-slate-400">
              <span>{{ scan.date }}</span>
              <span class="text-emerald-600 font-semibold group-hover:translate-x-0.5 transition-transform">View →</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── 5. FIELD FORAGING TIPS & ETHICAL GUIDELINES ─────────────────────── -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Tip 1 -->
      <div class="bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-800/40 rounded-2xl p-5 text-white flex flex-col justify-between">
        <div>
          <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h3 class="text-sm font-bold text-emerald-300">Safety First</h3>
          <p class="text-xs text-slate-300 mt-1 leading-relaxed">
            Never consume any wild mushroom based strictly on AI identification alone. Always verify physical traits with an experienced mycologist.
          </p>
        </div>
        <NuxtLink to="/mycodex" class="text-xs font-semibold text-emerald-400 hover:text-emerald-300 mt-3 inline-block">
          Explore Mycological DB →
        </NuxtLink>
      </div>

      <!-- Tip 2 -->
      <div class="bg-gradient-to-br from-teal-900/40 to-slate-900 border border-teal-800/40 rounded-2xl p-5 text-white flex flex-col justify-between">
        <div>
          <div class="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center mb-3">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
          <h3 class="text-sm font-bold text-teal-300">Better Scan Angles</h3>
          <p class="text-xs text-slate-300 mt-1 leading-relaxed">
            Capture clear close-ups of the cap, gills, and stem base. Natural indirect daylight yields the highest AI classification confidence.
          </p>
        </div>
        <NuxtLink to="/users/scan" class="text-xs font-semibold text-teal-400 hover:text-teal-300 mt-3 inline-block">
          Open Scanner →
        </NuxtLink>
      </div>

      <!-- Tip 3 -->
      <div class="bg-gradient-to-br from-amber-900/30 to-slate-900 border border-amber-800/30 rounded-2xl p-5 text-white flex flex-col justify-between">
        <div>
          <div class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center mb-3">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/>
            </svg>
          </div>
          <h3 class="text-sm font-bold text-amber-300">Ethical Foraging</h3>
          <p class="text-xs text-slate-300 mt-1 leading-relaxed">
            Harvest with a sharp blade above ground level so mycelium remains intact. Leave small immature buttons to disperse spores.
          </p>
        </div>
        <NuxtLink to="/users/map" class="text-xs font-semibold text-amber-400 hover:text-amber-300 mt-3 inline-block">
          Check Trail Map →
        </NuxtLink>
      </div>
    </div>

    <!-- ── 6. DETAIL MODAL ────────────────────────────────────────────────── -->
    <div
      v-if="selectedScan"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="selectedScan = null"
    >
      <div class="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <!-- Modal Image -->
        <div class="relative h-56 bg-slate-900 shrink-0">
          <img :src="selectedScan.image" :alt="selectedScan.name" class="w-full h-full object-cover" />
          <button
            @click="selectedScan = null"
            class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors border-none cursor-pointer"
          >
            ✕
          </button>
          <span
            class="absolute bottom-3 left-3 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md shadow"
            :class="selectedScan.classification === 'Edible' ? 'bg-emerald-500 text-white' : (selectedScan.classification === 'Poisonous' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white')"
          >
            {{ selectedScan.classification }} ({{ selectedScan.confidence }}%)
          </span>
        </div>

        <!-- Modal Info -->
        <div class="p-5 overflow-y-auto flex-1 flex flex-col gap-3">
          <div>
            <h3 class="text-lg font-bold text-slate-900">{{ selectedScan.name }}</h3>
            <p class="text-xs text-slate-400 mt-0.5">Recorded on {{ selectedScan.date }}</p>
          </div>

          <div v-if="selectedScan.location" class="p-3 bg-slate-50 rounded-xl flex items-center gap-2 text-xs text-slate-600">
            <svg class="w-4 h-4 text-emerald-600 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span class="truncate">{{ selectedScan.location }}</span>
          </div>

          <p v-if="selectedScan.descriptionRest" class="text-xs text-slate-600 leading-relaxed">
            <strong class="text-slate-800">{{ selectedScan.name }}</strong>{{ selectedScan.descriptionRest }}
          </p>

          <div v-if="selectedScan.habitat" class="text-xs text-slate-600">
            <strong class="text-slate-800">Habitat:</strong> {{ selectedScan.habitat }}
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <NuxtLink
            to="/users/history"
            class="text-xs font-semibold text-emerald-600 hover:underline"
          >
            Open in Full History →
          </NuxtLink>
          <button
            @click="selectedScan = null"
            class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl border-none cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ 
  layout: 'user', 
  middleware: 'auth' 
})

const config = useRuntimeConfig()
const { getUser, getToken } = useAuthSession()

const loadingStats = ref(true)
const loadingScans = ref(true)

const user = ref<any>({})
const isSubscribed = ref(false)
const remainingScans = ref<number | null>(null)
const rewardPoints = ref(0)
const selectedScan = ref<any>(null)

const stats = reactive({
  totalScans: 0,
  uniqueSpecies: 0,
  edibleCount: 0,
})

const recentScans = ref<any[]>([])

const firstName = computed(() => {
  const full = user.value?.name || user.value?.username || 'Forager'
  return full.split(' ')[0]
})

function openScanDetails(scan: any) {
  selectedScan.value = scan
}

async function loadDashboardData() {
  const token = getToken()
  if (!token) return

  user.value = getUser() || {}

  // 1. Fetch Subscription Status
  try {
    const subRes = await $fetch<any>(`${config.public.apiBase}/subscription/status`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    isSubscribed.value = !!subRes.is_subscribed
    remainingScans.value = subRes.remaining_scans ?? (isSubscribed.value ? null : 3)
  } catch (err) {
    console.warn('Subscription status check error:', err)
  }

  // 2. Fetch Rewards
  try {
    const rewardsRes = await $fetch<any>(`${config.public.apiBase}/rewards`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    rewardPoints.value = rewardsRes.points_balance ?? rewardsRes.available_points ?? 0
  } catch (err) {
    console.warn('Rewards fetch error:', err)
  }

  // 3. Fetch User Scans
  loadingScans.value = true
  loadingStats.value = true
  try {
    const rawScans = await $fetch<any[]>(`${config.public.apiBase}/scans`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const parsedScans = (rawScans || []).map((scan: any) => {
      const brief = resolveSpeciesBrief(scan)
      return {
        id: scan.id,
        name: brief.name,
        classification: brief.classification,
        confidence: brief.confidence,
        location: scan.location_name || (scan.latitude && scan.longitude ? `${scan.latitude}, ${scan.longitude}` : ''),
        date: new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: scan.image_url || (scan.image_path ? `${config.public.apiBase.replace(/\/api$/, '')}/storage/${scan.image_path}` : 'https://placehold.co/320x320/e8f0e8/a3a3a3?text=No+Image'),
        descriptionRest: brief.descriptionRest,
        habitat: brief.habitat,
      }
    })

    // Compute stats
    stats.totalScans = parsedScans.length
    const speciesSet = new Set<string>()
    let edible = 0

    parsedScans.forEach((s: any) => {
      if (s.name) speciesSet.add(s.name.toLowerCase().trim())
      if (s.classification === 'Edible') edible++
    })

    stats.uniqueSpecies = speciesSet.size
    stats.edibleCount = edible

    // Keep top 4 recent scans for dashboard display
    recentScans.value = parsedScans.slice(0, 4)
  } catch (err) {
    console.error('Failed to load user dashboard scans:', err)
  } finally {
    loadingScans.value = false
    loadingStats.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

