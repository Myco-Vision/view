export default defineNuxtRouteMiddleware((to) => {
  // Skip on server (localStorage isn't available)
  if (import.meta.server) return

  const token = localStorage.getItem('token')
  const role  = localStorage.getItem('role')

  // No token → redirect to login
  if (!token) {
    return navigateTo('/login')
  }

  // Admin routes require admin or super_admin role
  if (to.path.startsWith('/admin') && role !== 'admin' && role !== 'super_admin') {
    return navigateTo('/login')
  }
})
