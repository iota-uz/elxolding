<template>
    <div class="flex flex-col gap-8 h-full">
        <div>
            <h1 class="text-xl">Материалы</h1>
            <h2 class="text-sm text-gray-500">Справочник материалов и их плотностей</h2>
        </div>
        <Calendar />
    </div>
</template>

<script lang="ts" setup>
import Calendar from '~/components/calendar/Calendar.vue';

definePageMeta({
    authRoute: true,
    layout: 'account',
    verbose: 'Задачи'
});

useHead({
    title: 'Задачи'
});

// const materialsService = useService('materials', {auth: true});



</script>

<style>
</style>
