<script setup>
import { useCategoriesStore } from "@/store/Categories"
import { useCitiesStore } from "@/store/Cities"
import { useCountriesStore } from "@/store/Countries"
import { useCouponsStore } from "@/store/Coupons"
import { useEmployeesStore } from "@/store/Employees"
import { useProductsStore } from "@/store/Products"
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
const citiesListStore = useCitiesStore()
const countriesListStore = useCountriesStore()
const categoriesListStore = useCategoriesStore()
const productsListStore = useProductsStore()
const couponsListStore = useCouponsStore()
const employeesListStore = useEmployeesStore()
const settingsListStore = useSettingsStore()

const products = reactive([])
const countries = reactive([])
const cities = reactive([])
const categories = reactive([])
const subCategories = reactive([])
const customers = reactive([])
const isLoading = ref(false)
const refForm = ref(null)

onMounted(() => {
  countriesListStore.fetchCountries({}).then(response => {
    countries.value = response.data.data
  })
  citiesListStore.fetchCities({}).then(response => {
    cities.value = response.data.data
  })
  categoriesListStore.fetchCategories({}).then(response => {
    categories.value = response.data.data
  })
  categoriesListStore.fetchSubCategories({}).then(response => {
    subCategories.value = response.data.data
  })
  productsListStore.fetchProductsAll({}).then(response => {
    products.value = response.data.data
  })
  employeesListStore.fetchCustomers({ pageSize: -1 }).then(response => {
    customers.value = response.data.data
  })
})

// Variables
const coupon = reactive({
  name: null,
  code: null,
  product_ids: [],
  discount_amount_percent: 0,
  min_applied_amount: 0,
  max_discount: 0,
  is_for_all: 0,
  is_by_city: 0,
  is_by_product: 0,
  is_by_country: 0,
  is_by_category: 0,
  is_by_subcategory: 0,
  is_percent: 0,
  for_clients_only: 0,
  is_active: true,
  category_parent_ids: [],
  city_ids: [],
  country_ids: [],
  client_ids: [],
  category_child_ids: [],
  expire_at: null,
  use_times_per_user: 1,
  foodics_integrate_id : null,
})

// Functions
const resetForm = () => {
  emit('update:isAddOpen', false)
}

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    couponsListStore.storeCoupon(coupon).then(response => {
      emit('update:isAddOpen', false)
      emit('refreshTable')
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
    persistent
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
            icon="bxs:coupon"
            size="24"
            color="primary"
          />
          <span class="mx-1 my-1">
            {{ t('Add_Coupon') }}
          </span>
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm
          ref="refForm"
          @submit.prevent.stop="onFormSubmit"
        >
          <VRow>
            <VCol
              cols="12"
              lg="12"
            >
              <VTextField
                v-model="coupon.name"
                :label="t('forms.name')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
            >
              <VTextField
                v-model="coupon.code"
                :label="t('forms.code')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
            >
              <VRow>
                <VCol
                  cols="12"
                  sm="3"
                >
                  <VSwitch
                    v-model="coupon.is_percent"
                    :label="t('forms.is_percent')"
                  />
                </VCol>
                <VCol
                  cols="12"
                  sm="9"
                >
                  <VTextField
                    v-model="coupon.discount_amount_percent"
                    :label="coupon.is_percent ? t('forms.discount_amount_percent') + ' %' : t('forms.discount_amount_percent')"
                    :rules="[requiredValidator]"
                    type="number"
                    min="0"
                    max="100"
                  />
                </VCol>
              </VRow>
            </VCol>
            <VCol
              cols="12"
              lg="12"
            >
              <VTextField
                v-model="coupon.min_applied_amount"
                :label="t('forms.min_applied_amount')"
                :rules="[requiredValidator]"
                type="number"
                min="0"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
            >
              <VTextField
                v-model="coupon.max_discount"
                :label="t('forms.max_discount')"
                :rules="[requiredValidator]"
                type="number"
                min="0"
              />
            </VCol>
     
            <VCol
              cols="12"
              lg="12"
            >
              <VSwitch
                v-model="coupon.for_clients_only"
                :label="t('forms.for_clients_only')"
              />
              <div v-if="coupon.for_clients_only">
                <VSelect
                  v-model="coupon.client_ids"
                  :items="customers.value"
                  :label="t('forms.customers')"
                  item-title="name"
                  item-value="id"
                  multiple
                  :rules="[requiredValidator]"
                />
              </div>
            </VCol>
            <VCol

              cols="12"
              lg="12"
            >
              <VSwitch
                v-model="coupon.is_by_product"
                :label="t('forms.is_by_product')"
              />
              <div v-if="coupon.is_by_product">
                <VSelect
                  v-model="coupon.product_ids"
                  :items="products.value"
                  :label="t('forms.products')"
                  item-title="name_ar"
                  item-value="id"
                  multiple
                  :rules="[requiredValidator]"
                />
              </div>
            </VCol>
            <VCol
              cols="12"
              lg="12"
            >
              <VSwitch
                v-model="coupon.is_by_country"
                :label="t('forms.is_by_country')"
              />
              <div v-if="coupon.is_by_country">
                <VSelect
                  v-model="coupon.country_ids"
                  :items="countries.value"
                  :label="t('forms.countries')"
                  item-title="name_ar"
                  item-value="id"
                  multiple
                  :rules="[requiredValidator]"
                />
              </div>
            </VCol>
            <VCol cols="12">
              <VSwitch
                v-model="coupon.is_by_city"
                :label="t('forms.is_by_city')"
              />
              <div v-if="coupon.is_by_city">
                <VSelect
                  v-model="coupon.city_ids"
                  :items="cities.value"
                  :label="t('forms.cities')"
                  item-title="name_ar"
                  item-value="id"
                  multiple
                  :rules="[requiredValidator]"
                />
              </div>
            </VCol>
            <VCol
              cols="12"
              lg="12"
            >
              <VSwitch
                v-model="coupon.is_by_category"
                :label="t('forms.is_by_category')"
              />
              <div v-if="coupon.is_by_category">
                <VSelect
                  v-model="coupon.category_parent_ids"
                  :items="categories.value"
                  :label="t('forms.categories')"
                  item-title="type_ar"
                  item-value="id"
                  multiple
                  :rules="[requiredValidator]"
                />
              </div>
            </VCol>
            <VCol
              cols="12"
              lg="12"
            >
              <VSwitch
                v-model="coupon.is_by_subcategory"
                :label="t('forms.is_by_subcategory')"
              />
              <div v-if="coupon.is_by_subcategory">
                <VSelect
                  v-model="coupon.category_child_ids"
                  :items="subCategories.value"
                  :label="t('forms.sub_categories')"
                  item-title="type_ar"
                  item-value="id"
                  multiple
                  :rules="[requiredValidator]"
                />
              </div>
            </VCol>
            <VCol
              cols="12"
              lg="12"
            >
              <VTextField
                v-model="coupon.use_times_per_user"
                :label="t('forms.use_times_per_user')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
            >
              <VTextField
                v-model="coupon.expire_at"
                :label="t('forms.expire_at')"
                :rules="[requiredValidator]"
                type="date"
              />
            </VCol>
            <VCol
              cols="12"
              lg="6"
            >
              <VSwitch
                v-model="coupon.is_active"
                :label="t('forms.is_active')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="6"
            >
              <VSwitch
                v-model="coupon.is_for_all"
                :label="t('forms.is_for_all')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
            >
              <VTextField
                v-model="coupon.foodics_integrate_id"
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

