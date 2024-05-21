<template>
    <div
        class="flex flex-col gap-8"
    >
        <div class="space-y-2">
            <h1 class="text-2xl font-semibold">
                Загрузка Excel
            </h1>
            <p class="text-sm">
                Последовательнось ячеек в Excel должна быть следующая:
            </p>
            <ul class="list-disc list-inside text-sm">
                <li>Артикул</li>
                <li>Название</li>
                <li>Ед. измерения</li>
            </ul>
            <div>
                <p class="text-lg mb-1">
                    Пример
                </p>
                <img
                    alt="Excel example positions structure"
                    class="w-full md:w-1/2 object-contain"
                    src="/img/excel/example-positions.png"
                >
            </div>
        </div>
        <DragDrop
            accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            description="Только файлы .xls, .xlsx"
        />
    </div>
</template>

<script lang="ts" setup>

import DragDrop from '~/components/common/DragDrop.vue';

definePageMeta({
    layout: 'account',
    verbose: 'Загрузка Excel'
});

useHead({
    title: 'Загрузка Excel'
});

const loading = ref(false);

const toast = useToast('GlobalToast');
const rpcService = useService('rpc');
const router = useRouter();
</script>

<style>
</style>
