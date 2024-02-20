<script setup>
import { onMounted } from 'vue';

    const props = defineProps({
        valueText: String,
        placeholder: String,
        apiModel: Object,
        apiSearchMethod: Object,
        apiParams: Object,
    })

    const items = ref([])
    const _timerId = ref(null)
    const isLoadingItems = ref(false)
    const searchItems = (e) => {
        clearTimeout(_timerId.value)
        _timerId.value = setTimeout(() => {
            isLoadingItems.value = true
            const search = (!e?.target?.value && (e && typeof e == 'string')) ? e : e.target?.value;
            props.apiModel[props.apiSearchMethod]({
                search,
                ...props.apiParams
            })
            .then(response => {
                items.value = response.data?.data?.data || [];
            })
            .finally(() => {
                isLoadingItems.value = false
            })
        }, 800);
    }

    onMounted(() => {
        console.log(props.valueText);
        if(props.valueText) {
            searchItems(props.valueText);
        }
    })
</script>
<template>
    <VSelect
    :items="items"
    :loading="isLoadingItems">
        <template #prepend-item>
        <VListItem>
            <VListItemContent>
            <VTextField
                :placeholder="props.placeholder"
                @input="searchItems"
            />
            </VListItemContent>
        </VListItem>
        <VDivider class="mt-2" />
        </template>
    </VSelect>
</template>