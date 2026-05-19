<template>
  <div class="auth-bg">
    <div class="modal-card">
      <!-- Header with progress bar -->
      <div class="card-header">
        <h2>Register to <span class="brand">MycoVision</span></h2>
        <div class="progress-track">
          <div class="step-bubble" :class="{ active: step >= 1, done: step > 1 }">
            <span v-if="step <= 1">1</span>
            <span v-else class="check">✓</span>
          </div>
          <div class="progress-line">
            <div class="progress-fill" :style="{ width: step > 1 ? '100%' : '0%' }"></div>
          </div>
          <div class="step-bubble" :class="{ active: step >= 2 }">2</div>
        </div>
      </div>

      <!-- Step 1 -->
      <div v-if="step === 1" class="card-body">
        <div v-if="error" class="error-banner">{{ error }}</div>
        
        <div class="field-row">
          <div class="field">
            <label class="field-label">First Name</label>
            <input v-model="form.firstName" type="text" placeholder="Maria" class="input-field" :disabled="loading" />
          </div>
          <div class="field">
            <label class="field-label">Last Name</label>
            <input v-model="form.lastName" type="text" placeholder="Salem" class="input-field" :disabled="loading" />
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Username</label>
            <input v-model="form.username" type="text" placeholder="mariasalem" class="input-field" :disabled="loading" />
          </div>
          <div class="field">
            <label class="field-label">Email</label>
            <input v-model="form.email" type="email" placeholder="maria@example.com" class="input-field" :disabled="loading" />
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Contact no.</label>
            <input v-model="form.contact" type="text" placeholder="+63 955 123 5566" class="input-field" :disabled="loading" />
          </div>
        </div>
        <div class="field full">
          <label class="field-label">Complete Address</label>
          <input v-model="form.address" type="text" placeholder="123 Rizal Street, Barangay San Roque..." class="input-field" :disabled="loading" />
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field-label">Password</label>
            <input v-model="form.password" type="password" placeholder="••••••••" class="input-field" :disabled="loading" />
          </div>
          <div class="field">
            <label class="field-label">Confirm Password</label>
            <div class="input-wrap">
              <input
                v-model="form.confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                placeholder="••••••••"
                class="input-field"
                :disabled="loading"
              />
              <button class="eye-btn" @click="showConfirm = !showConfirm" type="button">
                <svg v-if="!showConfirm" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>
        </div>
        <div class="btn-row">
          <button class="btn-primary" @click="goNext">Next →</button>
        </div>
      </div>

      <!-- Step 2 -->
      <div v-if="step === 2" class="card-body">
        <p class="step2-hint">Almost there! Review and confirm your details.</p>
        <div class="review-grid">
          <div class="review-item"><span class="review-label">Full Name</span><span>{{ form.firstName }} {{ form.lastName }}</span></div>
          <div class="review-item"><span class="review-label">Username</span><span>{{ form.username }}</span></div>
          <div class="review-item"><span class="review-label">Email</span><span>{{ form.email }}</span></div>
          <div class="review-item"><span class="review-label">Contact</span><span>{{ form.contact }}</span></div>
          <div class="review-item" style="grid-column: 1 / -1;"><span class="review-label">Address</span><span>{{ form.address }}</span></div>
        </div>
        <div v-if="error" class="error-banner" style="margin-top: 10px;">{{ error }}</div>
        <div class="btn-row two">
          <button class="btn-outline" @click="step = 1" :disabled="loading">← Back</button>
          <button class="btn-primary" @click="handleRegister" :disabled="loading">
            <span v-if="loading" class="spinner" />
            {{ loading ? 'Registering…' : 'Register' }}
          </button>
        </div>
      </div>

      <p class="footer-text">
        Already have an account?
        <NuxtLink to="/login" class="link">Login</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const step = ref(1)
const showConfirm = ref(false)
const loading = ref(false)
const error = ref('')

const form = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  contact: '',
  address: '',
})

function goNext() {
  error.value = ''
  if (!form.firstName || !form.lastName || !form.username || !form.email || !form.password || !form.confirmPassword) {
    error.value = 'Please fill out all required fields.'
    return
  }
  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match.'
    return
  }
  step.value = 2
}

