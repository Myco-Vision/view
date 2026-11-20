<script setup lang="ts">
// No auth check on this redirect page
definePageMeta({ middleware: [] })

const route = useRoute()

onMounted(() => {
  const redirect = String(route.query.redirect || '')
  const roleQuery = (route.query.role || route.query.login) as string
  if (roleQuery === 'admin' || redirect.startsWith('/admin')) {
    const adminTarget = redirect ? `/admin/login?redirect=${encodeURIComponent(redirect)}` : '/admin/login'
    navigateTo(adminTarget, { replace: true })
    return
  }
  const target = redirect
    ? `/?login=user&redirect=${encodeURIComponent(redirect)}`
    : '/?login=user'
  navigateTo(target, { replace: true })
})
</script>
