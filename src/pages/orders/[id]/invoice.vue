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

const getOrderDetails = id => {
  ordersListStore.fetchOrder(id).then(response => {
    order.value = response?.data.data
    isLoading.value = false
    setTimeout(() => {
      printOrder();
    }, 500);
  }).catch(error => {
    isLoading.value = false
  }).finally(() => {
    setTimeout(() => {
      router.push(`/orders`)
    }, 1500);
  });
}

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // Months are zero-indexed, so add 1
  const day = today.getDate();
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

onMounted(() => {
  const id = route.params.id

  getOrderDetails(id)
})
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
      class="card-wrapper"
    >
      <VRow
        justify="space-between"
        class="mb-2 pa-0"
      >
      <!-- <VCol cols="12">
          <div class="d-flex justify-space-between">
            <div></div>
            <VBtn
              class="print_sec"
              @click="printOrder"
            >
              طباعة الفاتورة
            </VBtn>
          </div>
        </VCol> -->
        <VCol cols="12">
          <div class="d-flex justify-space-between align-center">
            <div>
              <h2 class="mb-2">
                شركة لحوم تركي للذبائح
              </h2>
              <h4 class="d-flex align-center gap-3 mb-2">
                <span>رقم السجل الضريبي: </span>
                <span class="text-primary">
                  {{ ConvertToArabicNumbers(310841577800003) }}
                </span>
              </h4>
              <h4 class="d-flex align-center gap-3 mb-2">
                <span>سجل تجاري: </span>
                <span class="text-primary">
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
          <h3 class="pa-2 mb-4" style="background-color: #ddd;">بيانات الفاتورة</h3>
          <VRow>
            <VCol cols="6" class="d-flex align-center gap-3">
              <h4>رقم الفاتورة:</h4>
              <h2 v-if="order.order.payment">{{ order.order.payment.order_ref_no }}</h2>
              <span v-else class="text-primary">لا يوجد</span>
            </VCol>
            <VCol cols="6" class="d-flex align-center gap-3">
              <h4>تاريخ الفاتورة:</h4>
              <h4 class="text-primary">
                {{ ConvertToArabicNumbers(getTodayDate().split("-").reverse().join("-")) }}
              </h4>
            </VCol>
            <VCol cols="6" class="d-flex align-center gap-3">
                <h4>تاريخ التسليم: </h4>
                <h4 class="text-primary">
                  {{ ConvertToArabicNumbers(order.order.delivery_date.toString().split("-").reverse().join("-")) }}  
                </h4>
              </VCol>
              <VCol cols="6" class="d-flex align-center gap-3">
                <h4>وقت التسليم: </h4>
                <h4 class="text-primary">
                  {{ order.order.delivery_period ? order.order.delivery_period.name_ar : "لا يوجد" }}  
                </h4>
              </VCol>
              <VCol v-if="order.order && order.order.boxes_count"
              cols="6" class="d-flex align-center gap-3">
                <h4>عدد الكراتين </h4>
                <h4 class="text-primary">
                  {{ order.order.boxes_count }}  
                </h4>
              </VCol>
              <VCol v-if="order.order && order.order.dishes_count" 
              cols="6" class="d-flex align-center gap-3">
                <h4>عدد الأطباق</h4>
                <h4 class="text-primary">
                  {{ order.order.dishes_count }}  
                </h4>
              </VCol>
          </VRow>
        </VCol>
        <VCol cols="12" class="mb-4">
          <h3 class="pa-2 mb-4" style="background-color: #ddd;">بيانات العميل</h3>
          <VRow>
            <VCol cols="6" class="d-flex align-center gap-3">
              <h4>اسم العميل: </h4>
              <h4 class="text-primary">{{ order.order.customer.name }}</h4>
            </VCol>
            <VCol cols="6" class="d-flex align-center gap-3">
              <h4>رقم الهاتف:</h4>
              <h4 dir="ltr" class="text-primary">{{ order.order.customer.mobile }}</h4>
            </VCol>
            <VCol cols="6" class="d-flex align-center gap-3">
              <h4> العنوان :</h4>
              <h4 class="text-primary">
              {{ ConvertToArabicNumbers(order.order.selected_address.address) }}  
              </h4>
            </VCol>
            <VCol cols="6" class="d-flex align-center gap-3">
              <h4>طريقة الدفع :</h4>
              <h4 class="text-primary">
                {{ order.order.payment_type ? order.order.payment_type.name_ar : "لا يوجد" }}
              </h4>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <VTable class="mb-6">
            <thead>
              <tr>
                <th>الذبيحة</th>
                <th>الحجم</th>
                <th>الكمية</th>
                <th>التقطيع</th>
                <th>التجهيز</th>
                <th>الكرشة</th>
                <th>الكوارع</th>
                <th>اللية</th>
                <th>الرأس</th>
                <th>الشلوطة</th>
                <th>السعر</th>
                <th>الاجمالي</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="product in order.products"
                :key="product.id"
              >
                <td><small>{{ product.product ? product.product.name_ar : "لا يوجد" }}</small></td>
                <td><small>
                  {{ product.size ? product.size.name_ar : "لا يوجد" }}</small></td>
                <td><small>
                  {{ product.quantity ? product.quantity : "لا يوجد" }}</small></td>
                <td><small>
                  {{ product.cut ? product.cut.name_ar : "لا يوجد" }}</small></td>
                <td><small>
                  {{ product.preparation ? product.preparation.name_ar : "لا يوجد" }}</small></td>
                <td><small>
                  {{ product.is_karashah ? "بدون" : "" }}</small></td>
                <td><small>
                  {{ product.is_kwar3 ? "بدون" : "" }}</small></td>
                <td><small>
                  {{ product.is_lyh ? "بدون" : "" }}</small></td>
                <td><small>
                  {{ product.is_Ras ? "بدون" : "" }}</small></td>
                <td><small>
                  {{ product.shalwata ? "مع شلوطة" : "بدون" }}</small></td>
                <td><small>
                  {{ product.price ?? (product.total_price / product.quantity) }}</small></td>
                <td><small>
                  {{ product.total_price ?? "لا يوجد" }}</small></td>
              </tr>
            </tbody>
          </VTable>
          <h3 class="d-flex align-center justify-space-between pa-2 mb-4" style="background-color: #ddd;">
            <span>بيانات الدفع</span>
            <small>جميع الأسعار تشمل الضريبة</small>
          </h3>
          <VRow class="mb-4">
            <VCol cols="6" class="d-flex align-center gap-3 py-1">
              <span class="text-primary"> المبلغ المسدد :</span>
              <span v-if="order.order.payment">
                {{ order.order.payment ? ConvertToArabicNumbers(order.order.payment.price) : 0 }} <small>ريال سعودي </small> 
              </span>
            </VCol>
            <VCol cols="6" class="d-flex align-center gap-3 py-1">
              <span> إجمالي المتبقي	: </span>
              <span class="text-primary">
                {{ order.order.payment ? order.order.total_amount_after_discount - order.order.payment.price < 0 ? ConvertToArabicNumbers(0) : ConvertToArabicNumbers(order.order.total_amount_after_discount - order.order.payment.price) : ConvertToArabicNumbers(order.order.total_amount_after_discount) }} 
                <small>ريال سعودي </small>
              </span>
            </VCol>
            <VCol cols="6" class="d-flex align-center gap-3 py-1">
              <span>الخصم :</span>
              <span class="text-primary">
                {{ ConvertToArabicNumbers(order.order.discount_applied) ?? 0 }} 
                <small>ريال سعودي </small>
              </span>
            </VCol>
            <VCol cols="6" class="d-flex align-center gap-3 py-1">
              <span> الإجمالي غير شامل الضريبة بعد الخصم : </span>
              <span class="text-primary">
                {{ ConvertToArabicNumbers(order.order.total_amount_after_tax) ?? 0 }} 
                <small>ريال سعودي </small>
              </span>
            </VCol>
            <VCol cols="6" class="d-flex align-center gap-3 py-1">
              <span>ضريبة القيمة المضافة : </span>
              <span class="text-primary">
                {{ ConvertToArabicNumbers(order.order.tax_fees) }} 
                <small>ريال سعودي </small>
              </span>
            </VCol>
            <VCol cols="6" class="d-flex align-center gap-3 py-1">
              <span> الإجمالي شامل الضريبة : </span>
              <span class="text-primary">
                {{ ConvertToArabicNumbers(Number(order.order.order_subtotal)) }} 
                <small>ريال سعودي </small>
              </span>
            </VCol>
            <VCol cols="12" class="pt-4">
            <hr />
            </VCol>
            <VCol cols="12" class="d-flex align-center gap-3 py-2">
              <span> الإجمالي شامل الضريبة بعد الخصم : </span>
              <h3 class="text-primary">
                {{ ConvertToArabicNumbers(order.order.total_amount_after_discount) ?? 0 }} 
                <small>ريال سعودي </small>
              </h3>
            </VCol>
          </VRow>
          <h3 class="d-flex align-center justify-space-between pa-2 mb-4" style="background-color: #ddd;">
            ملاحظات
          </h3>
          <p>{{ order.order.comment ?? "لا توجد" }}</p>
        </VCol>
      </VRow>
      <VRow
        class="pt-4"
        justify="end"
      >
        <div>
          <img
            v-if="order.order.qr"
            :src="order.order.qr"
            alt="رمز الاستجابة السريعة"
            width="250"
            class="mx-auto"
          >
          <img
            v-else
            src="@/assets/images/logo.png"
            alt="turki"
            width="250"
            class="mx-auto"
          >
        </div>
      </VRow>
    </div>
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

table thead th {
  border-block-start: 1px solid;
}

table tbody td {
  border-block-end: 1px solid;
  border-block-start: 1px solid;
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
