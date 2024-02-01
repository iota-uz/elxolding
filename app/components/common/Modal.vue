<template>
    <TransitionRoot
        :show="open"
        appear
        as="template"
    >
        <div class="fixed inset-0 z-[9999] flex items-center justify-center">
            <Dialog
                as="div"
                class="relative z-[9999]"
                @close="closeModal"
            >
                <TransitionChild
                    as="template"
                    enter="duration-300 ease-out"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="duration-200 ease-in"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                >
                    <div class="bg-muted-800/70 dark:bg-muted-900/80 fixed inset-0" />
                </TransitionChild>

                <div class="fixed inset-0">
                    <div
                        :class="props.classes.wrapper"
                        class="flex min-h-full items-center justify-center p-4 text-center"
                    >
                        <TransitionChild
                            as="template"
                            enter="duration-300 ease-out"
                            enter-from="opacity-0 scale-95"
                            enter-to="opacity-100 scale-100"
                            leave="duration-200 ease-in"
                            leave-from="opacity-100 scale-100"
                            leave-to="opacity-0 scale-95"
                        >
                            <DialogPanel
                                :class="dialogClasses"
                                class="dark:bg-muted-800 w-full bg-white text-left align-middle shadow-xl transition-all"
                            >
                                <div class="px-5 py-2 border-b border-gray-200 dark:border-gray-700">
                                    <div class="flex justify-end">
                                        <base-button-close @click="closeModal" />
                                    </div>
                                    <slot name="header" />
                                </div>
                                <div class="p-5">
                                    <slot />
                                </div>
                                <div
                                    v-if="'footer' in $slots"
                                    :class="[
                                        props.footerAlign === 'center' && 'justify-center',
                                        props.footerAlign === 'end' && 'justify-end',
                                        props.footerAlign === 'between' && 'justify-between',
                                    ]"
                                    class="flex w-full items-center gap-x-2 mt-5 border-t border-gray-200 dark:border-gray-700 py-4 px-5"
                                >
                                    <slot name="footer" />
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </div>
    </TransitionRoot>
</template>

<script lang="ts">
export default {
    inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue';

import {bus} from '~/constants';

const props = withDefaults(
    defineProps<{
        id: string,
        /**
         * The size of the modal.
         */
        size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

        /**
         * The shape of the modal.
         */
        shape?: 'straight' | 'rounded' | 'curved'

        /**
         * The alignment of the footer content.
         */
        footerAlign?: 'start' | 'end' | 'center' | 'between'

        classes?: {
            wrapper?: string | string[]
            dialog?: string | string[]
        }
    }>(),
    {
        size: 'md',
        shape: 'rounded',
        footerAlign: 'end',
        classes: () => ({
            wrapper: '',
            dialog: '',
        }),
    },
);

const emit = defineEmits(['shown', 'hidden']);
const open = ref(false);

function closeModal() {
    emit('hidden');
    open.value = false;
}

bus.on('modals.open', ({id, data}: any) => {
    if (id === props.id) {
        open.value = true;
        emit('shown', data);
    }
});

bus.on('modals.close', ({id}) => {
    if (id === props.id) {
        closeModal();
    }
});

const dialogClasses = computed(() => {
    const classes = [];

    if (props.classes.dialog) {
        if (Array.isArray(props.classes.dialog)) {
            classes.push(...props.classes.dialog);
        } else {
            classes.push(props.classes.dialog);
        }
    }

    switch (props.shape) {
        case 'rounded':
            classes.push('rounded-lg');
            break;
        case 'curved':
            classes.push('rounded-xl');
            break;
    }

    switch (props.size) {
        case 'sm':
            classes.push('max-w-sm');
            break;
        case 'md':
            classes.push('max-w-md');
            break;
        case 'lg':
            classes.push('max-w-xl');
            break;
        case 'xl':
            classes.push('max-w-2xl');
            break;
        case '2xl':
            classes.push('max-w-3xl');
            break;
        case '3xl':
            classes.push('max-w-5xl');
            break;
    }

    return classes;
});
</script>

