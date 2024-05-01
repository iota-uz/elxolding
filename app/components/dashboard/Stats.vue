<template>
    <BaseCard class="mt-6 p-6">
        <BaseHeading size="xl">
            Статистика
        </BaseHeading>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <NuxtLink
                :to="{name: 'positions'}"
                class="bg-muted-100/80 dark:bg-muted-700 flex items-center gap-2 rounded-md px-5 py-10 hover:bg-muted-200/80 dark:hover:bg-muted-600 transition-colors duration-200 ease-in-out"
            >
                <div>
                    <BaseIconBox
                        color="primary"
                        rounded="full"
                        size="md"
                        variant="pastel"
                    >
                        <Icon
                            class="size-5"
                            name="ph:notepad-fill"
                        />
                    </BaseIconBox>
                </div>
                <div>
                    <BaseHeading size="lg">
                        {{ data.positions }}
                    </BaseHeading>
                    <p class="text-muted-500 dark:text-muted-400">
                        Всего наименований
                    </p>
                </div>
            </NuxtLink>
            <NuxtLink
                :to="{name: 'products'}"
                class="bg-muted-100/80 dark:bg-muted-700 flex items-center gap-2 rounded-md px-5 py-10 hover:bg-muted-200/80 dark:hover:bg-muted-600 transition-colors duration-200 ease-in-out"
            >
                <div>
                    <BaseIconBox
                        color="success"
                        rounded="full"
                        size="md"
                        variant="pastel"
                    >
                        <Icon
                            class="size-5"
                            name="ph:package-fill"
                        />
                    </BaseIconBox>
                </div>
                <div>
                    <BaseHeading size="lg">
                        {{ data.products }}
                    </BaseHeading>
                    <p class="text-muted-500 dark:text-muted-400">
                        Всего товаров
                    </p>
                </div>
            </NuxtLink>
            <NuxtLink
                class="bg-muted-100/80 dark:bg-muted-700 flex items-center gap-2 rounded-md px-5 py-10 hover:bg-muted-200/80 dark:hover:bg-muted-600 transition-colors duration-200 ease-in-out"
            >
                <div>
                    <BaseIconBox
                        color="warning"
                        rounded="full"
                        size="md"
                        variant="pastel"
                    >
                        <Icon
                            class="size-5"
                            name="ph:dots-six"
                        />
                    </BaseIconBox>
                </div>
                <div>
                    <BaseHeading size="lg">
                        {{ data.depth.toFixed(2) }}
                    </BaseHeading>
                    <p class="text-muted-500 dark:text-muted-400">
                        Глубина склада
                    </p>
                </div>
            </NuxtLink>
            <NuxtLink
                :to="{name: 'orders'}"
                class="bg-muted-100/80 dark:bg-muted-700 flex items-center gap-2 rounded-md px-5 py-10 hover:bg-muted-200/80 dark:hover:bg-muted-600 transition-colors duration-200 ease-in-out"
            >
                <div>
                    <BaseIconBox
                        color="info"
                        rounded="full"
                        size="md"
                        variant="pastel"
                    >
                        <Icon
                            class="size-5"
                            name="ph:archive-tray-fill"
                        />
                    </BaseIconBox>
                </div>
                <div>
                    <BaseHeading size="lg">
                        {{ data.orders }}
                    </BaseHeading>
                    <p class="text-muted-500 dark:text-muted-400">
                        Заявки
                    </p>
                </div>
            </NuxtLink>
        </div>
    </BaseCard>
</template>

<script lang="ts" setup>
const toast = useToast('GlobalToast');
const rpcService = useService('rpc', {auth: true});
const data = ref<{
    products: number;
    positions: number;
    depth: number;
    orders: number;
}>({
    products: 0,
    positions: 0,
    depth: 0,
    orders: 0
});

onMounted(async () => {
    const {result, error} = await rpcService.create({
        method: 'DashboardStats',
        params: {}
    }).exec();
    if (error) {
        toast.show({
            message: error.message,
            type: 'error',
            timeout: 5000
        });
        return;
    }
    data.value = result;
});
</script>

<style scoped>

</style>
