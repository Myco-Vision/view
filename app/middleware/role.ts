export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return
  if (to.path === '/admin/login') return

  const { getToken, getRole } = useAuthSession()
  if (!getToken()) {
    if (to.path.startsWith('/admin')) {
      return navigateTo('/admin/login')
    }
    return navigateTo('/login')
  }

  const allowed = to.meta.roles as string[] | undefined
  const role = getRole()

  if (allowed && !allowed.includes(role)) {
    // If attempting to open an admin console without admin credentials, send to admin login
    if (to.path.startsWith('/admin')) {
      return navigateTo('/admin/login')
    }
    // Redirect to role-appropriate home instead of a non-existent /403 page
    if (role === 'admin' || role === 'super_admin') {
      return navigateTo('/admin/dashboard')
    }
    return navigateTo('/users/scan')
  }
})
