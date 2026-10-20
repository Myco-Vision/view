export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const allowed = to.meta.roles as string[] | undefined
  const role = localStorage.getItem('role') ?? ''

  if (allowed && !allowed.includes(role)) {
    return navigateTo('/403')
  }
})