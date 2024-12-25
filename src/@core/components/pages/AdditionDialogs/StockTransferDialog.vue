<script setup>
import { useSettingsStore } from "@/store/Settings"
import { useStocksStore } from "@/store/Stocks"
import { useStoresStore } from "@/store/Stores"
import {
  requiredValidator,
} from '@validators'
import { watch } from "vue"
import { useI18n } from "vue-i18n"

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
const stocksStore = useStocksStore()
const storesStore = useStoresStore()

const refForm = ref(null)
const { t } = useI18n()
const isStoreSelected = ref(false)

const itemData = reactive({
  store_id: null,
  stock_id: null,
  to_store: null,
  transfer_quantity: null,
})

const isLoading = ref(false)

const resetForm = () => {
  emit('update:isAddOpen', false)
}

watch(() => itemData.store_id, () => {
  isStoreSelected.value = itemData.store_id ? true : false
})

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    stocksStore.transferStock(itemData).then(response => {
      emit('refreshTable')
      emit('update:isAddOpen', false)
      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم التحويل بنجاح"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
      }, 2000)
    }).catch(error => {
      if (error.response?.data?.errors) {
        const errs = Object.keys(error.response?.data?.errors)

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
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon
            icon="mdi-transfer"
            size="24"
            color="primary"
          />
          <span class="mx-1 my-1">
            تحويل مخزني
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
            <VCol cols="12">
              <VRow>
                <VCol cols="12">
                  <AutoCompleteDropdown
                    v-model="itemData.store_id"
                    :api-model="storesStore"
                    api-search-method="getAll"
                    item-title="name"
                    item-value="id"
                    label="تحويل من مخزن"
                    placeholder="البحث في المخزن"
                    prepend-icon="oi:data-transfer-upload"
                    :rules="[requiredValidator]"
                  />
                </VCol>
                <VCol
                  v-if="isStoreSelected"
                  cols="12"
                >
                  <AutoCompleteDropdown
                    v-model="itemData.stock_id"
                    :api-model="stocksStore"
                    api-search-method="getAll"
                    item-title="product_name"
                    item-value="id"
                    :api-params="{ store_id: itemData.store_id }"
                    label="المخزون (المنتج)"
                    placeholder="البحث في المخزون"
                    :rules="[requiredValidator]"
                    prepend-icon="material-symbols:production-quantity-limits"
                  />
                </VCol>
                <VCol
                  v-if="isStoreSelected"
                  cols="12"
                >
                  <VTextField
                    v-model="itemData.transfer_quantity"
                    label="تحويل كمية"
                    type="number"
                    min="1"
                    :rules="[requiredValidator]"
                  />
                </VCol>
              </VRow>
            </VCol>
            <!-- to store -->
            <VCol cols="12">
              <AutoCompleteDropdown
                v-model="itemData.to_store"
                :api-model="storesStore"
                api-search-method="getAll"
                item-title="name"
                item-value="id"
                label="تحويل إلى مخزن"
                placeholder="البحث في المخزن"
                :rules="[requiredValidator]"
                prepend-icon="oi:data-transfer-download"
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
                class="px-8"
                @click="resetForm"
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
