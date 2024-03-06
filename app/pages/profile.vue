<template>
    <div>
        <LinkTabs :tabs="tabs" />
        <NuxtPage />
    </div>
</template>

<script lang="ts" setup>
import LinkTabs from '~/components/common/LinkTabs.vue';

definePageMeta({
    authRoute: true,
    layout: 'account',
    verbose: 'Профиль'
});

useHead({
    title: 'Профиль'
});

const tabs = ref([
    {
        label: 'Профиль',
        icon: 'ph:user',
        value: 'profile',
        path: '/profile'
    },
    {
        label: 'Безопасность',
        icon: 'ph:lock',
        value: 'security',
        path: '/profile/security'
    },
    {
        label: 'Меню навигации',
        icon: 'ph:list',
        value: 'navigation',
        path: '/profile/navigation'
    }
]);

</script>

<style scoped>

</style>
