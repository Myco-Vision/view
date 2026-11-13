export default defineNuxtRouteMiddleware((to) => {
  // Skip on server (localStorage isn't available)
  if (import.meta.server) return

  const token = localStorage.getItem('token')
  const role  = localStorage.getItem('role')
  const user  = JSON.parse(localStorage.getItem('user') || '{}')

  // No token → redirect to landing page login modal
  if (!token) {
    if (to.path === '/' || to.path === '/login') return
    return navigateTo('/?login=user')
  }

  // Incomplete Google profile → force completion before any other page
  if (user.needs_profile_completion && to.path !== '/complete-profile') {
    return navigateTo('/complete-profile')
  }

  // Admin routes require admin or super_admin role
  if (to.path.startsWith('/admin') && role !== 'admin' && role !== 'super_admin') {
    return navigateTo('/?login=admin')
  }
})
