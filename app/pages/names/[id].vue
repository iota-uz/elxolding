<template>
    <div class="mt-4 px-10">
        <div class="flex flex-col gap-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 items-end">
                <BaseInput :error="errors.name" type="text" v-model="name.name" label="Наименование*" name="name" placeholder="пр.: Коробка"/>
                <BaseInput v-model="name.article" label="Артикул*" name="article" placeholder="пр.: 6548231" :error="errors.article" type="text"/>
                <BaseSelect :error="errors.measure" v-model="name.measure" label="Ед. измерения*" name="measure">
                    <option value="admin">
                        См
                    </option>
                    <option value="manager">
                        Дм
                    </option>
                    <option value="editor">
                        Литр
                    </option>
                    <option value="name">
                        М3
                    </option>
                </BaseSelect>
            </div>
        </div>
        <div class="flex justify-end mt-6">
            <div>
                <BaseButton
                    v-if="name.id"
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
const namesService = useService('names');

const name = ref<any>({});

const errors = ref<Record<string, string>>({});
const isDeletePending = ref(false);
const isSavePending = ref(false);

onMounted(async () => {
    if (route.params.id === 'new') {
        name.value = {};
    } else {
        name.value = await namesService.get(route.params.id as string).exec();
    }

});


async function remove() {
    isDeletePending.value = true;
    try {
        await namesService.remove(name.value.id);
        toast.show({message: 'Успешно удалено', timeout: 3000, type: 'success'});
        navigateTo('/name');
    } catch (e: any) {
        toast.show({message: e.message, timeout: 3000, type: 'error'});
    } finally {
        isDeletePending.value = false;
    }
}

async function submit() {
    const {id, ...data} = name.value;
    errors.value = {};
    isSavePending.value = true;
    try {
        if (id) {
            await namesService.patch(id, data).exec();
        } else {
            await namesService.create(data).exec();
        }
        navigateTo('/names');
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
