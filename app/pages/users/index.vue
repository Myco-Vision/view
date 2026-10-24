<script setup>
definePageMeta({ layout: 'user', middleware: 'auth' })
await navigateTo('/users/scan', { replace: true })
</script>
