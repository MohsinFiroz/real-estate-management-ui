<script lang="ts">
    let pageContent = "";
    
    async function fetchPage() {
      try {
        const res = await fetch("http://real-estate-management:8080/v1/metrics");
        
        if (!res.ok) {
          throw new Error(`Failed to fetch page, status: ${res.status}`);
        }
        
        pageContent = await res.text();
      } catch (error) {
        console.error("Error fetching page:", error);
        throw error; // Rethrow the error after logging it
      }
    }
    
    fetchPage();
  </script>
  
  {@html pageContent}
  