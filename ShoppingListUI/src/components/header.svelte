<script lang="ts">
    import { listService, type ShoppingList } from "../services/list-service";
    import NavItem from "./nav-item.svelte";

    let lists:ShoppingList[] = $state([]);

    listService.getAllLists().then(r => lists = r);

    let hideMenu = $state(true);

    listService.addOnChangesListener(newLists => lists = newLists)

</script>

<header>
    <div class="top-bar">
        <a onclick={() => hideMenu = true} href="/#/">Boodschappen?</a>
        <button onclick={() => hideMenu = !hideMenu}>MENU</button>
    </div>
    <nav class="{hideMenu ? "hidden" : ""}">
        {#await lists}
            <p>Aan het laden..</p>
        {:then lists} 
            {#each lists as list}
                <NavItem onSelected={() => hideMenu = true} iconClasses={null} text={list.name} url="/#/list-view/{list.id}"  />
            {/each}
        {/await}
        <hr>

        <NavItem onSelected={() => hideMenu = true} iconClasses="bi bi-journal-plus" text="Nieuwe lijst" url="/#/new-list"  />
        <NavItem onSelected={() => hideMenu = true} iconClasses="bi bi-journal-minus" text="Lijst verwijderen" url="/#/delete-list"  />
    </nav>
</header>

<style>

    header {
        overflow: auto;
        width: 100%;
        background: var(--theme-background);
        color: white;
        display: flex;
        flex-direction: column;
        z-index: 1;
    }

    header:has(nav:not(.hidden)) {
        height: 100%;
        position: fixed;
    }

    header:has(nav:not(.hidden)) + div {
        display: none;
    }

    .top-bar {
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        background: var(--theme-background);

        a {
            text-decoration: none;
            font-size: 1.2rem;
            color: white;
            font-weight: 900;
            font-family: Impact, 'Arial Narrow Bold', sans-serif;
            display: flex;
            align-items: center;
        }


        button {
            background: none;
            border: none;
            color: inherit;
            /* text-transform:uppercase; */
        }
    }

    nav {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-top: 10px;
        margin-bottom: 1rem;
        flex-grow: 1;

        &.hidden {
            display: none;
        }


    }


    div {
        padding: 1rem;
    }

    hr {
        color: white;
        margin: .5em 0em;
    }

    @media screen and (min-width: 750px) {


        header {
            width: 300px;
            margin-bottom: 0;

            button {
                display: none;
            }

            nav {
                display: flex !important;
            }
        }

    }
</style>