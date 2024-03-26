<template>
    <div class="flex flex-col gap-8">
        <div>
            <h1 class="text-xl">
                Завки
            </h1>
            <h2 class="text-sm text-gray-500">
                Список заявок
            </h2>
        </div>
        <div class="flex flex-wrap gap-5 justify-between">
            <div class="flex items-center gap-4">
                <DateSelect
                    v-model:start="dateFilter.start"
                    v-model:end="dateFilter.end"
                    label="Дата создания"
                />
                <PerPageSelect v-model="perPage" />
            </div>
            <NuxtLink :to="{name: 'requests-id', params: {id: 'new'}}">
                <BaseButton color="primary">
                    Новая заявка
                </BaseButton>
            </NuxtLink>
        </div>
        <div class="relative overflow-x-auto">
            <BaseTable
                v-model:sortBy="sortBy"
                :columns="columns"
                :data="requests.data"
                :loading="isFetchPending"
                class="flex-auto"
            >
                <template #buttons="{item}">
                    <TairoTableCell class="px-6 py-4 flex justify-end">
                        <NuxtLink
                            :to="{name: 'requests-id', params: {id: item.id}}"
                            class="border border-gray-300 dark:border-muted-600 rounded-md p-2"
                        >
                            <Icon
                                class="w-5 h-5"
                                name="ph:pencil-simple"
                            />
                        </NuxtLink>
                    </TairoTableCell>
                </template>
            </BaseTable>
            <BasePagination
                v-if="requests.total / perPage > 1"
                v-model:current-page="currentPage"
                class="my-2"
                :item-per-page="perPage"
                :total-items="requests.total"
                :max-links-displayed="10"
                shape="rounded"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import BaseTable from '~/components/common/BaseTable.vue';
import DateSelect from '~/components/common/DateSelect.vue';
import PerPageSelect from '~/components/common/PerPageSelect.vue';
import {type Column} from '~/components/common/types';
import TairoTableCell from '~/components/tairo/TairoTableCell.vue';
import {type PaginatedResponse} from '~/types/generics';

definePageMeta({
    layout: 'account',
    verbose: 'Elxolding'
});

useHead({
    title: 'Elxolding'
});

const toast = useToast('GlobalToast');
const route = useRoute();
const app = useAppConfig();
const requestsService = useService('requests', {auth: true});

const isFetchPending = ref(false);
const requests = ref<PaginatedResponse<any>>({total: 0, data: [], limit: 0, skip: 0});
const perPage = ref(app.pagination.defaultPageSize);
const currentPage = ref(route.query.page ? parseInt(route.query.page as string) : 1);
const dateFilter = reactive({start: '', end: ''});
const sortBy = ref<Record<string, any>>({createdAt: -1});

const columns = ref<Column[]>([
    {
        label: 'Тип заявки',
        name: 'type',
        enums: {
            'in': 'Приход',
            'out': 'Расход'
        },
        sortable: true
    },
    {
        label: 'Наименований',
        name: 'name',
        sortable: true,
        field: (item) => {
            return item.positions.length;
        }
    },
    {
        label: 'Продукции',
        name: 'total',
        sortable: true,
        field: (item) => {
            return item.products.length;
        }
    },
    {
        label: 'Дата создания',
        name: 'createdAt',
        sortable: true,
        dateFormat: 'calendar'
    },
]);

watch([currentPage, sortBy, perPage, dateFilter], fetch);

async function fetch() {
    isFetchPending.value = true;
    const query: Record<string, any> = {
        $limit: perPage.value,
        $skip: (currentPage.value - 1) * perPage.value,
        $sort: sortBy.value
    };
    if (dateFilter.end && dateFilter.start) {
        query.createdAt = {
            $lt: dateFilter.end,
            $gt: dateFilter.start
        };
    }
    try {
        requests.value = await requestsService.find<PaginatedResponse<any>>(query).exec();
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
