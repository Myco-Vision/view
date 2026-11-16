<script setup lang="ts">
// No auth check on this redirect page
definePageMeta({ middleware: [] })

const route = useRoute()

onMounted(() => {
  const role = (route.query.role as string) === 'admin' ? 'admin' : 'user'
  navigateTo(`/?login=${role}`, { replace: true })
})
</script>
