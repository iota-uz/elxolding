<template>
    <div class="mt-4 px-10">
        <div class="flex flex-col gap-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 items-end">
                <MultiSelect label="Деталь*" placeholder="Выберите деталь" name="detailId" :options="details" :error="errors.detailId" v-model="technologie.detailId"/>
                <BaseSelect v-model="technologie.status" label="Статус*" name="status" :error="errors.status">
                    <option value="inProgress">
                        В разработке
                    </option>
                    <option value="completed">
                        Завершен
                    </option>
                </BaseSelect>
                <MultiSelect v-model="technologie.assortmentId" label="Сортамент*" placeholder="Выберите сортамент" name="assortmentId" :options="assortments" :error="errors.assortmentId"/>
                <MultiSelect :options="materials" :error="errors.materialId" v-model="technologie.materialId" label="Материал*" placeholder="Выберите материал" name="materialId"/>
                <BaseInput :error="errors.sawWidth" step="0.100000" type="number" v-model="technologie.sawWidth" label="Ширина пила*" name="sawWidth" placeholder="Введите ширину пилы"/>
            </div>
        </div>
        <div class="flex justify-end mt-6">
            <div>
                <BaseButton
                    v-if="technologie.id"
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
import {optionsList} from '~/utils/search';

definePageMeta({
    authRoute: true,
    layout: 'account',
    verbose: 'Тех. процесс'
});

useHead({
    title: 'Тех. процесс'
});

const route = useRoute();
const toast = useToast('GlobalToast');
const technologiesService = useService('technologies', {auth: true});

const technologie = ref<any>({});
const details = ref<any[]>([]);
const assortments = ref<any[]>([]);
const materials = ref<any[]>([]);
const errors = ref<Record<string, string>>({});
const isDeletePending = ref(false);
const isSavePending = ref(false);

onMounted(async () => {
    if (route.params.id === 'new') {
        technologie.value = {status: 'inProgress'};
    } else {
        technologie.value = await technologiesService.get(route.params.id as string).exec();
    }
    details.value = await optionsList(useService('details', {auth: true}), 'name');
    assortments.value = await optionsList(useService('assortments', {auth: true}), 'name');
    materials.value = await optionsList(useService('materials', {auth: true}), 'name');
});


async function remove() {
    isDeletePending.value = true;
    try {
        await technologiesService.remove(technologie.value.id);
        toast.show({message: 'Успешно удалено', timeout: 3000, type: 'success'});
        navigateTo('/technologie');
    } catch (e: any) {
        toast.show({message: e.message, timeout: 3000, type: 'error'});
    } finally {
        isDeletePending.value = false;
    }
}

async function submit() {
    const {id, ...data} = technologie.value;
    errors.value = {};
    isSavePending.value = true;
    try {
        if (id) {
            await technologiesService.patch(id, data).exec();
        } else {
            await technologiesService.create(data).exec();
        }
        navigateTo('/technologies');
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