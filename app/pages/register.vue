<template>
  <div class="min-h-screen bg-[#07130f] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden flex flex-col">

    <!-- ── AMBIENT BACKGROUND GLOW ── -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-[140px]" />
      <div class="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[160px]" />
      <div class="absolute -bottom-40 left-1/3 w-[700px] h-[700px] bg-emerald-800/15 rounded-full blur-[180px]" />
      <div class="absolute inset-0 bg-[radial-gradient(#15382b_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
    </div>

    <!-- ── NAVBAR ── -->
    <header class="relative z-40 backdrop-blur-xl bg-[#081712]/85 border-b border-emerald-900/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C7.03 2 3 6.03 3 11c0 1.25.26 2.44.73 3.52C4.1 15.35 4.8 16 5.6 16h12.8c.8 0 1.5-.65 1.87-1.48.47-1.08.73-2.27.73-3.52 0-4.97-4.03-9-9-9zm-1.5 15h3v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-5z" />
            </svg>
          </div>
          <div class="flex flex-col">
            <span class="text-lg font-bold tracking-tight text-white">Myco<span class="text-emerald-400">Vision</span></span>
            <span class="text-[9px] tracking-wider uppercase text-emerald-400/80 font-semibold">AI Mushroom Intelligence</span>
          </div>
        </NuxtLink>

        <NuxtLink to="/login" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/40 transition">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14" />
          </svg>
          <span>Back to Login</span>
        </NuxtLink>
      </div>
    </header>

    <!-- ── MAIN CONTENT ── -->
    <main class="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-lg">

        <!-- Header Text -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-4 backdrop-blur-md">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Free Account — 3 Lifetime Scans Included</span>
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight text-white">
            Join <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">MycoVision</span>
          </h1>
          <p class="text-sm text-slate-400 mt-2">Create your forager account in seconds</p>
        </div>

        <!-- Registration Card -->
        <div class="relative bg-[#0d221b]/90 border border-emerald-700/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-2xl">

          <!-- Ambient top-right glow -->
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <!-- Step Progress -->
          <div class="flex items-center gap-0 mb-7">
            <!-- Step 1 bubble -->
            <div
              class="w-8 h-8 rounded-full border-2 text-[0.78rem] font-bold flex items-center justify-center shrink-0 transition-all duration-300"
              :class="step >= 1 ? 'border-emerald-400 bg-emerald-500 text-white shadow-lg shadow-emerald-500/40' : 'border-emerald-900 text-slate-500 bg-transparent'"
            >
              <span v-if="step <= 1">1</span>
              <span v-else class="text-sm">✓</span>
            </div>
            <!-- Connector -->
            <div class="flex-1 h-[2px] bg-emerald-900/60 rounded-sm mx-2 overflow-hidden">
              <div class="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-sm transition-all duration-500 ease-in-out" :style="{ width: step > 1 ? '100%' : '0%' }" />
            </div>
            <!-- Step 2 bubble -->
            <div
              class="w-8 h-8 rounded-full border-2 text-[0.78rem] font-bold flex items-center justify-center shrink-0 transition-all duration-300"
              :class="step >= 2 ? 'border-emerald-400 bg-emerald-500 text-white shadow-lg shadow-emerald-500/40' : 'border-emerald-900 text-slate-500 bg-transparent'"
            >2</div>
          </div>

          <!-- ── STEP 1 ── -->
          <div v-if="step === 1" class="flex flex-col gap-4">

            <!-- Error Banner -->
            <div v-if="error" class="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs">
              <svg class="w-4 h-4 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{{ error }}</span>
            </div>

            <!-- Name Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="flex flex-col gap-1.5">
                <label class="text-[0.75rem] font-semibold text-slate-300 tracking-wide">First Name</label>
                <input
                  v-model="form.firstName"
                  type="text"
                  placeholder="Maria"
                  class="w-full py-2.5 px-3.5 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                  :disabled="loading"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-[0.75rem] font-semibold text-slate-300 tracking-wide">Last Name</label>
                <input
                  v-model="form.lastName"
                  type="text"
                  placeholder="Salem"
                  class="w-full py-2.5 px-3.5 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Username -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[0.75rem] font-semibold text-slate-300 tracking-wide">Username</label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">@</span>
                <input
                  v-model="form.username"
                  type="text"
                  placeholder="maria_salem"
                  class="w-full py-2.5 pl-8 pr-3.5 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Email + Contact Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="flex flex-col gap-1.5">
                <label class="text-[0.75rem] font-semibold text-slate-300 tracking-wide">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="maria@example.com"
                  class="w-full py-2.5 px-3.5 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                  :disabled="loading"
                />
                <p v-if="form.email && emailHint.text" class="text-[0.65rem] font-medium flex items-center gap-1 mt-0.5" :class="emailHint.color">
                  <svg v-if="emailStatus === 'checking'" class="w-3 h-3 animate-spin shrink-0" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                  <span v-else class="w-1.5 h-1.5 rounded-full shrink-0" :class="emailHint.dot" />
                  {{ emailHint.text }}
                </p>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-[0.75rem] font-semibold text-slate-300 tracking-wide">Contact No.</label>
                <input
                  v-model="form.contact"
                  type="text"
                  placeholder="+63 955 123 5566"
                  class="w-full py-2.5 px-3.5 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                  :disabled="loading"
                />
                <p v-if="form.contact" class="text-[0.65rem] font-medium flex items-center gap-1 mt-0.5" :class="phoneValid ? 'text-emerald-400' : 'text-red-400'">
                  <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="phoneValid ? 'bg-emerald-400' : 'bg-red-400'" />
                  {{ phoneValid ? 'Valid mobile number' : 'Use PH format: 0917 123 4567 or +63 917 123 4567' }}
                </p>
              </div>
            </div>

            <!-- Address (Cascading Philippine Location Dropdowns) -->
            <div class="flex flex-col gap-2">
              <label class="text-[0.75rem] font-semibold text-slate-300 tracking-wide">Address</label>

              <!-- Region -->
              <div class="relative">
                <select
                  v-model="addr.regionCode"
                  @change="onRegionChange"
                  :disabled="loading || addrLoading.regions"
                  class="w-full py-2.5 px-3.5 pr-9 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition appearance-none cursor-pointer disabled:opacity-60"
                  :class="addr.regionCode ? 'text-white' : 'text-slate-500'"
                >
                  <option value="" disabled>{{ addrLoading.regions ? 'Loading regions…' : 'Select Region' }}</option>
                  <option v-for="r in regions" :key="r.code" :value="r.code">{{ r.name }}</option>
                </select>
                <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg v-if="addrLoading.regions" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                  <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </span>
              </div>

              <!-- Province -->
              <div class="relative">
                <select
                  v-model="addr.provinceCode"
                  @change="onProvinceChange"
                  :disabled="loading || !addr.regionCode || addrLoading.provinces"
                  class="w-full py-2.5 px-3.5 pr-9 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition appearance-none cursor-pointer disabled:opacity-60"
                  :class="addr.provinceCode ? 'text-white' : 'text-slate-500'"
                >
                  <option value="" disabled>{{ addrLoading.provinces ? 'Loading provinces…' : (addr.regionCode ? 'Select Province' : 'Select a region first') }}</option>
                  <option v-for="p in provinces" :key="p.code" :value="p.code">{{ p.name }}</option>
                </select>
                <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg v-if="addrLoading.provinces" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                  <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </span>
              </div>

              <!-- City / Municipality -->
              <div class="relative">
                <select
                  v-model="addr.cityCode"
                  @change="onCityChange"
                  :disabled="loading || !addr.provinceCode || addrLoading.cities"
                  class="w-full py-2.5 px-3.5 pr-9 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition appearance-none cursor-pointer disabled:opacity-60"
                  :class="addr.cityCode ? 'text-white' : 'text-slate-500'"
                >
                  <option value="" disabled>{{ addrLoading.cities ? 'Loading cities…' : (addr.provinceCode ? 'Select City / Municipality' : 'Select a province first') }}</option>
                  <option v-for="c in cities" :key="c.code" :value="c.code">{{ c.name }}</option>
                </select>
                <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg v-if="addrLoading.cities" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                  <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </span>
              </div>

              <!-- Barangay -->
              <div class="relative">
                <select
                  v-model="addr.barangayCode"
                  @change="onBarangayChange"
                  :disabled="loading || !addr.cityCode || addrLoading.barangays"
                  class="w-full py-2.5 px-3.5 pr-9 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition appearance-none cursor-pointer disabled:opacity-60"
                  :class="addr.barangayCode ? 'text-white' : 'text-slate-500'"
                >
                  <option value="" disabled>{{ addrLoading.barangays ? 'Loading barangays…' : (addr.cityCode ? 'Select Barangay' : 'Select a city first') }}</option>
                  <option v-for="b in barangays" :key="b.code" :value="b.code">{{ b.name }}</option>
                </select>
                <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg v-if="addrLoading.barangays" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                  <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </span>
              </div>

              <!-- Street / House No. -->
              <input
                v-model="addr.street"
                type="text"
                placeholder="House No. / Street / Purok (optional)"
                class="w-full py-2.5 px-3.5 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                :disabled="loading"
              />
            </div>

            <!-- Password Row -->
            <div class="flex flex-col gap-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="flex flex-col gap-1.5">
                  <label class="text-[0.75rem] font-semibold text-slate-300 tracking-wide">Password</label>
                  <input
                    v-model="form.password"
                    type="password"
                    placeholder="••••••••"
                    class="w-full py-2.5 px-3.5 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                    :disabled="loading"
                  />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[0.75rem] font-semibold text-slate-300 tracking-wide">Confirm Password</label>
                  <div class="relative">
                    <input
                      v-model="form.confirmPassword"
                      :type="showConfirm ? 'text' : 'password'"
                      placeholder="••••••••"
                      class="w-full py-2.5 pl-3.5 pr-10 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                      :disabled="loading"
                    />
                    <button
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-300 transition cursor-pointer"
                      type="button"
                      @click="showConfirm = !showConfirm"
                    >
                      <svg v-if="!showConfirm" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Password Requirements Note -->
              <div class="p-3 rounded-xl bg-stone-950/70 border border-emerald-900/50 flex flex-col gap-2">
                <p class="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <svg class="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Password Requirements
                </p>
                <div class="grid grid-cols-2 gap-1.5">
                  <span
                    class="flex items-center gap-1.5 text-[0.7rem] font-medium transition-colors"
                    :class="form.password.length >= 8 ? 'text-emerald-400' : 'text-slate-500'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="form.password.length >= 8 ? 'bg-emerald-400' : 'bg-slate-600'" />
                    At least 8 characters
                  </span>
                  <span
                    class="flex items-center gap-1.5 text-[0.7rem] font-medium transition-colors"
                    :class="/[A-Z]/.test(form.password) ? 'text-emerald-400' : 'text-slate-500'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="/[A-Z]/.test(form.password) ? 'bg-emerald-400' : 'bg-slate-600'" />
                    One uppercase letter (A–Z)
                  </span>
                  <span
                    class="flex items-center gap-1.5 text-[0.7rem] font-medium transition-colors"
                    :class="/[0-9]/.test(form.password) ? 'text-emerald-400' : 'text-slate-500'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="/[0-9]/.test(form.password) ? 'bg-emerald-400' : 'bg-slate-600'" />
                    One number (0–9)
                  </span>
                  <span
                    class="flex items-center gap-1.5 text-[0.7rem] font-medium transition-colors"
                    :class="/[^A-Za-z0-9]/.test(form.password) ? 'text-emerald-400' : 'text-slate-500'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="/[^A-Za-z0-9]/.test(form.password) ? 'bg-emerald-400' : 'bg-slate-600'" />
                    One special character (!@#$…)
                  </span>
                </div>
              </div>
            </div>

            <!-- Next Button -->
            <button
              class="w-full mt-1 py-3 px-4 rounded-xl font-bold text-sm text-stone-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              @click="goNext"
            >
              <span>Continue to Review</span>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          <!-- ── STEP 2 ── -->
          <div v-if="step === 2" class="flex flex-col gap-4">
            <p class="text-xs text-slate-400">Almost there! Review your details before submitting.</p>

            <!-- Summary Card -->
            <div class="grid grid-cols-2 gap-3 bg-stone-950/60 border border-emerald-900/40 rounded-2xl py-5 px-5">
              <div class="flex flex-col gap-1">
                <span class="text-[0.68rem] uppercase tracking-[0.06em] text-emerald-400/80 font-bold">Full Name</span>
                <span class="text-sm text-white font-medium">{{ form.firstName }} {{ form.lastName }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[0.68rem] uppercase tracking-[0.06em] text-emerald-400/80 font-bold">Username</span>
                <span class="text-sm text-white font-medium">@{{ form.username }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[0.68rem] uppercase tracking-[0.06em] text-emerald-400/80 font-bold">Email</span>
                <span class="text-sm text-white font-medium break-all">{{ form.email }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[0.68rem] uppercase tracking-[0.06em] text-emerald-400/80 font-bold">Contact</span>
                <span class="text-sm text-white font-medium">{{ form.contact }}</span>
              </div>
              <div class="flex flex-col gap-1 col-span-2">
                <span class="text-[0.68rem] uppercase tracking-[0.06em] text-emerald-400/80 font-bold">Address</span>
                <span class="text-sm text-white font-medium">{{ form.address }}</span>
              </div>
            </div>

            <!-- Free Plan Badge -->
            <div class="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/30">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-semibold text-emerald-300">Free Starter Account</p>
                <p class="text-[11px] text-slate-400">3 lifetime AI mushroom scans • No credit card required</p>
              </div>
            </div>

            <!-- Terms & Agreement (popup trigger) -->
            <button
              type="button"
              class="w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer"
              :class="agreedToTerms ? 'bg-emerald-950/60 border-emerald-500/50' : 'bg-stone-950/40 border-emerald-900/40 hover:border-emerald-700/50'"
              @click="openTerms(false)"
            >
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                :class="agreedToTerms ? 'bg-emerald-500 text-stone-950' : 'bg-emerald-500/15 text-emerald-400'"
              >
                <svg v-if="agreedToTerms" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold" :class="agreedToTerms ? 'text-emerald-300' : 'text-white'">
                  {{ agreedToTerms ? 'Terms & Agreement accepted' : 'Review Terms & Agreement' }}
                </p>
                <p class="text-[11px] text-slate-400">
                  {{ agreedToTerms ? 'Tap to read again' : 'Required before creating your account' }}
                </p>
              </div>
              <svg class="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>


            <!-- Error Banner -->
            <div v-if="error" class="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs">
              <svg class="w-4 h-4 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{{ error }}</span>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 mt-1">
              <button
                class="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm text-emerald-300 bg-transparent border border-emerald-700/50 hover:bg-emerald-900/30 transition cursor-pointer"
                @click="step = 1"
                :disabled="loading"
              >
                ← Back
              </button>
              <button
                class="flex-[2] py-2.5 px-4 rounded-xl font-bold text-sm text-stone-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                @click="handleRegister"
                :disabled="loading || !agreedToTerms"
              >
                <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>{{ loading ? 'Creating Account…' : 'Create Free Account' }}</span>
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-6 pt-5 border-t border-emerald-900/30 text-center text-xs text-slate-400">
            Already have an account?
            <NuxtLink to="/login" class="text-emerald-400 hover:underline font-semibold ml-1">Sign in here</NuxtLink>
          </div>

          <!-- Google Sign-In Alternative (Step 1 only) -->
          <div v-if="step === 1" class="mt-4">
            <div class="flex items-center gap-3">
              <div class="flex-1 h-px bg-emerald-900/50" />
              <span class="text-[11px] text-slate-500 font-medium">or sign up with</span>
              <div class="flex-1 h-px bg-emerald-900/50" />
            </div>

            <!-- Custom themed Google button -->
            <button
              type="button"
              @click="onGoogleClick"
              :disabled="googleLoading"
              class="mt-3 w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 border bg-[#0d1f19] hover:bg-emerald-950/80 border-emerald-700/50 hover:border-emerald-500/60 text-slate-200 hover:text-white shadow-sm hover:shadow-emerald-900/30 hover:shadow-md"
            >
              <svg v-if="googleLoading" class="w-4 h-4 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <svg v-else viewBox="0 0 24 24" class="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>{{ googleLoading ? 'Setting up account…' : 'Continue with Google' }}</span>
            </button>

            <p class="mt-2.5 text-center text-[10px] text-slate-500">
              You'll be asked to review and accept our
              <button type="button" class="text-emerald-400 hover:underline font-semibold cursor-pointer" @click="openTerms(false)">Terms &amp; Agreement</button>
              first. Your free forager account is created instantly.
            </p>
          </div>

        </div>
      </div>
    </main>

    <!-- ── TERMS & AGREEMENT POPUP ── -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        leave-active-class="transition duration-150 ease-in"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showTerms"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          @click.self="closeTerms"
          role="dialog"
          aria-modal="true"
          aria-labelledby="terms-title"
        >
          <div class="relative w-full max-w-lg max-h-[88vh] flex flex-col bg-[#0d221b] border border-emerald-700/30 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden">
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            <!-- Header -->
            <div class="relative flex items-start justify-between gap-3 px-6 pt-6 pb-4 border-b border-emerald-900/40">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 id="terms-title" class="text-base font-bold text-white">Terms &amp; Agreement</h2>
                  <p v-if="!hasReadTerms" class="text-[11px] text-amber-300/80 font-medium">Scroll to the bottom to enable "I Agree"</p>
                  <p v-else class="text-[11px] text-emerald-400 font-medium">✓ You've read everything</p>
                </div>
              </div>
              <button type="button" class="text-slate-400 hover:text-emerald-300 transition cursor-pointer" aria-label="Close" @click="closeTerms">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Scrollable body -->
            <div
              ref="termsBox"
              @scroll="onTermsScroll"
              class="relative flex-1 overflow-y-auto px-6 py-5 text-xs leading-relaxed text-slate-300 flex flex-col gap-4"
            >
              <p class="text-slate-400">Last updated: October 2026. Please read these terms carefully before creating your MycoVision account.</p>

              <div>
                <p class="font-bold text-emerald-300 mb-1">1. Acceptance of Terms</p>
                <p>By creating an account, you agree to be bound by these Terms &amp; Agreement and our Privacy Policy. If you do not agree, you may not create an account or use MycoVision.</p>
              </div>

              <div class="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30">
                <p class="font-bold text-amber-300 mb-1">2. ⚠ Safety Disclaimer — Never Eat Based on AI Alone</p>
                <p>MycoVision uses AI to estimate mushroom species. Results are <strong class="text-white">informational only</strong> and may be inaccurate. Many edible mushrooms have deadly look-alikes. You must <strong class="text-white">never consume any wild mushroom</strong> based solely on an app result. Always consult a qualified mycologist or expert before eating any foraged mushroom. MycoVision and its developers accept no liability for illness, injury, or death resulting from consumption.</p>
              </div>

              <div>
                <p class="font-bold text-emerald-300 mb-1">3. Your Account</p>
                <p>You are responsible for the accuracy of the information you provide and for keeping your password confidential. You are responsible for all activity under your account. Notify us immediately of any unauthorized use.</p>
              </div>

              <div>
                <p class="font-bold text-emerald-300 mb-1">4. Free Plan &amp; Scan Limits</p>
                <p>Free accounts include 3 lifetime AI mushroom scans. We may modify plans, limits, or features at any time. Attempts to bypass scan limits, such as creating multiple accounts, may result in suspension.</p>
              </div>

              <div>
                <p class="font-bold text-emerald-300 mb-1">5. Data &amp; Privacy</p>
                <p>We collect your name, username, email, contact number, address, and the images you upload for scanning. This data is used to operate the service, improve our AI models, and provide support. We do not sell your personal information. If you sign in with Google, we receive your name, email, and profile photo from Google.</p>
              </div>

              <div>
                <p class="font-bold text-emerald-300 mb-1">6. Acceptable Use</p>
                <p>You agree not to upload unlawful or harmful content, attempt to disrupt or reverse-engineer the service, or misuse results to mislead others about mushroom safety.</p>
              </div>

              <div>
                <p class="font-bold text-emerald-300 mb-1">7. Termination</p>
                <p>We may suspend or terminate accounts that violate these terms. You may request deletion of your account and data at any time by contacting support.</p>
              </div>

              <div>
                <p class="font-bold text-emerald-300 mb-1">8. Changes to These Terms</p>
                <p>We may update these terms from time to time. Continued use of MycoVision after changes means you accept the updated terms.</p>
              </div>

              <p class="text-slate-400 italic">End of Terms &amp; Agreement.</p>
            </div>

            <!-- Footer -->
            <div class="relative px-6 py-4 border-t border-emerald-900/40 bg-[#0a1b15]/80 flex flex-col gap-3">
              <p class="text-[11px] text-slate-400 leading-snug">
                By clicking "I Agree", you confirm you've read these terms and understand that MycoVision results must
                <span class="text-amber-300 font-semibold">never</span> be the sole basis for eating a wild mushroom.
              </p>
              <div class="flex gap-3">
                <button
                  type="button"
                  class="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm text-emerald-300 bg-transparent border border-emerald-700/50 hover:bg-emerald-900/30 transition cursor-pointer"
                  @click="declineTerms"
                >
                  Decline
                </button>
                <button
                  type="button"
                  class="flex-[2] py-2.5 px-4 rounded-xl font-bold text-sm text-stone-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  :disabled="!hasReadTerms"
                  @click="acceptTerms"
                >
                  I Agree
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const step = ref(1)
const showConfirm = ref(false)
const loading = ref(false)
const googleLoading = ref(false)
const error = ref('')

// Terms & Agreement popup state
const agreedToTerms = ref(false)
const hasReadTerms = ref(false)
const showTerms = ref(false)
const pendingGoogle = ref(false) // true when the popup was opened from the Google button
const termsBox = ref<HTMLElement | null>(null)

function onTermsScroll() {
  const el = termsBox.value
  if (!el) return
  // Unlock "I Agree" once the user has scrolled to (near) the bottom
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) {
    hasReadTerms.value = true
  }
}

function openTerms(fromGoogle = false) {
  pendingGoogle.value = fromGoogle
  showTerms.value = true
  // If the content already fits without scrolling, unlock immediately
  nextTick(onTermsScroll)
}

function closeTerms() {
  showTerms.value = false
  pendingGoogle.value = false
}

function declineTerms() {
  agreedToTerms.value = false
  closeTerms()
}

function acceptTerms() {
  if (!hasReadTerms.value) return
  agreedToTerms.value = true
  const launchGoogle = pendingGoogle.value
  closeTerms()
  if (launchGoogle) handleGoogleRegister()
}

// Google sign-up requires accepting the terms first
function onGoogleClick() {
  if (agreedToTerms.value) {
    handleGoogleRegister()
  } else {
    openTerms(true)
  }
}

// Close popup with Esc and lock page scroll while it is open
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && showTerms.value) closeTerms()
}
watch(showTerms, (open) => {
  if (typeof document !== 'undefined') document.body.style.overflow = open ? 'hidden' : ''
})
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})


