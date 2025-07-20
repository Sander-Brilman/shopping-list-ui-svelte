<script lang="ts">
    let { url, iconClasses = null, text, onSelected }: { url:string, iconClasses:string|null, text:string, onSelected:CallableFunction } = $props();

    let isActive = $state(url == `/${window.location.hash}`);

    window.addEventListener('hashchange', () => {
        isActive = url == `/${window.location.hash}`;
    });

</script>

<a onclick={() => onSelected()} class="{isActive ? "selected" : ""}" href="{url}">
    <i class="{iconClasses}"></i>
    {text}
</a>

<style>

    a { 
        margin-left: 25PX;
        padding: .7em 1.4em;
        text-decoration: none;
        color: white;
        transition: all .3s ease-out;

        outline: solid 10px transparent;

        border-radius: 0px 00px 0px 10px !important;
        font-weight: bold;


        &:is(:hover, .selected, :focus) {
            background: white;
            color: var(--theme);
            outline: solid 6px #ffffffa3;
        }
    }


</style>