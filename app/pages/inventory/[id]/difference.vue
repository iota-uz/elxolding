<template>
    <div class="flex flex-col gap-8">
        <div class="flex flex-wrap gap-5 justify-between">
            <div class="flex items-center gap-4">
                <PerPageSelect v-model="perPage" />
            </div>
        </div>
        <div class="relative overflow-x-auto">
            <BaseTable
                v-model:sortBy="sortBy"
                :columns="columns"
                :data="items.data"
                :loading="isFetchPending"
                class="flex-auto"
            />
            <BasePagination
                v-if="items.total / perPage > 1"
                v-model:current-page="currentPage"
                class="my-2"
                :item-per-page="perPage"
                :total-items="items.total"
                :max-links-displayed="10"
                shape="rounded"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import BaseTable from '~/components/common/BaseTable.vue';
import PerPageSelect from '~/components/common/PerPageSelect.vue';
import {type Column} from '~/components/common/types';
import {type PaginatedResponse} from '~/types/generics';

definePageMeta({
    layout: 'account',
    verbose: 'Разница'
});

useHead({
    title: 'Разница'
});

const toast = useToast('GlobalToast');
const route = useRoute();
const app = useAppConfig();
const inventoryResultsService = useService('inventory-results', {auth: true});

const isFetchPending = ref(false);
const items = ref<PaginatedResponse<any>>({total: 0, data: [], limit: 0, skip: 0});
const perPage = ref(app.pagination.defaultPageSize);
const currentPage = ref(route.query.page ? parseInt(route.query.page as string) : 1);
const sortBy = ref<Record<string, any>>({createdAt: -1});

const columns = ref<Column[]>([
    {
        label: 'Название',
        name: 'name',
        field: (item) => item.position.title,
    },
    {
        label: 'Артикул RFID',
        name: 'article',
        field: (item) => item.position.barcode,
    },
    {
        label: 'Ед. измерения',
        name: 'measure',
        field: (item) => item.position.unit,
    },
    {
        label: 'Факт. кол-во/кол-во в 1С',
        name: 'expected',
        field: (item) => `${item.found} / ${item.expected}`,
    }
]);

watch([currentPage, sortBy, perPage], fetch);

async function fetch() {
    isFetchPending.value = true;
    const query: Record<string, any> = {
        $limit: perPage.value,
        $skip: (currentPage.value - 1) * perPage.value,
        $sort: sortBy.value,
        difference: {
            $ne: 0
        }
    };
    try {
        items.value = await inventoryResultsService.find<PaginatedResponse<any>>(query).exec();
    } catch(e: any) {
        toast.show({type: 'error', message: e.message, timeout: 3000});
    } finally {
        isFetchPending.value = false;
    }
}

onMounted(async () => {
    await fetch();
});
</script>

<style>
</style>
