<template>
  <div class="flex flex-col gap-2">
    <!-- Region -->
    <div class="relative">
      <select
        v-model="addr.regionCode"
        :disabled="disabled || loading.regions"
        :class="[selectCls, addr.regionCode ? 'text-[#0f172a]' : 'text-[#94a3b8]']"
        @change="onRegionChange"
      >
        <option value="" disabled>{{ loading.regions ? 'Loading regions…' : 'Select Region' }}</option>
        <option v-for="r in regions" :key="r.code" :value="r.code">{{ r.name }}</option>
      </select>
      <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
        <svg v-if="loading.regions" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
        <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </span>
    </div>

    <!-- Province -->
    <div class="relative">
      <select
        v-model="addr.provinceCode"
        :disabled="disabled || !addr.regionCode || loading.provinces"
        :class="[selectCls, addr.provinceCode ? 'text-[#0f172a]' : 'text-[#94a3b8]']"
        @change="onProvinceChange"
      >
        <option value="" disabled>{{ loading.provinces ? 'Loading provinces…' : (addr.regionCode ? 'Select Province' : 'Select a region first') }}</option>
        <option v-for="p in provinces" :key="p.code" :value="p.code">{{ p.name }}</option>
      </select>
      <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
        <svg v-if="loading.provinces" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
        <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </span>
    </div>

    <!-- City / Municipality -->
    <div class="relative">
      <select
        v-model="addr.cityCode"
        :disabled="disabled || !addr.provinceCode || loading.cities"
        :class="[selectCls, addr.cityCode ? 'text-[#0f172a]' : 'text-[#94a3b8]']"
        @change="onCityChange"
      >
        <option value="" disabled>{{ loading.cities ? 'Loading cities…' : (addr.provinceCode ? 'Select City / Municipality' : 'Select a province first') }}</option>
        <option v-for="c in cities" :key="c.code" :value="c.code">{{ c.name }}</option>
      </select>
      <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
        <svg v-if="loading.cities" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
        <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </span>
    </div>

    <!-- Barangay -->
    <div class="relative">
      <select
        v-model="addr.barangayCode"
        :disabled="disabled || !addr.cityCode || loading.barangays"
        :class="[selectCls, addr.barangayCode ? 'text-[#0f172a]' : 'text-[#94a3b8]']"
        @change="onBarangayChange"
      >
        <option value="" disabled>{{ loading.barangays ? 'Loading barangays…' : (addr.cityCode ? 'Select Barangay' : 'Select a city first') }}</option>
        <option v-for="b in barangays" :key="b.code" :value="b.code">{{ b.name }}</option>
      </select>
      <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
        <svg v-if="loading.barangays" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
        <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </span>
    </div>

    <!-- Street / House No. -->
    <input
      v-model="addr.street"
      type="text"
      placeholder="House No. / Street / Purok (optional)"
      :disabled="disabled"
      class="w-full py-[9px] px-3.5 border border-[#e2e8f0] rounded-[10px] text-[14px] font-sans text-[#0f172a] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] disabled:opacity-60"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * Cascading Philippine address picker (Region → Province → City/Municipality → Barangay + street).
 * v-model is the combined address string, e.g. "Street, Barangay, City, Province, Region".
 * Uses the same PSGC API as the registration page.
 */
const props = defineProps<{ modelValue?: string; disabled?: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const PSGC = 'https://psgc.cloud/api'

const selectCls =
  'w-full py-[9px] pl-3.5 pr-9 border border-[#e2e8f0] rounded-[10px] text-[14px] font-sans bg-white outline-none appearance-none cursor-pointer transition-colors focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.1)] disabled:opacity-60 disabled:cursor-not-allowed'

type Item = { code: string; name: string }

const addr = reactive({
  regionCode: '', regionName: '',
  provinceCode: '', provinceName: '',
  cityCode: '', cityName: '',
  barangayCode: '', barangayName: '',
  street: '',
})

const loading = reactive({ regions: false, provinces: false, cities: false, barangays: false })

const regions = ref<Item[]>([])
const provinces = ref<Item[]>([])
const cities = ref<Item[]>([])
const barangays = ref<Item[]>([])

const toItems = (data: any[]): Item[] =>
  (Array.isArray(data) ? data : [])
    .map((x: any) => ({ code: x.code, name: x.name }))
    .sort((a, b) => a.name.localeCompare(b.name))

async function loadRegions() {
  loading.regions = true
  try {
    regions.value = toItems(await $fetch<any[]>(`${PSGC}/regions`))
  } catch { regions.value = [] }
  finally { loading.regions = false }
}

async function onRegionChange() {
  addr.regionName = regions.value.find(x => x.code === addr.regionCode)?.name ?? ''
  addr.provinceCode = ''; addr.provinceName = ''
  addr.cityCode = ''; addr.cityName = ''
  addr.barangayCode = ''; addr.barangayName = ''
  provinces.value = []; cities.value = []; barangays.value = []
  if (!addr.regionCode) return
  loading.provinces = true
  try {
    provinces.value = toItems(await $fetch<any[]>(`${PSGC}/regions/${addr.regionCode}/provinces`))
  } catch { provinces.value = [] }
  finally { loading.provinces = false }
}

async function onProvinceChange() {
  addr.provinceName = provinces.value.find(x => x.code === addr.provinceCode)?.name ?? ''
  addr.cityCode = ''; addr.cityName = ''
  addr.barangayCode = ''; addr.barangayName = ''
  cities.value = []; barangays.value = []
  if (!addr.provinceCode) return
  loading.cities = true
  try {
    cities.value = toItems(await $fetch<any[]>(`${PSGC}/provinces/${addr.provinceCode}/cities-municipalities`))
  } catch { cities.value = [] }
  finally { loading.cities = false }
}

async function onCityChange() {
  addr.cityName = cities.value.find(x => x.code === addr.cityCode)?.name ?? ''
  addr.barangayCode = ''; addr.barangayName = ''
  barangays.value = []
  if (!addr.cityCode) return
  loading.barangays = true
  try {
    barangays.value = toItems(await $fetch<any[]>(`${PSGC}/cities-municipalities/${addr.cityCode}/barangays`))
  } catch { barangays.value = [] }
  finally { loading.barangays = false }
}

function onBarangayChange() {
  addr.barangayName = barangays.value.find(x => x.code === addr.barangayCode)?.name ?? ''
}

const fullAddress = computed(() =>
  [addr.street.trim(), addr.barangayName, addr.cityName, addr.provinceName, addr.regionName]
    .filter(Boolean)
    .join(', ')
)

watch(fullAddress, (val) => {
  if (val !== props.modelValue) emit('update:modelValue', val)
}, { immediate: true })

onMounted(loadRegions)
</script>

