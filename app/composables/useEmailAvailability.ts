import type { Ref } from 'vue'

export type EmailCheckStatus = 'empty' | 'invalid' | 'checking' | 'available' | 'taken'

interface UseEmailAvailabilityOptions {
  ignoreEmail?: Ref<string> | (() => string)
  theme?: 'dark' | 'light'
}

const EMAIL_FORMAT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useEmailAvailability(
  emailSource: Ref<string> | (() => string),
  options: UseEmailAvailabilityOptions = {},
) {
  const config = useRuntimeConfig()
  const theme = options.theme ?? 'dark'

  const emailStatus = ref<EmailCheckStatus>('empty')
  const emailCustomError = ref('')
  let checkTimer: ReturnType<typeof setTimeout> | null = null

  const readEmail = () => (typeof emailSource === 'function' ? emailSource() : emailSource.value) || ''
  const readIgnored = () => {
    if (!options.ignoreEmail) return ''
    const v = typeof options.ignoreEmail === 'function' ? options.ignoreEmail() : options.ignoreEmail.value
    return (v || '').trim().toLowerCase()
  }

  const emailHint = computed(() => {
    const isLight = theme === 'light'
    switch (emailStatus.value) {
      case 'invalid':
        return {
          text: emailCustomError.value || 'Enter a valid email (name@example.com)',
          color: isLight ? 'text-red-600' : 'text-red-400',
          dot: isLight ? 'bg-red-500' : 'bg-red-400',
        }
      case 'checking':
        return {
          text: 'Checking email…',
          color: isLight ? 'text-amber-600' : 'text-amber-400',
          dot: 'bg-amber-400',
        }
      case 'available':
        return {
          text: 'Email is valid and available',
          color: isLight ? 'text-emerald-600' : 'text-emerald-400',
          dot: isLight ? 'bg-emerald-500' : 'bg-emerald-400',
        }
      case 'taken':
        return {
          text: 'This email is already registered',
          color: isLight ? 'text-red-600' : 'text-red-400',
          dot: isLight ? 'bg-red-500' : 'bg-red-400',
        }
      default:
        return { text: '', color: '', dot: '' }
    }
  })

  async function runCheck(target: string): Promise<EmailCheckStatus> {
    if (!target) {
      emailStatus.value = 'empty'
      return 'empty'
    }
    if (!EMAIL_FORMAT_REGEX.test(target)) {
      emailStatus.value = 'invalid'
      return 'invalid'
    }

    const ignored = readIgnored()
    if (ignored && target.toLowerCase() === ignored) {
      emailStatus.value = 'empty'
      return 'available'
    }

    emailStatus.value = 'checking'
    try {
      const res = await $fetch<{ available: boolean }>(`${config.public.apiBase}/register/check-email`, {
        params: { email: target },
      })
      if (readEmail().trim() !== target) return emailStatus.value
      emailStatus.value = res.available ? 'available' : 'taken'
      return emailStatus.value
    } catch (err: any) {
      if (readEmail().trim() !== target) return emailStatus.value
      const status = err?.status ?? err?.statusCode ?? err?.response?.status
      if (status === 422) {
        emailCustomError.value = err?.data?.errors?.email?.[0] || err?.data?.message || 'Please enter a legitimate email address.'
        emailStatus.value = 'invalid'
        return 'invalid'
      }
      // Network hiccup — submit-time backend validation still enforces uniqueness
      emailStatus.value = 'available'
      return 'available'
    }
  }

  watch(readEmail, (val) => {
    if (checkTimer) {
      clearTimeout(checkTimer)
      checkTimer = null
    }
    emailCustomError.value = ''
    const trimmed = (val || '').trim()
    if (!trimmed) {
      emailStatus.value = 'empty'
      return
    }
    if (!EMAIL_FORMAT_REGEX.test(trimmed)) {
      emailStatus.value = 'invalid'
      return
    }
    const ignored = readIgnored()
    if (ignored && trimmed.toLowerCase() === ignored) {
      emailStatus.value = 'empty'
      return
    }

    emailStatus.value = 'checking'
    checkTimer = setTimeout(() => {
      runCheck(trimmed)
    }, 450)
  })

  async function verifyEmailNow(): Promise<EmailCheckStatus> {
    if (checkTimer) {
      clearTimeout(checkTimer)
      checkTimer = null
    }
    const trimmed = readEmail().trim()
    if (!trimmed) return 'empty'
    if (emailStatus.value === 'taken' || emailStatus.value === 'invalid') {
      return emailStatus.value
    }
    return runCheck(trimmed)
  }

  onBeforeUnmount(() => {
    if (checkTimer) {
      clearTimeout(checkTimer)
      checkTimer = null
    }
  })

  return {
    emailStatus,
    emailCustomError,
    emailHint,
    verifyEmailNow,
  }
}

