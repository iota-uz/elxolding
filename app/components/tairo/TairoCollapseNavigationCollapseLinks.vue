<template>
    <div class="group">
        <button
            ref="buttonRef"
            :class="props.expanded ? 'gap-4 px-4' : 'px-2 justify-center'"
            class="nui-focus text-muted-100 dark:text-muted-400/80 hover:bg-muted-100 dark:hover:bg-muted-700/60 hover:text-muted-600 dark:hover:text-muted-200 flex w-full cursor-pointer items-center rounded-lg py-3 transition-colors duration-300"
            @click.stop.prevent="onDropClick"
        >
            <Icon
                :class="[item.icon.class, isActive && 'text-primary-500']"
                :name="item.icon.name"
                class="shrink-0"
            />
            <span
                :class="[
                    isActive && 'text-primary-500',
                    !props.expanded ? 'hidden' : 'block',
                ]"
                class="block whitespace-nowrap font-sans text-sm"
            >
                {{ item.name }}
            </span>
            <span
                :class="!props.expanded ? 'hidden' : 'flex'"
                class="ms-auto items-center justify-center"
            >
                <Icon
                    :class="!isOpen ? 'rotate-180' : ''"
                    class="h-4 w-4 transition-transform duration-200"
                    name="lucide:chevron-up"
                />
            </span>
        </button>

        <ul
            v-if="props.expanded"
            :class="{
                'max-h-0 overflow-hidden opacity-0 group-focus-within:max-h-max group-focus-within:overflow-visible group-focus-within:opacity-100':
                    !isOpen,
                'after:border-muted-200 max-h-max opacity-100': isOpen,
            }"
            class="border-muted-200 relative block ps-4"
        >
            <li
                v-for="child in props.item.children"
                :key="child.to"
                class="border-muted-300 dark:border-muted-700 ms-2 border-s-2 first:mt-2"
            >
                <NuxtLink
                    :to="child.to"
                    class="nui-focus text-muted-300 hover:text-muted-600 dark:text-muted-400/80 dark:hover:text-muted-200 relative -left-0.5 flex cursor-pointer items-center gap-2 border-s-2 border-transparent py-2 ps-4 transition-colors duration-300"
                    exact-active-class="!border-muted-100 !text-muted-100 dark:!text-primary-500"
                >
                    <Icon
                        :class="child.icon.class"
                        :name="child.icon.name"
                        class="shrink-0"
                    />
                    <span
                        :class="[!props.expanded ? 'hidden' : 'block']"
                        class="whitespace-nowrap font-sans text-[0.85rem]"
                    >
                        {{ child.name }}
                    </span>
                </NuxtLink>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    item: any
    expanded?: boolean
}>();

const emit = defineEmits(['clicked']);

const route = useRoute();

const isActive = computed(() => {
    if (!props.item?.activePath) {
        return false;
    }

    return route.path.startsWith(props.item.activePath);
});

const buttonRef = ref<HTMLElement>();
const isOpen = ref(isActive.value);

function onDropClick() {
    isOpen.value = !isOpen.value;
    if (!isOpen.value) {
        buttonRef.value?.blur();
    }
    emit('clicked');
}
</script>
