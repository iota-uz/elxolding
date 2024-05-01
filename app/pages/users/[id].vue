<template>
    <div class="mt-4 px-10">
        <div class="flex flex-col gap-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 items-end">
                <BaseInput
                    v-model="user.firstName"
                    :error="errors.firstName"
                    type="text"
                    label="Имя*"
                    name="firstName"
                    placeholder="пр.: Иван"
                />
                <BaseInput
                    v-model="user.lastName"
                    label="Фамилия"
                    name="lastName"
                    placeholder="пр.: Иванов"
                    :error="errors.lastName"
                    type="text"
                />
                <BaseInput
                    v-model="user.middleName"
                    label="Отчество"
                    name="middleName"
                    placeholder="пр.: Иванович"
                    :error="errors.email"
                    type="email"
                />
                <BaseSelect
                    v-model="user.role"
                    :error="errors.role"
                    label="Роль*"
                    name="role"
                >
                    <option value="superuser">
                        Руководитель
                    </option>
                    <option value="user">
                        Администратор
                    </option>
                    <option value="polygraphy">
                        Сотрудник полиграфии
                    </option>
                    <option value="tci">
                        Сотрудник ОТК
                    </option>
                    <option value="warehouse_manager">
                        Сотрудник склада
                    </option>
                </BaseSelect>
                <BaseInput
                    v-model="user.password"
                    placeholder="Введите пароль"
                    :error="errors.password"
                    type="password"
                    label="Пароль*"
                    name="password"
                />
            </div>
        </div>
        <div class="flex justify-end mt-6">
            <div>
                <BaseButton
                    v-if="user.id"
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
    verbose: 'Пользователь'
});

useHead({
    title: 'Пользователь'
});

const route = useRoute();
const toast = useToast('GlobalToast');
const usersService = useService('users', {auth: true});

const user = ref<any>({});

const errors = ref<Record<string, string>>({});
const isDeletePending = ref(false);
const isSavePending = ref(false);

onMounted(async () => {
    if (route.params.id === 'new') {
        user.value = {};
    } else {
        user.value = await usersService.get(route.params.id as string).exec();
    }

});


async function remove() {
    isDeletePending.value = true;
    try {
        await usersService.remove(user.value.id);
        toast.show({message: 'Успешно удалено', timeout: 3000, type: 'success'});
        navigateTo('/user');
    } catch (e: any) {
        toast.show({message: e.message, timeout: 3000, type: 'error'});
    } finally {
        isDeletePending.value = false;
    }
}

async function submit() {
    const {id, ...data} = user.value;
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
