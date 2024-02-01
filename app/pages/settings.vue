<template>
    <div>
        <h1 class="text-2xl">
            Настройки
        </h1>
        <form
            v-if="setting"
            class="flex flex-col gap-4 mt-4"
            @submit.prevent="saveSettings"
        >
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 items-end">
                <BaseInput label="Риски (%)" name="risks" placeholder="Риски закладываемые в партию по умолчанию" :error="errors.risks" type="number" v-model="setting.risks"/>
                <BaseInput placeholder="Прибыль закладываемая в партию по умолчанию" :error="errors.profit" type="number" v-model="setting.profit" label="Прибыль (%)" name="profit"/>
                <BaseInput :error="errors.ndfl" type="number" v-model="setting.ndfl" label="НДФЛ (%)" name="ndfl" placeholder="Налог на доходы физических лиц"/>
                <BaseInput v-model="setting.esn" label="ЕСН (%)" name="esn" placeholder="Единый социальный налог" :error="errors.esn" type="number"/>
            </div>
            <div class="flex">
                <div class="flex-auto" />
                <div class="flex-initial">
                    <BaseButton
                        class="w-full mt-4"
                        color="primary"
                        type="submit"
                        :loading="isSavePending"
                    >
                        <span>Сохранить</span>
                    </BaseButton>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">


definePageMeta({
    authRoute: true,
    layout: 'account',
    verbose: ''
});

useHead({
    title: ''
});

const toast = useToast('GlobalToast');
const settingsService = useService('settings', {auth: true});

const setting = ref<any>({});
const isSavePending = ref(false);
const errors = ref<Record<string, string>>({});

onMounted(async () => {
    setting.value = await settingsService.find().exec();
});

async function saveSettings() {
    isSavePending.value = true;
    try {
        setting.value = await settingsService.create(setting.value).exec();
        toast.show({
            message: 'Успешно сохранено',
            type: 'success',
            timeout: 2000,
        });
    } catch (e: any) {
        if (e.code === 400 || e.code === 422) {
            for (let err of e.errors) {
                errors.value[err.path] = useText(`errors.${err.type || err.kind}`);
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
