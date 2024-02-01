<template>
    <div class="container">
        Bye bye
    </div>
</template>

<script lang="ts" setup>
const router = useRouter();
if (!process.server) {
    localStorage.removeItem('token');
    router.push({path: '/'});
}
</script>

<style scoped>

</style>