<template>
    <div class="container flex justify-center items-center h-screen px-5 md:px-0">
        <div class="flex flex-col justify-center md:flex-row-reverse items-center gap-4 md:gap-24 w-full">
            <div class="w-full hidden md:block md:w-2/3 max-w-lg md:max-w-3xl">
                <LoginIllustration class="w-full" />
            </div>
            <div class="flex flex-col items-center w-full md:w-1/2 max-w-sm">
                <ParisaLogo />
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
                        <BaseInput
                            v-model.trim="loginData.email"
                            :error="errors.email"

                            label="Email"
                            placeholder="example@gmail.com"
                            type="email"
                            icon="ph:envelope-simple"
                        />
                        <PasswordInput
                            v-model="loginData.password"
                            :error="errors.password"
                            label="Пароль"
                            placeholder="Пароль вашего аккаунта"
                        />
                        <BaseButton
                            :loading="isCreatePending"
                            class="btn-primary w-full"
                            type="submit"
                            color="primary"
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
import ParisaLogo from '~/components/illustrations/ParisaLogo.vue';
import {login} from '~/utils/login';

useHead({
    title: 'Войти'
});

const loginData = reactive({email: '', password: ''});
const isCreatePending = ref(false);
const errors = ref({email: '', password: ''});
const toast = useToast('GlobalToast');

async function submit() {
    errors.value = {email: '', password: ''};
    if (!loginData.email) {
        errors.value.email = 'Данное поле обязательное';
    }
    if (!loginData.password) {
        errors.value.password = 'Данное поле обязательное';
    }
    if (errors.value.email || errors.value.password) {
        return;
    }
    isCreatePending.value = true;
    try {
        await login(loginData.email, loginData.password);
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
</script>

<style scoped>
</style>
