<template>
  <div class="min-h-screen bg-[#f5f5f3] flex items-center justify-center font-dm">
    <div class="bg-white rounded-xl shadow-[0_4px_32px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] w-full max-w-[520px] pt-9 px-8 pb-7">
      <!-- Header with progress bar -->
      <div class="mb-7">
        <h2 class="font-serif text-[1.35rem] font-normal text-[#2c2c2c] m-0 mb-[1.1rem] tracking-[-0.01em]">Register to <span class="text-[#5a9e6f] italic font-semibold">MycoVision</span></h2>
        <div class="flex items-center gap-0">
          <div class="w-7 h-7 rounded-full border-2 bg-white text-[0.78rem] font-semibold flex items-center justify-center shrink-0 transition-all duration-300" :class="step >= 1 ? (step > 1 ? 'border-[#5a9e6f] bg-[#5a9e6f] text-white' : 'border-[#5a9e6f] bg-[#5a9e6f] text-white') : 'border-[#d5d5d0] text-[#aaa]'">
            <span v-if="step <= 1">1</span>
            <span v-else class="text-[0.85rem]">✓</span>
          </div>
          <div class="flex-1 h-[2px] bg-[#e0e0dc] rounded-sm mx-1.5 overflow-hidden">
            <div class="h-full bg-[#5a9e6f] rounded-sm transition-all duration-400 ease-in-out" :style="{ width: step > 1 ? '100%' : '0%' }"></div>
          </div>
          <div class="w-7 h-7 rounded-full border-2 bg-white text-[0.78rem] font-semibold flex items-center justify-center shrink-0 transition-all duration-300" :class="step >= 2 ? 'border-[#5a9e6f] bg-[#5a9e6f] text-white' : 'border-[#d5d5d0] text-[#aaa]'">2</div>
        </div>
      </div>

      <!-- Step 1 -->
      <div v-if="step === 1" class="flex flex-col gap-3">
        <div v-if="error" class="bg-red-50 border-[1.5px] border-red-300 rounded-lg text-red-700 text-[0.85rem] py-[0.65rem] px-[0.9rem] mb-2">{{ error }}</div>
        
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1.5">
            <label class="text-[0.78rem] font-medium text-[#555] tracking-[0.01em]">First Name</label>
            <input v-model="form.firstName" type="text" placeholder="Maria" class="w-full py-[0.65rem] px-[0.85rem] border-[1.5px] border-[#e0e0dc] rounded-lg font-dm text-[0.875rem] text-[#2c2c2c] bg-[#fafaf8] outline-none transition-all duration-200 box-border placeholder:text-[#bbb] focus:border-[#5a9e6f] focus:shadow-[0_0_0_3px_rgba(90,158,111,0.12)] focus:bg-white" :disabled="loading" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[0.78rem] font-medium text-[#555] tracking-[0.01em]">Last Name</label>
            <input v-model="form.lastName" type="text" placeholder="Salem" class="w-full py-[0.65rem] px-[0.85rem] border-[1.5px] border-[#e0e0dc] rounded-lg font-dm text-[0.875rem] text-[#2c2c2c] bg-[#fafaf8] outline-none transition-all duration-200 box-border placeholder:text-[#bbb] focus:border-[#5a9e6f] focus:shadow-[0_0_0_3px_rgba(90,158,111,0.12)] focus:bg-white" :disabled="loading" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1.5">
            <label class="text-[0.78rem] font-medium text-[#555] tracking-[0.01em]">Username</label>
            <input v-model="form.username" type="text" placeholder="mariasalem" class="w-full py-[0.65rem] px-[0.85rem] border-[1.5px] border-[#e0e0dc] rounded-lg font-dm text-[0.875rem] text-[#2c2c2c] bg-[#fafaf8] outline-none transition-all duration-200 box-border placeholder:text-[#bbb] focus:border-[#5a9e6f] focus:shadow-[0_0_0_3px_rgba(90,158,111,0.12)] focus:bg-white" :disabled="loading" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[0.78rem] font-medium text-[#555] tracking-[0.01em]">Email</label>
            <input v-model="form.email" type="email" placeholder="maria@example.com" class="w-full py-[0.65rem] px-[0.85rem] border-[1.5px] border-[#e0e0dc] rounded-lg font-dm text-[0.875rem] text-[#2c2c2c] bg-[#fafaf8] outline-none transition-all duration-200 box-border placeholder:text-[#bbb] focus:border-[#5a9e6f] focus:shadow-[0_0_0_3px_rgba(90,158,111,0.12)] focus:bg-white" :disabled="loading" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1.5">
            <label class="text-[0.78rem] font-medium text-[#555] tracking-[0.01em]">Contact no.</label>
            <input v-model="form.contact" type="text" placeholder="+63 955 123 5566" class="w-full py-[0.65rem] px-[0.85rem] border-[1.5px] border-[#e0e0dc] rounded-lg font-dm text-[0.875rem] text-[#2c2c2c] bg-[#fafaf8] outline-none transition-all duration-200 box-border placeholder:text-[#bbb] focus:border-[#5a9e6f] focus:shadow-[0_0_0_3px_rgba(90,158,111,0.12)] focus:bg-white" :disabled="loading" />
          </div>
        </div>
        <div class="flex flex-col gap-1.5 col-span-full">
          <label class="text-[0.78rem] font-medium text-[#555] tracking-[0.01em]">Complete Address</label>
          <input v-model="form.address" type="text" placeholder="123 Rizal Street, Barangay San Roque..." class="w-full py-[0.65rem] px-[0.85rem] border-[1.5px] border-[#e0e0dc] rounded-lg font-dm text-[0.875rem] text-[#2c2c2c] bg-[#fafaf8] outline-none transition-all duration-200 box-border placeholder:text-[#bbb] focus:border-[#5a9e6f] focus:shadow-[0_0_0_3px_rgba(90,158,111,0.12)] focus:bg-white" :disabled="loading" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1.5">
            <label class="text-[0.78rem] font-medium text-[#555] tracking-[0.01em]">Password</label>
            <input v-model="form.password" type="password" placeholder="••••••••" class="w-full py-[0.65rem] px-[0.85rem] border-[1.5px] border-[#e0e0dc] rounded-lg font-dm text-[0.875rem] text-[#2c2c2c] bg-[#fafaf8] outline-none transition-all duration-200 box-border placeholder:text-[#bbb] focus:border-[#5a9e6f] focus:shadow-[0_0_0_3px_rgba(90,158,111,0.12)] focus:bg-white" :disabled="loading" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[0.78rem] font-medium text-[#555] tracking-[0.01em]">Confirm Password</label>
            <div class="relative">
              <input
                v-model="form.confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full py-[0.65rem] pl-[0.85rem] pr-9 border-[1.5px] border-[#e0e0dc] rounded-lg font-dm text-[0.875rem] text-[#2c2c2c] bg-[#fafaf8] outline-none transition-all duration-200 box-border placeholder:text-[#bbb] focus:border-[#5a9e6f] focus:shadow-[0_0_0_3px_rgba(90,158,111,0.12)] focus:bg-white"
                :disabled="loading"
              />
              <button class="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#aaa] p-0 flex items-center hover:text-[#5a9e6f]" @click="showConfirm = !showConfirm" type="button">
                <svg v-if="!showConfirm" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-2">
          <button class="py-[0.7rem] px-7 bg-[#5a9e6f] text-white border-none rounded-lg font-dm text-[0.9rem] font-medium cursor-pointer tracking-[0.02em] transition-all duration-200 hover:bg-[#4a8c5f] active:scale-[0.99]" @click="goNext">Next →</button>
        </div>
      </div>

      <!-- Step 2 -->
      <div v-if="step === 2" class="flex flex-col gap-3">
        <p class="text-[0.85rem] text-[#888] m-0 mb-2">Almost there! Review and confirm your details.</p>
        <div class="grid grid-cols-2 gap-3 bg-[#fafaf8] border-[1.5px] border-[#e8e8e4] rounded-lg py-4 px-[1.1rem]">
          <div class="flex flex-col gap-1 text-[0.875rem] text-[#2c2c2c] break-words"><span class="text-[0.72rem] uppercase tracking-[0.05em] text-[#999] font-semibold">Full Name</span><span>{{ form.firstName }} {{ form.lastName }}</span></div>
          <div class="flex flex-col gap-1 text-[0.875rem] text-[#2c2c2c] break-words"><span class="text-[0.72rem] uppercase tracking-[0.05em] text-[#999] font-semibold">Username</span><span>{{ form.username }}</span></div>
          <div class="flex flex-col gap-1 text-[0.875rem] text-[#2c2c2c] break-words"><span class="text-[0.72rem] uppercase tracking-[0.05em] text-[#999] font-semibold">Email</span><span>{{ form.email }}</span></div>
          <div class="flex flex-col gap-1 text-[0.875rem] text-[#2c2c2c] break-words"><span class="text-[0.72rem] uppercase tracking-[0.05em] text-[#999] font-semibold">Contact</span><span>{{ form.contact }}</span></div>
          <div class="flex flex-col gap-1 text-[0.875rem] text-[#2c2c2c] break-words col-span-full"><span class="text-[0.72rem] uppercase tracking-[0.05em] text-[#999] font-semibold">Address</span><span>{{ form.address }}</span></div>
        </div>
        <div v-if="error" class="bg-red-50 border-[1.5px] border-red-300 rounded-lg text-red-700 text-[0.85rem] py-[0.65rem] px-[0.9rem] mb-2 mt-2.5">{{ error }}</div>
        <div class="flex justify-between mt-2">
          <button class="py-[0.7rem] px-6 bg-transparent text-[#5a9e6f] border-[1.5px] border-[#5a9e6f] rounded-lg font-dm text-[0.9rem] font-medium cursor-pointer transition-colors duration-200 hover:bg-[#5a9e6f]/[0.06]" @click="step = 1" :disabled="loading">← Back</button>
          <button class="py-[0.7rem] px-7 bg-[#5a9e6f] text-white border-none rounded-lg font-dm text-[0.9rem] font-medium cursor-pointer tracking-[0.02em] transition-all duration-200 hover:bg-[#4a8c5f] active:scale-[0.99] flex items-center justify-center" @click="handleRegister" :disabled="loading">
            <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
            {{ loading ? 'Registering…' : 'Register' }}
          </button>
        </div>
      </div>

      <p class="text-center text-[0.85rem] text-[#888] m-0 mt-4">
        Already have an account?
        <NuxtLink to="/login" class="text-[#5a9e6f] no-underline font-medium hover:underline">Login</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const step = ref(1)
const showConfirm = ref(false)
const loading = ref(false)
const error = ref('')

const form = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  contact: '',
  address: '',
})

function goNext() {
  error.value = ''
  if (!form.firstName || !form.lastName || !form.username || !form.email || !form.password || !form.confirmPassword) {
    error.value = 'Please fill out all required fields.'
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
    // If validation errors are returned, show the first one
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
</script>