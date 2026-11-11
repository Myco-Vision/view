<template>
  <div class="py-12 text-center text-sm text-[#64748b]">
    Redirecting to Species DB &amp; AI Retrain…
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'role',
  roles: ['admin', 'super_admin'],
})

onMounted(() => {
  navigateTo('/admin/species?tab=retrain', { replace: true })
})
</script>
