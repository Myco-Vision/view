<template>
  <div class="min-h-screen bg-[#f5f5f3] flex items-center justify-center font-dm px-4 py-8">
    <div class="bg-white rounded-xl shadow-[0_4px_32px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] w-full max-w-[400px] pt-10 px-6 sm:px-8 pb-8">
      <div class="text-center mb-8">
        <h2 class="font-serif text-[1.35rem] font-normal text-[#2c2c2c] m-0 tracking-[-0.01em]">Login to <span class="text-[#5a9e6f] italic font-semibold">MycoVision</span></h2>
      </div>
      <div class="flex flex-col gap-3">
        <!-- Error banner -->
        <div v-if="error" class="bg-red-50 border-[1.5px] border-red-300 rounded-lg text-red-700 text-[0.85rem] py-[0.65rem] px-[0.9rem]">{{ error }}</div>

        <div class="w-full">
          <input
            v-model="form.email"
            type="email"
            placeholder="Email address"
            class="w-full py-3 px-4 border-[1.5px] border-[#e0e0dc] rounded-lg font-dm text-[0.9rem] text-[#2c2c2c] bg-[#fafaf8] outline-none transition-all duration-200 box-border placeholder:text-[#aaa] focus:border-[#5a9e6f] focus:shadow-[0_0_0_3px_rgba(90,158,111,0.12)] focus:bg-white"
            :disabled="loading"
          />
        </div>
        <div class="w-full">
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              class="w-full py-3 pl-4 pr-10 border-[1.5px] border-[#e0e0dc] rounded-lg font-dm text-[0.9rem] text-[#2c2c2c] bg-[#fafaf8] outline-none transition-all duration-200 box-border placeholder:text-[#aaa] focus:border-[#5a9e6f] focus:shadow-[0_0_0_3px_rgba(90,158,111,0.12)] focus:bg-white"
              :disabled="loading"
              @keyup.enter="handleLogin"
            />
            <button class="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#aaa] p-0 flex items-center hover:text-[#5a9e6f]" type="button" @click="showPassword = !showPassword">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
        </div>

        <button class="w-full p-[0.8rem] bg-[#5a9e6f] text-white border-none rounded-lg font-dm text-[0.95rem] font-medium cursor-pointer tracking-[0.02em] transition-all duration-200 mt-1 hover:bg-[#4a8c5f] active:scale-[0.99] flex items-center justify-center" :disabled="loading" @click="handleLogin">
          <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
          {{ loading ? 'Logging in…' : 'Login' }}
        </button>

        <p class="text-center text-[0.85rem] text-[#888] m-0 mt-2">
          No account yet?
          <NuxtLink to="/register" class="text-[#5a9e6f] no-underline font-medium hover:underline">Register</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const form        = reactive({ email: '', password: '' })
const loading     = ref(false)
const error       = ref('')
const showPassword = ref(false)

async function handleLogin() {
  error.value = ''

  if (!form.email || !form.password) {
    error.value = 'Please fill in all fields.'
    return
  }

  loading.value = true
  try {
    const data = await $fetch<{ user: any; token: string }>(`${config.public.apiBase}/login`, {
      method: 'POST',
      body: { email: form.email, password: form.password },
    })

    // Persist auth data
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('role', data.user.role)

    // Redirect based on role
    if (data.user.role === 'admin') {
      await navigateTo('/admin/dashboard')
    } else {
      await navigateTo('/users/scan')
    }
  } catch (err: any) {
    const msg = err?.data?.message || err?.data?.errors?.email?.[0]
    error.value = msg || 'Invalid email or password.'
  } finally {
    loading.value = false
  }
}
</script>