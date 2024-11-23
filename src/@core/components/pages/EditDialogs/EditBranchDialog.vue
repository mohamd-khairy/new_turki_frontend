<script setup>
import { useBranchesStore } from "@/store/Branches";

const props = defineProps({
  isEditOpen: {
    type: Boolean,
    required: true,
  },
  branch: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'refreshTable',
  'update:isEditOpen',
])

import { useSettingsStore } from "@/store/Settings";
import { useI18n } from "vue-i18n";

const { t } = useI18n()
const branchesListStore = useBranchesStore()
const settingsListStore = useSettingsStore()
const isLoading = ref(false)


// Variables
const branchData = reactive({
  id: null,
  name: null,
  address: null,
  mobile: null,
  is_active: null,
})


onUpdated(() => {
  branchData.id = props.branch.id
  branchData.name = props.branch.name
  branchData.address = props.branch.address
  branchData.mobile = props.branch.mobile
  branchData.is_active = props.branch.is_active
})

// Functions
const resetForm = () => {
  emit('update:isEditOpen', false)
}

const refForm = ref(null)

const onFormSubmit = async () => {
  isLoading.value = true
  let branchDt = {
    id: branchData.id,
    name: branchData.name,
    mobile: branchData.mobile,
    address: branchData.address,
    is_active: branchData.is_active,
  }

  const res = await refForm.value.validate()
  if (res.valid) {
    branchesListStore.editBranch(branchDt).then(response => {
      emit('update:isEditOpen', false)
      emit('refreshTable')
      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم تعديل المدينة بنجاح"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
        isLoading.value = false
      }, 1000)
    }).catch(error => {
      if (error.response.data.errors) {
        const errs = Object.keys(error.response.data.errors)

        errs.forEach(err => {
          settingsListStore.alertMessage = t(`errors.${err}`)
        })
      } else {
        settingsListStore.alertMessage = "حدث خطأ ما !"
      }
      isLoading.value = false
      settingsListStore.alertColor = "error"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
      }, 2000)
    })
  } else {
    isLoading.value = false
    settingsListStore.alertMessage = "يرجي تعبئة الحقول المطلوبة !"
    settingsListStore.alertColor = "error"
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
    }, 2000)
  }
}

const dialogModelValueUpdate = val => {
  emit('update:isEditOpen', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650"
    :model-value="props.isEditOpen"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-9 pa-5">
      <!-- 👉 Title -->
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon
            icon="solar:branch-broken"
            size="24"
            color="primary"
          />
          <span class="mx-1 my-1">
            تعديل فرع
          </span>
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
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="branchData.name"
                :label="t('forms.name')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="branchData.address"
                :label="t('forms.address')"
              />
            </VCol>

            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="branchData.mobile"
                :label="t('forms.mobile')"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VSwitch
                v-model="branchData.is_active"
                :label="t('forms.is_active')"
              />
            </VCol>

            <VCol
              cols="12"
              class="text-center"
            >
              <VBtn
                v-if="!isLoading"
                type="submit"
                class="me-3"
              >
                {{ t("buttons.save") }}
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
                {{ t("buttons.cancel") }}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
