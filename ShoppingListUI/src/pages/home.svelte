<script lang="ts">
    import { listService, type ShoppingList } from "../services/list-service.js";
    import { selectTheme, allThemes, getSelectedTheme } from "../services/utilities.svelte.js";

    let lists:ShoppingList[] = $state([]);

    listService.getAllLists().then(l => lists = l);

</script>

<h1>Sander's boodschappen lijstje app</h1>
<h2>Kies een thema!</h2>

<div class="button-drawer">
    {#each allThemes as theme}
        <button onclick={() => selectTheme(theme)} class="{theme.toLowerCase()} {theme == getSelectedTheme() ? "selected" : ""}">{theme}</button>
    {/each}
</div>

<hr>

<h3>Lijsten</h3>
<ol>
    {#each lists as list, i}
        <li><a class="button {i > 0 ? "secondary" : ""}" href="#/list-view/{list.id}">{list.name}</a></li>
    {/each}
</ol>

<p class="version small">Versie: 1.0.1</p>

<style>
    button {
        font-size: 1rem;
    }

    .selected {
        outline: solid var(--theme-lighter) 3px;
        outline-offset: 2px;
    }

    .button-drawer {
        margin-bottom: 1rem;
    }

    ol {
        padding: 0;
        margin-bottom: 1rem;
    }

    li {
        list-style: none;
    }

    a {
        margin-bottom: 1rem;
        width: 100%;
    }   

    h3 {
        font-size: 1.5rem;
    }
</style>