<script>
    let pageContent = "";
  
    async function fetchPage() {
      const res = await fetch("https://real-estate-management:8080/v1/metrics");
      pageContent = await res.text();
    }
  
    fetchPage();
  </script>
  
  {@html pageContent}
  