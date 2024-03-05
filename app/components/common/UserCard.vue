<template>
    <div class="flex items-center gap-4">
        <div
            :class="avatarClasses"
            class="flex items-center justify-center rounded-full aspect-square text-white"
        >
            {{ avatar.text }}
        </div>
        <div v-if="!props.avatarOnly">
            {{ props.username }} {{ props.email }}
            <slot name="subtitle" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type {User} from '~/types/user';

interface Props {
    user: User;
    avatarOnly?: boolean;
    avatarClass?: string;
}

const props = withDefaults(defineProps<Props>(), {avatarClass: 'w-14 text-2xl'});

const colors = ref([
    'bg-blue-600',
    'bg-green-600',
    'bg-yellow-600',
    'bg-red-600',
    'bg-indigo-600',
    'bg-purple-600',
    'bg-pink-600',
]);

function uniqueColor(): string {
    const str = `${props.user.firstName}${props.user.lastName}`;
    const sum = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return <string>colors.value.at(sum % colors.value.length);
}

const avatarClasses = computed(() => {
    return [
        'flex',
        'items-center',
        'justify-center',
        'rounded-full',
        'aspect-square',
        'text-white',
        props.avatarClass,
        uniqueColor()
    ];
});

const avatar = computed(() => {
    const f: string = props.user.firstName.slice(0, 1);
    const l: string = props.user.lastName.slice(0, 1);
    return {
        text: `${f.toUpperCase()}${l.toUpperCase()}`
    };
});</script>

<style scoped>

</style>
