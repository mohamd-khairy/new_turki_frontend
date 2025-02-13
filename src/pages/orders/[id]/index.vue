<script setup>
import { hasRole } from '@/helpers'
import AddNewProduct from "@/pages/orders/[id]/AddNewProduct.vue"
import AddProductCoupon from "@/pages/orders/[id]/AddProductCoupon.vue"
import { useCouponsStore } from "@/store/Coupons"
import { useCustomersStore } from "@/store/Customers"
import { useEmployeesStore } from "@/store/Employees"
import { useOrdersStore } from "@/store/Orders"
import { useSettingsStore } from "@/store/Settings"
import {
  requiredValidator,
} from '@validators'
import moment from "moment"

const ordersListStore = useOrdersStore()
const settingsListStore = useSettingsStore()
const couponsStore = useCouponsStore()
const employeesStore = useEmployeesStore()
const customersStore = useCustomersStore()
const route = useRoute()
const { t } = useI18n()

const order = ref({})
const isLoading = ref(true)
const isSubmitting = ref(false)
const isDeleteing = ref(false)
const isEditProductOpen = ref(false)
const isAddCustomerAddressOpen = ref(false)
const customerId = ref(null)

const isAddProductOpen = ref(false)
const isAddProductCouponOpen = ref(false)
const selectedProductItem = ref({})
const productCuts = ref([])
const productSizes = ref([])
const productPreparations = ref([])
const deliveryPeriods = ref([])
const coupons = ref([])
const paymentTypes = ref([])
const refForm = ref(null)
const orderStatus = ref([])
const allOrderStatus = ref([])
const customerAddresses = ref([])
const addedCustomerAddress = ref(null)

const itemData = ref({
  order_state_id: null,
  discount_code: null,
  delivery_date: null,
  delivery_period_id: null,
  payment_type_id: null,
  paid: 0,
  address_id: null,
  delivery_fee: 0,
  boxes_count: 0,
  dishes_count: 0,
  customer_name: null,
  customer_mobile: null,

  // customer_address: null,
  comment: null,
})

const orderCurrency = computed(() => {
  if(order.value.order?.selected_address?.country_id == 4) {
    return 'درهم'
  }

  return 'ريال'
})

const canEditAllFields = computed(() => {
  if(hasRole(['general_manager', 'store_manager', 'admin'])) {
    return true
  }

  return false
})

const removeDiscountCode = () => {
  isDeleteing.value = true
  ordersListStore.removeDiscount(order.value.order.id).then(() => {
    settingsListStore.alertColor = "success"
    settingsListStore.alertMessage = "تم إزالة الكوبون بنجاح"
    settingsListStore.isAlertShow = true
    getOrderDetails()

    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
    }, 2000)
    isDeleteing.value = false
  }).catch(error => {
    isDeleteing.value = false
    settingsListStore.alertColor = "error"
    settingsListStore.alertMessage = "حدث خطأ ما !"
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
    }, 2000)
  })
}

const openProductEdit = item => {
  selectedProductItem.value = item
  isEditProductOpen.value = true
}

const AddNewProductOpen = item => {
  selectedProductItem.value = {
    ...item,
    shalwata: item.shalwata ? 1 : 0,
    is_karashah: item.is_karashah ? 1 : 0,
    is_kwar3: item.is_kwar3 ? 1 : 0,
    is_lyh: item.is_lyh ? 1 : 0,
    is_Ras: item.is_Ras ? 1 : 0,
  }
  isAddProductOpen.value = true
}

const ConvertToArabicNumbers = num => {
  const arabicNumbers = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669"

  return String(num).replace(/[0123456789]/g, d => {
    return arabicNumbers[d]
  })
}

const formatDateTime = data => {
  let date = moment(data).format("DD-MM-YYYY")
  let time = moment(data).format("hh:mm:ss A")

  return { date, time }
}

const getCustomerAddresses = customerId => {
  customersStore.getAddresses(customerId).then(response => {
    customerAddresses.value = response.data?.data || []
  })
}

const addNewCustomerAddress = () => {
  isAddCustomerAddressOpen.value = true
}

const updateNewCustomerAddress = address => {
  customerAddresses.value.unshift(address)
  itemData.value.address_id = address.id
}

