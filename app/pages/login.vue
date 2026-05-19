<template>
  <div class="auth-bg">
    <div class="modal-card">
      <div class="card-header">
        <h2>Login to <span class="brand">MycoVision</span></h2>
      </div>
      <div class="card-body">
        <!-- Error banner -->
        <div v-if="error" class="error-banner">{{ error }}</div>

        <div class="field">
          <input
            v-model="form.email"
            type="email"
            placeholder="Email address"
            class="input-field"
            :disabled="loading"
          />
        </div>
        <div class="field">
          <div class="input-wrap">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              class="input-field"
              :disabled="loading"
              @keyup.enter="handleLogin"
            />
            <button class="eye-btn" type="button" @click="showPassword = !showPassword">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
        </div>

        <button class="btn-primary" :disabled="loading" @click="handleLogin">
          <span v-if="loading" class="spinner" />
          {{ loading ? 'Logging in…' : 'Login' }}
        </button>

        <p class="footer-text">
          No account yet?
          <NuxtLink to="/register" class="link">Register</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const form        = reactive({ email: '', password: '' })
const loading     = ref(false)
const error       = ref('')
const showPassword = ref(false)

async function handleLogin() {
  error.value = ''

  if (!form.email || !form.password) {
    error.value = 'Please fill in all fields.'
    return
  }

  loading.value = true
  try {
    const data = await $fetch<{ user: any; token: string }>(`${config.public.apiBase}/login`, {
      method: 'POST',
      body: { email: form.email, password: form.password },
    })

    // Persist auth data
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('role', data.user.role)

    // Redirect based on role
    if (data.user.role === 'admin') {
      await navigateTo('/admin/dashboard')
    } else {
      await navigateTo('/users/scan')
    }
  } catch (err: any) {
    const msg = err?.data?.message || err?.data?.errors?.email?.[0]
    error.value = msg || 'Invalid email or password.'
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

.auth-bg {
  min-height: 100vh;
  background: #f5f5f3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'DM Sans', sans-serif;
}

.modal-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 400px;
  padding: 2.5rem 2rem 2rem;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header h2 {
  font-family: 'Lora', serif;
  font-size: 1.35rem;
  font-weight: 400;
  color: #2c2c2c;
  margin: 0;
  letter-spacing: -0.01em;
}

.brand {
  color: #5a9e6f;
  font-style: italic;
  font-weight: 600;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.field {
  width: 100%;
}

.error-banner {
  background: #fef2f2;
  border: 1.5px solid #fca5a5;
  border-radius: 8px;
  color: #b91c1c;
  font-size: 0.85rem;
  padding: 0.65rem 0.9rem;
}

.input-wrap {
  position: relative;
}

.input-wrap .input-field {
  padding-right: 2.5rem;
}

.eye-btn {
  position: absolute;
  right: 0.7rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #aaa;
  padding: 0;
  display: flex;
  align-items: center;
}

.eye-btn:hover { color: #5a9e6f; }

.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #e0e0dc;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  color: #2c2c2c;
  background: #fafaf8;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.input-field::placeholder {
  color: #aaa;
}

.input-field:focus {
  border-color: #5a9e6f;
  box-shadow: 0 0 0 3px rgba(90, 158, 111, 0.12);
  background: #fff;
}

.btn-primary {
  width: 100%;
  padding: 0.8rem;
  background: #5a9e6f;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: background 0.2s, transform 0.1s;
  margin-top: 0.25rem;
}

.btn-primary:hover {
  background: #4a8c5f;
}

.btn-primary:active {
  transform: scale(0.99);
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
  margin-right: 0.4rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.footer-text {
  text-align: center;
  font-size: 0.85rem;
  color: #888;
  margin: 0.5rem 0 0;
}

.link {
  color: #5a9e6f;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}
</style>