// Load Google Identity Services script
useHead({
  script: [
    {
      src: 'https://accounts.google.com/gsi/client',
      async: true,
      defer: true,
    },
  ],
})

// Redirect if already logged in
onMounted(() => {
  const token = localStorage.getItem('token')
  const role  = localStorage.getItem('role')
  if (token) {
    if (role === 'admin' || role === 'super_admin') {
      navigateTo('/admin/dashboard')
    } else {
      navigateTo('/users/scan')
    }
  }
})

// Custom Google button — opens Google account picker popup on click
function handleGoogleRegister() {
  error.value = ''
  const gsi = (window as any).google
  if (!gsi) {
    error.value = 'Google Sign-In is not available. Please refresh and try again.'
    return
  }
  const tokenClient = gsi.accounts.oauth2.initTokenClient({
    client_id: config.public.googleClientId,
    scope: 'email profile',
    prompt: 'select_account',
    callback: async (resp: any) => {
      if (resp.error) {
        error.value = 'Google sign-up was cancelled or failed.'
        googleLoading.value = false
        return
      }
      await processGoogleToken(resp.access_token)
    },
  })
  googleLoading.value = true
  tokenClient.requestAccessToken()
}

// ── Philippine Cascading Address ──
const PSGC = 'https://psgc.cloud/api'

