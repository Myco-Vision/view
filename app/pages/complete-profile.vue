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
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/50">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C7.03 2 3 6.03 3 11c0 1.25.26 2.44.73 3.52C4.1 15.35 4.8 16 5.6 16h12.8c.8 0 1.5-.65 1.87-1.48.47-1.08.73-2.27.73-3.52 0-4.97-4.03-9-9-9zm-1.5 15h3v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-5z" />
            </svg>
          </div>
          <div class="flex flex-col">
            <span class="text-lg font-bold tracking-tight text-white">Myco<span class="text-emerald-400">Vision</span></span>
            <span class="text-[9px] tracking-wider uppercase text-emerald-400/80 font-semibold">AI Mushroom Intelligence</span>
          </div>
        </div>

        <!-- Not you? sign out -->
        <button
          type="button"
          @click="signOut"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-700/40 transition cursor-pointer"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Not you? Sign out</span>
        </button>
      </div>
    </header>

    <!-- ── MAIN CONTENT ── -->
    <main class="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-lg">

        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-xs font-medium mb-4 backdrop-blur-md">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>One last step before you start</span>
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight text-white">
            Complete Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">Profile</span>
          </h1>
          <p class="text-sm text-slate-400 mt-2">
            You signed in with Google. We just need a few more details to set up your forager account.
          </p>
        </div>

        <!-- Card -->
        <div class="relative bg-[#0d221b]/90 border border-emerald-700/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-2xl">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <!-- Google identity preview -->
          <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-stone-950/60 border border-emerald-900/40 mb-6">
            <img
              v-if="googleUser.photo"
              :src="googleUser.photo"
              :alt="googleUser.name"
              class="w-10 h-10 rounded-full border-2 border-emerald-500/40 shrink-0 object-cover"
            />
            <div v-else class="w-10 h-10 rounded-full bg-emerald-800/50 flex items-center justify-center text-emerald-300 font-bold text-lg shrink-0">
              {{ googleUser.name?.charAt(0) ?? 'G' }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-white truncate">{{ googleUser.name || 'Google User' }}</p>
              <p class="text-xs text-slate-400 truncate">{{ googleUser.email }}</p>
            </div>
            <div class="ml-auto shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/40">
              <svg viewBox="0 0 24 24" class="w-3 h-3 shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span class="text-[10px] text-emerald-400 font-semibold">Verified</span>
            </div>
          </div>

          <!-- Error banner -->
          <div v-if="error" class="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs mb-4">
            <svg class="w-4 h-4 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{{ error }}</span>
          </div>

          <!-- Form fields -->
          <div class="flex flex-col gap-4">

            <!-- Username -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[0.75rem] font-semibold text-slate-300 tracking-wide">Username</label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">@</span>
                <input
                  v-model="form.username"
                  type="text"
                  id="cp-username"
                  placeholder="your_unique_handle"
                  class="w-full py-2.5 pl-8 pr-3.5 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                  :disabled="loading"
                />
              </div>
              <p class="text-[0.68rem] text-slate-500">Choose a unique handle. You can change it later in your profile.</p>
            </div>

            <!-- Contact Number -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[0.75rem] font-semibold text-slate-300 tracking-wide">Contact Number</label>
              <input
                v-model="form.contact"
                type="text"
                id="cp-contact"
                placeholder="+63 955 123 4567"
                class="w-full py-2.5 px-3.5 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                :disabled="loading"
              />
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
                  id="cp-region"
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
                  id="cp-province"
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
                  id="cp-city"
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
                  id="cp-barangay"
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
                id="cp-street"
                placeholder="House No. / Street / Purok (optional)"
                class="w-full py-2.5 px-3.5 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                :disabled="loading"
              />
            </div>

            <!-- Submit -->
            <button
              type="button"
              id="cp-submit"
              @click="handleSubmit"
              :disabled="loading"
              class="w-full mt-1 py-3 px-4 rounded-xl font-bold text-sm text-stone-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ loading ? 'Saving…' : 'Complete My Profile' }}</span>
            </button>

          </div>
        </div>
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: [] }) // no auth middleware — page IS the gate

const config  = useRuntimeConfig()
const loading = ref(false)
const error   = ref('')

// ── Google user info from localStorage ──
const googleUser = computed(() => {
  if (import.meta.server) return { name: '', email: '', photo: '' }
  const u = JSON.parse(localStorage.getItem('user') || '{}')
  return {
    name:  u.first_name ? `${u.first_name} ${u.last_name}` : u.name ?? '',
    email: u.email ?? '',
    photo: u.profile_photo ?? '',
  }
})

// Redirect if not logged in or profile already complete
onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) { navigateTo('/login'); return }

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!user.needs_profile_completion) {
    const role = localStorage.getItem('role')
    navigateTo(role === 'admin' || role === 'super_admin' ? '/admin/dashboard' : '/users/scan')
  }
})

