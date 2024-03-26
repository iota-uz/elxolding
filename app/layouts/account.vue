<template>
    <TairoCollapseLayout>
        <slot />
        <Toast id="GlobalToast" />
        <template #toolbar-title>
            Система складского учета
        </template>
    </TairoCollapseLayout>
</template>

<script lang="ts" setup>
import Toast from '~/components/common/Toast.vue';
import TairoCollapseLayout from '~/components/tairo/TairoCollapseLayout.vue';
</script>
