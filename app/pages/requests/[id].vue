<template>
    <div class="mt-4 px-10">
        <div class="flex flex-col gap-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 items-end">
                <BaseInput type="text" v-model="request.path" label="Путь*" name="path" placeholder="Введите путь" :error="errors.path"/>
                <BaseSelect label="Метод*" name="method" :error="errors.method" v-model="request.method">
                    <option value="get">
                        GET /id
                    </option>
                    <option value="find">
                        GET /
                    </option>
                    <option value="create">
                        POST
                    </option>
                    <option value="patch">
                        PATCH
                    </option>
                    <option value="update">
                        PUT
                    </option>
                    <option value="remove">
                        DELETE
                    </option>
                </BaseSelect>
                <MultiSelect v-model="request.userId" label="Пользователь" placeholder="Выберите пользователя" name="userId" :options="users" :error="errors.userId"/>
                <BaseInput type="text" v-model="request.userAgent" label="User Agent" name="userAgent" placeholder="Введите user agent" :error="errors.userAgent"/>
                <BaseInput label="IP" name="ip" placeholder="Введите IP" :error="errors.ip" type="text" v-model="request.ip"/>
            </div>
        </div>
        <div class="flex justify-end mt-6">
            <div>
                <BaseButton
                    v-if="request.id"
                    color="danger"
                    :loading="isDeletePending"
                    @click="remove"
                >
                    Удалить
                </BaseButton>
                <BaseButton
                    class="ml-2"
                    color="primary"
                    :loading="isSavePending"
                    @click="submit"
                >
                    Сохранить
                </BaseButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import MultiSelect from '~/components/common/MultiSelect.vue';

definePageMeta({
    authRoute: true,
    layout: 'account',
    verbose: 'Запрос'
});

useHead({
    title: 'Запрос'
});

const route = useRoute();
const toast = useToast('GlobalToast');
const requestsService = useService('requests', {auth: true});

const request = ref<any>({});

const errors = ref<Record<string, string>>({});
const isDeletePending = ref(false);
const isSavePending = ref(false);

onMounted(async () => {
    if (route.params.id === 'new') {
        request.value = {};
    } else {
        request.value = await requestsService.get(route.params.id as string).exec();
    }
    
});


async function remove() {
    isDeletePending.value = true;
    try {
        await requestsService.remove(request.value.id);
        toast.show({message: 'Успешно удалено', timeout: 3000, type: 'success'});
        navigateTo('/request');
    } catch (e: any) {
        toast.show({message: e.message, timeout: 3000, type: 'error'});
    } finally {
        isDeletePending.value = false;
    }
}

async function submit() {
    const {id, ...data} = request.value;
    errors.value = {};
    isSavePending.value = true;
    try {
        if (id) {
            await requestsService.patch(id, data).exec();
        } else {
            await requestsService.create(data).exec();
        }
        navigateTo('/requests');
    } catch (e: any) {
        if (e.code === 400 || e.code === 422) {
            for (const err of e.errors) {
                errors.value[err.path] = useText(`errors.${err.type}`);
            }
        } else {
            toast.show({message: e.message, timeout: 3000, type: 'error'});
        }
    } finally {
        isSavePending.value = false;
    }
}
</script>

<style scoped>

</style>