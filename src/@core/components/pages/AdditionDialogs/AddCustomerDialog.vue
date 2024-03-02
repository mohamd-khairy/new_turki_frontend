<script setup>
import { useEmployeesStore } from "@/store/Employees"
import { useRolesStore } from "@/store/Roles"
import {
requiredValidator,
} from '@validators'


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

import { useSettingsStore } from "@/store/Settings"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const rolesListStore = useRolesStore()
const employeesListStore = useEmployeesStore()
const settingsListStore = useSettingsStore()
const roles = reactive([])
const isLoading = ref(false)

onMounted(() => {
  rolesListStore.fetchRoles().then(response => {
    roles.value = response.data.data
  })
})

// Variables
const employee = reactive({
  name: null,
  mobile: null,
  address: null,

  // mobile_country_code: null,
  // email: null,
  // avatar: {},
  // age: null,
  // gender: null,
  // nationality: "sau",
  // is_active: false,
  // wallet: null,
})

const genders = reactive([
  {
    id: 1,
    name: "ذكر",
  },
  {
    id: 0,
    name: "أنثي",
  },
])

// Functions
const resetForm = () => {
  // employee.mobile_country_code = null
  employee.mobile = null
  employee.name = null
  employee.address = null

  // employee.email = null
  // employee.avatar = {}
  // employee.age = null
  // employee.gender = null
  // employee.nationality = null
  // employee.is_active = false
  // employee.wallet = null
  emit('update:isAddOpen', false)
}

const refForm = ref(null)

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    employeesListStore.storeCustomer(employee).then(response => {
      isLoading.value = false
      emit('update:isAddOpen', false)
      emit('refreshTable')
      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم إضافة العنصر بنجاح"
      settingsListStore.isAlertShow = true
      resetForm()
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
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard
      class="pa-sm-9 pa-5"
    >
      <!-- 👉 Title -->
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon
            icon="ph:users-four"
            size="24"
            color="primary"
          />
          <span class="mx-1 my-1">
            {{ t('Add_Customer') }}
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
                v-model="employee.name"
                :label="t('forms.name')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="employee.mobile"
                type="number"
                min="0"
                label="رقم الجوال"
                :rules="[requiredValidator]"
              />
            </VCol>
            <!--
              <VCol
              cols="12"
              lg="12"
              sm="6"
              >
              <VTextField
              v-model="employee.address"
              label="العنوان"
              :rules="[requiredValidator]"
              />
              </VCol>
              <VCol
              cols="12"
              lg="12"
              sm="6"
              >
              <VTextField
              v-model="employee.mobile_country_code"
              :label="t('forms.country_code')"
              :rules="[requiredValidator]"
              />
              </VCol> 
            -->
            
            <!--
              <VCol
              cols="12"
              lg="12"
              sm="6"
              >
              <VTextField
              v-model="employee.age"
              :label="t('forms.age')"
              />
              </VCol>
              <VCol
              cols="12"
              lg="12"
              sm="6"
              >
              <VSelect
              v-model="employee.nationality"
              :label="t('forms.nationality')"
              :items="countriesList"
              item-title="ar"
              item-value="alpha3"
              />
              </VCol> 
            -->
            <!--
              <VCol
              cols="12"
              lg="12"
              sm="6"
              >
              <VSelect
              v-model="employee.gender"
              :label="t('forms.gender')"
              :items="genders"
              item-title="name"
              item-value="id"
              :rules="[requiredValidator]"
              />
              </VCol>
              <VCol
              cols="12"
              >
              <VFileInput
              v-model="employee.avatar"
              :label="t('forms.image')"
              accept="image/*"
              prepend-icon=""
              prepend-inner-icon="mdi-image"
              :rules="[requiredValidator]"
              />
              </VCol> 
            -->
            <!--
              <VCol
              cols="12"
              lg="12"
              sm="6"
              >
              <VTextField
              v-model="employee.wallet"
              :label="t('forms.wallet')"
              :rules="[requiredValidator]"
              />
              </VCol>
              <VCol
              cols="12"
              lg="12"
              sm="6"
              >
              <VSwitch
              v-model="employee.is_active"
              :label="t('forms.is_active')"
              />
              </VCol> 
            -->
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
