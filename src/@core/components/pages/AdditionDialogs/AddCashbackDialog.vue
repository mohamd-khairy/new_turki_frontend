<script setup>
import { useCashbackStore } from "@/store/Cashback"
import { useCategoriesStore } from "@/store/Categories"
import { useCitiesStore } from "@/store/Cities"
import { useCountriesStore } from "@/store/Countries"
import { useEmployeesStore } from "@/store/Employees"
import { useProductsStore } from "@/store/Products"

import {
  requiredValidator,
} from '@validators'
import { ref, watch } from 'vue'


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
const employeesListStore = useEmployeesStore()
const settingsListStore = useSettingsStore()
const cashbackStore = useCashbackStore()

const countries = reactive([])
const cities = reactive([])
const filterdCities = reactive([])
const categories = reactive([])
const filteredCategories = reactive([])
const subCategories = reactive([])
const filteredSubCategories = reactive([])
const products = reactive([])
const filteredProducts = reactive([])
const customers = reactive([])
const isLoading = ref(false)
const refForm = ref(null)

const is_by_customer = ref(false)
const is_by_product = ref(false)
const is_by_country = ref(false)
const is_by_city = ref(false)
const is_by_category = ref(false)
const is_by_subcategory = ref(false)

const searchCity = ref('')
const searchCustomer = ref('')
const searchCategory = ref('')
const searchSubCategory = ref('')
const searchProduct = ref('')
const _timerId = ref(null)
const isLoadingCustomers = ref(false)

onMounted(() => {
  countriesListStore.fetchCountries({}).then(response => {
    countries.value = response.data.data
  })
  citiesListStore.fetchCities({ pageSize: -1 , country_id: cashback.country_id }).then(response => {
    cities.value = response.data.data
  })
  categoriesListStore.fetchCategories({ pageSize: -1 , country_id: cashback.country_id }).then(response => {
    categories.value = response.data.data
  })
  categoriesListStore.fetchSubCategories({ pageSize: -1 , country_id: cashback.country_id }).then(response => {
    subCategories.value = response.data.data
  })
  productsListStore.fetchProductsAll({ pageSize: -1 , country_id: cashback.country_id }).then(response => {
    products.value = response.data.data
  })
})

// Variables
const cashback = reactive({
  cash_back_amount: null,
  cash_back_start_date: null,
  cash_back_end_date: null,
  is_active: true,
  country_id: 1,
  city_ids: [],
  category_ids: [],
  sub_category_ids: [],
  customer_ids: [],
  product_ids: [],
})

