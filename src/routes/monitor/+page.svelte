<script lang="ts">
  import { onMount } from 'svelte';

  let pageContent = "";

  async function fetchPage() {
    try {
      const res = await fetch("https://real-estate-management.softcelia.com/v1/metrics");
      
      if (!res.ok) {
        throw new Error(`Failed to fetch metrics page, status: ${res.status}`);
      }

      // Get the raw HTML content
      pageContent = await res.text();
    } catch (error) {
      console.error("Error fetching page:", error);
    }
  }

  // Function to execute any embedded JavaScript in the content
  function executeScripts() {
    const scripts = document.querySelectorAll("script");

    scripts.forEach((script) => {
      const newScript = document.createElement("script");
      newScript.textContent = script.textContent;
      document.body.appendChild(newScript); // Execute the script by appending it
    });
  }

  onMount(() => {
    // Fetch the page content when the component mounts
    fetchPage();
  });

  // Run the scripts after the page content is set
  $: if (pageContent) {
    executeScripts();
  }
</script>

<div>
  {#if pageContent}
    {@html pageContent}  <!-- Render HTML content dynamically -->
  {:else}
    <p>Loading...</p>
  {/if}
</div>
