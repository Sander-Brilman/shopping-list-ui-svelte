<script lang="ts">
    import { listService } from "../services/list-service";
    import { push } from "svelte-spa-router";
    import { messageService } from "../services/message-service";

    let name = $state("");

    async function onsubmit(e:SubmitEvent) {
        e.preventDefault();

        if (name.trim().length == 0) {
            messageService.showError("je moet wel wat invullen sukkel");
            return;
        }

        let newList = await listService.createNewList(name);
        
        if (newList == null) {
            messageService.showError("er is iets mis gegaan bij het aanmaken van de lijst");
            return;
        }
        
        messageService.showSuccess(`Lijst ${newList.name} aangemaakt`);
        push(`#/list-view/${newList.id}`)
    }

    function askNicelyPlease() {
        messageService.showError("Niet als je het zo vraagt 😤");
    }

</script>

<h1>Nieuwe lijst aanmaken</h1>
<h2>Liever 10 lijstjes in de app dan 1 in de hand</h2>

<form {onsubmit}>
    <input required placeholder="jouw-super-coole-lijst-naam" type="text" bind:value={name} >

    <div class="button-drawer">
        <button onclick={askNicelyPlease} type="button">Aanmaken met dat aanmaken, en rap een beetje</button>
        <button class="secondary" type="submit">Kan je alsjeblieft de lijst aanmaken? 😇</button>
    </div>
</form>


<style>
    input {
        border:  solid 1px black;
        padding: .7em;
        width: 100%;
        border-radius: 10px;
        margin-bottom: 1rem;
    }


    button {
        max-width: fit-content;
    }
</style>