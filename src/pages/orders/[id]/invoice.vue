<script setup>
import { useOrdersStore } from "@/store/Orders"
import moment from "moment"

const value = ref('qrcode')

const ordersListStore = useOrdersStore()
const route = useRoute()
const router = useRouter()

const order = ref({})
const isLoading = ref(true)
const isEditOpen = ref(false)

const { t } = useI18n()

const i18n = useI18n()

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

const printOrder = () => {
  window.print()
}

const orderCurrency = computed(() => {
  if(order.value.order?.selected_address?.country_id == 4) {
    return 'درهم'
  }

  return 'ريال'
})

const isUAEOrder = computed(() => order.value.order?.selected_address?.country_id == 4)

const getOrderDetails = id => {
  ordersListStore.fetchOrder(id).then(response => {
    order.value = response?.data.data
    isLoading.value = false

    setTimeout(() => {
      printOrder()
    }, 500)
  }).catch(error => {
    isLoading.value = false
  }).finally(() => {
    setTimeout(() => {
      // router.push(`/orders`)
      window.close()
    }, 1500)
  })
}

const getTodayDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1 // Months are zero-indexed, so add 1
  const day = today.getDate()
  
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}

const formatCreatedDate = createdDate => {
  const formatedDate = moment(createdDate).format("DD-MM-YYYY")

  return ConvertToArabicNumbers(formatedDate)
}

onMounted(() => {
  const id = route.params.id

  getOrderDetails(id)
})

const handleDeliveryDate = (date, createdDate) => {
  const newDate = moment(date).format("MM-DD-YYYY")

  return ConvertToArabicNumbers(newDate)
}
</script>

