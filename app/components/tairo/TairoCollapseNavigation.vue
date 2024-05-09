<template>
    <div
        :class="[
            !isOpen ? 'w-[80px]' : 'w-[280px]',
            isMobileOpen ? 'translate-x-0 lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
        ]"
        class="dark:bg-muted-800 border-muted-200 dark:border-muted-700 fixed left-0 top-0 z-[60] flex h-full flex-col border-r bg-primary-500 transition-all duration-300"
    >
        <!--Header-->
        <slot name="header" />
        <!--Body-->
        <div
            :class="!isOpen ? 'px-4' : 'px-6'"
            class="slimscroll relative w-full grow overflow-y-auto py-6"
        >
            <!--Menu-->
            <div class="flex items-center gap-3 mb-4">
                <CompanyLogo class="text-white dark:text-muted-400/80 h-14" />
            </div>
            <ul
                id="sidebar-menu"
                class="space-y-2"
            >
                <!--Menu item-->
                <li
                    v-for="(item, index) in menuItems"
                    :key="index"
                    @click="isMobileOpen=false"
                >
                    <TairoCollapseNavigationCollapseLinks
                        v-if="item.children"
                        :expanded="isOpen"
                        :item="item"
                        @clicked="isOpen = true"
                    />
                    <NuxtLink
                        v-else-if="item.to"
                        :class="!isOpen ? 'px-1 justify-center' : 'px-4'"
                        :to="item.to"
                        class="nui-focus text-white dark:text-muted-400/80 hover:bg-muted-100 dark:hover:bg-muted-700/60 hover:text-muted-600 dark:hover:text-muted-200 flex cursor-pointer items-center gap-4 rounded-lg py-3 transition-colors duration-300"
                        exact-active-class="!bg-white-500/10 dark:!bg-white-500/20 !text-white-500 dark:!text-white-500"
                    >
                        <Icon
                            :class="item.icon.class"
                            :name="item.icon.name"
                        />
                        <span
                            :class="!isOpen ? 'hidden' : 'block'"
                            class="whitespace-nowrap font-sans text-sm"
                        >
                            {{ item.name }}
                        </span>
                    </NuxtLink>
                    <div
                        v-else-if="item.divider"
                        class="border-muted-200 dark:border-muted-700 my-3 h-px w-full border-t"
                    />
                    <button
                        v-else
                        :class="!isOpen ? 'px-1 justify-center' : 'px-4'"
                        class="nui-focus text-white dark:text-muted-400/80 hover:bg-muted-100 dark:hover:bg-muted-700/60 hover:text-muted-600 dark:hover:text-muted-200 flex w-full cursor-pointer items-center gap-4 rounded-lg py-3 transition-colors duration-300"
                        @click="item.click"
                    >
                        <Icon
                            :class="item.icon.class"
                            :name="item.icon.name"
                        />
                        <span
                            :class="!isOpen ? 'hidden' : 'block'"
                            class="whitespace-nowrap font-sans text-sm"
                        >
                            {{ item.name }}
                        </span>
                    </button>
                </li>
            </ul>
        </div>
        <!--Footer-->
        <slot name="footer" />
    </div>
</template>

<script lang="ts" setup>
import TairoCollapseNavigationCollapseLinks from '~/components/tairo/TairoCollapseNavigationCollapseLinks.vue';

const {isOpen, isMobileOpen, menuItems} = useCollapse();
</script>
