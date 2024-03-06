<template>
    <div class="mt-4 px-10">
        <div class="flex flex-col gap-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 items-end">
                <BaseSelect
                    v-model="request.type"
                    :error="errors.type"
                    label="Тип заявки*"
                    name="type"
                >
                    <option value="incoming">
                        Приход
                    </option>
                    <option value="outgoing">
                        Отгрузка
                    </option>
                </BaseSelect>
            </div>
        </div>
        <div class="flex justify-end mt-6">
            <div>
                <BaseButton
                    v-if="request.id"
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
    verbose: 'Новая накладная'
});

useHead({
    title: 'Новая накладная'
});

const route = useRoute();
const toast = useToast('GlobalToast');
const usersService = useService('users');

const request = ref<any>({});

const errors = ref<Record<string, string>>({});
const isDeletePending = ref(false);
const isSavePending = ref(false);

onMounted(async () => {
    if (route.params.id === 'new') {
        request.value = {};
    } else {
        request.value = await usersService.get(route.params.id as string).exec();
    }

});


async function remove() {
    isDeletePending.value = true;
    try {
        await usersService.remove(request.value.id);
        toast.show({message: 'Успешно удалено', timeout: 3000, type: 'success'});
        navigateTo('/user');
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
            await usersService.patch(id, data).exec();
        } else {
            await usersService.create(data).exec();
        }
        navigateTo('/users');
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
