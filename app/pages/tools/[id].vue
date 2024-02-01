<template>
    <div class="mt-4 px-10">
        <div class="flex flex-col gap-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 items-end">
                <BaseInput v-model="tool.name" label="Название*" name="name" placeholder="пр.: Сверло Ф10" :error="errors.name" type="text"/>
                <BaseInput name="barcode" placeholder="пр.: 123456" :error="errors.barcode" type="text" v-model="tool.barcode" label="Артикул*"/>
                <BaseInput name="baseLife" placeholder="пр.: 24 000" :error="errors.baseLife" type="number" v-model="tool.baseLife" label="Базовая стойкость (м)*"/>
                <BaseSelect label="Тип*" name="type" :error="errors.type" v-model="tool.type">
                    <option value="drill">
                        Сверло
                    </option>
                    <option value="mill">
                        Фреза
                    </option>
                    <option value="body">
                        Корпус
                    </option>
                    <option value="plate">
                        Пластина
                    </option>
                    <option value="welding">
                        Сварочный инструмент
                    </option>
                    <option value="measuring">
                        Измерительный инструмент
                    </option>
                    <option value="other">
                        Прочее
                    </option>
                </BaseSelect>
            </div>
        </div>
        <div class="flex justify-end mt-6">
            <div>
                <BaseButton
                    v-if="tool.id"
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


definePageMeta({
    authRoute: true,
    layout: 'account',
    verbose: 'Инструмент'
});

useHead({
    title: 'Инструмент'
});

const route = useRoute();
const toast = useToast('GlobalToast');
const toolsService = useService('tools', {auth: true});

const tool = ref<any>({});

const errors = ref<Record<string, string>>({});
const isDeletePending = ref(false);
const isSavePending = ref(false);

onMounted(async () => {
    if (route.params.id === 'new') {
        tool.value = {};
    } else {
        tool.value = await toolsService.get(route.params.id as string).exec();
    }
    
});


async function remove() {
    isDeletePending.value = true;
    try {
        await toolsService.remove(tool.value.id);
        toast.show({message: 'Успешно удалено', timeout: 3000, type: 'success'});
        navigateTo('/tool');
    } catch (e: any) {
        toast.show({message: e.message, timeout: 3000, type: 'error'});
    } finally {
        isDeletePending.value = false;
    }
}

async function submit() {
    const {id, ...data} = tool.value;
    errors.value = {};
    isSavePending.value = true;
    try {
        if (id) {
            await toolsService.patch(id, data).exec();
        } else {
            await toolsService.create(data).exec();
        }
        navigateTo('/tools');
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