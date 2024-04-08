<template>
    <div class="flex flex-col gap-8">
        <div>
            <h1 class="text-xl">
                Инвентаризация
            </h1>
        </div>
        <div class="flex gap-3">
            <LinkTabs :tabs="tabs" />
        </div>
        <NuxtPage />
    </div>
</template>

<script lang="ts" setup>
import LinkTabs from '~/components/common/LinkTabs.vue';

definePageMeta({
    layout: 'account',
    verbose: 'Инвентаризация'
});

useHead({
    title: 'Инвентаризация'
});

const route = useRoute();
const tabs = [
    {
        icon: 'ph:unite-square',
        label: 'Все',
        path: {name: 'inventory-id', params: {id: route.params.id}}
    },
    {
        icon: 'ph:exclude-square',
        label: 'Разница',
        path: {name: 'inventory-id-difference', params: {id: route.params.id}}
    }
];
</script>

<style scoped>
</style>
