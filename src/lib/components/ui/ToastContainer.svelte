<!-- ToastContainer.svelte -->
<script lang="ts">
    import { Toast } from 'flowbite-svelte';
    import { slide } from 'svelte/transition';
    import { 
      InfoCircleSolid, 
      ExclamationCircleSolid, 
      CloseCircleSolid, 
      CheckCircleSolid 
    } from 'flowbite-svelte-icons';
    import { onDestroy } from 'svelte';
    import { toastsStore, type ToastType, type ToastItem } from '$lib/stores/toast';
  
    // Set maximum number of visible toasts
    const MAX_VISIBLE_TOASTS = 5;
  
    // Store for toasts to display
    let visibleToasts: ToastItem[] = [];
  
    // Subscribe to toastsStore and keep limited number of toasts
    const unsubscribe = toastsStore.subscribe((toasts) => {
      // Sort by timestamp (newest first for errors, oldest first for others)
      const sortedToasts = [...toasts].sort((a, b) => {
        if (a.type === 'error' && b.type === 'error') {
          // For errors, show newest first
          return b.timestamp - a.timestamp;
        } else if (a.type === 'error') {
          // Prioritize errors
          return -1;
        } else if (b.type === 'error') {
          // Prioritize errors
          return 1;
        } else {
          // For other types, show oldest first
          return a.timestamp - b.timestamp;
        }
      });
      
      // Limit visible toasts
      visibleToasts = sortedToasts.slice(0, MAX_VISIBLE_TOASTS);
    });
  
    function getIconComponent(type: ToastType) {
      switch (type) {
        case 'info': return InfoCircleSolid;
        case 'warning': return ExclamationCircleSolid;
        case 'error': return CloseCircleSolid;
        case 'success': return CheckCircleSolid;
        default: return InfoCircleSolid;
      }
    }
  
    function getColorClass(type: ToastType) {
      switch (type) {
        case 'info': return 'blue';
        case 'warning': return 'yellow';
        case 'error': return 'red';
        case 'success': return 'green';
        default: return 'blue';
      }
    }
  
    function dismissToast(id: string) {
      toastsStore.update(toasts => toasts.filter(t => t.id !== id));
    }
  
    // Cleanup subscription on destroy
    onDestroy(unsubscribe);
  </script>
  
  <div class="toast-container fixed bottom-4 right-4 flex flex-col-reverse gap-2 max-w-md z-50">
    {#each visibleToasts as toast (toast.id)}
      <div transition:slide={{ duration: 300 }}>
        <Toast
          color={getColorClass(toast.type) as 'blue' | 'yellow' | 'red' | 'green'}
          dismissable={!toast.autoDismiss}
          on:dismiss={() => dismissToast(toast.id)}
        >
          <svelte:component this={getIconComponent(toast.type)} slot="icon" class="w-5 h-5" />
          <span class="sr-only">{toast.type} notification</span>
          <div class="toast-content">
            <p class="text-sm font-medium">{toast.message}</p>
            {#if toast.code}
              <span class="text-xs font-semibold opacity-80">(Code: {toast.code})</span>
            {/if}
          </div>
        </Toast>
      </div>
    {/each}
  </div>
  
  <style>
    .toast-container {
      max-height: 80vh;
      overflow-y: auto;
      scrollbar-width: thin;
    }
  </style>