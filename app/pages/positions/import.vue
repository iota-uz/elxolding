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
                <li>Наименование</li>
                <li>Артикул</li>
                <li>Ед. измерения</li>
                <li>Кол-во</li>
            </ul>
            <div>
                <p class="text-lg mb-1">
                    Пример
                </p>
                <img
                    alt="Excel example positions structure"
                    class="w-full md:w-1/2 object-contain"
                    src="/img/excel/example-positions.jpg"
                >
            </div>
        </div>
        <DragDrop
            accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            description="Только файлы .xls, .xlsx"
            @update:model-value="fileId = $event"
        />
        <div class="flex justify-end">
            <BaseButton
                color="primary"
                @click="upload"
            >
                Загрузить
            </BaseButton>
        </div>
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
const fileId = ref<number | null>(null);

const toast = useToast('GlobalToast');
const rpcService = useService('rpc', {auth: true});

async function upload() {
    if (!fileId) {
        toast.show({
            message: 'Файл не выбран',
            timeout: 3000,
            type: 'error'
        });
        return;
    }

    loading.value = true;
    try {
        const {error} = await rpcService.create({
            method: 'UploadPositionsFromExcel',
            params: {
                fileId: fileId.value
            }
        }).exec();
        if (error) {
            throw new Error(error.message);
        }
        toast.show({
            message: 'Позиции успешно загружены',
            timeout: 3000,
            type: 'success'
        });
    } catch (e: any) {
        toast.show({
            message: e.message,
            timeout: 3000,
            type: 'error'
        });
    } finally {
        loading.value = false;
    }
}
</script>

<style>
</style>
