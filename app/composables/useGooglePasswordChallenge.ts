export interface GooglePasswordChallenge {
  challengeToken: string
  email: string
  name: string
  avatar: string
}

export function useGooglePasswordChallenge() {
  const config = useRuntimeConfig()
  const { setSession, getHomeRoute } = useAuthSession()

  const challenge = ref<GooglePasswordChallenge | null>(null)
  const passwordSubmitting = ref(false)
  const passwordError = ref('')

  async function processGoogleAccessToken(accessToken: string) {
    passwordError.value = ''
    const data = await $fetch<any>(`${config.public.apiBase}/auth/google`, {
      method: 'POST',
      body: { access_token: accessToken },
    })

    if (data?.requires_password && data?.challenge_token) {
      challenge.value = {
        challengeToken: data.challenge_token,
        email: data.email || '',
        name: data.name || '',
        avatar: data.avatar || '',
      }
      return
    }

    setSession(data.token, data.user)
    // Full-page redirect: the GSI callback runs outside Vue's lifecycle
    await navigateTo(getHomeRoute(data.user, Boolean(data.needs_completion)), { external: true })
  }

  async function submitChallengePassword(password: string) {
    if (!challenge.value) return
    const trimmed = password
    if (!trimmed) {
      passwordError.value = 'Please enter your account password.'
      return
    }

    passwordError.value = ''
    passwordSubmitting.value = true
    try {
      const data = await $fetch<any>(`${config.public.apiBase}/auth/google/verify-password`, {
        method: 'POST',
        body: {
          challenge_token: challenge.value.challengeToken,
          password: trimmed,
        },
      })
      challenge.value = null
      setSession(data.token, data.user)
      await navigateTo(getHomeRoute(data.user, false), { external: true })
    } catch (err: any) {
      passwordError.value = err?.data?.message || 'Incorrect password. Please try again.'
    } finally {
      passwordSubmitting.value = false
    }
  }

  function cancelChallenge() {
    challenge.value = null
    passwordError.value = ''
  }

  return {
    challenge,
    passwordSubmitting,
    passwordError,
    processGoogleAccessToken,
    submitChallengePassword,
    cancelChallenge,
  }
}

