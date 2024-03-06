<template>
    <div class="flex flex-col gap-8">
        <div>
            <h1 class="text-xl">
                Продукция
            </h1>
            <h2 class="text-sm text-gray-500">
                Список продуктов
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

            <div class="flex gap-3">
                <div class="flex">
                    <BaseButton class="flex items-center !px-3 !rounded-r-none !border-e-0">
                        {{ statusFilter.status }}
                    </BaseButton>
                    <BaseDropdown
                        class="status-filter"
                        flavor="button"
                        label="Статус"
                        orientation="start"
                    >
                        <BaseDropdownItem
                            v-for="option in options"
                            :key="option.label"
                            :title="option.label"
                            @click="statusFilter.status = option.value"
                        />
                    </BaseDropdown>
                </div>
                <NuxtLink :to="{name: 'products-id', params: {id: 'new'}}">
                    <BaseButton color="primary">
                        Новый продукция
                    </BaseButton>
                </NuxtLink>
            </div>
        </div>
        <div>
            <Search
                v-model="searchQ"
                :debounce="300"
                :fields="fields"
            />
        </div>
        <div class="relative overflow-x-auto">
            <BaseTable
                v-model:sortBy="sortBy"
                :columns="columns"
                :data="products.data"
                :loading="isFetchPending"
                class="flex-auto"
            >
                <template #buttons="{item}">
                    <TairoTableCell class="px-6 py-4 flex justify-end">
                        <NuxtLink
                            :to="{name: 'products-id', params: {id: item.id}}"
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
                v-if="products.total / perPage > 1"
                v-model:current-page="currentPage"
                class="my-2"
                :item-per-page="perPage"
                :total-items="products.total"
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
import Search from '~/components/common/Search.vue';
import {type Column} from '~/components/common/types';
import TairoTableCell from '~/components/tairo/TairoTableCell.vue';
import {type PaginatedResponse} from '~/types/generics';

definePageMeta({
    layout: 'account',
    verbose: 'Сотрудники'
});

useHead({
    title: 'Сотрудники'
});

const toast = useToast('GlobalToast');
const route = useRoute();
const app = useAppConfig();
const productsService = useService('products', {auth: true});

const searchQ = ref({});
const isFetchPending = ref(false);
const products = ref<PaginatedResponse<any>>({total: 0, data: [], limit: 0, skip: 0});
const perPage = ref(app.pagination.defaultPageSize);
const currentPage = ref(route.query.page ? parseInt(route.query.page as string) : 1);
const dateFilter = reactive({start: '', end: ''});
const statusFilter = reactive({status: 'Все'});
const sortBy = ref<Record<string, any>>({createdAt: -1});

const options = [
    {label: 'Все', value: ''},
    {label: 'На складе', value: 'in_stock'},
    {label: 'В разработке', value: 'in_development'},
    {label: 'Одобрено', value: 'approved'},
];

const columns = ref<Column[]>([
    {
        label: 'Название',
        name: 'name',
        sortable: true
    },
    {
        label: 'Артикул',
        name: 'article',
        sortable: true
    },
    {
        label: 'Статус',
        name: 'status',
        sortable: true
    },
    {
        label: 'Дата создания',
        name: 'createdAt',
        sortable: true
    },
    {
        label: 'Дата обновления',
        name: 'updatedAt',
        sortable: true
    }
]);

const fields = ref([
    {
        label: 'Название',
        key: 'name'
    },
    {
        label: 'Артикул',
        key: 'article'
    },
    {
        label: 'Статус',
        key: 'status'
    },
]);

watch([currentPage, sortBy, perPage, searchQ, dateFilter, statusFilter], fetch);

async function fetch() {
    isFetchPending.value = true;
    const query: Record<string, any> = {
        $limit: perPage.value,
        $skip: (currentPage.value - 1) * perPage.value,
        $sort: sortBy.value,
        ...searchQ.value,
    };
    if (dateFilter.end && dateFilter.start) {
        query.createdAt = {
            $lt: dateFilter.end,
            $gt: dateFilter.start
        };
    }
    if (statusFilter.status) {
        query.status = statusFilter.status;
    }
    try {
        products.value = await productsService.find<PaginatedResponse<any>>(query).exec();
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
.status-filter {
    button {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
    }
}
</style>
