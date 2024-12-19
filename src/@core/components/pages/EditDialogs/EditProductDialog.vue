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
  isEditOpen: {
    type: Boolean,
    required: true,
  },
  item: {
    type: Object,
    required: true,
  },

})

const emit = defineEmits([
  'update:isEditOpen',
  'refreshTable',
])

const settingsListStore = useSettingsStore()
const productsListStore = useProductsStore()
const citiesListStore = useCitiesStore()
const categoryListStore = useCategoriesStore()
const isLoading = ref(false)

const { t } = useI18n()

const cities = reactive([])
const categories = reactive([])
const sub_categories = reactive([])
const preparations = reactive([])
const sizes = reactive([])
const cuts = reactive([])
const payment_type_ids = reactive([])
const images = ref([])
const shalwatas = ref([])

const itemData = reactive({
  id: null,
  name_ar: "",
  name_en: "",
  weight: "",
  calories: "",
  description_ar: "",
  description_en: "",
  sale_price: 0.00,
  price: 0,
  is_active: 0,
  is_available: 0,
  is_kwar3: 0,
  is_Ras: 0,
  is_lyh: 0,
  is_karashah: 0,
  category_id: null,
  sub_category_id: null,
  is_shalwata: 0,
  is_delivered: 0,
  is_picked_up: 0,
  preparation_ids: [],
  size_ids: [],
  cut_ids: [],
  payment_type_ids: [],
  city_ids: [],
  images: [],
  shalwata_id: null,
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

watch(() => itemData.category_id, (nv,ov) => {
  if(typeof itemData.category_id == 'object') {
    categoryListStore.fetchSubCategoryByCategory(itemData.category_id.id).then(response => {
      sub_categories.value = response.data.data
    })
  }
  else {
    categoryListStore.fetchSubCategoryByCategory(itemData.category_id).then(response => {
      sub_categories.value = response.data.data
    })
  }
})

onMounted(() => {
  citiesListStore.fetchCities({ pageSize: -1 }).then(response => {
    cities.value = response.data.data
  })
  categoryListStore.fetchCategories({ pageSize: -1 }).then(response => {
    categories.value = response.data.data
  })
  settingsListStore.fetchProductSize({ pageSize: -1 }).then(response => {
    sizes.value = response.data.data
  })
  settingsListStore.fetchProductCut({ pageSize: -1 }).then(response => {
    cuts.value = response.data.data
  })
  settingsListStore.fetchProductPerparation({ pageSize: -1 }).then(response => {
    preparations.value = response.data.data
  })
  settingsListStore.fetchPaymentTypes({ pageSize: -1 }).then(response => {
    payment_type_ids.value = response.data.data
  })

  settingsListStore.fetchProductShalwata({ pageSize: -1 }).then(response => {
    shalwatas.value = response.data.data
  })


})

onUpdated(() => {
  itemData.id = props.item.id
  itemData.name_ar = props.item.name_ar
  itemData.name_en = props.item.name_en
  itemData.weight = props.item.weight
  itemData.calories = props.item.calories
  itemData.description_ar = props.item.description_ar
  itemData.description_en = props.item.description_en
  itemData.sale_price = props.item['sale_price']
  itemData.price = props.item.price
  itemData.is_active = props.item.is_active ?? 0
  itemData.is_available = props.item.is_available ?? 0
  itemData.is_kwar3 = props.item.is_kwar3 ?? 0
  itemData.is_Ras = props.item.is_Ras ?? 0
  itemData.is_lyh = props.item.is_lyh ?? 0
  itemData.is_karashah = props.item.is_karashah ?? 0
  itemData.category_id = props.item.category ? props.item.category : null
  itemData.sub_category_id = props.item.sub_category ?? 0
  itemData.shalwata_id = props.item.shalwata_id// ? props.item.shalwata_id: props.item.shalwata
  itemData.is_shalwata = props.item.is_shalwata ?? 0
  itemData.is_delivered = props.item.is_delivered ?? 0
  itemData.is_picked_up = props.item.is_picked_up ?? 0
  itemData.preparation_ids = props.item.product_preparations ?? []
  itemData.size_ids = props.item.product_sizes ?? []
  itemData.cut_ids = props.item.product_cuts ?? []
  itemData.payment_type_ids = props.item.product_payment_types ?? []
  itemData.city_ids = props.item.cities ?? []
  images.value = props.item.product_images ?? []
})

const refForm = ref(null)

const resetForm = () => {
  emit('update:isEditOpen', false)
}

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    productsListStore.editProduct(itemData).then(response => {
      emit('refreshTable')
      emit('update:isEditOpen', false)
      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم تعديل العنصر بنجاح"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
        isLoading.value = false
      }, 2000)
    }).catch(error => {
      if (error.response.data.errors) {
        const errs = Object.keys(error.response.data.errors)

        errs.forEach(err => {
          settingsListStore.alertMessage = error.response.data.errors[err][0]
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
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon
            icon="streamline:shopping-bag-hand-bag-1-shopping-bag-purse-goods-item-products"
            size="24"
            color="primary"
          />
          <span class="mx-1 my-1">
            {{ t('Edit_Item') }}
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
              <VSelect
                v-model="itemData.cut_ids"
                :items="cuts.value"
                :label="t('forms.product_cut')"
                item-title="name_ar"
                item-value="id"
                multiple
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="itemData.size_ids"
                :items="sizes.value"
                :label="t('forms.product_size')"
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
                v-model="itemData.preparation_ids"
                :items="preparations.value"
                :label="t('forms.product_preparation')"
                item-title="name_ar"
                item-value="id"
                multiple
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
                small-chips
                prepend-inner-icon="mdi-image"
                multiple
              />
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
              v-if="images.length > 0"
              cols="12"
            >
              <VCarousel show-arrows="hover">
                <VCarouselItem
                  v-for="image in images"
                  :key="image.id"
                  :src="image.thumbnail_url"
                  cover
                />
              </VCarousel>
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
  </VDialog>
</template>
