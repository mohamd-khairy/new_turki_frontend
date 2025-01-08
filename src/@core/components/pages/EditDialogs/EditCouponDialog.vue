<script setup>
import { useCategoriesStore } from "@/store/Categories"
import { useCitiesStore } from "@/store/Cities"
import { useCountriesStore } from "@/store/Countries"
import { useCouponsStore } from "@/store/Coupons"
import { useEmployeesStore } from "@/store/Employees"
import { useProductsStore } from "@/store/Products"
import moment from "moment"

const props = defineProps({
  isEditOpen: {
    type: Boolean,
    required: true,
  },
  coupon: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'refreshTable',
  'update:isEditOpen',
])

import { useSettingsStore } from "@/store/Settings"
import { requiredValidator } from "@validators"
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
const sizes = reactive([])
const countries = reactive([])
const cities = reactive([])
const categories = reactive([])
const subCategories = reactive([])
const customers = reactive([])
const isLoading = ref(false)

onMounted(() => {
  countriesListStore.fetchCountries({ pageSize: -1 }).then(response => {
    countries.value = response.data.data
  })
  citiesListStore.fetchCities({ pageSize: -1 }).then(response => {
    cities.value = response.data.data
  })
  categoriesListStore.fetchCategories({ pageSize: -1 }).then(response => {
    categories.value = response.data.data
  })
  categoriesListStore.fetchSubCategories({ pageSize: -1 }).then(response => {
    subCategories.value = response.data.data
  })
  productsListStore.fetchProductsAll().then(response => {
    products.value = response.data.data
  })
  productsListStore.fetchSizes().then(response => {
    sizes.value = response.data.data
  })
  employeesListStore.fetchCustomers({ pageSize: -1 }).then(response => {
    customers.value = response.data.data.data
  })
})

onUpdated(() => {
  couponData.id = props.coupon.id
  couponData.name = props.coupon.name
  couponData.code = props.coupon.code
  couponData.size_ids = props.coupon.size_ids
  couponData.product_ids = props.coupon.product_ids
  couponData.discount_amount_percent = props.coupon.discount_amount_percent
  couponData.min_applied_amount = props.coupon.min_applied_amount
  couponData.max_discount = props.coupon.max_discount
  couponData.is_for_all = props.coupon.is_for_all == 0 ? false : true
  couponData.is_by_city = props.coupon.is_by_city == 0 ? false : true
  couponData.is_by_size = props.coupon.is_by_size == 0 ? false : true
  couponData.is_by_product = props.coupon.is_by_product == 0 ? false : true
  couponData.is_by_country = props.coupon.is_by_country == 0 ? false : true
  couponData.is_by_category = props.coupon.is_by_category == 0 ? false : true
  couponData.is_by_subcategory = props.coupon.is_by_subcategory == 0 ? false : true
  couponData.is_percent = props.coupon.is_percent == 0 ? false : true
  couponData.for_clients_only = props.coupon.for_clients_only == 0 ? false : true
  couponData.is_active = props.coupon.is_active == 0 ? false : true
  couponData.category_parent_ids = props.coupon.category_parent_ids == "" ? [] : props.coupon.category_parent_ids
  couponData.city_ids = props.coupon.city_ids == "" ? [] : props.coupon.city_ids
  couponData.country_ids = props.coupon.country_ids == "" ? [] : props.coupon.country_ids
  couponData.client_ids = props.coupon.client_ids == "" ? [] : props.coupon.client_ids
  couponData.category_child_ids = props.coupon.category_child_ids == "" ? [] : props.coupon.category_child_ids
  couponData.expire_at =   moment(props.coupon.expire_at).format("YYYY-MM-DD")
  couponData.use_times_per_user = props.coupon.use_times_per_user,
  couponData.foodics_integrate_id = props.coupon.foodics_integrate_id
})

// Variables
const couponData = reactive({
  id: null,
  name: null,
  code: null,
  size_ids: [],
  product_ids: [],
  discount_amount_percent: 0,
  min_applied_amount: 0,
  max_discount: 0,
  is_for_all: 0,
  is_by_city: 0,
  is_by_product: 0,
  is_by_size: 0,
  is_by_country: 0,
  is_by_category: 0,
  is_by_subcategory: 0,
  is_percent: 0,
  for_clients_only: 0,
  is_active: true,
  category_parent_ids: [],
  city_ids: [],
  client_ids: [],
  country_ids: [],
  category_child_ids: [],
  expire_at: null,
  use_times_per_user: 1,
  foodics_integrate_id: null,
})

