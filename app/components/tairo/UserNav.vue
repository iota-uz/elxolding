<template>
    <div class="group inline-flex items-center justify-center text-right">
        <Menu
            v-slot="{ close }"
            as="div"
            class="relative h-9 w-9 text-left"
        >
            <MenuButton as="template">
                <button
                    class="group-hover:ring-primary-500 dark:ring-offset-muted-900 inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-transparent transition-all duration-300 group-hover:ring-offset-4"
                    type="button"
                >
                    <div
                        class="relative inline-flex h-9 w-9 items-center justify-center rounded-full"
                    >
                        <UserCard
                            :user="props.user"
                            avatar-class="w-9 text-lg"
                            avatar-only
                        />
                    </div>
                </button>
            </MenuButton>

            <Transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
            >
                <MenuItems
                    class="divide-muted-100 border-muted-200 dark:divide-muted-700 dark:border-muted-700 dark:bg-muted-800 absolute end-0 mt-2 w-64 origin-top-right divide-y rounded-md border bg-white shadow-lg focus:outline-none"
                >
                    <div class="p-6 text-center">
                        <div
                            class="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full"
                        >
                            <UserCard
                                :user="props.user"
                                avatar-class="w-20 text-3xl"
                                avatar-only
                            />
                        </div>
                        <div class="mt-3">
                            <h6
                                class="font-heading text-muted-800 text-sm font-medium dark:text-white"
                            >
                                {{ props.user?.username }}
                            </h6>
                            <p class="text-muted-400 mb-4 font-sans text-xs">
                                {{ props.user.email }}
                            </p>
                            <BaseButton
                                class="w-full"
                                shape="curved"
                                to="/profile"
                                @click.passive="close"
                            >
                                Профиль
                            </BaseButton>
                        </div>
                    </div>
                    <div class="p-6">
                        <BaseButton
                            class="w-full"
                            shape="curved"
                            @click.passive="close(); logout();"
                        >
                            Выйти
                        </BaseButton>
                    </div>
                </MenuItems>
            </Transition>
        </Menu>
    </div>
</template>

<script lang="ts" setup>
import {Menu, MenuButton, MenuItems} from '@headlessui/vue';

import UserCard from '~/components/common/UserCard.vue';
import {type User} from '~/types/user';

const props = withDefaults(defineProps<{ user: User }>(), {
    user: {
        username: '',
        email: '',
        avatar: '',
    },
});

function logout() {
    navigateTo('/logout');
}
</script>
