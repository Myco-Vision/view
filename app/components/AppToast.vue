<template>
  <teleport to="body">
    <div class="toast-container" aria-live="polite">
      <transition-group name="toast" tag="div" class="toast-stack">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-item"
          :class="`toast-${toast.type}`"
          @click="remove(toast.id)"
        >
          <!-- Icon -->
          <span class="toast-icon">
            <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>
            <svg v-else-if="toast.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            <svg v-else-if="toast.type === 'warning'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </span>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" @click.stop="remove(toast.id)">×</button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'
const { toasts, remove } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 500;
  font-family: var(--font-sans);
  min-width: 260px;
  max-width: 380px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.14);
  pointer-events: all;
  cursor: pointer;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.15);
}

.toast-success { background: #052e16; color: #86efac; }
.toast-error   { background: #450a0a; color: #fca5a5; }
.toast-warning { background: #431407; color: #fdba74; }
.toast-info    { background: #0f172a; color: #94a3b8; }

.toast-icon { display:flex; align-items:center; shrink:0; }
.toast-message { flex: 1; line-height: 1.4; }

.toast-close {
  background: transparent;
  border: none;
  color: inherit;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.6;
  line-height: 1;
  padding: 0;
  display: flex;
  align-items: center;
  transition: opacity 0.15s;
}
.toast-close:hover { opacity: 1; }
</style>
