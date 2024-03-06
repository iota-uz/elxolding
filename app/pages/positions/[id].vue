<template>
    <div class="mt-4 px-10">
        <div class="flex flex-col gap-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 items-end">
                <BaseInput
                    v-model="position.title"
                    :error="errors.title"
                    type="text"
                    label="Наименование*"
                    name="title"
                    placeholder="пр.: Коробка"
                />
                <BaseInput
                    v-model="position.barcode"
                    label="Артикул*"
                    name="barcode"
                    placeholder="пр.: 6548231"
                    :error="errors.barcode"
                    type="text"
                />
                <BaseSelect
                    v-model="position.unit"
                    :error="errors.unit"
                    label="Ед. измерения*"
                    name="unit"
                >
                    <option value="cm">
                        См
                    </option>
                    <option value="dm">
                        Дм
                    </option>
                    <option value="l">
                        Литр
                    </option>
                    <option value="m3">
                        М3
                    </option>
                </BaseSelect>
            </div>
        </div>
        <div class="flex justify-end mt-6">
            <div>
                <BaseButton
                    v-if="position.id"
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


definePageMeta({
    layout: 'account',
    verbose: 'Новое наименование'
});

useHead({
    title: 'Новое наименование'
});

const route = useRoute();
const toast = useToast('GlobalToast');
const positionsService = useService('positions', {auth: true});

const position = ref<any>({});

const errors = ref<Record<string, string>>({});
const isDeletePending = ref(false);
const isSavePending = ref(false);

onMounted(async () => {
    if (route.params.id === 'new') {
        position.value = {};
    } else {
        position.value = await positionsService.get(route.params.id as string).exec();
    }
});


async function remove() {
    isDeletePending.value = true;
    try {
        await positionsService.remove(position.value.id);
        toast.show({message: 'Успешно удалено', timeout: 3000, type: 'success'});
        navigateTo('/positions');
    } catch (e: any) {
        toast.show({message: e.message, timeout: 3000, type: 'error'});
    } finally {
        isDeletePending.value = false;
    }
}

async function submit() {
    const {id, ...data} = position.value;
    errors.value = {};
    isSavePending.value = true;
    try {
        if (id) {
            await positionsService.patch(id, data).exec();
        } else {
            await positionsService.create(data).exec();
        }
        navigateTo('/positions');
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
