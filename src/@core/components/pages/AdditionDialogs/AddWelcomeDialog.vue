<script setup>
import { useCountriesStore } from "@/store/Countries"
import { useSettingsStore } from "@/store/Settings"
import { useWelcomeStore } from "@/store/Welcome"

import {
  requiredValidator,
} from '@validators'
import { ref } from 'vue'


const props = defineProps({
  isAddOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'refreshTable',
  'update:isAddOpen',
])

import { useI18n } from "vue-i18n"

const { t } = useI18n()
const welcomeStore = useWelcomeStore()
const countriesListStore = useCountriesStore()
const settingsListStore = useSettingsStore()

const countries = reactive([])

const isLoading = ref(false)
const refForm = ref(null)

onMounted(() => {
  countriesListStore.fetchCountries({}).then(response => {
    countries.value = response.data.data
  })
})

// Variables
const welcome = reactive({
  welcome_amount: null,
  welcome_start_date: null,
  welcome_end_date: null,
  is_active: true,
  country_id: null,
  expired_days:null,
})

// Functions
const resetForm = () => {
  emit('update:isAddOpen', false)
}

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
   
    welcomeStore.storeWelcome(welcome).then(response => {
      emit('update:isAddOpen', false)
      emit('refreshTable')
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
          settingsListStore.alertMessage = error.response.data.errors[err][0]
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
  emit('update:isAddOpen', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650"
    persistent
    :model-value="props.isAddOpen"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-9 pa-5">
      <!-- 👉 Title -->
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon
            icon="bxs:welcome"
            size="24"
            color="primary"
          />
          <span class="mx-1 my-1">
            {{ t('Add_welcome') }}
          </span>
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm
          ref="refForm"
          @submit.prevent.stop="onFormSubmit"
        >
          <VRow>
            <VCol
              cols="12"
              lg="12"
            >
              <VTextField
                v-model="welcome.welcome_amount"
                :label="t('forms.welcome_amount')"
                type="number"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="6"
              lg="6"
            >
              <VTextField
                v-model="welcome.welcome_start_date"
                :label="t('forms.welcome_start_date')"
                type="date"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="6"
              lg="6"
            >
              <VTextField
                v-model="welcome.welcome_end_date"
                :label="t('forms.welcome_end_date')"
                type="date"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="6"
              lg="6"
            >
              <VTextField
                v-model="welcome.expired_days"
                :label="t('forms.expired_days')"
                type="number"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              lg="12"
            >
              <VSelect
                v-model="welcome.country_id"
                :items="countries.value"
                :label="t('forms.countries')"
                item-title="name_ar"
                item-value="id"
                :disabled="isLoading"
                clearable
              />
            </VCol>
            <VCol
              cols="12"
              lg="6"
            >
              <VSwitch
                v-model="welcome.is_active"
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
