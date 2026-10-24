export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const allowed = to.meta.roles as string[] | undefined
  const role = localStorage.getItem('role') ?? ''

  if (allowed && !allowed.includes(role)) {
    // Redirect to role-appropriate home instead of a non-existent /403 page
    if (role === 'admin' || role === 'super_admin') {
      return navigateTo('/admin/dashboard')
    }
    return navigateTo('/users/scan')
  }
})