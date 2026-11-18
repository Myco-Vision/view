<script setup>
definePageMeta({ layout: 'user', middleware: 'auth' })
await navigateTo('/users/dashboard', { replace: true })
</script>
