<script lang="ts">
    import Router from 'svelte-spa-router';
    import routes from './pages/routes.js';
    import Header from './components/header.svelte';


</script>


<main>
    <Header />
    <div>
        <Router {routes} />
    </div>
</main>

<style>

    main {
        width: 100%;
        max-width: 100%;
        height: 100%;
        max-height: 100%;
    }


    div {
        width: 100%;
        padding: .5em;
        overflow: auto;
    }
    

    @media screen and (min-width: 750px) {
        
        main {
            display: flex;
        }

        div {
            padding: 1em;
        }
    }

</style>
