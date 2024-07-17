<script setup>
import {
  requiredValidator,
} from '@validators';
import { useI18n } from "vue-i18n";

import { useCityDaysStore } from "@/store/CityDays";

const props = defineProps({
  isAddOpen: {
    type: Boolean,
    required: true,
  },
  cities: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits([
  'update:isAddOpen',
  'refreshTable',
])

const CityDaysStore = useCityDaysStore()

const { t } = useI18n()


const itemData = reactive({
  day: null,
  city_id: null,
})

const form = ref()
const isLoading = ref(false)

const days = [
  {
    'key': 'saturday',
    'value': "السبت",
  },
  {
    'key': 'sunday',
    'value': "الأحد",
  },
  {
    'key': 'monday',
    'value': "الاثنين",
  },
  {
    'key': 'tuesday',
    'value': "الثلاثاء",
  },
  {
    'key': 'wednesday',
    'value': "الاربعاء",
  },
  {
    'key': 'thursday',
    'value': "الخميس",
  },
  {
    'key': 'friday',
    'value': "الجمعة",
  }
]

const resetForm = () => {
  emit('update:isAddOpen', false)
}

const refForm = ref(null)

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    CityDaysStore.store(itemData).then(response => {
      emit('refreshTable')
      emit('update:isAddOpen', false)
      CityDaysStore.alertColor = "success"
      CityDaysStore.alertMessage = "تم إضافة العنصر بنجاح"
      CityDaysStore.isAlertShow = true
      setTimeout(() => {
        CityDaysStore.isAlertShow = false
        CityDaysStore.alertMessage = ""
        isLoading.value = false

      }, 2000)
    }).catch(error => {
      if (error.response.data.errors) {
        const errs = Object.keys(error.response.data.errors)
        errs.forEach(err => {
          CityDaysStore.alertMessage = t(`errors.${err}`)
        })
      } else {
        CityDaysStore.alertMessage = "حدث خطأ ما !"
      }
      isLoading.value = false
      CityDaysStore.alertColor = "error"
      CityDaysStore.isAlertShow = true
      setTimeout(() => {
        CityDaysStore.isAlertShow = false
        CityDaysStore.alertMessage = ""
      }, 2000)
    })
  }
  else {
    isLoading.value = false
    CityDaysStore.alertMessage = "يرجي تعبئة الحقول المطلوبة !"
    CityDaysStore.alertColor = "error"
    CityDaysStore.isAlertShow = true
    setTimeout(() => {
      CityDaysStore.isAlertShow = false
      CityDaysStore.alertMessage = ""
    }, 2000)
  }
}

const dialogModelValueUpdate = val => {
  emit('update:isAddOpen', val)
}
</script>

<template>
  <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 650" :model-value="props.isAddOpen"
    @update:model-value="dialogModelValueUpdate">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-9 pa-5">
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon icon="fluent-mdl2:date-time" size="24" color="primary"></VIcon>
          <span class="mx-1 my-1">
            {{ t('Add_Item') }}
          </span>
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm @submit.prevent="onFormSubmit" ref="refForm">
          <VRow>
            <VCol cols="12">
              <VSelect v-model="itemData.day" multiple="multiple" :items="days" :label="t('الايام')" item-title="value"
                item-value="key" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12">
              <VSelect v-model="itemData.city_id" :items="cities" :label="t('Cities')" item-title="name_ar"
                item-value="id" :rules="[requiredValidator]" />
            </VCol>

            <VCol cols="12" class="text-center">
              <VBtn v-if="!isLoading" type="submit" class="me-3">
                {{ t('buttons.save') }}
              </VBtn>
              <VBtn v-else type="submit" class="position-relative me-3">
                <VIcon icon="mingcute:loading-line" class="loading" size="32"></VIcon>
              </VBtn>

              <VBtn variant="tonal" color="secondary" @click="resetForm">
                {{ t('buttons.cancel') }}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
