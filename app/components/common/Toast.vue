<template>
    <transition name="toast">
        <div
            v-if="show"
            class="toast z-[99999]"
            role="alert"
        >
            <div
                v-if="type === 'success'"
                class="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-green-500 dark:text-green-100 bg-green-100 dark:bg-green-600 rounded-lg"
            >
                <Icon name="ph:check" class="w-5 h-5" />
                <span class="sr-only">Check icon</span>
            </div>
            <div
                v-else
                class="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-red-500 dark:text-red-100 bg-red-100 dark:bg-red-600 rounded-lg"
            >
                <Icon name="ph:x" class="w-5 h-5" />
                <span class="sr-only">Cross icon</span>
            </div>
            <div class="ml-3 text-sm font-normal">
                {{ message }}
            </div>
            <button
                v-if="closable"
                class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-600 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
                type="button"
            >
                <span class="sr-only">Close</span>
                <Icon name="ph:x" class="w-5 h-5" />
            </button>
        </div>
    </transition>
</template>

<script lang="ts" setup>
import {type ToastOptions} from '~/composables/useToast';
import {bus} from '~/constants';

const props = defineProps<{id: string}>();

const show = ref(false);
const message = ref('');
const type = ref('success');
const closable = ref(false);

bus.on('toast.open', ({id, message: msg, timeout, type: t, closable: c}: ToastOptions & { id: string }) => {
    if (id !== props.id) {
        return;
    }
    show.value = true;
    message.value = msg;
    type.value = t || 'success';
    closable.value = c || false;
    if (timeout) {
        setTimeout(() => {
            show.value = false;
        }, timeout);
    }
});

bus.on('toast.close', ({id}: { id: string }) => {
    if (id === props.id) {
        show.value = false;
    }
});

</script>

<style lang="scss" scoped>

.toast {
    @apply flex fixed top-5 right-5 items-center p-4 mb-4 w-full max-w-xs text-gray-700 dark:text-gray-200 bg-white dark:bg-muted-800 rounded-lg shadow;
}

.toast-enter-from {
    transform: translateX(200px);
}

.toast-enter-to {
    transform: translateX(0);
}

.toast-enter-active {
    transition: all 0.4s ease;
}

</style>
