<template>
    <div class="mt-4 px-10">
        <div class="flex flex-col gap-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 items-end">
                <MultiSelect
                    v-model="product.positionId"
                    :error="errors.positionId"
                    :options="positions"
                    type="text"
                    label="Наименование*"
                    name="name"
                    placeholder="Начните печатать"
                />
                <BaseInput
                    v-model="product.rfid"
                    label="RFID метка*"
                    name="rfid"
                    placeholder="пр.: 6548231"
                    :error="errors.rfid"
                    type="text"
                />
                <BaseSelect
                    v-model="product.status"
                    :error="errors.status"
                    label="Статус*"
                    name="status"
                >
                    <option value="in_stock">
                        На складе
                    </option>
                    <option value="in_development">
                        В разработке
                    </option>
                    <option value="approved">
                        Обобрено
                    </option>
                </BaseSelect>
            </div>
        </div>
        <div class="flex justify-end mt-6">
            <div>
                <BaseButton
                    v-if="product.id"
                    color="danger"
                    :loading="isDeletePending"
                    @click="remove"
                >
                    Удалить
                </BaseButton>
                <BaseButton
                    class="ml-2"
                    color="primary"
                    :loading="isSavePending"
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
    verbose: 'Продукт'
});

useHead({
    title: 'Продукт'
});

const route = useRoute();
const toast = useToast('GlobalToast');
const productsService = useService('products', {auth: true});

const product = ref<any>({});
const positions = ref<any[]>([]);
const errors = ref<Record<string, string>>({});
const isDeletePending = ref(false);
const isSavePending = ref(false);

onMounted(async () => {
    if (route.params.id === 'new') {
        product.value = {};
    } else {
        product.value = await productsService.get(route.params.id as string).exec();
    }
    positions.value = await optionsList(useService('positions', {auth: true}), 'title');
});


async function remove() {
    isDeletePending.value = true;
    try {
        await productsService.remove(product.value.id);
        toast.show({message: 'Успешно удалено', timeout: 3000, type: 'success'});
        navigateTo('/name');
    } catch (e: any) {
        toast.show({message: e.message, timeout: 3000, type: 'error'});
    } finally {
        isDeletePending.value = false;
    }
}

async function submit() {
    const {id, ...data} = product.value;
    errors.value = {};
    isSavePending.value = true;
    try {
        if (id) {
            await productsService.patch(id, data).exec();
        } else {
            await productsService.create(data).exec();
        }
        navigateTo('/products');
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
