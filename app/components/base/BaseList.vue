<template>
    <template v-if="ordered">
        <ol
            :class="{
                'nui-list-media': hasMedia,
                'nui-list-base': !hasMedia,
            }"
            class="nui-list nui-list-base nui-list-ol"
        >
            <slot />
        </ol>
    </template>
    <template v-else>
        <ul
            :class="{
                'nui-list-media': hasMedia,
                'nui-list-base': !hasMedia,
            }"
            class="nui-list nui-list-base nui-list-ul"
        >
            <slot />
        </ul>
    </template>
</template>

<script lang="ts" setup>
const props = defineProps<{
    /**
     * If the list should be ordered.
     */
    ordered?: boolean;
    /**
     * Force the list to be media.
     */
    media?: boolean;
}>();

const slots = defineSlots();

const hasMedia =
    props.media ??
    slots.default?.().some((vnode: any) => {
        return typeof vnode.type !== 'string';
    });
</script>