const handleDeliveryDate = (date, createdDate) => {
  return moment(date).format("YYYY-MM-DD")
}

const getOrderDetails = () => {
  selectedProductItem.value = {
    shalwata: 0,
    is_karashah: 0,
    is_kwar3: 0,
    is_lyh: 0,
    is_Ras: 0,
  }

  const id = route.params.id

  isLoading.value = true
  ordersListStore.fetchOrder(id).then(response => {
    order.value = response?.data.data

    const orderDetails = response?.data?.data?.order

    if(orderDetails.customer) {
      getCustomerAddresses(orderDetails.customer.id)
    }

    if(orderDetails) {
      customerId.value = orderDetails?.customer_id || null

      itemData.value = {
        id: orderDetails.id,
        customer_name: orderDetails.customer?.name || null,
        customer_mobile: orderDetails.customer?.mobile ? parseInt(orderDetails.customer.mobile) : null,

        // customer_address: orderDetails.customer?.address || null,
        order_state_id: orderDetails.order_state_id,
        discount_code: orderDetails.discount_code,
        delivery_date: handleDeliveryDate(orderDetails.delivery_date, orderDetails.created_at),
        delivery_period_id: orderDetails.delivery_period_id,
        payment_type_id: orderDetails.payment_type_id,
        paid: orderDetails.paid,
        address_id: orderDetails.address_id,
        delivery_fee: orderDetails.delivery_fee,
        boxes_count: orderDetails.boxes_count,
        dishes_count: orderDetails.dishes_count,
        comment: orderDetails.comment,
      }

      addedCustomerAddress.value = orderDetails.address_id
    }
  }).catch(error => {
    console.error(error)
  }).finally (() => {
    isLoading.value = false
  })
}

const deleteProduct = item => {
  isDeleteing.value = true
  ordersListStore.deleteOrderProduct({ order_product_id: item.id }).then(() => {
    settingsListStore.alertColor = "success"
    settingsListStore.alertMessage = "تم إضافة العنصر بنجاح"
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
    }, 2000)
    isDeleteing.value = false
    getOrderDetails()
  }).catch(error => {
    isDeleteing.value = false
    settingsListStore.alertColor = "error"
    settingsListStore.alertMessage = "حدث خطأ ما !"
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
    }, 2000)
  })
}

