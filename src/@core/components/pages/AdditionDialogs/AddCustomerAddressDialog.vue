<script setup>
import { useEmployeesStore } from "@/store/Employees"
import { useRolesStore } from "@/store/Roles"


const props = defineProps({
  isAddOpen: {
    type: Boolean,
    required: true,
  },
  customerId: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits([
  'update:isAddOpen',
  'refreshTable',
])

import { useCitiesStore } from "@/store/Cities"
import { useCountriesStore } from "@/store/Countries"
import { useSettingsStore } from "@/store/Settings"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const rolesListStore = useRolesStore()
const employeesListStore = useEmployeesStore()
const countriesListStore = useCountriesStore()
const citiesListStore = useCitiesStore()
const settingsListStore = useSettingsStore()
const roles = reactive([])
const countries = ref([])
const cities = ref([])
const isLoading = ref(false)

// Variables
const address = reactive({
  customer_id: null,
  country_id: null,
  city_id: null,
  address: null,
  comment: null,
  label: null,
  is_default: false,
  lat: 0,
  lng: 0,
})

// Functions
const resetForm = () => {
  address.country_id = null
  address.city_id = null
  address.address = null
  address.comment = null
  address.label = null
  address.is_default = false
  address.lat = 0
  address.lng = 0
  emit('update:isAddOpen', false)
}

const refForm = ref(null)

onUpdated(() => {
  address.customer_id = props.customerId
})

onMounted(() => {
  rolesListStore.fetchRoles().then(response => {
    roles.value = response.data.data
  })
  countriesListStore.fetchCountries().then(response => {
    countries.value = response.data.data
  })
  citiesListStore.fetchCities().then(response => {
    cities.value = response.data.data
  })
})

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    employeesListStore.storeAddress(address).then(response => {
      isLoading.value = false
      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم إضافة العنصر بنجاح"
      settingsListStore.isAlertShow = true
      resetForm()
      // emit('refreshTable')
      emit('update')
      
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
  emit('update:isAddOpen', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650 "
    :model-value="props.isAddOpen"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)"/>

    <VCard
      class="pa-sm-9 pa-5"
    >
      <!-- 👉 Title -->
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon icon="ph:users-four" size="24" color="primary"></VIcon>
          <span class="mx-1 my-1">
            {{ t('Add_Address') }}
          </span>
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm ref="refForm" @submit.prevent="onFormSubmit">
          <VRow>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VSelect
                v-model="address.country_id"
                :items="countries"
                item-title="name_ar"
                item-value="id"
                :label="t('forms.country')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VSelect
                v-model="address.city_id"
                :items="cities"
                item-title="name_ar"
                item-value="id"
                :label="t('forms.city')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="address.address"
                :label="t('forms.address')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="address.comment"
                :label="t('forms.comment')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="address.label"
                :label="t('forms.label')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VSwitch
                v-model="address.is_default"
                :label="t('forms.is_default')"
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
                <VIcon icon="mingcute:loading-line" class="loading" size="32"></VIcon>
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
