<script lang="ts">
    import type { Snippet } from "svelte";

    let { additionalButtons, searchValue = $bindable(""), onSearch, onSubmit }: { additionalButtons:Snippet, searchValue:string, onSearch: (searchValue: string) => Promise<void>, onSubmit: (searchValue: string) => Promise<void> } = $props();

    async function onkeyup(e: KeyboardEvent) {
        await onSearch(searchValue);
    }

    async function internalOnSubmit(e:SubmitEvent) {
        e.preventDefault();
        await onSubmit(searchValue);
    }

    async function clear() {
        searchValue = "";
        await onSearch("");
    }
</script>

<form onsubmit={internalOnSubmit}>
    <label class="form-field"> 
    
        <input required {onkeyup} bind:value={searchValue} type="search" placeholder="Typ om te zoeken, of niet zoek het uit" >

        <div>
            {@render additionalButtons()}
            <button onclick={clear} aria-label="Leeg maken" title="Leeg maken" type="button" class="flat clear"><i class="bi bi-trash"></i></button>
        </div>
    </label>
</form>


<style>
    



    label {
        border: solid 1px #646464;
        border-radius: 50px;
        width: 100%;
        display: flex;
        gap: 10px;
        font-size: 1rem;

        & * {
            border-radius: 50px;
        }
    }

    input {
        border: none;
        width: 100%;
        padding: 0 .5em;
        margin: 0;
        margin-left: 2px;
        font-size: inherit;
        padding-left: 1rem;
    }

    div {
        display: flex;
        margin-right: 10px;
    }

</style>