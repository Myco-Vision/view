<template>
  <div class="min-h-screen bg-[#07130f] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden">
    <div
      v-if="restoringSession"
      class="fixed inset-0 z-50 bg-[#07130f] flex flex-col items-center justify-center gap-3"
    >
      <div class="w-9 h-9 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
      <p class="text-sm text-emerald-300 font-medium">Restoring your session…</p>
    </div>

    <!-- ── GLOBAL BACKGROUND GLOW / MESH ACCENTS ─────────── -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-[140px]" />
      <div class="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[160px]" />
      <div class="absolute -bottom-40 left-1/3 w-[700px] h-[700px] bg-emerald-800/15 rounded-full blur-[180px]" />
      <div class="absolute inset-0 bg-[radial-gradient(#15382b_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
    </div>

    <!-- ── NAVIGATION BAR ─────────────────────────────────── -->
    <header class="sticky top-0 z-40 backdrop-blur-xl bg-[#081712]/85 border-b border-emerald-900/30 transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <!-- Brand Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform">
            <!-- Custom Mushroom Icon -->
            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C7.03 2 3 6.03 3 11c0 1.25.26 2.44.73 3.52C4.1 15.35 4.8 16 5.6 16h12.8c.8 0 1.5-.65 1.87-1.48.47-1.08.73-2.27.73-3.52 0-4.97-4.03-9-9-9zm-1.5 15h3v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-5z" />
            </svg>
          </div>
          <div class="flex flex-col">
            <span class="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Myco<span class="text-emerald-400">Vision</span>
            </span>
            <span class="text-[10px] tracking-wider uppercase text-emerald-400/80 font-semibold hidden sm:block">
              AI Mushroom Intelligence
            </span>
          </div>
        </NuxtLink>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" class="hover:text-emerald-400 transition-colors">Features</a>
          <a href="#scanner-demo" class="hover:text-emerald-400 transition-colors">AI Scanner</a>
          <a href="#pricing" class="hover:text-emerald-400 transition-colors">Pricing</a>
        </nav>

        <!-- Navbar Action Buttons -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- General Sign In trigger -->
          <button
            @click="openLoginModal()"
            class="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition cursor-pointer shadow-sm"
          >
            Sign In
          </button>

          <!-- Register / Free scans CTA -->
          <NuxtLink
            to="/register"
            class="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 shadow-md shadow-emerald-600/30 transition cursor-pointer"
          >
            Free Sign Up
          </NuxtLink>
        </div>

      </div>
    </header>

    <!-- ── HERO SECTION WITH EMBEDDED LOGIN HUB ──────────── -->
    <section class="relative z-10 pt-10 pb-20 lg:pt-16 lg:pb-32 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <!-- Left Column: Value Proposition & Hero Highlights -->
          <div class="lg:col-span-7 flex flex-col items-start">
            
            <!-- Tech Badge -->
            <div class="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-6 backdrop-blur-md">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span class="text-center leading-snug">Deep Learning Computer Vision<span class="hidden sm:inline"> • 99.4% Species Accuracy</span></span>
            </div>

            <!-- Hero Headline -->
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Identify Wild Mushrooms <br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                with Science &amp; AI
              </span>
            </h1>

            <!-- Subheading -->
            <p class="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-light">
              Designed for foragers, mycologists, and environmental scientists.
              Classify species in seconds, receive critical toxicity warnings, map geo-tagged habitats, and manage research records on one unified platform.
            </p>

            <!-- Dual Quick Buttons -->
            <div class="mt-8 flex flex-wrap items-center gap-4">
              <button
                @click="scrollToLogin"
                class="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-stone-950 shadow-xl shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                <span>Access Login Portal</span>
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

            </div>

            <!-- Trust Metrics Bar -->
            <div class="mt-12 pt-8 border-t border-emerald-900/30 grid grid-cols-3 gap-3 sm:gap-10 w-full max-w-xl">
              <div>
                <p class="text-xl sm:text-3xl font-black text-white">500+</p>
                <p class="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-medium">Species Indexed</p>
              </div>
              <div>
                <p class="text-xl sm:text-3xl font-black text-emerald-400">3 Scans</p>
                <p class="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-medium">Free Lifetime Tier</p>
              </div>
              <div>
                <p class="text-xl sm:text-3xl font-black text-white">99.8%</p>
                <p class="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-medium">Safety Verification</p>
              </div>
            </div>

          </div>

          <!-- Right Column: Embedded Forager Login Card -->
          <div id="login-hub" class="lg:col-span-5 w-full">
            <div class="relative bg-[#0d221b]/90 border border-emerald-700/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-2xl">
              
              <!-- Ambient card top glow -->
              <div class="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

              <!-- Header for Forager Sign In -->
              <div class="mb-5">
                <div class="flex items-center justify-between">
                  <h2 class="text-xl font-bold text-white flex items-center gap-2">
                    <span>Forager Sign In</span>
                  </h2>
                  <span
                    class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/40"
                  >
                    Member Portal
                  </span>
                </div>
                <p class="text-xs text-slate-300 mt-1">
                  Scan mushrooms, view history, and manage your subscription.
                </p>
              </div>

              <!-- Error Alert -->
              <div v-if="loginError" class="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-start gap-2">
                <svg class="w-4 h-4 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div class="flex-1 min-w-0">
                  <p>{{ loginError }}</p>
                  <NuxtLink
                    v-if="unverifiedEmail"
                    :to="`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`"
                    class="inline-block mt-1.5 font-semibold text-emerald-300 hover:text-emerald-200 underline"
                  >
                    Resend verification link →
                  </NuxtLink>
                </div>
              </div>

              <!-- Form Inputs -->
              <form @submit.prevent="handleLoginSubmit" class="space-y-4">
                
                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div class="relative">
                    <input
                      id="login-email-input"
                      v-model="loginForm.email"
                      type="email"
                      required
                      placeholder="e.g. forager@example.com"
                      class="w-full py-2.5 pl-10 pr-4 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                      :disabled="isSubmitting"
                    />
                    <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div class="relative">
                    <input
                      id="login-password-input"
                      v-model="loginForm.password"
                      :type="showPassword ? 'text' : 'password'"
                      required
                      placeholder="••••••••"
                      class="w-full py-2.5 pl-10 pr-10 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                      :disabled="isSubmitting"
                    />
                    <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Forgot password link -->
                <div class="flex justify-end -mt-1">
                  <NuxtLink
                    to="/forgot-password"
                    class="text-[12.5px] hover:underline font-semibold transition-colors text-emerald-400 hover:text-emerald-300"
                  >Forgot password?</NuxtLink>
                </div>

                <!-- Submit Button -->
                <button
                  id="login-submit-button"
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full py-3 px-4 rounded-xl font-bold text-sm text-stone-950 transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-emerald-500/20"
                >
                  <svg v-if="isSubmitting" class="w-4 h-4 animate-spin text-stone-950" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>{{ isSubmitting ? 'Authenticating...' : 'Login as Forager' }}</span>
                </button>
              </form>

              <!-- Continue with Google -->
              <div class="mt-4">
                <div class="flex items-center gap-3">
                  <div class="flex-1 h-px bg-emerald-900/50" />
                  <span class="text-[11px] text-slate-500 font-medium">or</span>
                  <div class="flex-1 h-px bg-emerald-900/50" />
                </div>
                <button
                  id="landing-google-button"
                  type="button"
                  @click="handleGoogleLogin"
                  :disabled="googleLoading || isSubmitting"
                  class="mt-3 w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 border bg-[#0d1f19] hover:bg-emerald-950/80 border-emerald-700/50 hover:border-emerald-500/60 text-slate-200 hover:text-white hover:shadow-md hover:shadow-emerald-900/30"
                >
                  <svg v-if="googleLoading" class="w-4 h-4 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" class="w-4 h-4 shrink-0">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>{{ googleLoading ? 'Signing in…' : 'Continue with Google' }}</span>
                </button>
              </div>

              <!-- Footer info & Register link -->
              <div class="mt-6 pt-5 border-t border-emerald-900/30 flex items-center justify-between text-xs text-slate-400">
                <span>
                  New to MycoVision?
                  <NuxtLink to="/register" class="text-emerald-400 hover:underline font-semibold ml-1">Create free account</NuxtLink>
                </span>

                <span class="text-[11px] text-slate-500">v2.4 Core</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- ── INTERACTIVE AI SCANNER SIMULATION ──────────────── -->
    <section id="scanner-demo" class="relative z-10 py-20 bg-[#091b15]/60 border-y border-emerald-900/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-2xl mx-auto mb-14">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800/40">
            Real-Time Inference Demo
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white mt-3">
            See the Neural Classifier in Action
          </h2>
          <p class="text-sm text-slate-300 mt-2">
            Try switching samples below to test how our computer vision pipeline identifies edible vs. toxic species.
          </p>
        </div>

        <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#0d261e]/80 border border-emerald-700/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          
          <!-- Viewfinder Column -->
          <div class="md:col-span-6 relative rounded-2xl overflow-hidden aspect-square border border-emerald-500/30 bg-black group">
            
            <!-- Mushroom Photo -->
            <img
              :src="activeSample.image"
              :alt="activeSample.shortName" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <!-- Scanline Animation -->
            <div class="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent h-24 w-full animate-pulse" />

            <!-- Bounding Box Overlay -->
            <div class="absolute inset-10 border-2 border-dashed border-emerald-400/70 rounded-xl pointer-events-none flex flex-col justify-between p-2">
              <div class="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                <span>[DETECT: {{ activeSample.confidence }}]</span>
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div class="text-[10px] font-mono text-emerald-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs self-start">
                GEO: 14.5995°N, 120.9842°E
              </div>
            </div>

          </div>

          <!-- Analysis Results Column -->
          <div class="md:col-span-6 flex flex-col justify-between h-full space-y-6">
            
            <div>
              <!-- Sample Switcher Pills -->
              <div class="flex items-center gap-2 mb-4">
                <button
                  v-for="(sample, idx) in demoSamples"
                  :key="idx"
                  @click="activeSampleIdx = idx"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border"
                  :class="activeSampleIdx === idx ? 'bg-emerald-500 text-stone-950 border-emerald-400' : 'bg-stone-950/60 text-slate-300 border-emerald-900/60 hover:text-white'"
                >
                  {{ sample.shortName }}
                </button>
              </div>

              <!-- Species Identification Title -->
              <p class="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold">Scientific Classification</p>
              <h3 class="text-2xl font-serif italic text-white mt-1">{{ activeSample.scientificName }}</h3>
              <p class="text-sm text-slate-300 font-medium">{{ activeSample.commonName }}</p>

              <!-- Safety Badge -->
              <div class="mt-4 flex items-center gap-2">
                <span
                  class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border flex items-center gap-1.5"
                  :class="activeSample.edibilityClass"
                >
                  <span class="w-2 h-2 rounded-full" :class="activeSample.dotColor" />
                  <span>{{ activeSample.edibility }}</span>
                </span>

                <span class="text-xs text-slate-400 font-medium">
                  Model Confidence: <strong class="text-white">{{ activeSample.confidence }}</strong>
                </span>
              </div>

              <p class="text-xs text-slate-300 mt-4 leading-relaxed bg-black/30 p-3.5 rounded-xl border border-emerald-900/30">
                {{ activeSample.notes }}
              </p>
            </div>

            <!-- Action to scan own -->
            <div class="pt-4 border-t border-emerald-900/40 flex items-center justify-between">
              <div>
                <p class="text-xs text-slate-400">Have a wild mushroom photo?</p>
                <p class="text-xs font-bold text-white">Upload and scan in 2 seconds</p>
              </div>
              <button
                @click="openLoginModal()"
                class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-stone-950 transition cursor-pointer shadow-md"
              >
                Scan Now
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>

    <!-- ── CORE FEATURES GRID ─────────────────────────────── -->
    <section id="features" class="relative z-10 py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-2xl mx-auto mb-16">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800/40">
            Platform Capabilities
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white mt-3">
            Engineered for Field Safety &amp; Science
          </h2>
          <p class="text-sm text-slate-300 mt-2">
            Every feature is built around the strict safety needs of wild mushroom foraging and taxonomic documentation.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <!-- Feature 1 -->
          <div class="bg-[#0b211a]/80 border border-emerald-800/30 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 group">
            <div class="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <AppIcon name="eye" class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-white mb-2">Neural Visual Recognition</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
              Trained convolutional neural network analyzing cap shape, gill attachments, stem texture, and spore print characteristics.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-[#0b211a]/80 border border-emerald-800/30 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 group">
            <div class="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <AppIcon name="warning" class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-white mb-2">Toxicity &amp; Hazard Screening</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
              Automated lookalike cross-referencing flags deadly amatoxins, muscarine, and gastrointestinal irritants immediately.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-[#0b211a]/80 border border-emerald-800/30 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 group">
            <div class="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <AppIcon name="map-pin" class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-white mb-2">GPS Habitat Logging</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
              Pinpoint exact latitude, longitude, forest elevation, and substrate logs for your personal foraging map.
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="bg-[#0b211a]/80 border border-emerald-800/30 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 group">
            <div class="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <AppIcon name="credit-card" class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-white mb-2">PayMongo GCash Checkout</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
              Instant activation with GCash. Monthly or Annual unlimited scanning with auto-sync.
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="bg-[#0b211a]/80 border border-emerald-800/30 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 group">
            <div class="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <AppIcon name="book" class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-white mb-2">Curated Species Compendium</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
              Explore taxonomic descriptions, spore print diagrams, seasonality, and culinary preparation guidelines.
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="bg-[#0b211a]/80 border border-emerald-800/30 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 group">
            <div class="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <AppIcon name="sparkles" class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-white mb-2">Interactive MycoDex Rewards</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
              Discover wild mushroom species, unlock silhouette entries in your personal MycoDex, and earn points redeemable for Pro passes.
            </p>
          </div>

        </div>

      </div>
    </section>

    <!-- ── PRICING & SUBSCRIPTION PLANS ──────────────────── -->
    <section id="pricing" class="relative z-10 py-24 bg-[#081813]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-2xl mx-auto mb-16">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800/40">
            Transparent Pricing
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white mt-3">
            Simple, Accessible Foraging Plans
          </h2>
          <p class="text-sm text-slate-300 mt-2">
            Start completely free. Upgrade with GCash for unlimited scans anytime.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          <!-- Free Plan -->
          <div class="bg-[#0c221a] border border-emerald-900/50 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <span class="text-xs uppercase font-bold text-slate-400 tracking-wider">Starter</span>
              <h3 class="text-xl font-bold text-white mt-1">Free Account</h3>
              <p class="text-xs text-slate-400 mt-1">For first-time explorers</p>
              
              <div class="mt-6 flex items-baseline gap-1">
                <span class="text-4xl font-extrabold text-white">₱0</span>
                <span class="text-xs text-slate-400">/ lifetime</span>
              </div>
              <p class="text-xs text-amber-400/90 font-medium mt-1">3 lifetime scans total • Non-renewable</p>

              <ul class="mt-6 space-y-3 text-xs text-slate-300">
                <li class="flex items-center gap-2">
                  <span class="text-emerald-400 font-bold">✓</span>
                  <span>3 AI mushroom scans included</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-emerald-400 font-bold">✓</span>
                  <span>Permanent access to saved history</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-emerald-400 font-bold">✓</span>
                  <span>Species directory browsing</span>
                </li>
              </ul>
            </div>

            <NuxtLink
              to="/register"
              class="mt-8 w-full py-2.5 rounded-xl text-center text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition cursor-pointer"
            >
              Sign Up Free
            </NuxtLink>
          </div>

          <!-- Monthly Plan -->
          <div class="bg-[#0f2d22] border-2 border-emerald-500 rounded-3xl p-8 flex flex-col justify-between relative shadow-2xl shadow-emerald-950/60">
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-stone-950 text-[10px] font-extrabold uppercase tracking-wider">
              Most Popular
            </div>

            <div>
              <span class="text-xs uppercase font-bold text-emerald-400 tracking-wider">Flexible</span>
              <h3 class="text-xl font-bold text-white mt-1">Premium Monthly</h3>
              <p class="text-xs text-slate-300 mt-1">Unlimited scans with monthly flexibility</p>
              
              <div class="mt-6 flex items-baseline gap-1">
                <span class="text-4xl font-extrabold text-white">₱149</span>
                <span class="text-xs text-slate-400">/ month (~$2 USD)</span>
              </div>
              <p class="text-xs text-emerald-400 font-semibold mt-1">Unlimited AI scans • Cancel anytime</p>

              <ul class="mt-6 space-y-3 text-xs text-slate-200">
                <li class="flex items-center gap-2">
                  <span class="text-emerald-400 font-bold">✓</span>
                  <span><strong>Unlimited AI mushroom scans</strong></span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-emerald-400 font-bold">✓</span>
                  <span>Priority AI inference speed</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-emerald-400 font-bold">✓</span>
                  <span>Toxicity alerts &amp; lookalike details</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-emerald-400 font-bold">✓</span>
                  <span>Export scan &amp; collection reports (PDF)</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-emerald-400 font-bold">✓</span>
                  <span>Pay securely via GCash</span>
                </li>
              </ul>
            </div>

            <button
              @click="openLoginModal()"
              class="mt-8 w-full py-2.5 rounded-xl text-center text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-md shadow-emerald-500/20 transition cursor-pointer"
            >
              Subscribe with GCash (₱149)
            </button>
          </div>

          <!-- Annual Plan -->
          <div class="bg-[#0c221a] border border-emerald-900/50 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <span class="text-xs uppercase font-bold text-teal-400 tracking-wider">Annual Pass</span>
              <h3 class="text-xl font-bold text-white mt-1">Premium Annual</h3>
              <p class="text-xs text-slate-400 mt-1">Full year of foraging &amp; scans</p>
              
              <div class="mt-6 flex items-baseline gap-1">
                <span class="text-4xl font-extrabold text-white">₱1,299</span>
                <span class="text-xs text-slate-400">/ year</span>
              </div>
              <p class="text-xs text-teal-400 font-semibold mt-1">Only ~₱108/mo • Save 27%</p>

              <ul class="mt-6 space-y-3 text-xs text-slate-300">
                <li class="flex items-center gap-2">
                  <span class="text-teal-400 font-bold">✓</span>
                  <span>All Premium Monthly features included</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-teal-400 font-bold">✓</span>
                  <span>Full 365 days unlimited scans</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-teal-400 font-bold">✓</span>
                  <span>Save over 27% vs monthly billing</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-teal-400 font-bold">✓</span>
                  <span>Priority access to new AI models</span>
                </li>
              </ul>
            </div>

            <button
              @click="openLoginModal()"
              class="mt-8 w-full py-2.5 rounded-xl text-center text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition cursor-pointer"
            >
              Get Annual Pass (₱1,299)
            </button>
          </div>

        </div>

      </div>
    </section>

    <!-- ── FOOTER ─────────────────────────────────────────── -->
    <footer class="relative z-10 border-t border-emerald-900/40 bg-[#050e0b] py-12 text-slate-400 text-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap items-center lg:justify-between gap-6">
        
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C7.03 2 3 6.03 3 11c0 1.25.26 2.44.73 3.52C4.1 15.35 4.8 16 5.6 16h12.8c.8 0 1.5-.65 1.87-1.48.47-1.08.73-2.27.73-3.52 0-4.97-4.03-9-9-9zm-1.5 15h3v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-5z" />
            </svg>
          </div>
          <div>
            <span class="text-sm font-bold text-white">MycoVision</span>
            <p class="text-[11px] text-slate-500">Autonomous Fungal Vision &amp; Biosafety Platform</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs">
          <NuxtLink to="/?login=user" class="hover:text-emerald-400 transition">Login</NuxtLink>
          <NuxtLink to="/register" class="hover:text-emerald-400 transition">Register</NuxtLink>
          <NuxtLink to="/refund-policy" class="hover:text-emerald-400 transition">Refund Policy</NuxtLink>
        </div>

        <p class="text-[11px] text-slate-500 text-center md:text-right">
          © {{ new Date().getFullYear() }} MycoVision. For field research &amp; educational safety.
        </p>

      </div>
    </footer>

    <!-- ── FLOATING / TELEPORTED LOGIN MODAL ──────────────── -->
    <Teleport to="body">
      <div
        v-if="modalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      >
        <div
          class="bg-[#0d221b] border border-emerald-700/40 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto"
        >
          <!-- Close Button -->
          <button
            @click="modalOpen = false"
            class="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-stone-950/40 border border-emerald-900/40 cursor-pointer"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h3 class="text-xl font-bold text-white">
            Sign In to Forager Portal
          </h3>
          <p class="text-xs text-slate-300 mt-1 mb-4">
            Enter your credentials to manage your scans and subscriptions.
          </p>

          <!-- Error Alert -->
          <div v-if="loginError" class="mb-4 p-2.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs">
            <p>{{ loginError }}</p>
            <NuxtLink
              v-if="unverifiedEmail"
              :to="`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`"
              class="inline-block mt-1.5 font-semibold text-emerald-300 hover:text-emerald-200 underline"
            >
              Resend verification link →
            </NuxtLink>
          </div>

          <!-- Modal Form -->
          <form @submit.prevent="handleLoginSubmit" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input
                v-model="loginForm.email"
                type="email"
                required
                placeholder="name@example.com"
                class="w-full py-2.5 px-3 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm focus:outline-none focus:border-emerald-400"
                :disabled="isSubmitting"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                v-model="loginForm.password"
                type="password"
                required
                placeholder="••••••••"
                class="w-full py-2.5 px-3 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm focus:outline-none focus:border-emerald-400"
                :disabled="isSubmitting"
              />
            </div>

            <!-- Forgot password link -->
            <div class="flex justify-end -mt-1">
              <NuxtLink
                to="/forgot-password"
                class="text-[12.5px] hover:underline font-semibold transition-colors text-emerald-400 hover:text-emerald-300"
              >Forgot password?</NuxtLink>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full py-3 rounded-xl font-bold text-sm text-stone-950 transition-all cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300"
            >
              <span>{{ isSubmitting ? 'Verifying...' : 'Login as Forager' }}</span>
            </button>
          </form>

          <!-- Continue with Google -->
          <div class="mt-4">
            <div class="flex items-center gap-3">
              <div class="flex-1 h-px bg-emerald-900/50" />
              <span class="text-[11px] text-slate-500 font-medium">or</span>
              <div class="flex-1 h-px bg-emerald-900/50" />
            </div>
            <button
              id="modal-google-button"
              type="button"
              @click="handleGoogleLogin"
              :disabled="googleLoading || isSubmitting"
              class="mt-3 w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 border bg-[#0d1f19] hover:bg-emerald-950/80 border-emerald-700/50 hover:border-emerald-500/60 text-slate-200 hover:text-white"
            >
              <svg v-if="googleLoading" class="w-4 h-4 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <svg v-else viewBox="0 0 24 24" class="w-4 h-4 shrink-0">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>{{ googleLoading ? 'Signing in…' : 'Continue with Google' }}</span>
            </button>
          </div>

          <p class="text-center text-xs text-slate-400 mt-4">
            No account yet?
            <NuxtLink to="/register" class="text-emerald-400 hover:underline font-semibold ml-1">Register for free</NuxtLink>
          </p>

        </div>
      </div>
    </Teleport>

    <GooglePasswordModal
      :challenge="googleChallenge"
      :loading="googlePasswordSubmitting"
      :error="googlePasswordError"
      @submit="submitChallengePassword"
      @close="cancelChallenge"
    />
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { getToken, setSession, getHomeRoute, restoreAndValidateSession } = useAuthSession()
const restoringSession = ref(false)

onMounted(async () => {
  if (!getToken()) return
  restoringSession.value = true
  try {
    const user = await restoreAndValidateSession()
    if (user) {
      await navigateTo(getHomeRoute(user), { replace: true })
      return
    }
  } finally {
    restoringSession.value = false
  }
})

// SEO Meta
useHead({
  title: 'MycoVision — AI Mushroom Identification & Forager Platform',
  meta: [
    {
      name: 'description',
      content: 'Identify wild mushrooms with deep learning AI vision, toxicity warnings, GPS habitat logs, and scientific mycology taxonomy.'
    }
  ]
})

const modalOpen = ref(false)

// Login Form State
const loginForm = reactive({
  email: '',
  password: '',
})
const showPassword = ref(false)
const isSubmitting = ref(false)
const loginError = ref('')
const unverifiedEmail = ref('')

function openLoginModal() {
  loginError.value = ''
  unverifiedEmail.value = ''
  modalOpen.value = true
}

// Auto-open modal when redirected from /login (or redirect ?login=admin to /admin/login)
const route = useRoute()
onMounted(async () => {
  const loginParam = route.query.login as string
  if (loginParam === 'admin') {
    await navigateTo('/admin/login', { replace: true })
    return
  }
  if (loginParam === 'user') {
    openLoginModal()
  }
})

function scrollToLogin() {
  const el = document.getElementById('login-hub')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const emailInput = document.getElementById('login-email-input')
    if (emailInput) emailInput.focus()
  } else {
    modalOpen.value = true
  }
}

// ── Continue with Google ──
const googleLoading = ref(false)
const {
  challenge: googleChallenge,
  passwordSubmitting: googlePasswordSubmitting,
  passwordError: googlePasswordError,
  processGoogleAccessToken,
  submitChallengePassword,
  cancelChallenge,
} = useGooglePasswordChallenge()

watch(googleChallenge, (val) => {
  if (val) modalOpen.value = false
})

useHead({
  script: [{ src: 'https://accounts.google.com/gsi/client', async: true, defer: true }],
})

function handleGoogleLogin() {
  loginError.value = ''
  const gsi = (window as any).google
  if (!gsi) {
    loginError.value = 'Google Sign-In is not available. Please refresh and try again.'
    return
  }
  const tokenClient = gsi.accounts.oauth2.initTokenClient({
    client_id: config.public.googleClientId,
    scope: 'email profile',
    prompt: 'select_account',
    callback: async (resp: any) => {
      if (resp.error) {
        loginError.value = 'Google sign-in was cancelled or failed.'
        googleLoading.value = false
        return
      }
      await processGoogleToken(resp.access_token)
    },
    error_callback: () => { googleLoading.value = false },
  })
  googleLoading.value = true
  tokenClient.requestAccessToken()
}

async function processGoogleToken(accessToken: string) {
  try {
    await processGoogleAccessToken(accessToken)
  } catch (err: any) {
    loginError.value = err?.data?.message || 'Google sign-in failed. Please try again.'
  } finally {
    googleLoading.value = false
  }
}

async function handleLoginSubmit() {
  loginError.value = ''
  unverifiedEmail.value = ''

  if (!loginForm.email || !loginForm.password) {
    loginError.value = 'Please provide both email and password.'
    return
  }

  isSubmitting.value = true

  try {
    const data = await $fetch<{ user: any; token: string }>(`${config.public.apiBase}/login`, {
      method: 'POST',
      body: {
        email: loginForm.email,
        password: loginForm.password,
        portal: 'user',
      },
    })

    if (data.user?.role === 'admin' || data.user?.role === 'super_admin') {
      loginError.value = 'Administrator accounts must sign in through the dedicated Admin Login portal (/admin/login).'
      return
    }

    setSession(data.token, data.user)

    modalOpen.value = false

    // Smart role-based routing
    await navigateTo(getHomeRoute(data.user))
  } catch (err: any) {
    if (err?.data?.error === 'EMAIL_NOT_VERIFIED') {
      unverifiedEmail.value = err?.data?.email || loginForm.email.trim()
    }
    const msg = err?.data?.message || err?.data?.errors?.email?.[0]
    loginError.value = msg || 'Invalid email or password. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

// ── AI SCANNER SIMULATOR DATA ──────────────────────────────
const activeSampleIdx = ref(0)
const demoSamples = [
  {
    shortName: 'Chanterelle',
    scientificName: 'Cantharellus cibarius',
    commonName: 'Golden Chanterelle',
    image: '/images/chanterelle_sample.png',
    confidence: '98.7%',
    edibility: 'Choice Edible',
    edibilityClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
    dotColor: 'bg-emerald-400',
    notes: 'Fragrant apricot aroma with false, blunt ridges rather than true gills. No toxic lookalikes detected in the immediate morphology.',
  },
  {
    shortName: 'Bioluminescent',
    scientificName: 'Panellus stipticus',
    commonName: 'Luminescent Panellus',
    image: '/images/hero_mushrooms.png',
    confidence: '96.4%',
    edibility: 'Non-Edible / Bitter',
    edibilityClass: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
    dotColor: 'bg-amber-400',
    notes: 'Exhibits green bioluminescence due to luciferin enzymatic reaction. Inedible with astringent taste. Valuable environmental bio-indicator.',
  },
]

const activeSample = computed(() => demoSamples[activeSampleIdx.value])
</script>
