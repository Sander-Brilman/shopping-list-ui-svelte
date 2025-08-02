<script lang="ts">
    import { NotyfEvent } from "notyf";
    import ItemList from "../components/item-list.svelte";
    import SearchBar from "../components/search-bar.svelte";
    import { type ShoppingItem, itemService } from "../services/item-service";
    import { listService, type ShoppingList } from "../services/list-service";
    import { buildSignalRClient } from "../services/live-update-service.svelte";
    import { messageService } from "../services/message-service";
    import { daysUntilChristmas, galacticYearsUntilChristmas } from "../services/utilities.svelte";
    import Poem from "../components/poem.svelte";
    import { onDestroy, onMount } from "svelte";
    import type { HubConnection } from "@microsoft/signalr";
    const { params } = $props();

    const listId = $derived(params.listId);
    let listName = $state("");

    let allItems: ShoppingItem[] = $state([]);
    let visibleItems: ShoppingItem[] = $state([]);

    let active: ShoppingItem[] = $derived(visibleItems
        .filter(item => item.isChecked)
        .sort((a, b) => b.timesUsed - a.timesUsed));

    let inactive: ShoppingItem[] = $derived(visibleItems
        .filter(item => item.isChecked == false)
        .sort((a, b) => b.timesUsed - a.timesUsed));


    function rerenderVisibleLists() {
        visibleItems = searchValue.length == 0
            ? [...allItems]
            : [...allItems.filter(i => i.name.trim().normalize().toLowerCase().includes(searchValue.trim().normalize().toLowerCase()))];
    }

    let promise = $state();

    let daysUntilChristmasText = $state(daysUntilChristmas());
    let galacticYearsUntilChristmasText = $state(galacticYearsUntilChristmas());

    $effect(() => {
        daysUntilChristmasText = daysUntilChristmas();
        galacticYearsUntilChristmasText = galacticYearsUntilChristmas();


        searchValue = "";

        promise = itemService.getAllItemsInList(listId)
            .then(items => {
                allItems = items ?? [];
                visibleItems = allItems;
            })

        listService.getListNameByID(listId).then(result => listName = result);
    })

    async function setItemChecked(item: ShoppingItem, isChecked:boolean, showAlert:boolean = true) {
        item.isChecked = isChecked;
        searchValue = "";
        rerenderVisibleLists();
        
        if (showAlert) {
            const message = `${item.name} op ${isChecked ? "" : "in-"}actief gezet. Tik om ongedaan te maken.`;
            messageService.showSuccess(message).on(NotyfEvent.Click, async () => {
                await setItemChecked(item, !isChecked, false)
                messageService.showSuccess(`${item.name} terug op ${!isChecked ? "" : "in-"}actief gezet`);
            })
        }

        await itemService.setItemState(item.id, isChecked);
    }

    let searchValue = $state("");
    async function onSearch(newSearchValue:string) {
        searchValue = newSearchValue;
        rerenderVisibleLists();
    }


    async function addAsItem(value:string) {
        value = value.trim();
        if (value.length == 0) {
            return;
        }
        await itemService.addNewItem(listId, value);
        searchValue = "";
        rerenderVisibleLists();
        messageService.showSuccess(`${value} toegevoegd als item`);
    }


    let connection:HubConnection|null = null;
    
    onMount(async () => {
        connection = await buildSignalRClient("ShoppingItemHub", {
            OnItemAdded: async (item:ShoppingItem, newItemListId:string) => { 
                if (newItemListId != listId) { return; }
                allItems.push(item); 
                rerenderVisibleLists();
            },
            OnItemToggled: async (itemId:string, newState:boolean) => {
                const item = allItems.find(i => i.id == itemId);
                if (item === undefined || item.isChecked == newState) { return; }
                item.isChecked = newState;
                messageService.showSuccess(`${item.name} is op ${newState ? "" : "in-"}actief gezet door iemand anders`);
                rerenderVisibleLists();
            },
            OnItemDeleted: async (itemId:string) => {
                allItems = allItems.filter(i => i.id != itemId);
                rerenderVisibleLists();
            }},
            async () => {// on reconnected
                let items = await itemService.getAllItemsInList(listId);
                allItems = items ?? [];
                visibleItems = allItems;
            }
        );
    });

    onDestroy(() => {
        connection?.stop();
    });



</script>

<h1>Lijst {listName}</h1>     
<h2>Nog {daysUntilChristmasText} dagen tot kerst!<br><span class="small">(dat is {galacticYearsUntilChristmasText} galactische jaren)</span></h2>

{#snippet addAsItemButton()}
    <button aria-label="Toevoegen als item" type="button" title="Zoek waarde als item toevoegen" onclick={async () => await addAsItem(searchValue)} class="flat">
        <i class="bi bi-plus-circle"></i>
    </button>
{/snippet}

<div class="search-bar-wrapper">
    <SearchBar additionalButtons={addAsItemButton} {onSearch} bind:searchValue={searchValue} onSubmit={async (value) => await addAsItem(value)} />
</div>

{#await promise}
    <p>aan het laden..</p>
{:then _} 
    {#if allItems.length > 0}
        <ItemList items={active} onItemClicked={async (i) => await setItemChecked(i, false)}  />
        <hr>
        <ItemList items={inactive} onItemClicked={async (i) => await setItemChecked(i, true)}  />
    {:else}
        <Poem></Poem>
    {/if}
{/await}


<style>
    .search-bar-wrapper {
        margin-bottom: 2rem;
    }
</style>