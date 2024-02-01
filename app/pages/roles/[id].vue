<template>
    <div class="mt-4 px-10">
        <div class="flex flex-col gap-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 items-end">
                <BaseInput v-model="role.name" label="Название*" name="name" placeholder="пр.: Главный технолог" :error="errors.name" type="text"/>
            </div>
            <div class="flex flex-col gap-4">
                <BaseTextarea :error="errors.description" v-model="role.description" label="Описание" name="description" placeholder="пр.: Доступ к тех. процессам, складу, сотрудникам"/>
            </div>
        </div>
        <div class="flex justify-end mt-6">
            <div>
                <BaseButton
                    v-if="role.id"
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
    authRoute: true,
    layout: 'account',
    verbose: 'Роль'
});

useHead({
    title: 'Роль'
});

const route = useRoute();
const toast = useToast('GlobalToast');
const rolesService = useService('roles', {auth: true});

const role = ref<any>({});

const errors = ref<Record<string, string>>({});
const isDeletePending = ref(false);
const isSavePending = ref(false);

onMounted(async () => {
    if (route.params.id === 'new') {
        role.value = {};
    } else {
        role.value = await rolesService.get(route.params.id as string).exec();
    }
    
});


async function remove() {
    isDeletePending.value = true;
    try {
        await rolesService.remove(role.value.id);
        toast.show({message: 'Успешно удалено', timeout: 3000, type: 'success'});
        navigateTo('/role');
    } catch (e: any) {
        toast.show({message: e.message, timeout: 3000, type: 'error'});
    } finally {
        isDeletePending.value = false;
    }
}

async function submit() {
    const {id, ...data} = role.value;
    errors.value = {};
    isSavePending.value = true;
    try {
        if (id) {
            await rolesService.patch(id, data).exec();
        } else {
            await rolesService.create(data).exec();
        }
        navigateTo('/roles');
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