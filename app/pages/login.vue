<template>
    <div class="container flex justify-center items-center h-screen px-5 md:px-0">
        <div class="flex flex-col justify-center md:flex-row-reverse items-center gap-4 md:gap-24 w-full">
            <div class="w-full hidden md:block md:w-2/3 max-w-lg md:max-w-3xl">
                <LoginIllustration class="w-full" />
            </div>
            <div class="flex flex-col items-center w-full md:w-1/2 max-w-sm">
                <div class="text-center w-full">
                    <h1 class="text-3xl">
                        Вход
                    </h1>
                    <h2 class="text-sm text-gray-400 mb-8">
                        Доступ в систему управления
                    </h2>
                    <form
                        class="flex flex-col text-left gap-3"
                        @submit.prevent="submit"
                    >
                        <BaseSelect
                            v-model="loginData.id"
                            icon="ph:user"
                            label="Сотрудник"
                            placeholder="Сотрудник"
                        >
                            <option
                                v-for="user in users"
                                :value="user.id"
                            >
                                {{ user.firstName }}
                                {{ user.lastName }}
                            </option>
                        </BaseSelect>
                        <PasswordInput
                            v-model="loginData.password"
                            :error="errors.password"
                            label="Пароль"
                            placeholder="Пароль вашего аккаунта"
                        />
                        <BaseButton
                            :loading="isCreatePending"
                            class="btn-primary w-full"
                            color="primary"
                            type="submit"
                        >
                            Войти
                        </BaseButton>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import PasswordInput from '~/components/common/PasswordInput.vue';
import LoginIllustration from '~/components/illustrations/LoginIllustration.vue';
import type {User} from '~/types/user';
import {login} from '~/utils/login';

useHead({
    title: 'Войти'
});

const loginData = reactive({id: 0, password: ''});
const isCreatePending = ref(false);
const errors = ref({id: '', password: ''});
const toast = useToast('GlobalToast');
const users = ref<User[]>([]);

onMounted(async () => {
    users.value = await fetchUsers();
});

async function submit() {
    errors.value = {id: '', password: ''};
    if (!loginData.id) {
        errors.value.id = 'Данное поле обязательное';
    }
    if (!loginData.password) {
        errors.value.password = 'Данное поле обязательное';
    }
    if (errors.value.id || errors.value.password) {
        return;
    }
    isCreatePending.value = true;
    try {
        await login(loginData.id, loginData.password);
        navigateTo({path: '/'});
    } catch (e: any) {
        if (e.code === 401 || e.code === 403) {
            toast.show({type: 'error', message: 'Неверный логин/пароль', timeout: 3000});
        } else {
            toast.show({type: 'error', message: e.message, timeout: 3000});
        }
    } finally {
        isCreatePending.value = false;
    }
}

async function fetchUsers() {
    return useService('users').find().list().exec();
}
</script>

<style scoped>
</style>