const addr = reactive({
  regionCode: '',
  regionName: '',
  provinceCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
  barangayCode: '',
  barangayName: '',
  street: '',
})

const addrLoading = reactive({
  regions: false,
  provinces: false,
  cities: false,
  barangays: false,
})

const regions   = ref<{ code: string; name: string }[]>([])
const provinces = ref<{ code: string; name: string }[]>([])
const cities    = ref<{ code: string; name: string }[]>([])
const barangays = ref<{ code: string; name: string }[]>([])

async function loadRegions() {
  addrLoading.regions = true
  try {
    const data = await $fetch<any[]>(`${PSGC}/regions`)
    regions.value = data
      .map((r: any) => ({ code: r.code, name: r.name }))
      .sort((a, b) => a.name.localeCompare(b.name))
  } catch { regions.value = [] }
  finally { addrLoading.regions = false }
}

async function onRegionChange() {
  const r = regions.value.find(x => x.code === addr.regionCode)
  addr.regionName   = r?.name ?? ''
  addr.provinceCode = ''; addr.provinceName = ''
  addr.cityCode     = ''; addr.cityName     = ''
  addr.barangayCode = ''; addr.barangayName = ''
  provinces.value = []; cities.value = []; barangays.value = []
  if (!addr.regionCode) return
  addrLoading.provinces = true
  try {
    const data = await $fetch<any[]>(`${PSGC}/regions/${addr.regionCode}/provinces`)
    provinces.value = data
      .map((p: any) => ({ code: p.code, name: p.name }))
      .sort((a, b) => a.name.localeCompare(b.name))
  } catch { provinces.value = [] }
  finally { addrLoading.provinces = false }
}

