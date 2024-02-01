<template>
    <div class="mt-4 px-10">
        <div class="flex flex-col gap-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 items-end">
                <BaseInput :error="errors.firstName" type="text" v-model="user.firstName" label="Имя*" name="firstName" placeholder="пр.: Иван"/>
                <BaseInput v-model="user.lastName" label="Фамилия*" name="lastName" placeholder="пр.: Иванов" :error="errors.lastName" type="text"/>
                <BaseInput v-model="user.patronymic" label="Отчество*" name="patronymic" placeholder="пр.: Иваныч" :error="errors.patronymic" type="text"/>
                <BaseInput label="Номер телефона*" name="phone" placeholder="пр.: ivanov@yandex.ru" :error="errors.phone" type="phone" v-model="user.phone"/>
                <BaseInput placeholder="Введите пароль" :error="errors.password" type="password" v-model="user.password" label="Пароль*" name="password"/>
                <BaseSelect :error="errors.role" v-model="user.role" label="Роль*" name="role">
                    <option value="admin">
                        Администратор
                    </option>
                    <option value="manager">
                        Менеджер
                    </option>
                    <option value="editor">
                        Редактор
                    </option>
                    <option value="user">
                        Пользователь
                    </option>
                </BaseSelect>
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
    layout: 'account',
    verbose: 'Новый сотрудник'
});

useHead({
    title: 'Новый сотрудник'
});

const route = useRoute();
const toast = useToast('GlobalToast');
const usersService = useService('users');

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
