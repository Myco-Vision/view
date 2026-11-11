// Persistent client + cookie auth session helper so users stay signed in across browser/app restarts.
const SESSION_MAX_AGE = 60 * 60 * 24 * 365 // 1 year in seconds

export function useAuthSession() {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie<string | null>('token', {
    maxAge: SESSION_MAX_AGE,
    sameSite: 'lax',
    path: '/',
  })
  const roleCookie = useCookie<string | null>('role', {
    maxAge: SESSION_MAX_AGE,
    sameSite: 'lax',
    path: '/',
  })

  function getUser(): Record<string, any> {
    if (import.meta.server) return {}
    try {
      return JSON.parse(localStorage.getItem('user') || '{}') || {}
    } catch {
      return {}
    }
  }

  function getToken(): string | null {
    const rawLocal = import.meta.client ? localStorage.getItem('token') : null
    const localToken = rawLocal && rawLocal !== 'null' && rawLocal !== 'undefined' ? rawLocal : null
    const token = localToken || tokenCookie.value || null
    if (!token) return null

    if (import.meta.client) {
      if (!localToken) localStorage.setItem('token', token)
      if (tokenCookie.value !== token) tokenCookie.value = token
    }
    return token
  }

  function getRole(): string {
    const localRole = import.meta.client ? localStorage.getItem('role') : null
    const userRole = getUser()?.role || null
    const role = localRole || roleCookie.value || userRole || ''
    if (!role) return ''

    if (import.meta.client) {
      if (!localRole) localStorage.setItem('role', role)
      if (roleCookie.value !== role) roleCookie.value = role
    }
    return role
  }

  function updateStoredUser(user: any) {
    if (!user) return
    if (import.meta.client) {
      localStorage.setItem('user', JSON.stringify(user))
      if (user.role) localStorage.setItem('role', user.role)
    }
    if (user.role) {
      roleCookie.value = user.role
    }
  }

  function setSession(token: string, user: any) {
    if (import.meta.client) {
      localStorage.setItem('token', token)
    }
    tokenCookie.value = token
    updateStoredUser(user)
  }

  function clearSession() {
    if (import.meta.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      localStorage.removeItem('uuid')
    }
    tokenCookie.value = null
    roleCookie.value = null
  }

  function getHomeRoute(user?: any, needsCompletion?: boolean): string {
    if (needsCompletion || user?.needs_profile_completion) {
      return '/complete-profile'
    }
    const role = user?.role || getRole()
    if (role === 'admin' || role === 'super_admin') {
      return '/admin/dashboard'
    }
    return '/users/scan'
  }

  async function restoreAndValidateSession(): Promise<Record<string, any> | null> {
    const token = getToken()
    if (!token) return null

    try {
      const user = await $fetch<Record<string, any>>(`${config.public.apiBase}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      setSession(token, user)
      return user
    } catch (err: any) {
      const status = err?.status ?? err?.statusCode ?? err?.response?.status
      if (status === 401 || status === 403) {
        clearSession()
        return null
      }
      const cached = getUser()
      const role = cached.role || getRole()
      return role ? { ...cached, role } : null
    }
  }

  return {
    getToken,
    getRole,
    getUser,
    setSession,
    updateStoredUser,
    clearSession,
    getHomeRoute,
    restoreAndValidateSession,
  }
}

