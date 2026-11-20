export default defineNuxtRouteMiddleware((to) => {
  // Skip on server so existing localStorage-only sessions still hydrate cleanly on the client
  if (import.meta.server) return

  const { getToken, getRole, getUser } = useAuthSession()
  const token = getToken()
  const role  = getRole()
  const user  = getUser()

  // Public auth routes
  if (to.path === '/admin/login' || to.path === '/confirm-archive') return

  // No token → redirect to appropriate login page
  if (!token) {
    if (to.path === '/' || to.path === '/login') return
    if (to.path.startsWith('/admin')) {
      return navigateTo('/admin/login')
    }
    return navigateTo('/?login=user')
  }

  // Incomplete Google profile → force completion before any other page
  if (user.needs_profile_completion && to.path !== '/complete-profile') {
    return navigateTo('/complete-profile')
  }

  // Admin routes require admin or super_admin role
  if (to.path.startsWith('/admin') && role !== 'admin' && role !== 'super_admin') {
    return navigateTo('/admin/login')
  }
})
