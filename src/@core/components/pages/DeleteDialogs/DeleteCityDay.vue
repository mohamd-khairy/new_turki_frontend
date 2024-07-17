<script setup>
import { useI18n } from "vue-i18n"
import { useCityDaysStore } from "@/store/CityDays";

const props = defineProps({
  isDeleteOpen: {
    type: Boolean,
    required: true,
  },
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDeleteOpen',
  'refreshTable',
])

const isLoading = ref(false)
const { t } = useI18n()
const CityDaysStore = useCityDaysStore()

const resetForm = () => {
  emit('update:isDeleteOpen', false)
}

const onFormSubmit = () => {
  // Delete
  isLoading.value = true
  CityDaysStore.delete(props.item).then(() => {
    emit('refreshTable')
    emit('update:isDeleteOpen', false)
    CityDaysStore.alertColor = "success"
    CityDaysStore.alertMessage = "تم حذف العنصر بنجاح"
    CityDaysStore.isAlertShow = true
    setTimeout(() => {
      CityDaysStore.isAlertShow = false
      CityDaysStore.alertMessage = ""
      isLoading.value = false
    }, 1000)
  }).catch(error => {
    isLoading.value = false
    CityDaysStore.alertColor = "error"
    CityDaysStore.alertMessage = "حدث خطأ ما !"
    CityDaysStore.isAlertShow = true
    setTimeout(() => {
      CityDaysStore.isAlertShow = false
      CityDaysStore.alertMessage = ""
    }, 2000)
  })
}

const dialogModelValueUpdate = val => {
  emit('update:isDeleteOpen', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650 "
    :model-value="props.isDeleteOpen"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)"/>

    <VCard
      class="pa-sm-9 pa-5"
    >
      <VCardItem>
        <VCardTitle class="text-h5 text-center mb-3">
          <VIcon icon="ph:info-light" color="#f00" size="50"></VIcon>
          <h5>
            {{ t('ask_delete') }}
          </h5>
        </VCardTitle>
      </VCardItem>
      <VCardText>
        <!-- 👉 Form -->
        <VForm ref="refForm" @submit.prevent="onFormSubmit">
          <VRow>
            <VCol
              cols="12"
              class="text-center"
            >
              <VBtn
                v-if="!isLoading"
                type="submit"
                class="me-3"
                color="primary"
              >
                {{ t('buttons.confirm') }}
              </VBtn>
              <VBtn
                v-else
                type="submit"
                class="position-relative me-3"
              >
                <VIcon icon="mingcute:loading-line" class="loading" size="32"></VIcon>
              </VBtn>

              <VBtn
                variant="tonal"
                color="secondary"
                @click="resetForm"
              >
                {{ t('buttons.cancel') }}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
