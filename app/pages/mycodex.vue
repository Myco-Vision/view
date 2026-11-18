<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-extrabold text-white tracking-tight">MycoDex</h1>
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <AppIcon name="sparkles" class="w-3.5 h-3.5 text-emerald-400" />
            Field Encyclopedia
          </span>
        </div>
        <p class="text-sm text-slate-300 mt-1.5 leading-relaxed">
          Catalog your wild mushroom discoveries, earn crowdsourcing points, and redeem them for free 7-Day Pro Passes!
        </p>
      </div>

      <!-- Quick Scan Shortcut -->
      <NuxtLink
        to="/users/scan"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-sm transition no-underline shrink-0"
      >
        <AppIcon name="camera" class="w-4 h-4" />
        Scan to Unlock
      </NuxtLink>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="space-y-4">
      <div class="h-36 rounded-2xl bg-emerald-950/40 border border-emerald-900/30 animate-pulse" />
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="i in 8" :key="i" class="h-64 rounded-2xl bg-emerald-950/40 border border-emerald-900/30 animate-pulse" />
      </div>
    </div>

    <template v-else>
      <!-- ── New Specimen Alert Banner for Foragers ────────────────────────────── -->
      <div
        v-if="showNewSpecimenNotice && mycodex.latest_specimen"
        class="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-400/50 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl relative overflow-hidden"
      >
        <div class="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-emerald-500/15 blur-xl pointer-events-none"></div>
        <div class="flex items-start sm:items-center gap-3.5 relative z-10">
          <div class="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center shrink-0 shadow-inner">
            <AppIcon name="sparkles" class="w-6 h-6 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-950 bg-emerald-400 px-2.5 py-0.5 rounded-full shadow-xs">
                ✨ New Specimen Target
              </span>
              <span class="text-[11.5px] text-emerald-300 font-semibold">
                Recently added by biology admins!
              </span>
            </div>
            <h4 class="text-sm sm:text-base font-extrabold text-white mt-1 flex flex-wrap items-center gap-2">
              <span>{{ mycodex.latest_specimen.common_name }}</span>
              <span
                class="capitalize text-[10.5px] font-bold px-2 py-0.5 rounded-md text-white shadow-xs"
                :class="{
                  'bg-slate-700': !mycodex.latest_specimen.rarity || mycodex.latest_specimen.rarity === 'common',
                  'bg-blue-600': mycodex.latest_specimen.rarity === 'uncommon',
                  'bg-purple-600': mycodex.latest_specimen.rarity === 'rare',
                  'bg-amber-400 text-slate-900 font-extrabold': mycodex.latest_specimen.rarity === 'legendary',
                }"
              >
                {{ mycodex.latest_specimen.rarity || 'Common' }}
              </span>
              <span class="text-emerald-400 text-xs font-black">
                +{{ mycodex.latest_specimen.unlock_points || 5 }} Pts Discovery Bounty
              </span>
            </h4>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
              {{ mycodex.latest_specimen.unlock_hint || 'Head out into the wild to scan and be among the first foragers to unlock this new specimen into your MycoDex!' }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2.5 shrink-0 relative z-10 sm:self-center">
          <button
            type="button"
            @click="openSpecimenDossier(mycodex.latest_specimen)"
            class="px-3.5 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-400/30 text-emerald-300 hover:text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <AppIcon name="book" class="w-3.5 h-3.5" />
            <span>View Full Dossier</span>
          </button>
          <NuxtLink
            to="/users/scan"
            class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-sm transition no-underline flex items-center gap-1.5"
          >
            <AppIcon name="camera" class="w-3.5 h-3.5" />
            <span>Hunt Specimen</span>
          </NuxtLink>
          <button
            @click="dismissNewSpecimenNotice"
            class="px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-900/60 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Feedback notification banner -->
      <div
        v-if="feedbackMessage"
        class="rounded-xl p-4 flex items-center justify-between gap-3 text-sm transition-all"
        :class="feedbackSuccess ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-red-50 border border-red-200 text-red-900'"
      >
        <div class="flex items-center gap-2">
          <AppIcon :name="feedbackSuccess ? 'check-circle' : 'alert-circle'" class="w-5 h-5" :class="feedbackSuccess ? 'text-emerald-600' : 'text-red-600'" />
          <span>{{ feedbackMessage }}</span>
        </div>
        <button @click="feedbackMessage = ''" class="text-xs font-bold opacity-70 hover:opacity-100">✕</button>
      </div>

      <!-- ── Subscription Progress Header ────────────────────────────────────── -->
      <div class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <!-- Points & Progress -->
        <div class="flex-1 space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2.5">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Subscription Reward Progress</span>
              <!-- Pending points badge -->
              <span
                v-if="mycodex.pending_points > 0"
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200"
                title="Points awarded from recent scans awaiting human expert verification"
              >
                <AppIcon name="clock" class="w-3 h-3 text-amber-600" />
                {{ mycodex.pending_points }} pts in review
              </span>
            </div>

            <!-- Current subscription status -->
            <span
              class="text-xs font-bold px-2.5 py-1 rounded-full border"
              :class="mycodex.subscription?.is_subscribed ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'"
            >
              {{ mycodex.subscription?.is_subscribed ? '🌟 Pro Active' : 'Free Tier' }}
              <span v-if="mycodex.subscription?.expires_at" class="font-normal text-[11px] text-slate-500">
                (Exp: {{ new Date(mycodex.subscription.expires_at).toLocaleDateString() }})
              </span>
            </span>
          </div>

          <!-- Progress Bar Toward 100 Pts -->
          <div>
            <div class="flex items-baseline justify-between mb-1.5">
              <div class="flex items-baseline gap-1.5">
                <span class="text-3xl font-black text-slate-900">{{ mycodex.verified_points }}</span>
                <span class="text-sm font-semibold text-slate-400">/ 100 Verified Points</span>
              </div>
              <span class="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {{ mycodex.progress_percent }}% toward 7-Day Pro Pass
              </span>
            </div>
            <div class="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200/60">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="mycodex.verified_points >= 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-400 animate-pulse' : 'bg-emerald-500'"
                :style="{ width: `${mycodex.progress_percent}%` }"
              />
            </div>
          </div>

          <p class="text-xs text-slate-500 leading-relaxed">
            Every <strong>100 Verified Points</strong> unlocks a <strong>7-Day Pro Pass</strong> with unlimited high-accuracy AI scans.
            Earn points by contributing high-confidence and active learning borderline mushroom scans!
          </p>
        </div>

        <!-- Action Button -->
        <div class="shrink-0 flex flex-col items-center sm:items-end gap-1.5 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
          <button
            type="button"
            :disabled="!mycodex.can_redeem || isRedeeming"
            @click="redeemProPass"
            class="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            :class="mycodex.can_redeem
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-200 ring-2 ring-emerald-500/30'
              : 'bg-slate-100 text-slate-400 border border-slate-200'"
          >
            <span v-if="isRedeeming" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            <AppIcon v-else name="sparkles" class="w-4 h-4" />
            <span>{{ isRedeeming ? 'Redeeming…' : (mycodex.can_redeem ? 'Redeem 7-Day Pro Pass' : 'Need 100 Verified Pts') }}</span>
          </button>
          <span class="text-[11px] text-slate-400">
            {{ mycodex.can_redeem ? '100 points ready to redeem' : `${100 - mycodex.verified_points} points remaining` }}
          </span>
        </div>
      </div>

      <!-- ── MycoDex Catalog & Species Grid ─────────────────────────────────── -->
      <div class="space-y-4">
        <!-- Stats bar & filter -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <h2 class="text-base font-bold text-white">Mushroom Species Discovered</h2>
            <span class="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {{ mycodex.species_discovered_count }} / {{ mycodex.total_species_count }}
            </span>
          </div>

          <!-- Filter buttons -->
          <div class="flex items-center gap-1.5 p-1 bg-[#0c221a] border border-emerald-900/40 rounded-xl text-xs font-semibold">
            <button
              @click="filterMode = 'all'"
              class="px-3 py-1.5 rounded-lg border-none cursor-pointer transition-colors"
              :class="filterMode === 'all' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-transparent text-slate-400 hover:text-white'"
            >
              All ({{ mycodex.total_species_count }})
            </button>
            <button
              @click="filterMode = 'discovered'"
              class="px-3 py-1.5 rounded-lg border-none cursor-pointer transition-colors"
              :class="filterMode === 'discovered' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-transparent text-slate-400 hover:text-white'"
            >
              Unlocked ({{ mycodex.species_discovered_count }})
            </button>
            <button
              @click="filterMode = 'locked'"
              class="px-3 py-1.5 rounded-lg border-none cursor-pointer transition-colors"
              :class="filterMode === 'locked' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-transparent text-slate-400 hover:text-white'"
            >
              Locked ({{ mycodex.total_species_count - mycodex.species_discovered_count }})
            </button>
          </div>
        </div>

        <!-- Grid of Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="species in filteredSpeciesGrid"
            :key="species.id"
            @click="openSpecimenDossier(species)"
            class="group rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col bg-white cursor-pointer select-none"
            :class="species.is_discovered
              ? 'border-slate-200 hover:border-emerald-400 hover:shadow-lg'
              : 'border-slate-200 hover:border-emerald-300 hover:shadow-md bg-slate-50/70'"
          >
            <!-- Card Image Area -->
            <div class="relative h-44 bg-slate-100 overflow-hidden flex items-center justify-center">
              <template v-if="species.is_discovered">
                <img
                  v-if="species.cover_image_url || species.reference_image_url"
                  :src="species.cover_image_url || species.reference_image_url"
                  :alt="species.common_name"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div v-else class="w-full h-full bg-emerald-50 flex items-center justify-center">
                  <AppIcon name="leaf" class="w-12 h-12 text-emerald-400" />
                </div>

                <!-- Specimen Scan Count & Rarity Badge -->
                <div class="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  <span
                    v-if="species.id === mycodex.latest_specimen?.id || species.is_new_target"
                    class="px-2 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-xs animate-pulse tracking-wide"
                  >
                    ✨ NEW
                  </span>
                  <span
                    v-if="species.rarity && species.rarity !== 'common'"
                    class="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide shadow-sm"
                    :class="{
                      'bg-blue-600 text-white': species.rarity === 'uncommon',
                      'bg-purple-600 text-white': species.rarity === 'rare',
                      'bg-amber-400 text-slate-900 font-extrabold': species.rarity === 'legendary',
                    }"
                  >
                    {{ species.rarity }}
                  </span>
                  <div class="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-black/75 text-white backdrop-blur-xs flex items-center gap-1 shadow-sm">
                    <span>x{{ species.scan_count }}</span>
                  </div>
                </div>

                <!-- Classification / Edibility Badge -->
                <div class="absolute bottom-2.5 left-2.5">
                  <span
                    class="px-2 py-0.5 rounded-md text-[10.5px] font-extrabold uppercase tracking-wider backdrop-blur-xs shadow-xs"
                    :class="species.classification === 'edible'
                      ? 'bg-emerald-600/90 text-white'
                      : (species.classification === 'poisonous' ? 'bg-red-600/90 text-white' : 'bg-slate-800/80 text-slate-100')"
                  >
                    {{ species.classification }}
                  </span>
                </div>
              </template>

              <!-- Locked Specimen State -->
              <template v-else>
                <!-- Reference Photo (Full Color) or Fallback Placeholder -->
                <img
                  v-if="species.reference_image_url || species.cover_image_url"
                  :src="species.reference_image_url || species.cover_image_url"
                  :alt="species.common_name"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div v-else class="w-full h-full bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <div class="w-12 h-12 rounded-full bg-slate-800/90 flex items-center justify-center text-slate-400 border border-slate-700">
                    <AppIcon name="lock" class="w-5 h-5" />
                  </div>
                  <span class="text-[10px] font-bold text-slate-400 tracking-wider">LOCKED SPECIMEN</span>
                </div>

                <!-- Subtle gradient overlay so badges are always readable -->
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/30 pointer-events-none"></div>

                <!-- Rarity, Reward Points & NEW TARGET Badges -->
                <div class="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                  <span
                    v-if="species.id === mycodex.latest_specimen?.id || species.is_new_target"
                    class="px-2 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-xs animate-pulse tracking-wide"
                  >
                    ✨ NEW
                  </span>
                  <span
                    class="capitalize px-2.5 py-0.5 rounded-full text-[10.5px] font-bold shadow-xs tracking-wider"
                    :class="{
                      'bg-slate-900/80 text-slate-200 border border-slate-700': !species.rarity || species.rarity === 'common',
                      'bg-blue-600 text-white': species.rarity === 'uncommon',
                      'bg-purple-600 text-white': species.rarity === 'rare',
                      'bg-amber-400 text-slate-900 font-extrabold': species.rarity === 'legendary',
                    }"
                  >
                    {{ species.rarity || 'common' }}
                  </span>
                </div>
                <div class="absolute top-2.5 right-2.5 z-10">
                  <span class="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                    <span>+{{ species.unlock_points || 5 }} Pts</span>
                  </span>
                </div>

                <!-- Bottom Left: Locked Target Badge -->
                <div class="absolute bottom-2.5 left-2.5 z-10">
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-950/85 text-amber-300 border border-amber-400/30 backdrop-blur-xs flex items-center gap-1 shadow-sm">
                    <AppIcon name="lock" class="w-3 h-3 text-amber-400" />
                    <span>Target Specimen</span>
                  </span>
                </div>
              </template>
            </div>

            <!-- Card Info Body -->
            <div class="p-4 flex-1 flex flex-col justify-between gap-3">
              <div>
                <template v-if="species.is_discovered">
                  <h3 class="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {{ species.common_name }}
                  </h3>
                  <p class="text-xs italic text-slate-500 font-serif mt-0.5">
                    {{ species.scientific_name }}
                  </p>
                  <p v-if="species.habitat" class="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    <strong class="text-slate-700">Habitat:</strong> {{ species.habitat }}
                  </p>
                </template>

                <template v-else>
                  <h3 class="text-sm font-bold text-slate-700 flex items-center justify-between">
                    <span>{{ species.common_name }}</span>
                    <span class="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide bg-slate-100 px-1.5 py-0.5 rounded">🔒 Locked</span>
                  </h3>
                  <p class="text-xs italic text-slate-400 mt-0.5">
                    {{ species.scientific_name || 'Undiscovered Species' }}
                  </p>
                  <!-- Admin Unlock Clue if provided -->
                  <div v-if="species.unlock_hint" class="mt-2.5 p-2 rounded-lg bg-amber-50/90 border border-amber-200/80 text-amber-900 text-[11px] leading-relaxed">
                    <span class="font-bold flex items-center gap-1 text-amber-800 mb-0.5">
                      💡 Field Clue:
                    </span>
                    {{ species.unlock_hint }}
                  </div>
                  <p v-else class="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Find and scan this mushroom in the wild to unlock full species data and earn <strong class="text-emerald-600">+{{ species.unlock_points || 5 }} points</strong>!
                  </p>
                  <p v-if="species.habitat" class="text-[11px] text-slate-500 mt-1.5 truncate">
                    <strong class="text-slate-600">Known Habitat:</strong> {{ species.habitat }}
                  </p>
                </template>
              </div>

              <!-- Footer tag -->
              <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  @click.stop="openSpecimenDossier(species)"
                  class="font-bold text-slate-600 hover:text-emerald-700 bg-transparent border-none p-0 cursor-pointer inline-flex items-center gap-1 transition"
                >
                  <AppIcon name="book" class="w-3.5 h-3.5 text-emerald-600" />
                  <span>Field Dossier</span>
                </button>

                <div class="flex items-center gap-2">
                  <span v-if="species.is_discovered && species.first_scanned_at" class="text-slate-400">
                    Found {{ new Date(species.first_scanned_at).toLocaleDateString() }}
                  </span>
                  <span v-else class="text-emerald-600 font-bold">
                    +{{ species.unlock_points || 5 }} Pts
                  </span>

                  <NuxtLink
                    to="/users/scan"
                    @click.stop
                    class="font-bold text-emerald-600 hover:text-emerald-800 no-underline inline-flex items-center gap-0.5"
                  >
                    <span>Scan</span>
                    <span>→</span>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Specimen Field Dossier Modal ─────────────────────────────────────── -->
      <div
        v-if="activeSpecimen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        @click.self="closeSpecimenDossier"
      >
        <div class="relative w-full max-w-xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
          
          <!-- Header Image / Silhouette Section -->
          <div class="relative h-56 bg-slate-900 overflow-hidden shrink-0 flex items-center justify-center">
            <!-- Discovered Full Color Photo -->
            <template v-if="activeSpecimen.is_discovered">
              <img
                v-if="activeSpecimen.cover_image_url || activeSpecimen.reference_image_url"
                :src="activeSpecimen.cover_image_url || activeSpecimen.reference_image_url"
                :alt="activeSpecimen.common_name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-emerald-950 flex items-center justify-center">
                <AppIcon name="leaf" class="w-16 h-16 text-emerald-400" />
              </div>
              
              <div class="absolute top-3.5 left-3.5 flex items-center gap-2">
                <span class="px-3 py-1 rounded-full text-xs font-black bg-black/75 text-white backdrop-blur-sm shadow-sm">
                  x{{ activeSpecimen.scan_count }} Found
                </span>
              </div>
              <div class="absolute bottom-3.5 left-3.5">
                <span
                  class="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-sm"
                  :class="activeSpecimen.classification === 'edible'
                    ? 'bg-emerald-600 text-white'
                    : (activeSpecimen.classification === 'poisonous' ? 'bg-red-600 text-white' : 'bg-slate-800 text-white')"
                >
                  {{ activeSpecimen.classification }}
                </span>
              </div>
            </template>

            <!-- Locked Target Specimen Photo -->
            <template v-else>
              <div v-if="activeSpecimen.reference_image_url || activeSpecimen.cover_image_url" class="w-full h-full relative overflow-hidden bg-slate-900">
                <img
                  :src="activeSpecimen.reference_image_url || activeSpecimen.cover_image_url"
                  :alt="activeSpecimen.common_name"
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none"></div>
                <div class="absolute bottom-3.5 left-3.5 flex items-center gap-2">
                  <span class="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-slate-950/85 text-amber-300 border border-amber-400/40 backdrop-blur-md shadow-md flex items-center gap-1.5">
                    <AppIcon name="lock" class="w-3.5 h-3.5 text-amber-400" />
                    <span>Target Specimen</span>
                  </span>
                </div>
              </div>
              <div v-else class="w-full h-full bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center gap-2 text-slate-400">
                <div class="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 shadow-inner">
                  <AppIcon name="lock" class="w-7 h-7" />
                </div>
                <span class="text-xs font-extrabold tracking-widest uppercase text-slate-400">Locked Target Specimen</span>
              </div>

              <!-- Rarity badge on image -->
              <div class="absolute top-3.5 left-3.5">
                <span
                  class="capitalize px-3 py-1 rounded-full text-xs font-bold shadow-md tracking-wider text-white"
                  :class="{
                    'bg-slate-700': !activeSpecimen.rarity || activeSpecimen.rarity === 'common',
                    'bg-blue-600': activeSpecimen.rarity === 'uncommon',
                    'bg-purple-600': activeSpecimen.rarity === 'rare',
                    'bg-amber-400 text-slate-950 font-black': activeSpecimen.rarity === 'legendary',
                  }"
                >
                  {{ activeSpecimen.rarity || 'Common' }}
                </span>
              </div>

              <div class="absolute top-3.5 right-14">
                <span class="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-md">
                  +{{ activeSpecimen.unlock_points || 5 }} Pts Bounty
                </span>
              </div>
            </template>

            <!-- Close Modal Button -->
            <button
              @click="closeSpecimenDossier"
              class="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center text-sm transition shadow-md z-20 cursor-pointer border-none"
            >
              ✕
            </button>
          </div>

          <!-- Modal Body (Scrollable) -->
          <div class="p-6 overflow-y-auto space-y-4 flex-1">
            
            <!-- Title & Scientific Name Header -->
            <div class="border-b border-slate-100 pb-3">
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-black text-slate-900 leading-tight">
                  {{ activeSpecimen.common_name }}
                </h2>
                <span
                  v-if="!activeSpecimen.is_discovered"
                  class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200"
                >
                  Undiscovered
                </span>
                <span
                  v-else
                  class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  Cataloged
                </span>
              </div>
              <p class="text-sm italic font-serif text-slate-500 mt-1">
                {{ activeSpecimen.scientific_name || 'Species unclassified' }}
              </p>
            </div>

            <!-- Field Clue / Unlock Hint -->
            <div v-if="activeSpecimen.unlock_hint" class="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90">
              <h4 class="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-1.5">
                <span>💡</span>
                <span>Field Discovery Clue</span>
              </h4>
              <p class="text-sm text-amber-950 font-medium leading-relaxed">
                {{ activeSpecimen.unlock_hint }}
              </p>
            </div>

            <!-- Full Habitat & Environment -->
            <div v-if="activeSpecimen.habitat" class="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-1.5">
                <span>🌲</span>
                <span>Habitat & Growing Environment</span>
              </h4>
              <p class="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {{ activeSpecimen.habitat }}
              </p>
            </div>

            <!-- Botanical Description -->
            <div v-if="activeSpecimen.description" class="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-1.5">
                <span>📖</span>
                <span>Botanical Description & Identification</span>
              </h4>
              <p class="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {{ activeSpecimen.description }}
              </p>
            </div>

            <!-- Edibility / Safety Notice -->
            <div class="p-4 rounded-2xl border" :class="activeSpecimen.is_discovered ? (activeSpecimen.classification === 'edible' ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-red-50/70 border-red-200 text-red-950') : 'bg-slate-50 border-slate-200 text-slate-700'">
              <h4 class="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <span>🛡️</span>
                <span>Edibility & Safety Rating</span>
              </h4>
              <div v-if="activeSpecimen.is_discovered">
                <span class="capitalize font-black text-sm">
                  Classification: {{ activeSpecimen.classification }}
                </span>
                <p class="text-xs text-slate-600 mt-0.5">
                  {{ activeSpecimen.classification === 'edible' ? 'Recognized as safe for culinary use when properly cooked and identified.' : 'Warning: Not edible or toxic. Do not consume wild mushrooms without expert verification.' }}
                </p>
              </div>
              <div v-else>
                <span class="font-bold text-sm text-slate-800">
                  🔒 Concealed for Forager Safety
                </span>
                <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Edibility guidelines and culinary safety warnings remain locked until you scan and verify this mushroom in the field.
                </p>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              @click="closeSpecimenDossier"
              class="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              Close Dossier
            </button>

            <NuxtLink
              to="/users/scan"
              class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-sm transition no-underline flex items-center gap-2"
            >
              <AppIcon name="camera" class="w-4 h-4" />
              <span>{{ activeSpecimen.is_discovered ? 'Scan Specimen Again' : 'Scan to Unlock (+5 Pts)' }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'user', middleware: 'auth' })

