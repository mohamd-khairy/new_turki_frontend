<script setup>
import { useEmployeesStore } from "@/store/Employees"
import { useOrdersStore } from "@/store/Orders"
import { useSettingsStore } from "@/store/Settings"
import {
requiredValidator,
} from '@validators'
import { useI18n } from "vue-i18n"
const employeesStore = useEmployeesStore()

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  orderIds: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'update:isOpen',
  'refreshTable',
])

const { t } = useI18n()

const ordersListStore = useOrdersStore()
const settingsListStore = useSettingsStore()
const isLoading = ref(false)
const employees = ref([])

const itemData = reactive({
  user_id: null,
})

const resetForm = () => {
  emit('update:isOpen', false)

  itemData.user_id = null;
}

const refForm = ref(null)
const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    ordersListStore.assignOrderDeligation({
      ...itemData,
      order_ids: props.orderIds
    }).then(response => {
      emit('refreshTable')
      resetForm();
      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم تعديل حالة الطلب بنجاح"
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
  }
  else {
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
  emit('update:isOpen', val)
}

onMounted(() => {
  employeesStore.fetchEmployees({ pageSize: -1, role_name: 'delegate' }).then(response => {
    employees.value = response.data?.data?.data;
  })
})
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650 "
    :model-value="props.isOpen"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard
      class="pa-sm-9 pa-5"
    >
      <VCardItem>
        <VCardTitle class="text-h5 d-flex align-center justify-center gap-2 mb-6">
          <VIcon
            icon="clarity:users-line"
            size="24"
            color="primary"
          />
          <span class="mx-1 my-1">
            تعيين مندوب
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
              class="mb-6"
            >
              <VSelect
                v-model="itemData.user_id"
                :items="employees"
                :label="t('forms.user')"
                item-title="username"
                item-value="id"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              class="text-center"
            >
              <VBtn
                v-if="!isLoading"
                type="submit"
                class="me-3 px-10"
              >
                تعيين
              </VBtn>
              <VBtn
                v-else
                type="submit"
                class="position-relative me-3 px-10"
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
                class="px-10"
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
