<script setup>
import { useProductsStore } from "@/store/Products"
import { useSettingsStore } from "@/store/Settings"
import { useStoresStore } from "@/store/Stores"
import {
  requiredValidator,
} from '@validators'
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
const storesStore = useStoresStore()
const productsStore = useProductsStore()

const { t } = useI18n()

const itemData = reactive({
  name_en: null,
  name_ar: null,
  price: null,
  sale_price: null,
  weight: null,
  is_available_for_use: 0,
  foodics_integrate_id : null,
})

const storesItems = ref([])

const form = ref()
const isLoading = ref(false)

const resetForm = () => {
  emit('update:isAddOpen', false)
}

const refForm = ref(null)

const addProductStore = () => {
  storesItems.value.push({
    store_id: null,
    product_id: null,
    quantity: 1,
  })
}

const removeProductStore = index => {
  storesItems.value = storesItems.value.filter((store, i) => i != index)
}

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    const formData = {
      ...itemData,
      stores: storesItems.value,
    }

    settingsListStore.storeProductSize(formData).then(response => {
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

    <VCard
      class="pa-sm-9 pa-5"
    >
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon
            icon="game-icons:weight-scale"
            size="24"
            color="primary"
          />
          <span class="mx-1 my-1">
            {{ t('Add_Item') }}
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
              md="6"
            >
              <VTextField
                v-model="itemData.name_ar"
                :label="t('forms.name_ar')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="itemData.name_en"
                :label="t('forms.name_en')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="itemData.price"
                :label="t('forms.price')"
                :rules="[requiredValidator]"
                type="number"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="itemData.sale_price"
                :label="t('forms.sale_price')"
                :rules="[requiredValidator]"
                type="number"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="itemData.weight"
                :label="t('forms.weight')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="itemData.foodics_integrate_id"
                label="foodics_integrate_id"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSwitch
                v-model="itemData.is_available_for_use"
                :label="t('forms.available_for_use')"
              />
            </VCol>
            <VCol cols="12">
              <div class="d-flex justify-space-between align-center mb-6">
                <h3 class="">
                  المنتجات
                </h3>

                <VBtn
                  class="position-relative"
                  icon
                  size="small"
                  @click="addProductStore"
                >
                  <VIcon
                    icon="ei:plus"
                    size="30"
                  />
                </VBtn>
              </div>
              <VRow
                v-for="(store, index) in storesItems"
                :key="index"
                style="border-radius: 10px;background-color: #fafafa;"
                class="mb-6 py-3"
              >
                <VCol
                  cols="12"
                  md="6"
                >
                  <AutoCompleteDropdown
                    v-model="store.store_id"
                    :api-model="storesStore"
                    api-search-method="getAll"
                    item-title="name"
                    item-value="id"
                    label="المخزن"
                    placeholder="البحث في المخزن"
                    :rules="[requiredValidator]"
                    style="background-color: #fff;"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AutoCompleteDropdown
                    v-model="store.product_id"
                    :api-model="productsStore"
                    api-search-method="fetchProducts"
                    item-title="name_ar"
                    item-value="id"
                    label="المنتجات"
                    placeholder="البحث في المنتجات"
                    :rules="[requiredValidator]"
                    style="background-color: #fff;"
                  />
                </VCol>
                <VCol
                  cols="10"
                  md="6"
                >
                  <VTextField
                    v-model="store.quantity"
                    type="number"
                    min="1"
                    label="الكمية"
                    :rules="[requiredValidator]"
                    style="background-color: #fff;"
                  />
                </VCol>
                <VCol
                  v-if="index > 0 || storesItems.length > 1"
                  cols="2"
                  md="6"
                  class="d-flex justify-end"
                >
                  <VBtn
                    icon
                    size="small"
                    style="top: 5px;left: 5px;"
                    @click="removeProductStore(index)"
                  >
                    <VIcon
                      icon="simple-line-icons:minus"
                      size="20"
                    />
                  </VBtn>
                </VCol>
              </VRow>
            </VCol>

            <VCol
              cols="12"
              class="pt-4 text-center"
            >
              <VBtn
                v-if="!isLoading"
                type="submit"
                class="me-3"
              >
                {{ t('buttons.save') }}
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
                {{ t('buttons.cancel') }}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
