<script setup>
import { useBranchesStore } from "@/store/Branches";
import { useSettingsStore } from "@/store/Settings";
import { useI18n } from "vue-i18n";

const props = defineProps({
  isDeleteOpen: {
    type: Boolean,
    required: true,
  },
  branch: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDeleteOpen',
  'refreshTable',
])

const { t } = useI18n()
const branchesListStore = useBranchesStore()
const settingsListStore = useSettingsStore()
const isLoading = ref(false)

const resetForm = () => {
  emit('update:isDeleteOpen', false)
}

const onFormSubmit = () => {
  // Delete
  isLoading.value = true
  branchesListStore.deleteBranch(props.branch).then(() => {
    settingsListStore.alertColor = "success"
    settingsListStore.alertMessage = "تم حذف الفرع بنجاح"
    emit('refreshTable')
    emit('update:isDeleteOpen', false)
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
      isLoading.value = false
    }, 1000)
  }).catch(error => {
    isLoading.value = false
    settingsListStore.alertColor = "error"
    settingsListStore.alertMessage = "حدث خطأ ما !"
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
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
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard
      class="pa-sm-9 pa-5"
    >
      <VCardItem>
        <VCardTitle class="text-h5 text-center mb-3">
          <VIcon
            icon="ph:info-light"
            color="#f00"
            size="50"
          />
          <h5>
            {{ t('ask_delete') }}
          </h5>
        </VCardTitle>
      </VCardItem>
      <VCardText>
        <!-- 👉 Form -->
        <VForm
          ref="refForm"
          @submit.prevent="onFormSubmit"
        >
          <VRow>
            <VCol
              cols="12"
              class="text-center"
            >
              <VBtn
                v-if="!isLoading"
                type="submit"
                class="me-3"
              >
                {{ t('buttons.confirm') }}
              </VBtn>
              <VBtn
                v-else
                type="submit"
                class="position-relative me-3"
              >
                <VIcon
                  icon="mingcute:loading-line"
                  class="loading"
                  size="32"
                />
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
