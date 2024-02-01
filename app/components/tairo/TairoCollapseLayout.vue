<template>
    <div class="bg-muted-100 dark:bg-muted-900 pb-20">
        <slot name="navigation">
            <TairoCollapseNavigation v-if="collapseEnabled" v-click-outside="closeModal"/>
        </slot>

        <div :class="mainClass">
            <div
                :class="[
                    props.condensed && !props.horizontalScroll && 'w-full',
                    !props.condensed && props.horizontalScroll && 'mx-auto w-full',
                    !props.condensed &&
                        !props.horizontalScroll &&
                        'mx-auto w-full max-w-7xl',
                ]"
            >
                <slot name="toolbar">
                    <TairoCollapseToolbar
                        v-if="toolbarEnabled"
                        :collapse="props.collapse"
                        :horizontal-scroll="props.horizontalScroll"
                    >
                        <template #title>
                            <div>
                                <slot name="toolbar-title"></slot>
                                <BaseBreadcrumb class="breadCrumb" :items="breadcrumb">
                                    <Icon name="ph:arrow-right"></Icon>
                                </BaseBreadcrumb>
                            </div>
                        </template>
                    </TairoCollapseToolbar>
                </slot>
                <slot/>
            </div>
        </div>
    </div>
</template>


<script lang="ts" setup>
import TairoCollapseNavigation from '~/components/tairo/TairoCollapseNavigation.vue';
import TairoCollapseToolbar from '~/components/tairo/TairoCollapseToolbar.vue';


const props = withDefaults(
    defineProps<{
        collapse?: boolean
        toolbar?: boolean
        condensed?: boolean
        horizontalScroll?: boolean
    }>(),
    {
        collapse: true,
        toolbar: true,
    },
);

const app = useAppConfig();
const route = useRoute();
const router = useRouter();
const {isOpen, isMobileOpen} = useCollapse();

const collapseEnabled = computed(() => {
    return (app.tairo.collapse?.navigation?.enabled !== false && props.collapse);
});

const toolbarEnabled = computed(() => {
    return (app.tairo.collapse?.toolbar?.enabled !== false && props.toolbar);
});

const mainClass = computed(() => {
    if (props.condensed) {
        return 'bg-muted-100 dark:bg-muted-900 relative min-h-screen w-full overflow-x-hidden';
    }

    if (!collapseEnabled.value) {
        return 'bg-muted-100 dark:bg-muted-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10';
    }

    const list = [
        'bg-muted-100 dark:bg-muted-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10',
    ];

    if (isOpen.value) {
        list.push('lg:max-w-[calc(100%_-_280px)] lg:ms-[280px]');
    } else {
        list.push('lg:max-w-[calc(100%_-_80px)] lg:ms-[80px]');
    }

    if (props.horizontalScroll) {
        list.push('!pe-0 xl:!pe-0');
    }

    return list;
});

function closeModal(e: any) {
    if (e.target.id === 'openMenu') {
        isMobileOpen.value = true;
        return;
    }
    isMobileOpen.value = false;
}

const breadcrumb = ref<{ label: any; to: string }[]>([]);

watch(() => route.fullPath, breadCrumbs);

onMounted(() => breadCrumbs());

function breadCrumbs() {
    const subRoutes = [];
    let last = [];
    const subPath = route.path.slice(1).split('/');
    for (const r of subPath) {
        if (r === '') {
            continue;
        }
        last.push(r);
        let p = last.join('/');
        subRoutes.push({
            label: router.resolve(`/${p}`).meta.verbose,
            to: `/${p}`,
        });
    }
    breadcrumb.value = [{to: '/', label: router.resolve('/').meta.verbose}, ...subRoutes];
}
</script>

<style lang="css">
    .breadCrumb ul {
        margin: 0 !important;
    }
</style>
