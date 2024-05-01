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
                <ul class="list-disc list-inside text-sm">
                    <li>Артикул</li>
                    <li>Название</li>
                    <li>Ед. измерения</li>
                </ul>
            </p>
            <div>
                <p class="text-sm mb-1">
                    Пример:
                </p>
                <!--                <img-->
                <!--                    src="/images/structureProducts.png"-->
                <!--                    alt="Excel"-->
                <!--                    class="w-full md:w-1/2 object-contain"-->
                <!--                >-->
            </div>
        </div>
        <DragDrop
            v-model="id"
            accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            description="Только файлы с расширением .xls, .xlsx"
        />
        <div>
            <ul class="flex flex-col gap-2">
                <li v-if="xlsImports.length">
                    <div class="text-muted-400">
                        Дата загрузки
                    </div>
                </li>
                <li
                    v-for="xls in xlsImports"
                    :key="xls.id"
                    class="flex justify-between p-2 dark:bg-muted-800 bg-muted-50 rounded border-muted-200 dark:border-muted-700 shadow-muted-300/30 dark:shadow-muted-800/20 dark:bg-muted-800"
                >
                    <NuxtLink
                        class="w-full flex cursor-pointer"
                    >
                        <div
                            class="w-full flex justify-between items-center select-none"
                            @click="openProducts(xls.id)"
                        >
                            <div class="flex justify-between items-center gap-2 text-xs lg:text-sm text-muted-500">
                                <p>{{ xls.id }}</p>
                                <p>{{ moment.utc(xls.updatedAt).locale('ru').format('dddd, D MMMM YYYY [г.] в HH:mm') }}</p>
                            </div>
                        </div>
                    </NuxtLink>
                    <button class="btn">
                        <Icon
                            name="ph:x"
                            size="18"
                            @click="deleteXls(xls.id, $event)"
                        />
                    </button>
                </li>
                <BasePlaceload
                    v-if="loading"
                    class="h-10 rounded-md w-full"
                />
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>

import moment from 'moment';

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
const importsService = useService('imports');
const rpcService = useService('rpc');
const router = useRouter();
const id = ref<number[]>([]);

watch(() => id.value, (value) => {
    const lastIndex = value.length - 1;
    uploadExcel(value[lastIndex]);
});

const xlsImports = ref<any[]>([]);

onMounted(async() => {
    await fetchImports();
});
async function uploadExcel(fileId: number) {
    loading.value = true;
    await rpcService.create({
        method: 'UploadExcel',
        params: { fileId: fileId },
    }).exec();
    toast.show({type: 'success', message: 'Excel успешно импортирован', timeout: 5000});
    await fetchImports();
    loading.value = false;
}

async function fetchImports() {
    loading.value = true;
    xlsImports.value = await importsService.find().list().exec();
    loading.value = false;
}

async function deleteXls(id: number, e: Event) {
    e.stopPropagation();
    await importsService.remove(`${id}`).exec();
    await fetchImports();
    toast.show({type: 'success', message: 'Excel успешно удален', timeout: 5000});
}

function openProducts(id: number) {
    router.push({ name: 'excel-id', params: { id } });
}
</script>

<style>
</style>
