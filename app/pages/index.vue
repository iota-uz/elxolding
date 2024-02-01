<template>
    <div class="mt-4 space-y-4">

        <div>
            Здесь будет панель управления
        </div>

    </div>
</template>

<script lang="ts" setup>


definePageMeta({
    authRoute: true,
    layout: 'account',
    verbose: 'Панель управления',
});

useHead({
    title: 'Панель управления',
});


</script>

<style scoped>
</style>