// ── Form ──
const form = reactive({
  username: '',
  contact: '',
})

// ── Philippine Cascading Address ──
const PSGC = 'https://psgc.cloud/api'

const addr = reactive({
  regionCode: '', regionName: '',
  provinceCode: '', provinceName: '',
  cityCode: '', cityName: '',
  barangayCode: '', barangayName: '',
  street: '',
})

const addrLoading = reactive({ regions: false, provinces: false, cities: false, barangays: false })
const regions   = ref<{ code: string; name: string }[]>([])
const provinces = ref<{ code: string; name: string }[]>([])
const cities    = ref<{ code: string; name: string }[]>([])
const barangays = ref<{ code: string; name: string }[]>([])

async function loadRegions() {
  addrLoading.regions = true
  try {
    const data = await $fetch<any[]>(`${PSGC}/regions`)
    regions.value = data.map((r: any) => ({ code: r.code, name: r.name })).sort((a, b) => a.name.localeCompare(b.name))
  } catch { regions.value = [] }
  finally { addrLoading.regions = false }
}

async function onRegionChange() {
  const r = regions.value.find(x => x.code === addr.regionCode)
  addr.regionName = r?.name ?? ''
  addr.provinceCode = ''; addr.provinceName = ''
  addr.cityCode = ''; addr.cityName = ''
  addr.barangayCode = ''; addr.barangayName = ''
  provinces.value = []; cities.value = []; barangays.value = []
  if (!addr.regionCode) return
  addrLoading.provinces = true
  try {
    const data = await $fetch<any[]>(`${PSGC}/regions/${addr.regionCode}/provinces`)
    provinces.value = data.map((p: any) => ({ code: p.code, name: p.name })).sort((a, b) => a.name.localeCompare(b.name))
  } catch { provinces.value = [] }
  finally { addrLoading.provinces = false }
}

async function onProvinceChange() {
  const p = provinces.value.find(x => x.code === addr.provinceCode)
  addr.provinceName = p?.name ?? ''
  addr.cityCode = ''; addr.cityName = ''
  addr.barangayCode = ''; addr.barangayName = ''
  cities.value = []; barangays.value = []
  if (!addr.provinceCode) return
  addrLoading.cities = true
  try {
    const data = await $fetch<any[]>(`${PSGC}/provinces/${addr.provinceCode}/cities-municipalities`)
    cities.value = data.map((c: any) => ({ code: c.code, name: c.name })).sort((a, b) => a.name.localeCompare(b.name))
  } catch { cities.value = [] }
  finally { addrLoading.cities = false }
}

async function onCityChange() {
  const c = cities.value.find(x => x.code === addr.cityCode)
  addr.cityName = c?.name ?? ''
  addr.barangayCode = ''; addr.barangayName = ''
  barangays.value = []
  if (!addr.cityCode) return
  addrLoading.barangays = true
  try {
    const data = await $fetch<any[]>(`${PSGC}/cities-municipalities/${addr.cityCode}/barangays`)
    barangays.value = data.map((b: any) => ({ code: b.code, name: b.name })).sort((a, b) => a.name.localeCompare(b.name))
  } catch { barangays.value = [] }
  finally { addrLoading.barangays = false }
}

function onBarangayChange() {
  const b = barangays.value.find(x => x.code === addr.barangayCode)
  addr.barangayName = b?.name ?? ''
}

const fullAddress = computed(() => {
  return [addr.street, addr.barangayName, addr.cityName, addr.provinceName, addr.regionName]
    .filter(Boolean).join(', ')
})

onMounted(loadRegions)

// ── Submit ──
async function handleSubmit() {
  error.value = ''
  if (!form.username.trim()) { error.value = 'Please choose a username.'; return }
  if (!form.contact.trim())  { error.value = 'Please enter your contact number.'; return }
  if (!addr.regionCode || !addr.provinceCode || !addr.cityCode || !addr.barangayCode) {
    error.value = 'Please complete your address (Region, Province, City, and Barangay are required).'
    return
  }

  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const data = await $fetch<{ user: any; message: string }>(`${config.public.apiBase}/complete-profile`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        username:       form.username.trim(),
        contact_number: form.contact.trim(),
        address:        fullAddress.value,
      },
    })

    // Update stored user — mark as complete
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('role', data.user.role)

    // Redirect to the app
    await navigateTo('/users/scan', { external: true })
  } catch (err: any) {
    let msg = err?.data?.message || 'Something went wrong. Please try again.'
    if (err?.data?.errors) {
      const firstKey = Object.keys(err.data.errors)[0]
      if (firstKey) msg = err.data.errors[firstKey][0]
    }
    error.value = msg
  } finally {
    loading.value = false
  }
}

// ── Sign out ──
function signOut() {
  localStorage.clear()
  navigateTo('/login')
}
</script>
