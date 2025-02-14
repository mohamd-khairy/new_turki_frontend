<script setup>
import { useCategoriesStore } from "@/store/Categories"
import { useCitiesStore } from "@/store/Cities"
import { useCountriesStore } from "@/store/Countries"
import { useEmployeesStore } from "@/store/Employees"
import { useNotificationsStore } from "@/store/Notifications"
import { useProductsStore } from "@/store/Products"
import { useSettingsStore } from "@/store/Settings"
import { useI18n } from "vue-i18n"
import { VTextarea } from "vuetify/lib/components/index.mjs"

const { t } = useI18n()
const citiesListStore = useCitiesStore()
const countriesListStore = useCountriesStore()
const categoriesListStore = useCategoriesStore()
const productsListStore = useProductsStore()
const notificationsListStore = useNotificationsStore()
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
  productsListStore.fetchSizes({}).then(response => {
    sizes.value = response.data.data
  })
  employeesListStore.fetchCustomers({ pageSize: -1 }).then(response => {
    customers.value = response.data.data.data
  })
})

// Variables
const notification = reactive({
  title: null,
  scheduled_at: null,
  body: null,
  product_ids: [],
  size_ids: [],
  is_for_all: 0,
  is_by_city: 0,
  is_by_product: 0,
  is_by_country: 0,
  is_by_category: 0,
  is_by_subcategory: 0,
  for_clients_only: 0,
  category_parent_ids: [],
  city_ids: [],
  country_ids: [],
  client_ids: [],
  category_child_ids: [],
})


const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    notificationsListStore.pushNotifications(notification).then(response => {
      isLoading.value = false

      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم ارسال الاشعار بنجاح"
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
</script>

<template>
  <div>
    <VCard :loading="isLoading">
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon
            icon="bxs:notification"
            size="24"
            color="primary"
          />
          <span class="mx-1 my-1">
            ارسال اشعار
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
                v-model="notification.title"
                label="عنوان الاشعار"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              lg="12"
            >
              <VTextarea
                v-model="notification.body"
                label="نص الاشعار"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              lg="12"
            >
              <VTextField
                v-model="notification.scheduled_at"
                label="وقت الارسال"
                type="datetime-local"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="6"
              lg="6"
            >
              <VSwitch
                v-model="notification.is_for_all"
                :label="t('forms.is_for_all')"
              />
            </VCol>

            <VCol
              v-if="!notification.is_for_all"
              cols="6"
              lg="6"
            >
              <VSwitch
                v-model="notification.for_clients_only"
                :label="t('forms.for_clients_only')"
              />
              <div v-if="notification.for_clients_only">
                <VSelect
                  v-model="notification.client_ids"
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
              v-if="!notification.is_for_all"
              cols="6"
              lg="6"
            >
              <VSwitch
                v-model="notification.is_by_product"
                :label="t('forms.is_by_product')"
              />
              <div v-if="notification.is_by_product">
                <VSelect
                  v-model="notification.product_ids"
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
              v-if="!notification.is_for_all"
              cols="6"
              lg="6"
            >
              <VSwitch
                v-model="notification.is_by_size"
                :label="t('forms.is_by_size')"
              />
              <div v-if="notification.is_by_size">
                <VSelect
                  v-model="notification.size_ids"
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
              v-if="!notification.is_for_all"
              cols="6"
              lg="6"
            >
              <VSwitch
                v-model="notification.is_by_country"
                :label="t('forms.is_by_country')"
              />
              <div v-if="notification.is_by_country">
                <VSelect
                  v-model="notification.country_ids"
                  :items="countries.value"
                  :label="t('forms.countries')"
                  item-title="name_ar"
                  item-value="id"
                  multiple
                  :rules="[requiredValidator]"
                />
              </div>
            </VCol>
            <VCol
              v-if="!notification.is_for_all"
              cols="6"
              lg="6"
            >
              <VSwitch
                v-model="notification.is_by_city"
                :label="t('forms.is_by_city')"
              />
              <div v-if="notification.is_by_city">
                <VSelect
                  v-model="notification.city_ids"
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
              v-if="!notification.is_for_all"
              cols="6"
              lg="6"
            >
              <VSwitch
                v-model="notification.is_by_category"
                :label="t('forms.is_by_category')"
              />
              <div v-if="notification.is_by_category">
                <VSelect
                  v-model="notification.category_parent_ids"
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
              v-if="!notification.is_for_all"
              cols="6"
              lg="6"
            >
              <VSwitch
                v-model="notification.is_by_subcategory"
                :label="t('forms.is_by_subcategory')"
              />
              <div v-if="notification.is_by_subcategory">
                <VSelect
                  v-model="notification.category_child_ids"
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
  </div>
</template>
