export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const { getToken, getRole } = useAuthSession()
  if (!getToken()) {
    return navigateTo('/login')
  }

  const allowed = to.meta.roles as string[] | undefined
  const role = getRole()

  if (allowed && !allowed.includes(role)) {
    // Redirect to role-appropriate home instead of a non-existent /403 page
    if (role === 'admin' || role === 'super_admin') {
      return navigateTo('/admin/dashboard')
    }
    return navigateTo('/users/scan')
  }
})