async function onProvinceChange() {
  const p = provinces.value.find(x => x.code === addr.provinceCode)
  addr.provinceName = p?.name ?? ''
  addr.cityCode     = ''; addr.cityName     = ''
  addr.barangayCode = ''; addr.barangayName = ''
  cities.value = []; barangays.value = []
  if (!addr.provinceCode) return
  addrLoading.cities = true
  try {
    const data = await $fetch<any[]>(`${PSGC}/provinces/${addr.provinceCode}/cities-municipalities`)
    cities.value = data
      .map((c: any) => ({ code: c.code, name: c.name }))
      .sort((a, b) => a.name.localeCompare(b.name))
  } catch { cities.value = [] }
  finally { addrLoading.cities = false }
}

async function onCityChange() {
  const c = cities.value.find(x => x.code === addr.cityCode)
  addr.cityName     = c?.name ?? ''
  addr.barangayCode = ''; addr.barangayName = ''
  barangays.value = []
  if (!addr.cityCode) return
  addrLoading.barangays = true
  try {
    const data = await $fetch<any[]>(`${PSGC}/cities-municipalities/${addr.cityCode}/barangays`)
    barangays.value = data
      .map((b: any) => ({ code: b.code, name: b.name }))
      .sort((a, b) => a.name.localeCompare(b.name))
  } catch { barangays.value = [] }
  finally { addrLoading.barangays = false }
}

