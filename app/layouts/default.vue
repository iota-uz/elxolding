<template>
    <div>
        <slot/>
        <Toast id="GlobalToast"></Toast>
    </div>
</template>

<script lang="ts" setup>
import Toast from '~/components/common/Toast.vue';
</script>
