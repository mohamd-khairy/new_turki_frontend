<script setup>
import { useCategoriesStore } from "@/store/Categories"
import { useCitiesStore } from "@/store/Cities"
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
})

const emit = defineEmits([
  'update:isAddOpen',
  'refreshTable',
])

const settingsListStore = useSettingsStore()
const productsListStore = useProductsStore()
const citiesListStore = useCitiesStore()
const categoryListStore = useCategoriesStore()

const { t } = useI18n()

const cities = reactive([])
const categories = reactive([])
const sub_categories = reactive([])
const preparations = ref([])
const sizes = ref([])
const productCuts = ref([])
const shalwatas = ref([])
const payment_type_ids = reactive([])

const refForm = ref(null)

const itemData = reactive({
  name_ar: "",
  name_en: "",
  weight: "",
  calories: "",
  description_ar: "",
  description_en: "",
  sale_price: null,
  price: null,
  is_active: 0,
  is_available: 0,
  is_kwar3: 0,
  is_Ras: 0,
  is_lyh: 0,
  is_karashah: 0,
  category_id: null,
  sub_category_id: null,
  is_shalwata: 0,
  shalwata_id: null,
  preparation_ids: [],
  size_ids: [],
  cut_ids: [],
  payment_type_ids: [],
  city_ids: [],
  images: [],
  not_dates: [
    {
      date_mm_dd: null,
      delivery_period_ids: [
        {
          delivery_period_id: null,
          city_id: null,
        },
        {
          delivery_period_id: null,
          city_id: null,
        },
      ],
    },
  ],
})

const getProductSizes = () => {
  settingsListStore.fetchProductSize({ pageSize: -1 }).then(response => {
    sizes.value = response.data.data
  })
}

const getProductShalwata = () => {
  settingsListStore.fetchProductShalwata({ pageSize: -1 }).then(response => {
    shalwatas.value = response.data.data
  })
}

const getProductCuts = () => {
  settingsListStore.fetchProductCut({ pageSize: -1 }).then(response => {
    productCuts.value = response.data.data;
  })
}

const getProductPerparation = () => {
  settingsListStore.fetchProductPerparation({ pageSize: -1 }).then(response => {
    preparations.value = response.data.data
  })
}

const getPaymentTypes = () => {
  settingsListStore.fetchPaymentTypes({ pageSize: -1 }).then(response => {
    payment_type_ids.value = response.data.data
  })
}

const getAllData = async () => {
  isLoading.value = true

  const allRequests = () => {
    citiesListStore.fetchCities({ pageSize: -1 }).then(response => {
      cities.value = response.data.data
    })
    categoryListStore.fetchCategories({ pageSize: -1 }).then(response => {
      categories.value = response.data.data
    })
    getProductSizes()
    getProductCuts()
    getProductPerparation()
    getPaymentTypes()
    getProductShalwata()
  }

  await allRequests()
}

onMounted(() => {
  getAllData().then(res => {
    isLoading.value = false
  })
})

const form = ref()
const isLoading = ref(false)
const isAddSizeOpen = ref(false)
const isAddCutsOpen = ref(false)
const isAddPreparationOpen = ref(false)

const resetForm = () => {
  emit('update:isAddOpen', false)
}