function onBarangayChange() {
  const b = barangays.value.find(x => x.code === addr.barangayCode)
  addr.barangayName = b?.name ?? ''
}

// Build the full address string from dropdown selections
const fullAddress = computed(() => {
  const parts = [
    addr.street,
    addr.barangayName,
    addr.cityName,
    addr.provinceName,
    addr.regionName,
  ].filter(Boolean)
  return parts.join(', ')
})

// Load regions on mount
onMounted(loadRegions)

const form = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  contact: '',
  get address() { return fullAddress.value },
})

// ── Email & phone format validation ──
const emailValid = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
)

// Email availability — debounced live check against the backend
const emailStatus = ref<'empty' | 'invalid' | 'checking' | 'available' | 'taken'>('empty')
let emailCheckTimer: ReturnType<typeof setTimeout> | null = null

const emailHint = computed(() => {
  switch (emailStatus.value) {
    case 'invalid':   return { text: 'Enter a valid email (name@example.com)', color: 'text-red-400',     dot: 'bg-red-400' }
    case 'checking':  return { text: 'Checking availability…',                   color: 'text-amber-400',   dot: 'bg-amber-400' }
    case 'available': return { text: 'Email is available',                       color: 'text-emerald-400',  dot: 'bg-emerald-400' }
    case 'taken':     return { text: 'This email is already registered',         color: 'text-red-400',     dot: 'bg-red-400' }
    default:          return { text: '', color: '', dot: '' }
  }
})