<template>
  <div>
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
    <div
      v-else
      id="invoice"
      class="card-wrapper invoice-container"
    >
      <VRow
        justify="space-between"
        class="mb-2 pa-0"
      >
        <!--
          <VCol cols="12">
          <div class="d-flex justify-space-between">
          <div></div>
          <VBtn
          class="print_sec"
          @click="printOrder"
          >
          طباعة الفاتورة
          </VBtn>
          </div>
          </VCol> 
        -->
        <VCol
          cols="12"
          class="py-0"
        >
          <div class="d-flex justify-space-between align-center">
            <div>
              <h2
                v-if="isUAEOrder"
                class="mb-2"
                style="font-size: 1.4rem;"
              >
                شركة خيرات المرعى لتجارة اللحوم الطازجة ش.ذ.م.م
              </h2>
              <h2
                v-else
                class="mb-2"
                style="font-size: 1.4rem;"
              >
                شركة المرعى للتجارة (تركي للذبائح)
              </h2>
              <h4
                v-if="isUAEOrder"
                class="d-flex align-center gap-3 mb-3 text-base"
              />
              <h4
                v-else
                class="d-flex align-center gap-3 mb-3 text-base"
              >
                <span>رقم السجل الضريبي: </span>
                <span>
                  {{ ConvertToArabicNumbers(310841577800003) }}
                </span>
              </h4>
              <h4
                v-if="isUAEOrder"
                class="d-flex align-center gap-3 mb-2 text-base"
              />
              <h4
                v-else
                class="d-flex align-center gap-3 mb-2 text-base"
              >
                <span>سجل تجاري: </span>
                <span>
                  {{ ConvertToArabicNumbers(1010476540) }}
                </span>
              </h4>
            </div>
            <img
              src="/src/assets/images/logo.png"
              alt="تركي للذبائح"
              width="200"
              class="turki_logo"
            >
          </div>
        </VCol>
      </VRow>
      <VRow
        justify="space-between"
        class="mb-3"
      >
        <VCol cols="12">
          <h3
            class="pa-2 mb-4"
            style="background-color: #ddd;font-size: 0.8rem;"
          >
            بيانات الفاتورة
          </h3>
          <VRow>
            <VCol
              cols="6"
              class="d-flex align-center gap-3 text-base py-1"
            >
              <h4>رقم الفاتورة:</h4>
              <h2 v-if="order.order.payment">
                {{ order.order.payment.order_ref_no }}
              </h2>
              <span v-else>لا يوجد</span>
            </VCol>
            <VCol
              cols="6"
              class="d-flex align-center gap-3 text-base py-1"
            >
              <h4>تاريخ الفاتورة:</h4>
              <h4>
                {{ formatCreatedDate(order.order.created_at) }}
              </h4>
            </VCol>
            <VCol
              cols="6"
              class="d-flex align-center gap-3 text-base py-1"
            >
              <h4>تاريخ التسليم: </h4>
              <h4>
                {{ formatCreatedDate(order.order.delivery_date) }}
              </h4>
            </VCol>
            <VCol
              cols="6"
              class="d-flex align-center gap-3 text-base py-1"
            >
              <h4>وقت التسليم: </h4>
              <h4>
                {{ order.order.delivery_period ? order.order.delivery_period.name_ar : "لا يوجد" }}  
              </h4>
            </VCol>
          </VRow>
        </VCol>
        <VCol
          cols="12"
          class="mb-3"
        >
          <h3
            class="pa-2 mb-4"
            style="background-color: #ddd;font-size: 0.8rem;"
          >
            بيانات العميل
          </h3>
          <VRow>
            <VCol
              cols="6"
              class="d-flex align-center gap-3 text-base py-1"
            >
              <h4>اسم العميل: </h4>
              <h4>{{ order.order.customer.name }}</h4>
            </VCol>
            <VCol
              cols="6"
              class="d-flex align-center gap-3 text-base py-1"
            >
              <h4>رقم الهاتف:</h4>
              <h4 dir="ltr">
                {{ order.order.customer.mobile }}
              </h4>
            </VCol>
            <VCol
              cols="6"
              class="d-flex align-center gap-3 text-base py-1"
            >
              <h4> العنوان :</h4>
              <h4>
                {{ ConvertToArabicNumbers(order.order.selected_address.address) }}  
              </h4>
            </VCol>
            <VCol
              cols="6"
              class="d-flex align-center gap-3 text-base py-1"
            >
              <h4>طريقة الدفع :</h4>
              <h4>
                {{ order.order.payment_type ? order.order.payment_type.name_ar : "لا يوجد" }}  
                {{ order.order.using_wallet ? " - المحفظة" : " " }}
              </h4>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <VTable class="mb-4">
            <thead>
              <tr>
                <th class="text-base">
                  الذبيحة
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
                v-for="product in order.products"
                :key="product.id"
              >
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
                <!--
                  <td>
                  <small>
                  {{ product.is_karashah ? "بدون" : "" }}</small>
                  </td>
                  <td>
                  <small>
                  {{ product.is_kwar3 ? "بدون" : "" }}</small>
                  </td>
                  <td>
                  <small>
                  {{ product.is_lyh ? "بدون" : "" }}</small>
                  </td>
                  <td>
                  <small>
                  {{ product.is_Ras ? "بدون" : "" }}</small>
                  </td> 
                
                -->
                <td>
                  <small>
                    {{ product.shalwata ? "مع شلوطة" : "بدون" }}</small>
                </td>
                <td>
                  <small>
                    {{ product.price ? ConvertToArabicNumbers(product.price) : ConvertToArabicNumbers(product.total_price / product.quantity) }}</small>
                </td>
                <td>
                  <small>
                    {{ product.total_price ? ConvertToArabicNumbers(product.total_price) : "لا يوجد" }}</small>
                </td>
              </tr>
            </tbody>
          </VTable>
          <h3
            class="d-flex align-center justify-space-between pa-2 mb-3"
            style="background-color: #ddd;font-size: 0.8rem;"
          >
            <span class="text-base">بيانات الدفع</span>
            <small class="text-base">جميع الأسعار تشمل الضريبة</small>
          </h3>
          <VRow class="mb-4">
            <VCol
              cols="6"
              class="d-flex align-center gap-3 text-base py-1"
            >
              <span>  المبلغ المسدد :</span>
              <span>
                {{ ConvertToArabicNumbers(order.order.paidpayment ? order.order.paidpayment.price : 0 ) }} <small>{{ orderCurrency }}</small> 
              </span>
            </VCol>
            <VCol
              v-if="order.order.wallet_amount_used > 0"
              cols="6"
              class="d-flex align-center gap-3 text-base py-1"
            >
              <span>  المبلغ المسدد بالمحفظة :</span>
              <span>
                {{ ConvertToArabicNumbers(order.order.wallet_amount_used ? order.order.wallet_amount_used : 0 ) }} <small>{{ orderCurrency }}</small> 
              </span>
            </VCol>

            <VCol
              cols="6"
              class="d-flex align-center gap-3 text-base py-1"
            >
              <span> إجمالي المتبقي	: </span>
              <span>
                {{ ConvertToArabicNumbers(order.order.remain_amount) }}
                <small>{{ orderCurrency }}</small>
              </span>
            </VCol>
            <VCol
              cols="6"
              class="d-flex align-center gap-3 text-base py-1"
            >
              <span>الخصم :</span>
              <span>
                {{ ConvertToArabicNumbers(order.order.discount_applied) ?? 0 }} 
                <small>{{ orderCurrency }}</small>
              </span>
            </VCol>
            <VCol
              cols="12"
              class="d-flex align-center gap-3 text-base py-1"
            >
              <span> الإجمالي غير شامل الضريبة بعد الخصم : </span>
              <span>
                {{ ConvertToArabicNumbers(order.order.total_amount_after_tax) ?? 0 }} 
                <small>{{ orderCurrency }}</small>
              </span>
            </VCol>
            <VCol
              cols="6"
              class="d-flex align-center gap-3 text-base py-1"
            >
              <span>ضريبة القيمة المضافة : </span>
              <span>
                {{ ConvertToArabicNumbers(order.order.tax_fees) }} 
                <small>{{ orderCurrency }}</small>
              </span>
            </VCol>
            <VCol
              cols="6"
              class="d-flex align-center gap-3 text-base py-1"
            >
              <span> الإجمالي شامل الضريبة : </span>
              <span>
                {{ ConvertToArabicNumbers(Number(order.order.order_subtotal)) }} 
                <small>{{ orderCurrency }}</small>
              </span>
            </VCol>
            <VCol
              cols="12"
              class="pt-3"
            >
              <hr>
            </VCol>
            <VCol
              cols="12"
              class="d-flex align-center gap-3 text-base py-1"
            >
              <span> الإجمالي شامل الضريبة بعد الخصم : </span>
              <h3>
                {{ ConvertToArabicNumbers(parseFloat(order.order.total_amount_after_discount) + parseFloat(order.order.wallet_amount_used ?? 0)) ?? 0 }} 
                <small>{{ orderCurrency }}</small>
              </h3>
            </VCol>
            <VCol
              v-if="order.order && order.order.boxes_count"
              cols="6"
              class="d-flex align-center gap-3 text-base py-1"
            >
              <h4>عدد الكراتين </h4>
              <h4>
                {{ ConvertToArabicNumbers(order.order.boxes_count) }}  
              </h4>
            </VCol>
            <VCol
              v-if="order.order && order.order.dishes_count" 
              cols="6"
              class="d-flex align-center gap-3 text-base py-1"
            >
              <h4>عدد الأطباق</h4>
              <h4>
                {{ ConvertToArabicNumbers(order.order.dishes_count) }}  
              </h4>
            </VCol>
          </VRow>
          <h3
            class="d-flex align-center justify-space-between pa-2 mb-1 text-base"
            style="background-color: #ddd;"
          >
            ملاحظات
          </h3>
          <p class="text-base">
            {{ order.order.comment ?? "لا يوجد" }}
          </p>
        </VCol>
      </VRow>
      <VRow
        justify="end"
      >
        <div>
          <img
            v-if="order.order.qr"
            :src="order.order.qr"
            alt="رمز الاستجابة السريعة"
            width="100"
            class="mx-auto"
          >
          <img
            v-else
            src="@/assets/images/logo.png"
            alt="turki"
            width="100"
            class="mx-auto"
          >
        </div>
      </VRow>
    </div>
  </div>
</template>

<style scoped lang="scss">
.invoice-container {
  margin-block-start: -100px;

  .text-base {
    font-size: 1.2rem !important;
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
  font-size: 1.2rem;
  font-weight: 600;

  small {
    font-size: 1.2rem;
    font-weight: 600;
  }
}

table tbody td {
  border-block-end: 1px solid;
  border-block-start: 1px solid;
  font-size: 1.2rem;

  small {
    font-size: 1.2rem;
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
