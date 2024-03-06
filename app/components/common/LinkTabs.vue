<template>
    <div class="nui-tabs">
        <ul
            class="nui-tabs-inner"
        >
            <NuxtLink
                v-for="tab in props.tabs"
                :key="JSON.stringify(tab)"
                :class="{
                    'nui-has-icon': !!tab.icon
                }"
                :to="tab.path"
                class="nui-tab-item nui-has-icon"
                exact-active-class="nui-active"
            >
                <Icon
                    v-if="tab.icon"
                    :name="tab.icon"
                    class="icon me-1 block h-5 w-5"
                />
                <span>{{ tab.label }}</span>
            </NuxtLink>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import type {RouteLocationRaw} from 'vue-router';

interface Tab {
    icon?: string;
    label: string;
    path: RouteLocationRaw;
}

interface Props {
    tabs: Tab[];
}

const props = defineProps<Props>();
</script>

<style scoped>

</style>