watch(() => form.email, (val) => {
  if (emailCheckTimer) { clearTimeout(emailCheckTimer); emailCheckTimer = null }
  const v = (val || '').trim()
  if (!v) { emailStatus.value = 'empty'; return }
  if (!emailValid.value) { emailStatus.value = 'invalid'; return }
  emailStatus.value = 'checking'
  emailCheckTimer = setTimeout(async () => {
    try {
      const res = await $fetch<{ available: boolean }>(`${config.public.apiBase}/register/check-email`, {
        params: { email: v },
      })
      emailStatus.value = res.available ? 'available' : 'taken'
    } catch {
      // Network/validation hiccup — don't block the user; submit-time validation still enforces uniqueness
      emailStatus.value = 'available'
    }
  }, 500)
})

function normalizePhone(input: string): string {
  return (input || '').replace(/[\s\-()]/g, '')
}

const phoneValid = computed(() =>
  /^(\+63|0)9\d{9}$/.test(normalizePhone(form.contact))
)

function goNext() {
  error.value = ''
  if (!form.firstName || !form.lastName || !form.username || !form.email || !form.contact || !form.password || !form.confirmPassword) {
    error.value = 'Please fill out all required fields.'
    return
  }
  if (emailStatus.value === 'invalid') {
    error.value = 'Please enter a valid email address (e.g. name@example.com).'
    return
  }
  if (emailStatus.value === 'taken') {
    error.value = 'This email is already registered. Please use a different email.'
    return
  }
  if (!phoneValid.value) {
    error.value = 'Please enter a valid Philippine mobile number (e.g. 0917 123 4567 or +63 917 123 4567).'
    return
  }
  if (!addr.regionCode || !addr.provinceCode || !addr.cityCode || !addr.barangayCode) {
    error.value = 'Please complete your address (Region, Province, City, and Barangay are required).'
    return
  }
  if (form.password.length < 8) {
    error.value = 'Password must be at least 8 characters.'
    return
  }
  if (!/[A-Z]/.test(form.password)) {
    error.value = 'Password must contain at least one uppercase letter (A–Z).'
    return
  }
  if (!/[0-9]/.test(form.password)) {
    error.value = 'Password must contain at least one number (0–9).'
    return
  }
  if (!/[^A-Za-z0-9]/.test(form.password)) {
    error.value = 'Password must contain at least one special character (e.g. !@#$%).'
    return
  }
  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match.'
    return
  }
  step.value = 2
}

