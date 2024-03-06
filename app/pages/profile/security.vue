<template>
    <div class="flex justify-center items-center h-[800px]">
        <InDevelopment />
    </div>
</template>

<script lang="ts" setup>
import InDevelopment from '~/components/illustrations/InDevelopment.vue';

definePageMeta({
    authRoute: true,
    layout: 'account',
    verbose: 'Безопасность'
});

useHead({
    title: 'Безопасность'
});

</script>

<style scoped>

</style>
