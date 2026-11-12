<template>
  <AppModal
    :model-value="Boolean(challenge)"
    size="sm"
    variant="dark"
    title="Confirm Your Password"
    subtitle="Google verified your account. Enter the password you created during registration to continue."
    :persistent="loading"
    @update:model-value="(open: boolean) => { if (!open) emit('close') }"
  >
    <div v-if="challenge" class="flex flex-col gap-4 py-1">
      <!-- Verified Google account card -->
      <div class="flex items-center gap-3 p-3 rounded-xl bg-stone-950/70 border border-emerald-800/40">
        <img
          v-if="challenge.avatar"
          :src="challenge.avatar"
          :alt="challenge.name || challenge.email"
          class="w-10 h-10 rounded-full object-cover border border-emerald-500/40 shrink-0"
        />
        <div
          v-else
          class="w-10 h-10 rounded-full bg-emerald-800/50 text-emerald-300 font-bold text-sm flex items-center justify-center shrink-0"
        >
          {{ (challenge.name || challenge.email || 'G').charAt(0).toUpperCase() }}
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-white truncate">{{ challenge.name || 'MycoVision Account' }}</p>
          <p class="text-xs text-slate-400 truncate">{{ challenge.email }}</p>
        </div>
        <span class="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          Google Verified
        </span>
      </div>

      <!-- Error alert -->
      <div v-if="error" class="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs">
        {{ error }}
      </div>

      <!-- Password input -->
      <form id="google-password-form" @submit.prevent="onSubmit" class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <label for="google-account-password" class="text-xs font-semibold text-slate-300">Account Password</label>
          <NuxtLink
            to="/forgot-password"
            class="text-[11.5px] font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
            @click="emit('close')"
          >
            Forgot password?
          </NuxtLink>
        </div>
        <div class="relative">
          <input
            id="google-account-password"
            ref="passwordInputRef"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            autocomplete="current-password"
            placeholder="Enter your MycoVision password"
            :disabled="loading"
            class="w-full py-2.5 pl-3.5 pr-10 rounded-xl bg-stone-950/80 border border-emerald-800/40 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-300 transition cursor-pointer bg-transparent border-none p-0"
            @click="showPassword = !showPassword"
          >
            <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          </button>
        </div>
      </form>
    </div>

    <template #footer>
      <div class="flex gap-3">
        <button
          type="button"
          :disabled="loading"
          class="flex-1 py-2.5 px-4 rounded-xl text-[13px] font-semibold border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/30 bg-transparent cursor-pointer disabled:opacity-50"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="google-password-form"
          :disabled="loading || !password"
          class="flex-1 py-2.5 px-4 rounded-xl text-[13px] font-bold text-stone-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 border-none cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="w-3.5 h-3.5 border-2 border-stone-950/30 border-t-stone-950 rounded-full animate-spin" />
          <span>{{ loading ? 'Verifying…' : 'Verify & Sign In' }}</span>
        </button>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import type { GooglePasswordChallenge } from '~/composables/useGooglePasswordChallenge'

const props = defineProps<{
  challenge: GooglePasswordChallenge | null
  loading: boolean
  error: string
}>()

const emit = defineEmits<{
  (e: 'submit', password: string): void
  (e: 'close'): void
}>()

const password = ref('')
const showPassword = ref(false)
const passwordInputRef = ref<HTMLInputElement | null>(null)

watch(() => props.challenge, (val) => {
  if (val) {
    password.value = ''
    showPassword.value = false
    nextTick(() => passwordInputRef.value?.focus())
  }
})

function onSubmit() {
  emit('submit', password.value)
}
</script>

