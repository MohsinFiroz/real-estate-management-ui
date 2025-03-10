<!-- AlertContainer.svelte -->
<script lang="ts">
    import { Alert } from 'flowbite-svelte';
    import { fade } from 'svelte/transition';
    import { 
      InfoCircleSolid, 
      ExclamationCircleSolid, 
      CloseCircleSolid, 
      CheckCircleSolid 
    } from 'flowbite-svelte-icons';
    import { onDestroy } from 'svelte';
    import { alertsStore, type AlertType, type AlertItem } from '$lib/stores/alert';
  
    // Subscribe to alertsStore
    let visibleAlerts: AlertItem[] = [];
  
    const unsubscribe = alertsStore.subscribe((alerts) => {
      // Sort by timestamp (newest first)
      visibleAlerts = [...alerts].sort((a, b) => b.timestamp - a.timestamp);
    });
  
    function getIconComponent(type: AlertType) {
      switch (type) {
        case 'info': return InfoCircleSolid;
        case 'warning': return ExclamationCircleSolid;
        case 'error': return CloseCircleSolid;
        case 'success': return CheckCircleSolid;
        default: return InfoCircleSolid;
      }
    }
  
    function getColorClass(type: AlertType) {
      switch (type) {
        case 'info': return 'blue';
        case 'warning': return 'yellow';
        case 'error': return 'red';
        case 'success': return 'green';
        default: return 'blue';
      }
    }
  
    function dismissAlert(id: string) {
      alertsStore.update(alerts => alerts.filter(a => a.id !== id));
    }
  
    // Cleanup subscription on destroy
    onDestroy(unsubscribe);
  </script>
  
  <div class="alert-container fixed top-0 left-0 right-0 z-50 mx-auto p-4 max-w-4xl">
    {#each visibleAlerts as alert (alert.id)}
      <div transition:fade={{ duration: 200 }} class="mb-4">
        <Alert
          color={getColorClass(alert.type) as 'blue' | 'yellow' | 'red' | 'green'}
          dismissable={alert.dismissable}
          on:dismiss={() => dismissAlert(alert.id)}
        >
          <svelte:component this={getIconComponent(alert.type)} slot="icon" class="w-5 h-5" />
          <span class="sr-only">{alert.type} alert</span>
          <div class="alert-content ml-3">
            {#if alert.title}
              <h3 class="text-lg font-medium">{alert.title}</h3>
            {/if}
            <div class="text-sm {alert.title ? 'mt-1' : ''}">{alert.message}</div>
          </div>
        </Alert>
      </div>
    {/each}
  </div>
  
  <style>
    .alert-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  </style>