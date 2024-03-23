<template>
    <div class="flex flex-col gap-4 mt-4">
        <BaseTabSlider
            v-model="request.type"
            :tabs="[
                { label: 'Приход', value: 'in' },
                { label: 'Отгрузка', value: 'out' },
            ]"
            class="w-full"
            rounded="sm"
        />
        <div>
            <table class="divide-muted-200 dark:divide-muted-700 min-w-full table-fixed divide-y">
                <thead>
                    <tr>
                        <th class="text-sm bg-muted-50 dark:bg-muted-800 py-3 text-muted-700 dark:text-muted-400 text-left font-sans font-semibold tracking-wider px-4">
                            Наименование
                        </th>
                        <th class="text-sm bg-muted-50 dark:bg-muted-800 py-3 text-muted-700 dark:text-muted-400 text-left font-sans font-semibold tracking-wider px-4">
                            Артикул
                        </th>
                        <th class="text-sm bg-muted-50 dark:bg-muted-800 py-3 text-muted-700 dark:text-muted-400 text-left font-sans font-semibold tracking-wider px-4">
                            Количество
                        </th>
                        <th class="text-sm bg-muted-50 dark:bg-muted-800 py-3 text-muted-700 dark:text-muted-400 text-left font-sans font-semibold tracking-wider px-4" />
                    </tr>
                </thead>
                <tbody class="divide-muted-200 dark:divide-muted-700 dark:bg-muted-800 divide-y bg-white">
                    <template v-if="request.products.length">
                        <tr
                            v-for="(product, idx) in request.products"
                            class="hover:bg-muted-50 dark:hover:bg-muted-900 transition-colors duration-300"
                        >
                            <td class="font-alt whitespace-nowrap text-sm text-muted-800 dark:text-white p-4 w-1/2">
                                {{ product.position.title }}
                            </td>
                            <td class="font-alt whitespace-nowrap text-sm text-muted-800 dark:text-white p-4 w-1/3">
                                {{ product.position.barcode }}
                            </td>
                            <td class="font-alt whitespace-nowrap text-sm text-muted-800 dark:text-white p-4">
                                <BaseInput
                                    v-model="product.quantity"
                                    name="quantity"
                                    type="number"
                                />
                            </td>
                            <td class="font-alt whitespace-nowrap text-sm text-muted-800 dark:text-white p-4">
                                <BaseButtonIcon
                                    color="danger"
                                    @click="removeProduct(idx)"
                                >
                                    <Icon name="ph:trash" />
                                </BaseButtonIcon>
                            </td>
                        </tr>
                    </template>
                    <tr v-else>
                        <td
                            class="font-alt whitespace-nowrap text-sm text-muted-800 dark:text-white p-4 text-center"
                            colspan="4"
                        >
                            Пока ничего
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            <MultiSelect
                v-model="selectedPositions"
                :options="positionOptions"
                label="Наименования*"
                multiple
                name="name"
            />
            <BaseButton
                class="w-full mt-4"
                color="primary"
                @click="addPositions"
            >
                Добавить
            </BaseButton>
        </div>
        <div class="flex justify-end mt-6">
            <div>
                <BaseButton
                    v-if="request.id"
                    :loading="isDeletePending"
                    color="danger"
                    @click="remove"
                >
                    Удалить
                </BaseButton>
                <BaseButton
                    :loading="isSavePending"
                    class="ml-2"
                    color="primary"
                    @click="submit"
                >
                    Сохранить
                </BaseButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import MultiSelect from '~/components/common/MultiSelect.vue';

definePageMeta({
    layout: 'account',
    verbose: 'Заявка'
});

useHead({
    title: 'Заявка'
});

const route = useRoute();
const toast = useToast('GlobalToast');
const requestsService = useService('requests', {auth: true});

const request = ref<Record<string, any>>({
    type: 'in',
    quantity: 0,
    products: []
});
const positions = ref<Record<string, any>[]>([]);
const selectedPositions = ref<number[]>([]);

const errors = ref<Record<string, string>>({});
const isDeletePending = ref(false);
const isSavePending = ref(false);

onMounted(async () => {
    if (route.params.id === 'new') {
        request.value = {
            type: 'in',
            quantity: 0,
            products: []
        };
    } else {
        request.value = await requestsService.get(route.params.id as string).exec();
    }
    positions.value = await useService('positions', {auth: true}).find({$limit: 1000}).list().exec();
});

const positionOptions = computed(() => {
    return positions.value.map(el => ({id: el.id, label: el.title}));
});


function removeProduct(idx: number) {
    request.value.products.splice(idx, 1);
}

function addPositions() {
    for (const pos of selectedPositions.value) {
        const isContained = request.value.products.find((el: any) => el.position.id === pos);
        if (!isContained) {
            request.value.products.push({
                position: positions.value.find(el => el.id === pos),
                quantity: 1
            });
        }
    }
    selectedPositions.value = [];
}

async function remove() {
    isDeletePending.value = true;
    try {
        await requestsService.remove(request.value.id).exec();
        toast.show({message: 'Успешно удалено', timeout: 3000, type: 'success'});
        navigateTo('/requests');
    } catch (e: any) {
        toast.show({message: e.message, timeout: 3000, type: 'error'});
    } finally {
        isDeletePending.value = false;
    }
}

async function submit() {
    const {id, ...data} = request.value;
    errors.value = {};
    isSavePending.value = true;
    try {
        if (id) {
            await requestsService.patch(id, data).exec();
        } else {
            await requestsService.create(data).exec();
        }
        navigateTo('/requests');
    } catch (e: any) {
        if (e.code === 400 || e.code === 422) {
            for (const err of e.errors) {
                errors.value[err.path] = useText(`errors.${err.type}`);
            }
        } else {
            toast.show({message: e.message, timeout: 3000, type: 'error'});
        }
    } finally {
        isSavePending.value = false;
    }
}
</script>

<style scoped>

</style>
