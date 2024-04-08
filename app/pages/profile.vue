<template>
    <div>
        <div class="flex items-center gap-4">
            <UserAvatar
                :user="user"
                avatar-class="w-16 text-2xl"
            />
            <div>
                <p class="text-xl">
                    {{ user.firstName }} {{ user.lastName }}
                </p>
                <div class="text-muted-600">
                    {{ user.role }}
                </div>
            </div>
        </div>
        <form class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 items-end">
            <BaseInput
                v-model="user.firstName"
                :error="errors.firstName"
                label="Имя*"
                name="firstName"
                placeholder="пр.: Иван"
                type="text"
            />
            <BaseInput
                v-model="user.lastName"
                :error="errors.lastName"
                label="Фамилия*"
                name="lastName"
                placeholder="пр.: Иванов"
                type="text"
            />
            <BaseInput
                v-model="user.middleName"
                :error="errors.middleName"
                label="Отчество"
                name="middleName"
                placeholder="пр.: Иванович"
                type="text"
            />
            <BaseInput
                v-model="user.password"
                placeholder="Введите пароль"
                :error="errors.password"
                type="password"
                label="Пароль*"
                name="password"
            />
        </form>
        <div class="flex justify-end">
            <BaseButton
                type="submit"
                color="primary"
            >
                Сохранить
            </BaseButton>
        </div>
    </div>
</template>

<script lang="ts" setup>
import UserAvatar from '~/components/common/UserAvatar.vue';
import type {User} from '~/types/user';

definePageMeta({
    authRoute: true,
    layout: 'account',
    verbose: 'Профиль'
});

useHead({
    title: 'Профиль'
});

const user = useState<User>('user');
const errors = ref({
    firstName: '',
    lastName: '',
    middleName: '',
    password: ''
});
</script>

<style scoped>

</style>
