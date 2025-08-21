import DeleteList from './delete-list.svelte';
import Home from './home.svelte';
import ListView from './list-view.svelte';
import NewList from './new-list.svelte';
import NotFound from './not-found.svelte';

export default {
    '/list-view/:listId/': ListView,
    '/': Home,
    '/new-list/': NewList,
    '/delete-list/': DeleteList,
    '*': NotFound
};
