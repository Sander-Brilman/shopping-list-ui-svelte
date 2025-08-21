<script lang="ts">
    import { listService, type ShoppingList } from "../services/list-service";
    import { messageService } from "../services/message-service";


    let allLists: ShoppingList[] = $state([]);
    
    let promise = listService.getAllLists().then(l => allLists = l);

    let dialog: HTMLDialogElement;

    let selectedList: ShoppingList|null = $state(null);
    function openConfirm(list:ShoppingList) {
        selectedList = list;
        dialog.showModal();
    }

    async function deleteSelectedList() {
        if (selectedList == null) {
            return;
        }

        await listService.deleteList(selectedList);
        allLists = allLists.filter(l => l != selectedList);

        messageService.showSuccess(`lijst ${selectedList.name} verwijdert`);
        
        selectedList = null;
        dialog.close();
    }

</script>

<h1>Lijsten verwijderen</h1>
<h2>bottom text</h2>

{#await promise}
    <p>Aan het laden..</p>
{:then _}
    <ol>
        {#each allLists as list}
            <li>
                <button class="secondary" onclick={() => openConfirm(list)}>{list.name}</button>
            </li>        
        {/each}
    </ol>
{/await}

<dialog bind:this={dialog} popover id="confirm">
    <h3>Weet je zeker dat je de lijst {selectedList?.name} wilt verwijderen</h3>

    <div class="button-drawer">
        <button onclick={deleteSelectedList} type="button">Ja, opgeflikkert met dat ding</button>
        <button onclick={() => dialog.close()} class="secondary" type="button">NeEeeEEeE!!</button>
    </div>
</dialog>

<style>
    ol {
        padding: 0;
        display: flex;
        flex-direction: column;
    }

    li {
        list-style: none;
        margin-bottom: 1rem;
        width: 100%;
        max-width: 500px;
    }

    h3 {
        font-size: 1.5rem;
        margin-bottom: 1.5em;
    }

    li button {
        font-size: 1rem;
        width: 100%;
    }

    .button-drawer button {
        flex-grow: 1;
    }

    ::backdrop {
        background: rgba(0, 0, 0, 0.349);
    }

</style>