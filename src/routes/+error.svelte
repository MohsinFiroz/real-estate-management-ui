<script lang="ts">
    import { page } from '$app/state';
    import { Section, Page404 } from 'flowbite-svelte-blocks';
    import { Button } from 'flowbite-svelte';

    // Define emojis for specific error codes
    const errorEmojis: Record<number, string> = {
        400: "❓",  // Bad Request
        401: "🔒",  // Unauthorized
        403: "⛔",  // Forbidden
        404: "🔍",  // Not Found
        408: "⏳",  // Request Timeout
        429: "🚦",  // Too Many Requests
        500: "🔥",  // Internal Server Error
        502: "⚡",  // Bad Gateway
        503: "🛠️",  // Service Unavailable
        504: "⏲️"   // Gateway Timeout
    };

    // Get error emoji based on status
    $: errorEmoji = errorEmojis[page?.status] ?? "⚠️"; // Default emoji
  </script>
  
  <Section name="page404">
    <Page404>
      <svelte:fragment slot="h1">{page.status}</svelte:fragment>
      <svelte:fragment slot="paragraph">
        <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">{errorEmoji} {page.error?.message ?? "Something went wrong!"}</p>
        <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page.</p>
        <Button href="/" size="lg" color="red">Back to Homepage</Button>
      </svelte:fragment>
    </Page404>
  </Section>