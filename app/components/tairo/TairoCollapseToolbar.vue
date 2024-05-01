<template>
    <div
        :class="props.horizontalScroll && 'pe-4 xl:pe-10'"
        class="relative z-50 mb-5 flex h-20 items-center gap-2"
    >
        <TairoCollapseBurger
            v-if="showNavBurger"
            id="openMenu"
            class="-ms-3"
        />

        <BaseHeading
            v-if="app.tairo.collapse?.toolbar?.showTitle"
            as="h1"
            class="text-muted-800 hidden dark:text-white md:block"
            size="2xl"
            weight="light"
        >
            <slot name="title">
                {{ route.meta.title }}
            </slot>
        </BaseHeading>
        <div class="ms-auto" />
        <BaseThemeToggle />
        <UserNav :user="user" />
    </div>
</template>

<script lang="ts" setup>
import TairoCollapseBurger from '~/components/tairo/TairoCollapseBurger.vue';
import UserNav from '~/components/tairo/UserNav.vue';

const props = withDefaults(defineProps<{ collapse?: boolean, horizontalScroll?: boolean }>(), {collapse: true});

const app = useAppConfig();
const route = useRoute();
const user = await useUser();

const showNavBurger = computed(() => props.collapse && app.tairo.collapse?.toolbar?.showNavBurger);
</script>
