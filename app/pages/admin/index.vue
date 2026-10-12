<script setup>
definePageMeta({ layout: 'admin', middleware: 'auth' })
await navigateTo('/admin/dashboard', { replace: true })
</script>
