<template>
  <div>
    <CashierInvoice ref="orderContainerRef" />
    <div
      v-if="isLoading"
      class="loader_wrap"
    >
      <img
        src="@/assets/images/logo.png"
        alt="turki"
      >
      <p class="text-2xl">
        جاري جلب بيانات الفاتورة ...
      </p>
    </div>
    <div v-else>
      <div class="card-wrapper invoice-container">
        <h1 class="text-2xl mb-4 font-semibold">
          من فضلك قم بتحديد المنتجات التي تريد استرجاعها
        </h1>
        <VRow>
          <VCol>
            <VTable class="mb-4">
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="font-weight-semibold"
                  >
                    <VCheckbox
                      v-if="needToRefund"
                      v-model="allOrdersSelected"
                      @update:modelValue="selectAllOrders"
                    />
                  </th>
                  <th class="text-base">
                    المنتج
                  </th>
                  <th class="text-base">
                    الحجم
                  </th>
                  <th class="text-base">
                    الكمية
                  </th>
                  <th class="text-base">
                    التقطيع
                  </th>
                  <th class="text-base">
                    التجهيز
                  </th>
                  <!--
                    <th>الكرشة</th>
                    <th>الكوارع</th>
                    <th>اللية</th>
                    <th>الرأس</th>
                  -->
                  <th class="text-base">
                    الشلوطة
                  </th>
                  <th class="text-base">
                    السعر
                  </th>
                  <th class="text-base">
                    الاجمالي
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="product in orderDetails?.products"
                  :key="product.id"
                >
                  <td>
                    <VCheckbox
                      v-if="!product.is_refund"
                      v-model="product.selected"
                      @click="selectOrders(product)"
                    />
                    <VChip
                      v-else
                      class="text-error"
                    >
                      مرتجع
                    </VChip>
                  </td>
                  <td><small>{{ product.product ? product.product.name_ar : "لا يوجد" }}</small></td>
                  <td>
                    <small>
                      {{ product.size ? product.size.name_ar : "لا يوجد" }}</small>
                  </td>
                  <td>
                    <small>
                      {{ product.quantity ? product.quantity : "لا يوجد" }}</small>
                  </td>
                  <td>
                    <small>
                      {{ product.cut ? product.cut.name_ar : "لا يوجد" }}</small>
                  </td>
                  <td>
                    <small>
                      {{ product.preparation ? product.preparation.name_ar : "لا يوجد" }}</small>
                  </td>

                  <td>
                    <small>
                      {{ product.shalwata ? "مع شلوطة" : "بدون" }}</small>
                  </td>
                  <td>
                    <small>
                      {{ product.price ? ConvertToArabicNumbers(product.price) :
                        ConvertToArabicNumbers(product.total_price / product.quantity) }}</small>
                  </td>
                  <td>
                    <small>
                      {{ product.total_price ? ConvertToArabicNumbers(product.total_price) : "لا يوجد" }}</small>
                  </td>
                </tr>
              </tbody>
            </VTable>
          </VCol>
        </VRow>
      </div>
      <div class="buttons">
        <AppButton
          v-if="oneOrderSelected"
          type="primary"
          title="حفظ"
          @click="refundOrder"
        />
        <AppButton
          type="close"
          title="رجوع"
          @click="$router.push('/cashier/orders')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import CashierInvoice from '@/@core/components/CashierInvoice.vue'
import { useCashierStore } from '@/store/Cashier'
import { useSettingsStore } from "@/store/Settings"
import { useRouter } from 'vue-router'


const router = useRouter()
const orderDetails = ref({})
const cashierStore = useCashierStore()
const route = useRoute()
const isLoading = ref(true)
const orderContainerRef = ref(null)
const allOrdersSelected = ref(false)
const oneOrderSelected = ref(false)
const needToRefund = ref(false)
const settingsListStore = useSettingsStore()


const selectAllOrders = selectedAll => {

  orderDetails.value.products.value = orderDetails.value.products.map(product => {
    product.selected = selectedAll

    return product
  })

  checkSelectedOrder()
}

const selectOrders = product => {
  product.selected = !product.selected

  checkSelectedOrder()
}

const refundOrder = () => {
  const selectedProducts = orderDetails.value.products.filter(product => product.selected).map(product => product.id)

  cashierStore.refundOrder(orderDetails.value.order.ref_no, selectedProducts).then(response => {
    if(response.data){

      settingsListStore.alertMessage = "تم استرجاع الطلب بنجاح"
      settingsListStore.alertColor = "success"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
      }, 2000)

      // window.location.href = '/cashier/orders'
      router.push('/cashier/orders')

    }
  }).catch(error => {
    console.log(error)
  })

}


const ConvertToArabicNumbers = num => {
  const arabicNumbers = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669"

  return String(num).replace(/[0123456789]/g, d => {
    return arabicNumbers[d]
  })
}


const getOrderDetails = async () => {
  await cashierStore.orderDetails(route.params.id).then(response => {
    orderDetails.value = response?.data
    checkCountRefund()

  }).catch(error => {
    console.log(error)
  }).finally(() => {
    isLoading.value = false

  })
}

onMounted(function () {
  getOrderDetails()

})

const checkSelectedOrder = () => {

  if (orderDetails.value.products.some(product => product.selected)) {
    oneOrderSelected.value = true
  }else{
    oneOrderSelected.value = false
    allOrdersSelected.value = false
  }

  if (orderDetails.value.products.every(product => product.selected)) {
    allOrdersSelected.value = true
  }

}

const checkCountRefund = () => {
  orderDetails.value.products.map(product => {
    if (!product.is_refund) {
      needToRefund.value = true
    }
  })
}
</script>



<style scoped lang="scss">
.hidden {
  display: none !important;
}

.invoice-container {
  .text-base {
    font-size: 1rem !important;
    font-weight: 600;
  }
}

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

table thead th {
  border-block-start: 1px solid;
  font-size: 1rem;
  font-weight: 600;

  small {
    font-size: 1rem;
    font-weight: 600;
  }
}

table tbody td {
  border-block-end: 1px solid;
  border-block-start: 1px solid;
  font-size: 1rem;

  small {
    font-size: 1rem;
    font-weight: 600;
  }
}

table th {
  border-inline-end: 1px solid;
  border-inline-start: 1px solid;
}

table td {
  border-inline-end: 1px solid;
  border-inline-start: 1px solid;
}
</style>
