<script setup>
onMounted(() => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  if (token) {
    if (role === 'admin' || role === 'super_admin') {
      navigateTo('/admin/dashboard')
    } else {
      navigateTo('/users/scan')
    }
  } else {
    navigateTo('/login')
  }
})
</script>
