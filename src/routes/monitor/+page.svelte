<script lang="ts">
  let pageContent = "";

  async function fetchPage() {
    try {
      const res = await fetch("https://real-estate-management.softcelia.com/v1/metrics");
      
      if (!res.ok) {
        throw new Error(`Failed to fetch metrics page, status: ${res.status}`);
      }
      
      pageContent = await res.text();
    } catch (error) {
      console.error("Error fetching page:", error);
    }
  }

  // Call fetchPage when the component mounts
  fetchPage();
</script>

<div>
  <!-- Dynamically rendered content inside the iframe -->
  {#if pageContent}
    <iframe srcdoc={pageContent} width="100%" height="500px" title="Metrics Page"></iframe>
  {:else}
    <p>Loading...</p>
  {/if}
</div>
