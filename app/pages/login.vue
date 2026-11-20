<script setup lang="ts">
// No auth check on this redirect page
definePageMeta({ middleware: [] })

const route = useRoute()

onMounted(() => {
  const redirect = String(route.query.redirect || '')
  const roleQuery = (route.query.role || route.query.login) as string
  const role = roleQuery === 'admin' || redirect.startsWith('/admin') ? 'admin' : 'user'
  const target = redirect
    ? `/?login=${role}&redirect=${encodeURIComponent(redirect)}`
    : `/?login=${role}`
  navigateTo(target, { replace: true })
})
</script>
