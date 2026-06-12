<script>
  import { toasts } from '../stores/store.js';
</script>

{#if $toasts.length > 0}
  <div class="toast-wrap" role="status" aria-live="polite">
    {#each $toasts as t (t.id)}
      <div class="toast {t.type}">{t.text}</div>
    {/each}
  </div>
{/if}
