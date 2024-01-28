<script setup>
import { useCitiesStore } from "@/store/Cities";
import { useEmployeesStore } from "@/store/Employees";
import { useSafesStore } from "@/store/Safes";
import { useSettingsStore } from "@/store/Settings";
import {
requiredValidator,
} from '@validators';
import { useI18n } from "vue-i18n";

const props = defineProps({
  isAddOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isAddOpen',
  'refreshTable',
])

const settingsListStore = useSettingsStore()
const employeesStore = useEmployeesStore()
const citiesListStore = useCitiesStore()
const safesStore = useSafesStore()

const cities = ref([])
const employees = ref([])
const refForm = ref(null)
const { t } = useI18n()

const itemData = reactive({
  name: null,
  city_id: null,
  user_id: null,
  balance: null,
  currency: null,
})

const isLoading = ref(false)
const resetForm = () => {
  emit('update:isAddOpen', false)
}

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    safesStore.store(itemData).then(response => {
      emit('refreshTable')
      emit('update:isAddOpen', false)
      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم إضافة العنصر بنجاح"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
      }, 2000)
    }).catch(error => {
      if (error.response.data.errors) {
        const errs = Object.keys(error.response.data.errors)

        errs.forEach(err => {
          settingsListStore.alertMessage = t(`errors.${err}`)
        })
      } else {
        settingsListStore.alertMessage = "حدث خطأ ما !"
      }
      
      settingsListStore.alertColor = "error"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
      }, 2000)
    }).finally(() => {
        isLoading.value = false
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
  emit('update:isAddOpen', val)
}

const getAllData = async () => {
  citiesListStore.fetchCities({ pageSize: -1 }).then(response => {
    cities.value = response.data.data
  })
  employeesStore.fetchEmployees({ pageSize: -1 }).then(response => {
    employees.value = response.data.data?.data;
  })
}

onMounted(() => {
  getAllData();
})
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650 "
    :model-value="props.isAddOpen"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-9 pa-5">
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon
            icon="teenyicons-safe-outline"
            size="24"
            color="primary"
          />
          <span class="mx-1 my-1">
            إضافة خزنة
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
            >
              <VTextField
                v-model="itemData.name"
                :label="t('forms.name')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="itemData.city_id"
                :items="cities"
                label="المنطقة"
                item-title="name_ar"
                item-value="id"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="itemData.user_id"
                :items="employees"
                label="المسئول عن المخزون"
                item-title="username"
                item-value="id"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="itemData.balance"
                label="الرصيد"
                :rules="[requiredValidator]"
                type="number"
                min="0"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="itemData.currency"
                :items="[
                  { name: 'ريال سعودي', id: 'SAR'},
                  { name: 'درهم اماراتي', id: 'AED'},
                ]"
                label="العملة"
                item-title="name"
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
                class="me-3 px-8"
              >
                {{ t('buttons.save') }}
              </VBtn>
              <VBtn
                v-else
                type="submit"
                class="position-relative me-3 px-8"
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
                class="px-8"
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
