<template>
    <div>
        <div>
            <div class="flex items-center gap-4">
                <UserAvatar
                    :user="user"
                    avatar-class="w-16 text-2xl"
                />
                <div>
                    <p class="text-xl">
                        Добро пожаловать, {{ user.firstName }}
                    </p>
                    <div class="text-muted-600">
                        Ваш персональный дэшборд
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <Stats />
                <BaseCard class="mt-6 p-6">
                    <BaseHeading size="xl">
                        Заявки
                    </BaseHeading>
                    <BaseTable
                        :columns="columns"
                        :data="data"
                        :sort-by="{}"
                        class="flex-auto mt-6"
                    >
                        <template #buttons="{item}">
                            <TairoTableCell class="px-6 py-4 flex justify-end">
                                <NuxtLink
                                    :to="{name: 'orders-id', params: {id: item.id}}"
                                    class="border border-gray-300 dark:border-muted-600 rounded-md p-2"
                                >
                                    <Icon
                                        class="w-5 h-5"
                                        name="ph:eye"
                                    />
                                </NuxtLink>
                            </TairoTableCell>
                        </template>
                    </BaseTable>
                </BaseCard>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import BaseTable from '~/components/common/BaseTable.vue';
import type {Column} from '~/components/common/types';
import UserAvatar from '~/components/common/UserAvatar.vue';
import Stats from '~/components/dashboard/Stats.vue';
import TairoTableCell from '~/components/tairo/TairoTableCell.vue';
import type {User} from '~/types/user';

definePageMeta({
    layout: 'account',
    verbose: 'Панель управления',
    authRoute: true
});

useHead({
    title: 'Пользователь'
});

const user = useState<User>('user');
const toast = useToast('GlobalToast');
const ordersService = useService('orders', {auth: true});
const columns = ref<Column[]>([
    {
        label: 'Тип заявки',
        name: 'type',
        enums: {
            'in': 'Приход',
            'out': 'Расход'
        },
        sortable: true
    },
    {
        label: 'Дата создания',
        name: 'createdAt',
        sortable: true,
        dateFormat: 'calendar'
    },
]);
const data = ref<any[]>([]);

onMounted(async () => {
    try {
        data.value = await ordersService.find({
            $sort: {
                createdAt: -1,
            },
            $limit: 3,
        }).list().exec();
    } catch (e: any) {
        toast.show({
            message: e.message,
            type: 'error',
            timeout: 5000
        });
    }
});
</script>

<style scoped>

</style>