const onFormSubmit = async () => {
  isSubmitting.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    ordersListStore.editOrder(itemData.value).then(response => {
      getOrderDetails()
      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم تعديل حالة الطلب بنجاح"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
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
      settingsListStore.alertColor = "error"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
      }, 2000)
    }).finally(() => {
      isSubmitting.value = false
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

const _timerCouponsId = ref(null)
const isLoadingCoupons = ref(false)

const searchCoupon = e => {
  clearTimeout(_timerCouponsId.value)
  _timerCouponsId.value = setTimeout(() => {
    isLoadingCoupons.value = true
    couponsStore.fetchCoupons({ search: e.target.value }).then(response => {
      coupons.value = response.data?.data?.data || []
    })
      .finally(() => {
        isLoadingCoupons.value = false
      })
  }, 800)
}

onMounted(() => {
  getOrderDetails()
  ordersListStore.fetchOrderStatus().then(response => {
    orderStatus.value = response.data.data
  })

  settingsListStore.fetchDelivery_Periods().then(response => {
    deliveryPeriods.value = response.data.data
  })

  settingsListStore.fetchPaymentTypes().then(response => {
    paymentTypes.value = response.data.data
  })
  
  settingsListStore.fetchProductCut().then(response => {
    productCuts.value = response.data.data
  })

  settingsListStore.fetchProductSize().then(response => {
    productSizes.value = response.data.data
  })

  settingsListStore.fetchProductPerparation().then(response => {
    productPreparations.value = response.data.data
  })
})
</script>

<template>
  <div>
    <VCard
      v-if="!isLoading"
      class="mb-5 pa-5"
    >
      <VRow>
        <VCol
          cols="12"
        >
          <h2 class="order-title py-2 mb-0">
            <span>طلب رقم</span>
            <span> - </span>
            <span dir="ltr">
              #{{ order ? order.order.ref_no : '*******' }}
            </span>
          </h2>
        </VCol>
      </VRow>
    </VCard>
    <div
      v-if="isLoading"
      class="loader_wrap"
    >
      <img
        src="@/assets/images/logo.png"
        alt="turki"
      >
      <p class="text-2xl">
        جاري جلب البيانات ...
      </p>
    </div>
    <div
      v-else
      class="card-wrapper"
    >
      <div class="card">
        <VCard class="mb-8">
          <VCardText>
            <h2 class="py-2 mb-6">
              <VIcon
                color="primary"
                icon="arcticons:destiny-item-manager"
              />
              <span class="ms-2">
                تفاصيل الطلب
              </span>
            </h2>
            <VRow class="mb-4">
              <VCol
                cols="12"
                md="4"
              >
                <div class="">
                  <VIcon
                    icon="ph:dot-duotone"
                    color="primary"
                    class="ml-2"
                  />
                  <span>
                    تاريخ الطلب :
                  </span>
                  <VChip
                    size="small"
                    class="font-weight-bold"
                  >
                    {{ ConvertToArabicNumbers(formatDateTime(order.order.created_at).date) }}
                  </VChip>
                </div>
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <div class="">
                  <VIcon
                    icon="ph:dot-duotone"
                    color="primary"
                    class="ml-2"
                  />
                  <span>
                    توقيت الطلب :
                  </span>
                  <VChip
                    size="small"
                    class="font-weight-bold"
                  >
                    {{
                      ConvertToArabicNumbers(
                        String(formatDateTime(order.order.created_at).time)
                          .slice(-2)
                          .toLowerCase() == "pm"
                          ? String(formatDateTime(order.order.created_at).time)
                            .slice(0, -2)
                            .toLowerCase() + "مساءاً"
                          : String(formatDateTime(order.order.created_at).time)
                            .slice(0, -2)
                            .toLowerCase() + "صباحاً",
                      )
                    }}
                  </VChip>
                </div>
              </VCol>
            </VRow>
            <VRow class="mb-10">
              <VCol
                cols="12"
                md="4"
              >
                <VIcon
                  icon="ph:dot-duotone"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  المجموع الفرعي للطلب :
                </span>
                <VChip
                  size="small"
                  class="mx-1 font-weight-bold"
                >
                  {{ order ? ConvertToArabicNumbers(order.order.order_subtotal) : ConvertToArabicNumbers(0) }}
                  {{ orderCurrency }}
                </VChip>
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <VIcon
                  icon="ph:dot-duotone"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  المجموع الكلي بعد الخصم :
                </span>
                <VChip
                  size="small"
                  class="font-weight-bold"
                  :class="{'text-error': order['sale price'] === 'undefined', 'text-success': order['sale price'] !== 'undefined' }"
                >
                  {{
                    order.order.total_amount_after_discount !== "undefined" ? ConvertToArabicNumbers(parseFloat(order.order.total_amount_after_discount) + parseFloat(order.order.wallet_amount_used ?? 0)) : ConvertToArabicNumbers(0)
                  }} 
                  {{ orderCurrency }}
                </VChip>
              </VCol>
              <VCol
                cols="12"
                md="4"
              >
                <VIcon
                  icon="ph:dot-duotone"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  الرصيد المستخدم من المحفظة :
                </span>
                <VChip
                  size="small"
                  class="font-weight-bold"
                >
                  {{
                    order.order.wallet_amount_used !== "undefined" ? ConvertToArabicNumbers(order.order.wallet_amount_used) + " " + orderCurrency : "لا يوجد  "
                  }}
                </VChip>
              </VCol>
            </VRow>
            <VForm
              ref="refForm"
              @submit.prevent="onFormSubmit"
            >
              <VRow>
                <VCol
                  v-if="canEditAllFields"
                  cols="12"
                  md="6"
                >
                  <VSelect
                    v-model="itemData.order_state_id"
                    :items="orderStatus"
                    :label="t('forms.order_state')"
                    item-title="customer_state_ar"
                    item-value="code"
                    :rules="[requiredValidator]"
                  />
                </VCol>
                
                <VCol
                  v-if="canEditAllFields"
                  cols="12"
                  md="6"
                >
                  <VRow>
                    <VCol cols="11">
                      <VSelect
                        v-model="itemData.discount_code"
                        :items="coupons"
                        :label="t('forms.coupon')"
                        item-title="name"
                        item-value="code"
                        :loading="isLoadingCoupons"
                      >
                        <template #prepend-item>
                          <VListItem>
                            <VListItemContent>
                              <VTextField
                                placeholder="البحث في الكوبونات"
                                @input="searchCoupon"
                              />
                            </VListItemContent>
                          </VListItem>
                          <VDivider class="mt-2" />
                        </template>
                      </VSelect>
                    </VCol>
                    
                    <VCol
                      v-if="order.order.applied_discount_code"
                      cols="1"
                      class="px-0"
                    >
                      <VTooltip text="إزالة الكوبون من الطلب">
                        <template #activator="{ props }">
                          <VBtn
                            v-bind="props"
                            icon
                            variant="plain"
                            color="error"
                            size="x-small"
                            @click="removeDiscountCode"
                          >
                            <VIcon
                              :size="22"
                              icon="clarity:remove-line"
                            />
                          </VBtn>
                        </template>
                      </VTooltip>
                    </VCol>
                  </VRow>
                </VCol>
                <VCol
                  v-if="canEditAllFields"
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="itemData.delivery_date"
                    type="date"
                    :label="t('forms.delivery_date')"
                  />
                </VCol>
                <VCol
                  v-if="canEditAllFields"
                  cols="12"
                  md="6"
                >
                  <VSelect
                    v-model="itemData.delivery_period_id"
                    :label="t('forms.delivery_time')"
                    :items="deliveryPeriods"
                    item-title="name_ar"
                    item-value="id"
                  />
                </VCol>
                <VCol
                  v-if="canEditAllFields"
                  cols="12"
                  md="6"
                >
                  <VSelect
                    v-model="itemData.payment_type_id"
                    label="طريقة الدفع"
                    :items="paymentTypes"
                    item-title="name_ar"
                    item-value="id"
                  />
                </VCol>
                <VCol
                  v-if="canEditAllFields"
                  cols="12"
                  md="6"
                >
                  <VSelect
                    v-model="itemData.paid"
                    :label="t('forms.payment_status')"
                    :items="[
                      {
                        id: 1,
                        name: 'مدفوع',
                      }, {
                        id: 0,
                        name: 'غير مدفوع',
                      },
                    ]"
                    item-title="name"
                    item-value="id"
                  />
                </VCol>
                <VCol
                  v-if="canEditAllFields"
                  cols="12"
                  md="6"
                >
                  <VRow align="center">
                    <VCol cols="11">
                      <!-- :model-value="addedCustomerAddress" -->
                      <VSelect
                        v-model="itemData.address_id"
                        label="عنوان التوصيل"
                        :items="customerAddresses"
                        item-title="label"
                        item-value="id"
                      />
                    </VCol>
                    <VCol cols="1">
                      <VTooltip text="إضافة عنوان جديد">
                        <template #activator="{ props }">
                          <VBtn
                            v-bind="props"
                            icon
                            variant="plain"
                            color="error"
                            size="x-small"
                            @click="addNewCustomerAddress"
                          >
                            <VIcon
                              :size="30"
                              icon="ei:plus"
                            />
                          </VBtn>
                        </template>
                      </VTooltip>
                    </VCol>
                  </VRow>
                </VCol>
                <VCol
                  v-if="canEditAllFields"
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="itemData.delivery_fee"
                    type="number"
                    min="0"
                    label="مصاريف التوصيل"
                  />
                </VCol>
                <VCol
                  v-if="canEditAllFields"
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="itemData.customer_name"
                    label="اسم العميل"
                  />
                </VCol>
                <VCol
                  v-if="canEditAllFields"
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="itemData.customer_mobile"
                    type="number"
                    min="0"
                    label="رقم جوال العميل"
                  />
                </VCol>
                <!--
                  <VCol
                  v-if="canEditAllFields"
                  cols="12"
                  md="6"
                  >
                  <VTextField
                  v-model="itemData.customer_address"
                  label="عنوان العميل"
                  />
                  </VCol> 
                -->
                <VCol
                  v-if="hasRole(['production_manager', 'production_supervisor'])"
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="itemData.boxes_count"
                    type="number"
                    min="0"
                    label="عدد الكراتين"
                  />
                </VCol>
                <VCol
                  v-if="hasRole(['production_manager', 'production_supervisor'])"
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="itemData.dishes_count"
                    type="number"
                    min="0"
                    label="عدد الأطباق"
                  />
                </VCol>
                <VCol
                  v-if="canEditAllFields"
                  cols="12"
                >
                  <VTextarea
                    v-model="itemData.comment"
                    :label="t('forms.notes')"
                    rows="6"
                  />
                </VCol>
                <VCol
                  cols="12"
                >
                  <VBtn
                    v-if="isSubmitting"
                    type="button"
                    class="position-relative d-flex px-14"
                  >
                    <VIcon
                      icon="mingcute:loading-line"
                      class="loading"
                      size="32"
                    />
                  </VBtn>
                  <VBtn
                    v-else
                    color="primary"
                    class="px-4 d-flex"
                    type="submit"
                  >
                    <VIcon
                      :size="22"
                      icon="material-symbols-light:save-outline"
                    />
                    <span>تحديث الطلب</span>
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
        <VCard>
          <VCardText>
            <div class="order-products">
              <div class="d-flex justify-space-between align-center flex-wrap mb-3">
                <h2 class="py-2">
                  <VIcon
                    color="primary"
                    icon="arcticons:destiny-item-manager"
                  />
                  <span class="ms-2">
                    المنتجات
                  </span>
                </h2>
                <VBtn
                  v-if="canEditAllFields"
                  color="primary"
                  @click="AddNewProductOpen(order.order)"
                >
                  <VIcon
                    :size="22"
                    icon="lets-icons:add-light"
                  />
                  <span>إضافة منتج جديد</span>
                </VBtn>
              </div>
              <div class="products-list">
                <div class="product table-responsive">
                  <VTable class="table">
                    <thead>
                      <tr class="border-b-sm">
                        <th>
                          الاسم
                        </th>
                        <th>
                          الأحجام
                        </th>
                        <th>
                          التقطيع
                        </th>
                        <th>
                          التجهيز
                        </th>
                        <th>
                          الكمية
                        </th>
                        <th>الكرشة</th>
                        <th>الكوارع</th>
                        <th>اللية</th>
                        <th>الرأس</th>
                        <th>الشلوطة</th>
                        <th>
                          السعر
                        </th>
                        <th v-if="canEditAllFields">
                          الاجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="product in order.products"
                        :key="product.id"
                        style=" border-bottom: 1px solid;"
                      >
                        <td class="px-2">
                          <span>{{ product.product ? product.product.name_ar : "لا يوجد اسم" }}</span>
                        </td>
                        <td>{{ product.size ? product.size.name_ar : "لا يوجد" }}</td>
                        <td>{{ product.cut ? product.cut.name_ar : "لا يوجد" }}</td>
                        <td>{{ product.preparation ? product.preparation.name_ar : "لا يوجد" }}</td>
                        <td class="px-2">
                          <span class="d-block  text-base">
                            {{ ConvertToArabicNumbers(product.quantity) }}
                          </span>
                        </td>
                        <td>{{ product.is_karashah ? "بدون" : "" }}</td>
                        <td>{{ product.is_kwar3 ? "بدون" : "" }}</td>
                        <td>{{ product.is_lyh ? "بدون" : "" }}</td>
                        <td>{{ product.is_Ras ? "بدون" : "" }}</td>
                        <td>{{ product.shalwata ? "مع شلوطة" : "بدون" }}</td>
                  
                        <td class="px-2">
                          <span class="text-success whitespace-nowrap font-weight-bold">
                            {{ product.total_price ? ConvertToArabicNumbers(Intl.NumberFormat().format(product.total_price)) + orderCurrency : "غير معروف" }} 
                          </span>
                        </td>
                        <td v-if="canEditAllFields">
                          <div class="d-flex align-center gap-2">
                            <VTooltip text="تعديل المنتج">
                              <template #activator="{ props }">
                                <VBtn
                                  v-bind="props"
                                  icon
                                  variant="plain"
                                  color="default"
                                  size="x-small"
                                  @click="openProductEdit(product)"
                                >
                                  <VIcon
                                    :size="22"
                                    icon="ph:pencil-line"
                                  />
                                </VBtn>
                              </template>
                            </VTooltip>
                            <VTooltip text="حذف المنتج">
                              <template #activator="{ props }">
                                <VBtn
                                  v-bind="props"
                                  icon
                                  variant="plain"
                                  color="default"
                                  size="x-small"
                                  @click="deleteProduct(product)"
                                >
                                  <VIcon
                                    v-if="!isDeleteing"
                                    :size="22"
                                    icon="mingcute:delete-line"
                                  />
                                  <VIcon
                                    v-else
                                    icon="mingcute:loading-line"
                                    class="loading"
                                    size="32"
                                  />
                                </VBtn>
                              </template>
                            </VTooltip>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </VTable>
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </div>
    </div>
    <AddNewProduct
      v-if="isAddProductOpen"
      v-model:isAddOpen="isAddProductOpen"
      :order="selectedProductItem"
      :sizes="productSizes"
      :cuts="productCuts"
      :preparations="productPreparations"
      @refreshTable="getOrderDetails"
    />
    <AddProductCoupon
      v-if="isAddProductCouponOpen"
      v-model:isAddOpen="isAddProductCouponOpen"
      @addProductCoupon="addProductCoupon"
    />

    <EditOrderItemDialog
      v-if="isEditProductOpen"
      v-model:isEditProductOpen="isEditProductOpen"
      :item="selectedProductItem"
      :sizes="productSizes"
      :cuts="productCuts"
      :preparations="productPreparations"
      @refreshTable="getOrderDetails"
    />

    <AddCustomerAddressDialog
      v-if="isAddCustomerAddressOpen"
      v-model:is-add-open="isAddCustomerAddressOpen"
      :customer-id="customerId"
      @refreshTable="updateNewCustomerAddress"
    />
  </div>
</template>

<style scoped lang="scss">
.loader_wrap {
  text-align: center;

  img {
    inline-size: 300px;
    margin-block: 0;
    margin-inline: auto;
  }

  p {
    margin-block-start: 0;
  }
}

img {
  display: block;
  inline-size: 100%;
}

.img-display {
  overflow: hidden;
  max-inline-size: 500px;
}

.img-showcase {
  display: flex;
  inline-size: 100%;
  transition: all 0.5s ease;
}

.img-showcase img {
  min-inline-size: 100%;
}

.img-select {
  display: flex;
}

.img-item {
  margin: 0.3rem;
}

.img-item:nth-child(1),
.img-item:nth-child(2),
.img-item:nth-child(3) {
  margin-inline-end: 0;
}

.img-item:hover {
  opacity: 0.8;
}

.order-content {
  padding-block: 2rem;
  padding-inline: 1rem;
}

.order-title {
  position: relative;
  font-size: 2rem;
  font-weight: 700;
  inline-size: fit-content;
  text-transform: capitalize;
}

// .order-title::after {
//   position: absolute;
//   background: rgb(var(--v-global-theme-primary));
//   block-size: 4px;
//   content: "";
//   inline-size: 50%;
//   inset-block-end: 0;
//   inset-inline-end: 50%;
// }

.order-detail h2 {
  position: relative;
  inline-size: fit-content;
  margin-block-end: 20px;
}

.order-detail h2::after {
  position: absolute;
  background: rgb(var(--v-global-theme-primary));
  block-size: 4px;
  content: "";
  inline-size: 100%;
  inset-block-end: 0;
  inset-inline-end: 0;
}

.order-link {
  display: inline-block;
  background: #256eff;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 400;
  margin-block-end: 0.5rem;
  padding-block: 0;
  padding-inline: 0.3rem;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.5s ease;
}

@media screen and (min-width: 992px) {
  .card {
    //display: grid;
    //grid-gap: 1rem;
    //grid-template-columns: 2fr 2fr;
  }

  .card-wrapper {
    align-items: center;

    //height: 100vh;
    //display: flex;
    justify-content: center;
  }

  .order-imgs {
    max-inline-size: 500px;
  }

  .order-content {
    padding-block-start: 0;
  }
}
</style>
