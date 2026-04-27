<template>
  <div class="auth-bg">
    <div class="modal-card">
      <div class="card-header">
        <h2>Login to <span class="brand">MycoVision</span></h2>
      </div>
      <div class="card-body">
        <div class="field">
          <input
            v-model="form.username"
            type="text"
            placeholder="Username"
            class="input-field"
          />
        </div>
        <div class="field">
          <input
            v-model="form.password"
            type="password"
            placeholder="Password"
            class="input-field"
          />
        </div>
        <button class="btn-primary" @click="handleLogin">Login</button>
        <p class="footer-text">
          No account yet?
          <NuxtLink to="/register" class="link">Register</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const form = reactive({ username: '', password: '' })

function handleLogin() {
  // handle login logic
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