async function handleRegister() {
  error.value = ''
  if (!agreedToTerms.value) {
    error.value = 'You must read and agree to the Terms & Agreement to create an account.'
    return
  }
  loading.value = true

  try {
    const data = await $fetch<{ user: any; token: string }>(`${config.public.apiBase}/register`, {
      method: 'POST',
      body: {
        first_name: form.firstName,
        last_name: form.lastName,
        username: form.username,
        email: form.email,
        contact_number: form.contact,
        address: form.address,
        password: form.password,
        password_confirmation: form.confirmPassword,
      },
    })

    // Persist auth data
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('role', data.user.role)

    await navigateTo('/users/scan')
  } catch (err: any) {
    let msg = err?.data?.message || 'Registration failed.'
    if (err?.data?.errors) {
      const firstErrorKey = Object.keys(err.data.errors)[0]
      if (firstErrorKey) {
        msg = err.data.errors[firstErrorKey][0]
      }
    }
    error.value = msg
    step.value = 1 // Go back to step 1 to let them fix the error
  } finally {
    loading.value = false
  }
}

async function processGoogleToken(accessToken: string) {
  googleLoading.value = true
  error.value = ''
  try {
    const data = await $fetch<{ user: any; token: string; needs_completion: boolean }>(`${config.public.apiBase}/auth/google`, {
      method: 'POST',
      body: { access_token: accessToken },
    })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('role', data.user.role)

    // Gate: force profile completion for new / incomplete Google accounts
    if (data.needs_completion) {
      await navigateTo('/complete-profile', { external: true })
      return
    }

    // Full-page redirect (not a client-side route change): the Google popup callback runs outside
    // Vue's lifecycle, so an SPA transition left the old page stuck under the new layout.
    const isAdmin = data.user.role === 'admin' || data.user.role === 'super_admin'
    await navigateTo(isAdmin ? '/admin/dashboard' : '/users/scan', { external: true })
  } catch (err: any) {
    error.value = err?.data?.message || 'Google sign-up failed. Please try again.'
  } finally {
    googleLoading.value = false
  }
}
</script>