const config = useRuntimeConfig()
const loading = ref(true)
const isRedeeming = ref(false)
const filterMode = ref<'all' | 'discovered' | 'locked'>('all')
const feedbackMessage = ref('')
const feedbackSuccess = ref(true)

const mycodex = ref<any>({
  verified_points: 0,
  pending_points: 0,
  points_required: 100,
  can_redeem: false,
  progress_percent: 0,
  subscription: { is_subscribed: false, tier: 'free', expires_at: null },
  species_discovered_count: 0,
  total_species_count: 0,
  species_grid: [],
})

const getHeaders = () => {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

const showNewSpecimenNotice = ref(false)
const activeSpecimen = ref<any | null>(null)

function openSpecimenDossier(species: any) {
  if (!species) return
  activeSpecimen.value = species
}

function closeSpecimenDossier() {
  activeSpecimen.value = null
}

function checkNewSpecimenNotice() {
  if (!mycodex.value.latest_specimen) return
  const latestId = mycodex.value.latest_specimen.id
  const totalCount = mycodex.value.total_species_count || 0
  const dismissedId = parseInt(localStorage.getItem('mycodex_dismissed_specimen_id') || '0', 10)

  // Check if specimen was created recently (within last 14 days) or newer than dismissed
  const createdDate = mycodex.value.latest_specimen.created_at ? new Date(mycodex.value.latest_specimen.created_at) : null
  const isRecent = createdDate ? (Date.now() - createdDate.getTime()) < 14 * 24 * 60 * 60 * 1000 : true

  if (latestId > dismissedId && isRecent) {
    showNewSpecimenNotice.value = true
  }

  // Update seen markers to clear sidebar badge
  localStorage.setItem('mycodex_last_seen_id', String(latestId))
  localStorage.setItem('mycodex_last_seen_total', String(totalCount))
  window.dispatchEvent(new CustomEvent('mycodex-seen'))
}

function dismissNewSpecimenNotice() {
  showNewSpecimenNotice.value = false
  if (mycodex.value.latest_specimen) {
    localStorage.setItem('mycodex_dismissed_specimen_id', String(mycodex.value.latest_specimen.id))
  }
}

async function fetchMycoDex() {
  loading.value = true
  try {
    const res = await $fetch<any>(`${config.public.apiBase}/user/mycodex`, {
      headers: getHeaders(),
    })
    mycodex.value = res
    checkNewSpecimenNotice()
  } catch (err: any) {
    console.error('Failed to load MycoDex:', err)
  } finally {
    loading.value = false
  }
}

async function redeemProPass() {
  if (!mycodex.value.can_redeem || isRedeeming.value) return

  isRedeeming.value = true
  feedbackMessage.value = ''

  try {
    const res = await $fetch<any>(`${config.public.apiBase}/user/redeem-subscription`, {
      method: 'POST',
      headers: getHeaders(),
    })
    feedbackSuccess.value = true
    feedbackMessage.value = res.message || 'Successfully redeemed 100 Verified Points for a 7-Day Pro Pass!'
    await fetchMycoDex()
  } catch (err: any) {
    feedbackSuccess.value = false
    feedbackMessage.value = err?.data?.message || 'Failed to redeem subscription. Please try again.'
  } finally {
    isRedeeming.value = false
  }
}

const filteredSpeciesGrid = computed(() => {
  const list = mycodex.value.species_grid || []
  if (filterMode.value === 'discovered') {
    return list.filter((s: any) => s.is_discovered)
  }
  if (filterMode.value === 'locked') {
    return list.filter((s: any) => !s.is_discovered)
  }
  return list
})

onMounted(() => {
  fetchMycoDex()
})
</script>

