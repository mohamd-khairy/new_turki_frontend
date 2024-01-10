<script setup>
import { useProductsStore } from "@/store/Products"
import { useSettingsStore } from "@/store/Settings"
import { useI18n } from "vue-i18n"

const props = defineProps({
  isAddOpen: {
    type: Boolean,
    required: true,
  },
  item: {
    type: Object,
    required: true,
  },
  itemSaved: {
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
  'addProductQuantity',
])

const { t } = useI18n()
const settingsListStore = useSettingsStore()
const productsListStore = useProductsStore()


const productCuts = ref([])
const productSizes = ref([])
const productPreparations = ref([])

const itemData = reactive({
  id: null,
  quantity: 1,
  cut_id: null,
  size_id: null,
  preparation_id: null,
  shalwata: 0,
  is_karashah: 0,
  is_kwar3: 0,
  is_lyh: 0,
  is_Ras: 0,
})

const isLoadingCuts = ref(false)
const isLoadingSizes = ref(false)
const isLoadingPreparations = ref(false)

const resetForm = () => {
  itemData.quantity = 1
  itemData.cut_id = null
  itemData.size_id = null
  itemData.preparation_id = null
  itemData.shalwata = 0
  itemData.is_karashah = 0
  itemData.is_kwar3 = 0
  itemData.is_lyh = 0
  itemData.is_Ras = 0
  productCuts.value = []
  productSizes.value = []
  productPreparations.value = []
  emit('update:isAddOpen', false)
}

const onFormSubmit = () => {
  emit('addProductQuantity', itemData)
  // emit('update:isAddOpen', false)
  resetForm()
}

const dialogModelValueUpdate = val => {
  resetForm()
  emit('update:isAddOpen', val)
}

onUpdated(() => {
  isLoadingCuts.value = true
  isLoadingSizes.value = true
  isLoadingPreparations.value = true
  itemData.id = props.item.id
  itemData.quantity = props.itemSaved.quantity
  itemData.cut_id = props.itemSaved.cut_id
  itemData.size_id = props.itemSaved.size_id
  itemData.preparation_id = props.itemSaved.preparation_id
  if(props.item) {
    if(props.item.id) {
      productsListStore.fetchProduct(props.item.id).then(response => {
        productPreparations.value = response.data.data.preparations
        productSizes.value = response.data.data.sizes
        productCuts.value = response.data.data.cuts
        isLoadingCuts.value = false
        isLoadingSizes.value = false
        isLoadingPreparations.value = false
      })
    }
  }
})
</script>

<template>
  <div>
    <VDialog
      :width="$vuetify.display.smAndDown ? 'auto' : 650 "
      :model-value="props.isAddOpen"
      @update:model-value="dialogModelValueUpdate"
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

      <VCard
        :loading="isLoadingCuts || isLoadingSizes || isLoadingPreparations"
        class="pa-sm-9 pa-5"
      >
        <VCardItem>
          <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
            <VIcon icon="solar:tag-broken" size="24"
                   color="primary"
            ></VIcon>
            <span class="mx-1 my-1">
            {{ t('Add_Quantity') }}
          </span>
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <!-- 👉 Form -->
          <VForm @submit.prevent="onFormSubmit" ref="bannerData">
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="itemData.quantity"
                  :label="t('forms.quantity')"
                />
              </VCol>
              <VCol cols="12"
                    md="6">
                <VSelect
                  v-model="itemData.cut_id"
                  :items="productCuts"
                  :label="t('forms.product_cut')"
                  item-title="name_ar"
                  item-value="id"
                  :disabled="isLoadingCuts"
                />
              </VCol>
              <VCol cols="12"
                    md="6">
                <VSelect
                  v-model="itemData.size_id"
                  :items="productSizes"
                  :label="t('forms.product_size')"
                  item-title="name_ar"
                  item-value="id"
                  :disabled="isLoadingSizes"
                />
              </VCol>
              <VCol cols="12"
                    md="6">
                <VSelect
                  v-model="itemData.preparation_id"
                  :items="productPreparations"
                  :label="t('forms.product_preparation')"
                  item-title="name_ar"
                  item-value="id"
                  :disabled="isLoadingPreparations"
                />
              </VCol>
              <VCol cols="12"
                md="6"
                class="d-flex gap-9"
              >
                <v-checkbox label="مع شلوطة"
                v-model="itemData.shalwata"
                :false-value="0" :true-value="1"
                ></v-checkbox>
                <v-checkbox label="بدون كرشة"
                v-model="itemData.is_karashah"
                :false-value="0" :true-value="1"
                ></v-checkbox>
              </VCol>
              <VCol cols="12"
              md="6"
                class="d-flex gap-9"
              >
                <v-checkbox label="بدون كوارع"
                v-model="itemData.is_kwar3"
                :false-value="0" :true-value="1"
                ></v-checkbox>
                <v-checkbox label="بدون ليه"
                v-model="itemData.is_lyh"
                :false-value="0" :true-value="1"
                ></v-checkbox>
              </VCol>
              <VCol cols="12"
              md="6"
              class="d-flex gap-10 mb-4"
              >
                <v-checkbox label="بدون رأس"
                v-model="itemData.is_Ras"
                :false-value="0" :true-value="1"
                ></v-checkbox>
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
  </div>
</template>