// Functions
const resetForm = () => {
  emit('update:isAddOpen', false)
}

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    cashback.city_ids = is_by_city.value ? cashback.city_ids : []
    cashback.category_ids = is_by_category.value ? cashback.category_ids : []
    cashback.sub_category_ids = is_by_subcategory.value ? cashback.sub_category_ids : []
    cashback.customer_ids = is_by_customer.value ? cashback.customer_ids : []
    cashback.product_ids = is_by_product.value ? cashback.product_ids : []

    cashbackStore.storeCashback(cashback).then(response => {
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

watch(() => cashback.country_id, () => {
  citiesListStore.fetchCities({ pageSize: -1 , country_id: cashback.country_id }).then(response => {
    cities.value = response.data.data
  })
  categoriesListStore.fetchCategories({ pageSize: -1 , country_id: cashback.country_id }).then(response => {
    categories.value = response.data.data
  })
  categoriesListStore.fetchSubCategories({ pageSize: -1 , country_id: cashback.country_id }).then(response => {
    subCategories.value = response.data.data
  })
  productsListStore.fetchProductsAll({ pageSize: -1 , country_id: cashback.country_id }).then(response => {
    products.value = response.data.data
  })
})

watch(() => searchCity.value, () => {
  clearTimeout(_timerId.value)

  _timerId.value = setTimeout(() => {
    filterdCities.value = cities.value.filter(city =>
      city.name_ar.includes(searchCity.value),
    )
  }, 800)
})

watch(() => searchCategory.value, () => {
  clearTimeout(_timerId.value)

  _timerId.value = setTimeout(() => {
    filteredCategories.value = categories.value.filter(category =>
      category.type_ar.includes(searchCategory.value),
    )
  }, 800)
})

watch(() => searchSubCategory.value, () => {
  clearTimeout(_timerId.value)

  _timerId.value = setTimeout(() => {
    filteredSubCategories.value = subCategories.value.filter(subCategory =>
      subCategory.type_ar.includes(searchSubCategory.value),
    )
  }, 800)
})

watch(() => searchProduct.value, () => {
  clearTimeout(_timerId.value)

  _timerId.value = setTimeout(() => {
    filteredProducts.value = products.value.filter(product =>
      product.name_ar.includes(searchProduct.value),
    )
  }, 800)
})

watch(() => searchCustomer.value, () => {
  clearTimeout(_timerId.value)

  _timerId.value = setTimeout(() => {

    isLoadingCustomers.value = true
    customers.value = []
    employeesListStore.fetchCustomers({ search: searchCustomer.value, wallet: "all", country_id: cashback.country_id })
      .then(response => {
        customers.value = response.data?.data?.data || []
      })
      .finally(() => {
        isLoadingCustomers.value = false
      })
  }, 800)
})
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650"
    persistent
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
            icon="bxs:cashback"
            size="24"
            color="primary"
          />
          <span class="mx-1 my-1">
            {{ t('Add_cashback') }}
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
                v-model="cashback.cash_back_amount"
                :label="t('forms.cash_back_amount')"
                :rules="[requiredValidator]"
                type="number"
              />
            </VCol>
            <VCol
              cols="6"
              lg="6"
            >
              <VTextField
                v-model="cashback.cash_back_start_date"
                :label="t('forms.cash_back_start_date')"
                type="date"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="6"
              lg="6"
            >
              <VTextField
                v-model="cashback.cash_back_end_date"
                :label="t('forms.cash_back_end_date')"
                type="date"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              lg="12"
            >
              <VTextField
                v-model="cashback.expired_days"
                :label="t('forms.expired_days')"
                type="number"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
            >
              <VSelect
                v-model="cashback.country_id"
                :items="countries.value"
                :label="t('forms.countries')"
                item-title="name_ar"
                item-value="id"
                :disabled="isLoading"
              />
            </VCol>
            <VCol cols="12">
              <VSwitch
                v-model="is_by_city"
                :label="t('forms.is_by_city')"
              />
              <div v-if="is_by_city">
                <VSelect
                  v-model="cashback.city_ids"
                  :items="searchCity ? filterdCities.value : cities.value"
                  placeholder="ابحث باسم المدينة"
                  item-title="name_ar"
                  item-value="id"
                  :disabled="isLoading"
                  multiple
                  clearable
                >
                  <template #prepend-item>
                    <VTextField
                      v-model="searchCity"
                      type="text"
                      class="mx-2"
                      clearable
                      placeholder="ابحث باسم المدينة"
                    />
                    <VDivider class="mt-2" />
                  </template>
                </VSelect>
              </div>
            </VCol>
            <VCol
              cols="12"
              lg="12"
            >
              <VSwitch
                v-model="is_by_customer"
                :label="t('forms.is_by_customer')"
              />
              <div v-if="is_by_customer">
                <VSelect
                  v-model="cashback.customer_ids"
                  :items="customers.value"
                  label="البحث باسم أو رقم جوال العميل"
                  item-title="name_mobile"
                  item-value="id"
                  :disabled="isLoading || isLoadingCustomers"
                  :loading="isLoadingCustomers"
                  multiple
                >
                  <template #prepend-item>
                    <VTextField
                      v-model="searchCustomer"
                      type="text"
                      class="mx-2"
                      clearable
                      placeholder="ابحث باسم أو رقم جوال العميل"
                    />
                    <VDivider class="mt-2" />
                  </template>
                </VSelect>
              </div>
            </VCol>
            <VCol
              cols="12"
              lg="12"
            >
              <VSwitch
                v-model="is_by_product"
                :label="t('forms.is_by_product')"
              />
              <div v-if="is_by_product">
                <VSelect
                  v-model="cashback.product_ids"
                  :items="searchProduct ? filteredProducts.value : products.value"
                  placeholder="ابحث باسم المنتج"
                  item-title="name_ar"
                  item-value="id"
                  :disabled="isLoading"
                  multiple
                  clearable
                >
                  <template #prepend-item>
                    <VTextField
                      v-model="searchProduct"
                      type="text"
                      class="mx-2"
                      clearable
                      placeholder="ابحث باسم المنتج"
                    />
                    <VDivider class="mt-2" />
                  </template>
                </VSelect>
              </div>
            </VCol>

            <VCol
              cols="12"
              lg="12"
            >
              <VSwitch
                v-model="is_by_category"
                :label="t('forms.is_by_category')"
              />
              <div v-if="is_by_category">
                <VSelect
                  v-model="cashback.category_ids"
                  :items="searchCategory ? filteredCategories.value : categories.value"
                  placeholder="ابحث باسم الفئة"
                  item-title="type_ar"
                  item-value="id"
                  :disabled="isLoading"
                  multiple
                  clearable
                >
                  <template #prepend-item>
                    <VTextField
                      v-model="searchCategory"
                      type="text"
                      class="mx-2"
                      clearable
                      placeholder="ابحث باسم الفئة"
                    />
                    <VDivider class="mt-2" />
                  </template>
                </VSelect>
              </div>
            </VCol>

            <VCol
              cols="12"
              lg="12"
            >
              <VSwitch
                v-model="is_by_subcategory"
                :label="t('forms.is_by_subcategory')"
              />
              <div v-if="is_by_subcategory">
                <VSelect
                  v-model="cashback.sub_category_ids"
                  :items="searchSubCategory ? filteredSubCategories.value : subCategories.value"
                  placeholder="ابحث باسم الفئة الفرعيه"
                  item-title="type_ar"
                  item-value="id"
                  :disabled="isLoading"
                  multiple
                  clearable
                >
                  <template #prepend-item>
                    <VTextField
                      v-model="searchSubCategory"
                      type="text"
                      class="mx-2"
                      clearable
                      placeholder="ابحث باسم الفئة الفرعيه"
                    />
                    <VDivider class="mt-2" />
                  </template>
                </VSelect>
              </div>
            </VCol>

            <VCol
              cols="12"
              lg="6"
            >
              <VSwitch
                v-model="cashback.is_active"
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
