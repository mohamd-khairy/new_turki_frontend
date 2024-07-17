<script setup>
import { useCityDeliveryPeriodsStore } from "@/store/CityDeliveryPeriods";
import {
  requiredValidator,
} from '@validators';
import { useI18n } from "vue-i18n";

const props = defineProps({
  isEditOpen: {
    type: Boolean,
    required: true,
  },
  item: {
    type: Object,
    required: true,
  },
  cities: {
    type: Array,
    required: true,
  },
  deliveryPeriods: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits([
  'update:isEditOpen',
  'refreshTable',
])

const CityDeliveryPeriodsStore = useCityDeliveryPeriodsStore()
const isLoading = ref(false)
const { t } = useI18n()

const itemData = reactive({
  city_id: null,
  delivery_period_id: null,
})

const form = ref()

const resetForm = () => {
  emit('update:isEditOpen', false)
}

onUpdated(() => {
  itemData.id = props.item.id
  itemData.delivery_period_id = props?.item?.period_ids?.split(',').map(id => parseInt(id.trim(), 10));
  itemData.city_id = props.item.city_id
})

const refForm = ref(null)

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    CityDeliveryPeriodsStore.update(itemData).then(response => {
      emit('refreshTable')
      emit('update:isEditOpen', false)
      CityDeliveryPeriodsStore.alertColor = "success"
      CityDeliveryPeriodsStore.alertMessage = "تم تعديل العنصر بنجاح"
      CityDeliveryPeriodsStore.isAlertShow = true
      setTimeout(() => {
        CityDeliveryPeriodsStore.isAlertShow = false
        CityDeliveryPeriodsStore.alertMessage = ""
        isLoading.value = false
      }, 1000)
    }).catch(error => {
      if (error.response.data.errors) {
        const errs = Object.keys(error.response.data.errors)
        errs.forEach(err => {
          CityDeliveryPeriodsStore.alertMessage = t(`errors.${err}`)
        })
      } else {
        CityDeliveryPeriodsStore.alertMessage = "حدث خطأ ما !"
      }
      isLoading.value = false
      CityDeliveryPeriodsStore.alertColor = "error"
      CityDeliveryPeriodsStore.isAlertShow = true
      setTimeout(() => {
        CityDeliveryPeriodsStore.isAlertShow = false
        CityDeliveryPeriodsStore.alertMessage = ""
      }, 2000)
    })
  }
  else {
    isLoading.value = false
    CityDeliveryPeriodsStore.alertMessage = "يرجي تعبئة الحقول المطلوبة !"
    CityDeliveryPeriodsStore.alertColor = "error"
    CityDeliveryPeriodsStore.isAlertShow = true
    setTimeout(() => {
      CityDeliveryPeriodsStore.isAlertShow = false
      CityDeliveryPeriodsStore.alertMessage = ""
    }, 2000)
  }
}

const dialogModelValueUpdate = val => {
  emit('update:isEditOpen', val)
}
</script>

<template>
  <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 650" :model-value="props.isEditOpen"
    @update:model-value="dialogModelValueUpdate">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-9 pa-5">
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon icon="fluent-mdl2:date-time" size="24" color="primary"></VIcon>
          <span class="mx-1 my-1">
            {{ t('Edit_Item') }}
          </span>
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm @submit.prevent="onFormSubmit" ref="refForm">
          <VRow>
            <VCol cols="12">
              <VSelect v-model="itemData.delivery_period_id" multiple="multiple" :items="deliveryPeriods" :label="t('Delivery_Periods')"
                item-title="name_ar" item-value="id" :rules="[requiredValidator]" />
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
