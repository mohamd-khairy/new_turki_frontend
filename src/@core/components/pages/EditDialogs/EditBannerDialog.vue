<script setup>
import { useBannersStore } from "@/store/Banners"
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
  banner: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'update:isEditOpen',
  'refreshTable',
])

const bannersList = useBannersStore()
const productsList = useProductsStore()
const categoriesList = useCategoriesStore()
const citiesList = useCitiesStore()
const settingsListStore = useSettingsStore()

const { t } = useI18n()

const bannerData = reactive({
  id: null,
  title: null,
  title_color: null,
  sub_title: null,
  sub_title_color: null,
  button_text: null,
  button_text_color: null,
  redirect_url: null,
  is_active: null,
  type: null,
  image: {},
  redirect_mobile_url: null,
  product_id: null,
  category_ids: [],
  city_ids: [],
})

const products = ref([])
const categories = reactive([])
const cities = reactive([])
const isLoading = ref(false)

const types = reactive([
  {
    id: 0,
    name: "بنر عادي",
  },
  {
    id: 1,
    name: "رابط بنر خارجي",
  },
  {
    id: 2,
    name: "رابط بنر داخلي",
  },
])

const statuses = reactive([
  {
    id: 0,
    name: "غير نشط",
  },
  {
    id: 1,
    name: "نشط",
  },
])

const resetForm = () => {
  emit('update:isEditOpen', false)
}

const refForm = ref(null)

watch(() => bannerData.type, (newVal,oldVal) => {
  if (newVal == 0) {
    bannerData.redirect_url = null
    bannerData.product_id = null
  }
  if (newVal == 1) {
    bannerData.product_id = null
  }
  if (newVal == 2) {
    bannerData.redirect_url = null
  }
})

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    bannersList.editBanner(bannerData).then(response => {
      emit('refreshTable')
      emit('update:isEditOpen', false)
      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم تعديل العنصر بنجاح"
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

const _timerProductsId = ref(null)
const isLoadingProducts = ref(false)
const searchProduct = (e) => {
  clearTimeout(_timerProductsId.value)
  _timerProductsId.value = setTimeout(() => {
    isLoadingProducts.value = true
    productsList.fetchProducts({ search: e.target.value}).then(response => {
      products.value = response.data?.data?.data || [];
    })
    .finally(() => {
      isLoadingProducts.value = false
    });
  }, 800);
}

onUpdated(() => {
  categoriesList.fetchCategories().then(response => {
    categories.value = response.data.data
  })
  citiesList.fetchCities().then(response => {
    cities.value = response.data.data
  })
  bannerData.id = props.banner.id,
  bannerData.title = props.banner.title,
  bannerData.title_color = props.banner.title_color,
  bannerData.sub_title = props.banner.sub_title,
  bannerData.sub_title_color = props.banner.sub_title_color,
  bannerData.button_text = props.banner.button_text,
  bannerData.button_text_color = props.banner.button_text_color,
  bannerData.redirect_url = props.banner.redirect_url,
  bannerData.is_active = props.banner.is_active,
  bannerData.type = Number(props.banner.type),
  bannerData.redirect_mobile_url = props.banner.redirect_mobile_url,
  bannerData.product_id = props.banner.product_id,
  bannerData.category_ids = props.banner.categories,
  bannerData.city_ids = props.banner.cities
})
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650 "
    :model-value="props.isEditOpen"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)"/>

    <VCard
      class="pa-sm-9 pa-5"
    >
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon icon="game-icons:vertical-banner" size="24" color="primary"></VIcon>
          <span class="mx-1 my-1">
            {{ t('Edit_Item') }}
          </span>
        </VCardTitle>
      </VCardItem>
      <VCardText>
        <!-- 👉 Form -->
        <VForm ref="refForm" @submit.prevent="onFormSubmit">
          <VRow>
            <VCol
              cols="12"
            >
              <div class="d-flex justify-center align-center">
                <img :src="props.banner.url" alt="" class="banner-logo">
              </div>
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="bannerData.title"
                :label="t('forms.title')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >

              <VSelect
                v-model="bannerData.type"
                :label="t('forms.type')"
                :items="types"
                item-title="name"
                item-value="id"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
              v-if="bannerData.type == 1"
            >
              <VTextField
                v-model="bannerData.redirect_url"
                :label="t('forms.redirect_url')"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="bannerData.is_active"
                :label="t('forms.status')"
                :items="statuses"
                item-title="name"
                item-value="id"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VFileInput
                v-model="bannerData.image"
                :label="t('forms.image')"
                accept="image/*"
                prepend-icon=""
                prepend-inner-icon="mdi-image"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
              v-if="bannerData.type == 2"
            >
              <VSelect
                v-model="bannerData.product_id"
                :items="products"
                :label="t('Products')"
                item-title="name_ar"
                item-value="id"
                :loading="isLoadingProducts"
                :rules="[requiredValidator]"
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
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="bannerData.category_ids"
                :items="categories.value"
                :label="t('forms.categories')"
                item-title="type_ar"
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
                v-model="bannerData.city_ids"
                :label="t('forms.cities')"
                :items="cities.value"
                item-title="name_ar"
                item-value="id"
                multiple
                :rules="[requiredValidator]"
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
                <VIcon icon="mingcute:loading-line" class="loading" size="32"></VIcon>
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

<style>
.banner-logo {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin: 0 auto;
}
</style>