async function handleRegister() {
  error.value = ''
  loading.value = true

  try {
    const data = await $fetch<{ user: any; token: string }>(`${config.public.apiBase}/register`, {
      method: 'POST',
      body: {
        first_name: form.firstName,
        last_name: form.lastName,
        username: form.username,
        email: form.email,
        contact_number: form.contact,
        address: form.address,
        password: form.password,
        password_confirmation: form.confirmPassword,
      },
    })

    // Persist auth data
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('role', data.user.role)

    await navigateTo('/users/scan')
  } catch (err: any) {
    let msg = err?.data?.message || 'Registration failed.'
    // If validation errors are returned, show the first one
    if (err?.data?.errors) {
      const firstErrorKey = Object.keys(err.data.errors)[0]
      if (firstErrorKey) {
        msg = err.data.errors[firstErrorKey][0]
      }
    }
    error.value = msg
    step.value = 1 // Go back to step 1 to let them fix the error
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
  max-width: 520px;
  padding: 2.25rem 2rem 1.75rem;
}

.card-header {
  margin-bottom: 1.75rem;
}

.card-header h2 {
  font-family: 'Lora', serif;
  font-size: 1.35rem;
  font-weight: 400;
  color: #2c2c2c;
  margin: 0 0 1.1rem;
  letter-spacing: -0.01em;
}

.brand {
  color: #5a9e6f;
  font-style: italic;
  font-weight: 600;
}

/* Progress bar */
.progress-track {
  display: flex;
  align-items: center;
  gap: 0;
}

.step-bubble {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #d5d5d0;
  background: #fff;
  color: #aaa;
  font-size: 0.78rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s;
}

.step-bubble.active {
  border-color: #5a9e6f;
  background: #5a9e6f;
  color: #fff;
}

.step-bubble.done {
  border-color: #5a9e6f;
  background: #5a9e6f;
  color: #fff;
}

.check {
  font-size: 0.85rem;
}

.progress-line {
  flex: 1;
  height: 2px;
  background: #e0e0dc;
  border-radius: 2px;
  margin: 0 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #5a9e6f;
  border-radius: 2px;
  transition: width 0.4s ease;
}

/* Form */
.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.error-banner {
  background: #fef2f2;
  border: 1.5px solid #fca5a5;
  border-radius: 8px;
  color: #b91c1c;
  font-size: 0.85rem;
  padding: 0.65rem 0.9rem;
  margin-bottom: 0.5rem;
}

.field.full {
  grid-column: 1 / -1;
}

.field-label {
  font-size: 0.78rem;
  font-weight: 500;
  color: #555;
  letter-spacing: 0.01em;
}

.input-field {
  width: 100%;
  padding: 0.65rem 0.85rem;
  border: 1.5px solid #e0e0dc;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  color: #2c2c2c;
  background: #fafaf8;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.input-field::placeholder {
  color: #bbb;
}

.input-field:focus {
  border-color: #5a9e6f;
  box-shadow: 0 0 0 3px rgba(90, 158, 111, 0.12);
  background: #fff;
}

.input-wrap {
  position: relative;
}

.input-wrap .input-field {
  padding-right: 2.25rem;
}

.eye-btn {
  position: absolute;
  right: 0.65rem;
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

.eye-btn:hover {
  color: #5a9e6f;
}

/* Buttons */
.btn-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.btn-row.two {
  justify-content: space-between;
}

.btn-primary {
  padding: 0.7rem 1.75rem;
  background: #5a9e6f;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: background 0.2s, transform 0.1s;
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

.btn-outline {
  padding: 0.7rem 1.5rem;
  background: transparent;
  color: #5a9e6f;
  border: 1.5px solid #5a9e6f;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-outline:hover {
  background: rgba(90, 158, 111, 0.06);
}

/* Step 2 review */
.step2-hint {
  font-size: 0.85rem;
  color: #888;
  margin: 0 0 0.5rem;
}

.review-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  background: #fafaf8;
  border: 1.5px solid #e8e8e4;
  border-radius: 8px;
  padding: 1rem 1.1rem;
}

.review-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.875rem;
  color: #2c2c2c;
  word-break: break-word;
}

.review-label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #999;
  font-weight: 600;
}

/* Footer */
.footer-text {
  text-align: center;
  font-size: 0.85rem;
  color: #888;
  margin: 1rem 0 0;
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