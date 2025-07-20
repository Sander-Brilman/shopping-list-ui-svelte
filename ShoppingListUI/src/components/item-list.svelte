<script lang="ts">
    import { type ShoppingItem } from "../services/item-service";
    const { items, onItemClicked }: { items: ShoppingItem[], onItemClicked: (item: ShoppingItem) => Promise<void> } = $props();
</script>

<ol>
    {#each items as item (item.id)}
        <li>
            <button class={item.isChecked ? "" : "secondary" } onclick={async () => await onItemClicked(item)}>
            {#if item.isChecked}
                <i class="bi bi-circle"></i>
            {:else}
                <i class="bi bi-check-circle"></i>
            {/if}
            {item.name}
            </button>
        </li>      
    {/each}
</ol>

<style>

    ol {
        padding: 0;
    }

    li {
        list-style: none;
        margin-bottom: 5px;
    }

    button {
        width: 100%;
        margin: auto;
        font-weight: bold;
        text-align: left;
        font-size: 1rem;
        
        &.grey {
            text-decoration: line-through;
        }
    }

    

    i {
        margin-right: 10px;
    }

</style>