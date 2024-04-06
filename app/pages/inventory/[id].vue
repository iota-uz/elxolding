<template>
    <div class="flex flex-col gap-8">
        <div>
            <h1 class="text-xl">
                Инвентаризация
            </h1>
        </div>
        <div class="flex gap-3">
            <ul class="flex gap-3">
                <li>
                    <NuxtLink
                        :to="{name: 'inventory-id', params: {id: route.params.id}}"
                        class="pb-1 hover:border-b"
                        exact-active-class="text-blue-500 border-b border-blue-500"
                    >
                        Все
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink
                        :to="{name: 'inventory-id-difference', params: {id: route.params.id}}"
                        class="pb-1 hover:border-b"
                        exact-active-class="text-blue-500 border-b border-blue-500"
                    >
                        Разница
                    </NuxtLink>
                </li>
            </ul>
        </div>
        <NuxtPage />
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'account',
    verbose: 'Инвентаризация'
});

useHead({
    title: 'Инвентаризация'
});

const route = useRoute();
</script>

<style scoped>
</style>
