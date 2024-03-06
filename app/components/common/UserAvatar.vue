<template>
    <div>
        <img
            v-if="props.user.avatar"
            :class="avatarClasses"
            :src="props.user.avatar.xsUrl"
            alt="user avatar"
            class="rounded-full aspect-square object-cover"
        >
        <div
            v-else
            :class="avatarClasses"
            class="flex items-center justify-center rounded-full aspect-square text-white"
        >
            {{ avatar.text }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import type {User} from '~/types/user';

interface Props {
    user: User;
    avatarClass?: string;
    firstNameOnly?: boolean;
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
    if (props.firstNameOnly) {
        return {
            text: f.toUpperCase()
        };
    }
    return {
        text: `${f.toUpperCase()}${l.toUpperCase()}`
    };
});
</script>

<style scoped>

</style>