watch(() => itemData.category_id, () => {
  if (itemData.category_id !== null) {
    categoryListStore.fetchSubCategoryByCategory(itemData.category_id).then(response => {
      sub_categories.value = response?.data.data
    })
  }
})

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    productsListStore.storeProduct(itemData).then(response => {
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
    :width="$vuetify.display.smAndDown ? 'auto' : 650 "
    :model-value="props.isAddOpen"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard
      :loading="isLoading"
      class="pa-sm-9 pa-5"
    >
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon
            icon="streamline:shopping-bag-hand-bag-1-shopping-bag-purse-goods-item-products"
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
                v-model="itemData.calories"
                :label="t('forms.calories')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="itemData.description_ar"
                :label="t('forms.description_ar')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="itemData.description_en"
                :label="t('forms.description_en')"
                :rules="[requiredValidator]"
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
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="itemData.category_id"
                :items="categories.value"
                :label="t('forms.categories')"
                item-title="type_ar"
                item-value="id"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="itemData.sub_category_id"
                :items="sub_categories.value"
                :label="t('forms.sub_categories')"
                item-title="type_ar"
                item-value="id"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VRow align="center">
                <VCol
                  cols="12"
                  lg="9"
                  sm="12"
                >
                  <VSelect
                    v-model="itemData.cut_ids"
                    :items="productCuts"
                    :label="t('forms.product_cut')"
                    item-title="name_ar"
                    item-value="id"
                    multiple
                  />
                </VCol>
                <VCol
                  cols="12"
                  lg="3"
                  sm="12"
                >
                  <VBtn
                    type="button"
                    size="small"
                    class="position-relative me-3"
                    @click="isAddCutsOpen = true"
                  >
                    <VIcon
                      icon="material-symbols-light:add"
                      size="20"
                    />
                  </VBtn>
                </VCol>
              </VRow>
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VRow align="center">
                <VCol
                  cols="12"
                  lg="9"
                  sm="12"
                >
                  <VSelect
                    v-model="itemData.size_ids"
                    :items="sizes"
                    :label="t('forms.product_size')"
                    item-title="name_ar"
                    item-value="id"
                    multiple
                    :rules="[requiredValidator]"
                  />
                </VCol>
                <VCol
                  cols="12"
                  lg="3"
                  sm="12"
                >
                  <VBtn
                    type="button"
                    size="small"
                    class="position-relative me-3"
                    @click="isAddSizeOpen = true"
                  >
                    <VIcon
                      icon="material-symbols-light:add"
                      size="20"
                    />
                  </VBtn>
                </VCol>
              </VRow>
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VRow align="center">
                <VCol
                  cols="12"
                  lg="9"
                  sm="12"
                >
                  <VSelect
                    v-model="itemData.preparation_ids"
                    :items="preparations"
                    :label="t('forms.product_preparation')"
                    item-title="name_ar"
                    item-value="id"
                    multiple
                  />
                </VCol>
                <VCol
                  cols="12"
                  lg="3"
                  sm="12"
                >
                  <VBtn
                    type="button"
                    size="small"
                    class="position-relative me-3"
                    @click="isAddPreparationOpen = true"
                  >
                    <VIcon
                      icon="material-symbols-light:add"
                      size="20"
                    />
                  </VBtn>
                </VCol>
              </VRow>
            </VCol>
            <VCol
              v-if="!itemData.is_shalwata"
              cols="12"
              md="6"
            >
              <VSelect
                v-model="itemData.shalwata_id"
                :items="shalwatas"
                :label="t('forms.shalwata')"
                item-title="name_ar"
                item-value="id"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="itemData.city_ids"
                :items="cities.value"
                :label="t('forms.cities')"
                item-title="name_ar"
                item-value="id"
                multiple
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="itemData.payment_type_ids"
                :items="payment_type_ids.value"
                :label="t('forms.payment_type_ids')"
                item-title="name_ar"
                item-value="id"
                multiple
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VFileInput
                v-model="itemData.images"
                :label="t('forms.product_images')"
                accept="image/*"
                prepend-icon=""
                prepend-inner-icon="mdi-image"
                multiple
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VSwitch
                v-model="itemData.is_active"
                :label="t('forms.is_active')"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSwitch
                v-model="itemData.is_available"
                :label="t('forms.is_available')"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSwitch
                v-model="itemData.is_kwar3"
                :label="t('forms.is_kwar3')"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSwitch
                v-model="itemData.is_Ras"
                :label="t('forms.is_Ras')"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSwitch
                v-model="itemData.is_lyh"
                :label="t('forms.is_lyh')"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSwitch
                v-model="itemData.is_karashah"
                :label="t('forms.is_karashah')"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSwitch
                v-model="itemData.is_shalwata"
                :label="t('forms.is_shalwata')"
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
    <AddProductSizeDialog
      v-model:is-add-open="isAddSizeOpen"
      @refreshTable="getProductSizes"
    />
    <AddProductPreparationDialog
      v-model:is-add-open="isAddPreparationOpen"
      @refreshTable="getProductPerparation"
    />
    <AddProductCutDialog
      v-model:is-add-open="isAddCutsOpen"
      @refreshTable="getProductCuts"
    />
  </VDialog>
</template>
