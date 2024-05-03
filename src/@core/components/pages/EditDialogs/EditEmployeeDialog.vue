<script setup>
import { useEmployeesStore } from "@/store/Employees"
import { useRolesStore } from "@/store/Roles"

const props = defineProps({
  isEditOpen: {
    type: Boolean,
    required: true,
  },
  employee: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'refreshTable',
  'update:isEditOpen',
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
onUpdated(() => {
  employeeData.id = props.employee.id
  employeeData.username = props.employee.username
  employeeData.email = props.employee.email
  employeeData.password = props.employee.password

  // employeeData.avatar = props.employee.avatar ?? {}
  employeeData.mobile = props.employee.mobile
  employeeData.gender = props.employee.gender
  employeeData.age = props.employee.age
  employeeData.country_code = props.employee.country_code
  employeeData.roles = props.employee.roles
  employeeData.is_active = props.employee.is_active == 1 ? true : false
  employeeData.foodics_integrate_id = props.employee.foodics_integrate_id

})

// Variables
const employeeData = reactive({
  id: null,
  username: null,
  email: null,
  password: null,
  avatar: {},
  mobile: null,
  gender: null,
  age: null,
  country_code: null,
  roles: [],
  is_active: null,
  foodics_integrate_id: null,
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

const countries = reactive([
  {
    code: 'SA',
    name: "السعودية",
  },
  {
    code: "AE",
    name: "الامارات",
  },
])

// Functions
const resetForm = () => {
  emit('update:isEditOpen', false)
}

const refForm = ref(null)

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    employeesListStore.editEmployee(employeeData).then(response => {
      emit('update:isEditOpen', false)
      emit('refreshTable')
      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم تعديل العنصر بنجاح"
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
  emit('update:isEditOpen', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650 "
    :model-value="props.isEditOpen"
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
            icon="carbon:categories"
            size="24"
            color="primary"
          />
          <span class="mx-1 my-1">
            {{ t('Edit_Employee') }}
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
                v-model="employeeData.email"
                :label="t('forms.email')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="employeeData.mobile"
                :label="t('forms.phone')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="employeeData.username"
                :label="t('forms.username')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="employeeData.password"
                :label="t('forms.password')"
                type="password"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VSelect
                v-model="employeeData.country_code"
                :label="t('forms.country')"
                :items="countries"
                item-title="name"
                item-value="code"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VSelect
                v-model="employeeData.gender"
                :label="t('forms.gender')"
                :items="genders"
                item-title="name"
                item-value="id"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="employeeData.age"
                :label="t('forms.age')"
              />
            </VCol>
            <VCol
              cols="12"
            >
              <VFileInput
                v-model="employeeData.avatar"
                :label="t('forms.image')"
                accept="image/*"
                prepend-icon=""
                prepend-inner-icon="mdi-image"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VSelect
                v-model="employeeData.roles"
                :items="roles.value"
                :label="t('forms.roles')"
                item-title="display_name"
                item-value="id"
                multiple
              />
            </VCol>
            <VCol
              cols="12"
            >
              <VSwitch
                v-model="employeeData.is_active"
                :label="t('forms.is_active')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              md="6"
            >
              <VTextField
                v-model="employeeData.foodics_integrate_id"
                label="foodics_integrate_id"
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