// Functions
const resetForm = () => {
  emit('update:isEditOpen', false)
}

const refForm = ref(null)

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    couponsListStore.editCoupon(couponData).then(response => {
      emit('update:isEditOpen', false)
      emit('refreshTable')
      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم حذف العنصر بنجاح"
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
    :width="$vuetify.display.smAndDown ? 'auto' : 650"
    persistent
    :model-value="props.isEditOpen"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-9 pa-5">
      <!-- 👉 Title -->
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon
            icon="bxs:coupon"
            size="24"
            color="primary"
          />
          <span class="mx-1 my-1">
            {{ t('Edit_Coupon') }}
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
                v-model="couponData.name"
                :label="t('forms.name')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
            >
              <VTextField
                v-model="couponData.code"
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
                    v-model="couponData.is_percent"
                    :label="t('forms.is_percent')"
                  />
                </VCol>
                <VCol
                  cols="12"
                  sm="9"
                >
                  <VTextField
                    v-model="couponData.discount_amount_percent"
                    :label="couponData.is_percent ? t('forms.discount_amount_percent') + ' %' : t('forms.discount_amount_percent')"
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
                v-model="couponData.min_applied_amount"
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
                v-model="couponData.max_discount"
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
                v-model="couponData.for_clients_only"
                :label="t('forms.for_clients_only')"
              />
              <div v-if="couponData.for_clients_only">
                <VSelect
                  v-model="couponData.client_ids"
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
                v-model="couponData.is_by_product"
                :label="t('forms.is_by_product')"
              />
              <div v-if="couponData.is_by_product">
                <VSelect
                  v-model="couponData.product_ids"
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
                v-model="couponData.is_by_size"
                :label="t('forms.is_by_size')"
              />
              <div v-if="couponData.is_by_size">
                <VSelect
                  v-model="couponData.size_ids"
                  :items="sizes.value"
                  :label="t('forms.sizes')"
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
                v-model="couponData.is_by_country"
                :label="t('forms.is_by_country')"
              />
              <div v-if="couponData.is_by_country">
                <VSelect
                  v-model="couponData.country_ids"
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
                v-model="couponData.is_by_city"
                :label="t('forms.is_by_city')"
              />
              <div v-if="couponData.is_by_city">
                <VSelect
                  v-model="couponData.city_ids"
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
                v-model="couponData.is_by_category"
                :label="t('forms.is_by_category')"
              />
              <div v-if="couponData.is_by_category">
                <VSelect
                  v-model="couponData.category_parent_ids"
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
                v-model="couponData.is_by_subcategory"
                :label="t('forms.is_by_subcategory')"
              />
              <div v-if="couponData.is_by_subcategory">
                <VSelect
                  v-model="couponData.category_child_ids"
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
                v-model="couponData.use_times_per_user"
                :label="t('forms.use_times_per_user')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
            >
              <VTextField
                v-model="couponData.expire_at"
                :label="t('forms.expire_at')"
                :rules="[requiredValidator]"
                type="date"
              />
            </VCol>
            <div class="v-col-lg-12 v-col-12">
              <div
                class="v-input v-input--horizontal v-input--center-affix v-input--density-compact v-locale--is-rtl v-input--dirty v-text-field"
              >
                <div class="v-input__control">
                  <div
                    class="v-field v-field--active v-field--center-affix v-field--dirty v-field--variant-outlined v-theme--light v-locale--is-rtl"
                  >
                    <div class="v-field__overlay" />
                    <div class="v-field__loader">
                      <div
                        class="v-progress-linear v-progress-linear--reverse v-theme--light v-locale--is-rtl"
                        role="progressbar"
                        aria-hidden="true"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style="top: 0; left: 50%; height: 0; transform: translateX(-50%);

  --v-progress-linear-height: 2px;"
                      >
                        <div
                          class="v-progress-linear__background bg-primary"
                          style="width: 100%;"
                        />
                        <div class="v-progress-linear__indeterminate">
                          <div class="v-progress-linear__indeterminate long bg-primary" />
                          <div class="v-progress-linear__indeterminate short bg-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <VCol
              cols="12"
              lg="6"
            >
              <VSwitch
                v-model="couponData.is_active"
                :label="t('forms.is_active')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="6"
            >
              <VSwitch
                v-model="couponData.is_for_all"
                :label="t('forms.is_for_all')"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
              md="6"
            >
              <VTextField
                v-model="couponData.foodics_integrate_id"
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
