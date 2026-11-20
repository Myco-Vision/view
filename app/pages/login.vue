<script setup lang="ts">
// No auth check on this redirect page
definePageMeta({ middleware: [] })

const route = useRoute()

onMounted(() => {
  if ((route.query.role as string) === 'admin') {
    navigateTo('/admin/login', { replace: true })
    return
  }
  navigateTo('/?login=user', { replace: true })
})
</script>
