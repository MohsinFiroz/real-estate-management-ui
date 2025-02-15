<script>
    let pageContent = "";
  
    async function fetchPage() {
      const res = await fetch("http://localhost:8080/v1/metrics");
      pageContent = await res.text();
    }
  
    fetchPage();
  </script>
  
  {@html pageContent}
  