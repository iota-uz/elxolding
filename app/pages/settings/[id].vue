<template>
    <div class="mt-4 px-10">
        <div class="flex flex-col gap-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 items-end">
                <BaseInput placeholder="Риски закладываемые в партию по умолчанию" :error="errors.risks" type="number" v-model="setting.risks" label="Риски (%)" name="risks"/>
                <BaseInput v-model="setting.profit" label="Прибыль (%)" name="profit" placeholder="Прибыль закладываемая в партию по умолчанию" :error="errors.profit" type="number"/>
                <BaseInput v-model="setting.ndfl" label="НДФЛ (%)" name="ndfl" placeholder="Налог на доходы физических лиц" :error="errors.ndfl" type="number"/>
                <BaseInput name="esn" placeholder="Единый социальный налог" :error="errors.esn" type="number" v-model="setting.esn" label="ЕСН (%)"/>
            </div>
        </div>
        <div class="flex justify-end mt-6">
            <div>
                <BaseButton
                    v-if="setting.id"
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
    verbose: ''
});

useHead({
    title: ''
});

const route = useRoute();
const toast = useToast('GlobalToast');
const settingsService = useService('settings', {auth: true});

const setting = ref<any>({});

const errors = ref<Record<string, string>>({});
const isDeletePending = ref(false);
const isSavePending = ref(false);

onMounted(async () => {
    if (route.params.id === 'new') {
        setting.value = {};
    } else {
        setting.value = await settingsService.get(route.params.id as string).exec();
    }
    
});


async function remove() {
    isDeletePending.value = true;
    try {
        await settingsService.remove(setting.value.id);
        toast.show({message: 'Успешно удалено', timeout: 3000, type: 'success'});
        navigateTo('/setting');
    } catch (e: any) {
        toast.show({message: e.message, timeout: 3000, type: 'error'});
    } finally {
        isDeletePending.value = false;
    }
}

async function submit() {
    const {id, ...data} = setting.value;
    errors.value = {};
    isSavePending.value = true;
    try {
        if (id) {
            await settingsService.patch(id, data).exec();
        } else {
            await settingsService.create(data).exec();
        }
        navigateTo('/settings');
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