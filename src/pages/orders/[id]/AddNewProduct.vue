<script setup>
import { useProductsStore } from "@/store/Products"
import { useSettingsStore } from "@/store/Settings"
import {
requiredValidator,
} from '@validators'
import { useI18n } from "vue-i18n"

const props = defineProps({
  isAddOpen: {
    type: Boolean,
    required: true,
  },
  order: {
    type: Object,
    required: true,
  },
  sizes: {
    type: Array,
    required: true,
  },
  cuts: {
    type: Array,
    required: true,
  },
  preparations: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits([
  'update:isAddOpen',
  'refreshTable',
])

const productsListStore = useProductsStore()
const settingsListStore = useSettingsStore()

const { t } = useI18n()

const refForm = ref(null)
const productSizes = ref([])
const isLoadingSpecifications = ref(false)

const itemData = reactive({
  order_id: null,
  product_id: null,
  quantity: null,
  cut_ids: [],
  size_ids: [],
  preparation_ids: [],
  shalwata: 0,
  is_karashah: 0,
  is_kwar3: 0,
  is_lyh: 0,
  is_Ras: 0,
})

const getProductSpecifications = (productId) => {
  if(!productId) {
    productSizes.value = [];
    return
  }
  
  isLoadingSpecifications.value = true
  productsListStore.fetchProduct(productId).then(response => {
    // productPreparations.value = response.data.data.preparations
    productSizes.value = response.data.data.sizes
    // productCuts.value = response.data.data.cuts
    // isLoadingCuts.value = false
    // isLoadingSizes.value = false
    // isLoadingPreparations.value = false
  }).finally(() => {
    isLoadingSpecifications.value = false
  })
} 

onUpdated(() => {
  itemData.order_id = props.order ? props.order.id : 0
})

const products = ref([])
const isLoading = ref(false)


const resetForm = () => {
  itemData.order_id = null
  itemData.product_id = null
  itemData.quantity = null
  itemData.cut_ids = null
  itemData.size_ids = null
  itemData.preparation_ids = null
  itemData.shalwata = 0
  itemData.is_karashah = 0
  itemData.is_kwar3 = 0
  itemData.is_lyh = 0
  itemData.is_Ras = 0
  emit('update:isAddOpen', false)
}

const onFormSubmit = async () => {

  const res = await refForm.value.validate()
  if (res.valid) {
    isLoading.value = true
    productsListStore.addNewProduct(itemData).then(response => {
      emit('refreshTable')
      emit('update:isAddOpen', false)
      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم إضافة المنتج بنجاح"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
      }, 2000)
    })
    .catch(error => {
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
    })
    .finally(() => {
      isLoading.value = false
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

const _timerProductsId = ref(null)
const isLoadingProducts = ref(false)
const searchProduct = (e) => {
  clearTimeout(_timerProductsId.value)
  _timerProductsId.value = setTimeout(() => {
    isLoadingProducts.value = true
    productsListStore.fetchProducts({ search: e.target.value}).then(response => {
      products.value = response.data?.data?.data || [];
    })
    .finally(() => {
      isLoadingProducts.value = false
    });
  }, 800);
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
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon icon="streamline:shopping-bag-hand-bag-1-shopping-bag-purse-goods-item-products" size="24"
                 color="primary"
          ></VIcon>
          <span class="mx-1 my-1">
            {{ t('Add_Item') }}
          </span>
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm @submit.prevent="onFormSubmit" ref="refForm">
          <VRow>
            <VCol cols="12"
                  md="6"
            >
              <VSelect
                v-model="itemData.product_id"
                :items="products"
                :label="t('forms.products')"
                item-title="name_ar"
                item-value="id"
                clearable
                :rules="[requiredValidator]"
                :loading="isLoadingProducts"
                @update:modelValue="getProductSpecifications"
                >
                  <template #prepend-item>
                    <VListItem>
                      <VListItemContent>
                        <VTextField
                          placeholder="البحث في المنتجات"
                          @input="searchProduct"
                        />
                      </VListItemContent>
                    </VListItem>
                    <VDivider class="mt-2" />
                  </template>
                </VSelect>
            </VCol>
            <VCol cols="12"
                  md="6"
            >
              <VTextField v-model="itemData.quantity"
                          :label="t('forms.quantity')"
              ></VTextField>
            </VCol>
            <VCol cols="12"
                  md="6"
            >
              <VSelect
                v-model="itemData.cut_ids"
                :items="props.cuts"
                :label="t('forms.product_cut')"
                item-title="name_ar"
                item-value="id"
              />
            </VCol>
            <VCol cols="12"
                  md="6"
            >
              <VSelect
                v-model="itemData.size_ids"
                :items="productSizes"
                :label="t('forms.product_size')"
                item-title="name_ar"
                item-value="id"
                :rules="[requiredValidator]"
                :loading="isLoadingSpecifications"
              />
            </VCol>
            <VCol cols="12"
                  md="6"
            >
              <VSelect
                v-model="itemData.preparation_ids"
                :items="props.preparations"
                :label="t('forms.product_preparation')"
                item-title="name_ar"
                item-value="id"
              />
            </VCol>
            <VCol cols="12"
              md="6"
            >
              <v-checkbox label="مع شلوطة"
              v-model="itemData.shalwata"
              :false-value="0" :true-value="1"
              ></v-checkbox>
            </VCol>
            <VCol cols="12"
            md="6"
              class="d-flex gap-9"
            >
              <v-checkbox label="بدون كرشة"
              v-model="itemData.is_karashah"
              :false-value="0" :true-value="1"
              ></v-checkbox>
              <v-checkbox label="بدون كوارع"
              v-model="itemData.is_kwar3"
              :false-value="0" :true-value="1"
              ></v-checkbox>
            </VCol>
            <VCol cols="12"
            md="6"
            class="d-flex gap-10"
            >
              <v-checkbox label="بدون ليه"
              v-model="itemData.is_lyh"
              :false-value="0" :true-value="1"
              ></v-checkbox>
              <v-checkbox label="بدون رأس"
              v-model="itemData.is_Ras"
              :false-value="0" :true-value="1"
              ></v-checkbox>
            </VCol>
            <VCol
              cols="12"
              class="text-center mt-8"
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
                <VIcon icon="mingcute:loading-line" class="loading" size="32"></VIcon>
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
