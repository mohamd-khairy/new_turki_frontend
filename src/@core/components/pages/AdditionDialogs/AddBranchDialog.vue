<script setup>
import {
  requiredValidator,
} from '@validators';

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

import { useBranchesStore } from "@/store/Branches";
import { useCitiesStore } from "@/store/Cities";
import { useSettingsStore } from "@/store/Settings";
import { useI18n } from "vue-i18n";

const { t } = useI18n()
const branchesListStore = useBranchesStore()
const settingsListStore = useSettingsStore()
const citiesListStore = useCitiesStore()

const countries = reactive([])
const isLoading = ref(false)

const refForm = ref(null)
const cities = reactive([])


onMounted(() => {
  citiesListStore.fetchCities({ pageSize: -1 }).then(response => {
    cities.value = response.data.data
  })
})

const branch = reactive({
  name: null,
  mobile: null,
  address: null,
  city_id: null,
  is_active: 0,
})

// Functions
const resetForm = () => {
  branch.name = null,
  branch.address = null,
  branch.city_id = null,
  branch.mobile = null,
  branch.is_active = false,
  emit('update:isAddOpen', false)
}

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()

  if (res.valid) {
    let branchDt = {
      name: branch.name,
      address: branch.address,
      mobile: branch.mobile,
      is_active: branch.is_active,
      city_id: branch.city_id,
    }
    branchesListStore.storeBranch(branchDt).then(response => {
      emit('update:isAddOpen', false)
      emit('refreshTable')
      resetForm()
      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم إضافة المدينة بنجاح"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
      }, 2000)
      resetForm()
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
    :width="$vuetify.display.smAndDown ? 'auto' : 650"
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
            icon="solar:branch-broken"
            size="24"
            color="primary"
          />
          <span class="mx-1 my-1">
            اضافه فرع
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
                v-model="branch.name"
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
                v-model="branch.address"
                :label="t('forms.address')"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VSelect
                v-model="branch.city_id"
                :items="cities.value"
                :label="t('forms.cities')"
                item-title="name_ar"
                item-value="id"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              lg="12"
              sm="6"
            >
              <VTextField
                v-model="branch.mobile"
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
                v-model="branch.is_active"
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
