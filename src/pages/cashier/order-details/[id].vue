<template>
  <div>
    <CashierInvoice ref="orderContainerRef" />
    <div v-if="isLoading" class="loader_wrap">
      <img src="@/assets/images/logo.png" alt="turki">
      <p class="text-2xl">
        جاري جلب بيانات الفاتورة ...
      </p>
    </div>
    <div v-else>
      <div class="card-wrapper invoice-container">
        <VRow justify="space-between hidden" class="mb-2 pa-0">
          <VCol cols="12" class="py-0">
            <div class="d-flex justify-space-between align-center">
              <div>
                <h2 v-if="isUAEOrder" class="mb-2" style="font-size: 1.4rem;">
                  شركة خيرات المرعى لتجارة اللحوم الطازجة ش.ذ.م.م
                </h2>
                <h2 v-else class="mb-2" style="font-size: 1.4rem;">
                  شركة المرعى للتجارة (تركي للذبائح)
                </h2>
                <h4 v-if="isUAEOrder" class="d-flex align-center gap-3 mb-3 text-base" />
                <h4 v-else class="d-flex align-center gap-3 mb-3 text-base">
                  <span>رقم السجل الضريبي: </span>
                  <span>
                    {{ ConvertToArabicNumbers(310841577800003) }}
                  </span>
                </h4>
                <h4 v-if="isUAEOrder" class="d-flex align-center gap-3 mb-2 text-base" />
                <h4 v-else class="d-flex align-center gap-3 mb-2 text-base">
                  <span>سجل تجاري: </span>
                  <span>
                    {{ ConvertToArabicNumbers(1010476540) }}
                  </span>
                </h4>
              </div>
              <img src="/src/assets/images/logo.png" alt="تركي للذبائح" width="200" class="turki_logo">
            </div>
          </VCol>
        </VRow>
        <VRow justify="space-between" class="mb-3">
          <VCol cols="12">
            <h3 class="pa-2 mb-4" style="background-color: #ddd;font-size: 0.8rem;">
              بيانات الفاتورة
            </h3>
            <VRow>
              <VCol cols="6" class="d-flex align-center gap-3 text-base py-1">
                <h4>رقم الفاتورة:</h4>
                <h2 v-if="orderDetails?.order?.payment">
                  {{ orderDetails?.order?.payment.order_ref_no }}
                </h2>
                <span v-else>لا يوجد</span>
              </VCol>
              <VCol cols="6" class="d-flex align-center gap-3 text-base py-1">
                <h4>تاريخ الفاتورة:</h4>
                <h4>
                  {{ formatCreatedDate(orderDetails?.order?.created_at) }}
                </h4>
              </VCol>
              <VCol cols="6" class="d-flex align-center gap-3 text-base py-1">
                <h4>تاريخ التسليم: </h4>
                <h4>
                  {{ formatCreatedDate(orderDetails?.order?.delivery_date) }}
                </h4>
              </VCol>
              <VCol cols="6" class="d-flex align-center gap-3 text-base py-1">
                <h4>وقت التسليم: </h4>
                <h4>
                  {{ orderDetails?.order?.delivery_period ? orderDetails?.order?.delivery_period.name_ar : "لا يوجد" }}
                </h4>
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="12" class="mb-3">
            <h3 class="pa-2 mb-4" style="background-color: #ddd;font-size: 0.8rem;">
              بيانات العميل
            </h3>
            <VRow>
              <VCol v-if="orderDetails?.order?.customer.mobile != '+9660123456789'" cols="6" class="d-flex align-xcenter gap-3 text-base py-1">
                <h4>اسم العميل: </h4>
                <h4>{{ orderDetails?.order?.customer.name }}</h4>
              </VCol>
              <VCol v-if="orderDetails?.order?.customer.mobile != '+9660123456789'" cols="6" class="d-flex align-center gap-3 text-base py-1">
                <h4>رقم الهاتف:</h4>
                <h4 dir="ltr">
                  {{ orderDetails?.order?.customer.mobile }}
                </h4>
              </VCol>
              <VCol v-if="(orderDetails?.order?.selected_address || orderDetails?.order?.customer?.default_addresses) && orderDetails?.order?.customer.mobile != '+9660123456789'" cols="6" class="d-flex align-xcenter gap-3 text-base py-1">
                <h4> المدينة: </h4>
                <h4>{{ orderDetails?.order?.selected_address?.city?.name_ar ?? orderDetails?.order?.customer?.default_addresses?.city?.name_ar }}</h4>
              </VCol>
              <VCol v-if="(orderDetails?.order?.selected_address || orderDetails?.order?.customer?.default_addresses) && orderDetails?.order?.customer.mobile != '+9660123456789'" cols="6" class="d-flex align-center gap-3 text-base py-1">
                <h4> العنوان:</h4>
                <h4 dir="ltr">
                  {{ orderDetails?.order?.selected_address?.address ?? orderDetails?.order?.customer?.default_addresses?.address }}
                </h4>
              </VCol>
              <VCol cols="6" class="d-flex align-center gap-3 text-base py-1">
                <h4>طريقة الدفع :</h4>
                <h4>
                  {{ orderDetails?.order?.payment_type ? orderDetails?.order?.payment_type.name_ar : "لا يوجد" }}
                  {{ orderDetails?.order?.using_wallet ? " - المحفظة" : " " }}
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
                <tr v-for="product in orderDetails?.products" :key="product.id">
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
                      {{ product.price ? ConvertToArabicNumbers(product.price) : ConvertToArabicNumbers(product.total_price / product.quantity) }}</small>
                  </td>
                  <td>
                    <small>
                      {{ product.total_price ? ConvertToArabicNumbers(product.total_price) : "لا يوجد" }}</small>
                  </td>
                </tr>
              </tbody>
            </VTable>
            <h3 class="d-flex align-center justify-space-between pa-2 mb-3" style="background-color: #ddd;font-size: 0.8rem;">
              <span class="text-base">بيانات الدفع</span>
              <small class="text-base">جميع الأسعار تشمل الضريبة</small>
            </h3>
            <VRow class="mb-4">
              <VCol cols="6" class="d-flex align-center gap-3 text-base py-1">
                <span> المبلغ المسدد :</span>
                <span>
                  {{ ConvertToArabicNumbers(orderDetails?.order?.paidpayment ? orderDetails?.order?.paidpayment.price : 0) }} <small>{{ orderCurrency }}</small>
                </span>
              </VCol>
              <VCol v-if="orderDetails?.order?.wallet_amount_used > 0" cols="6" class="d-flex align-center gap-3 text-base py-1">
                <span> المبلغ المسدد بالمحفظة :</span>
                <span>
                  {{ ConvertToArabicNumbers(orderDetails?.order?.wallet_amount_used ? orderDetails?.order?.wallet_amount_used : 0) }} <small>{{ orderCurrency }}</small>
                </span>
              </VCol>

              <VCol cols="6" class="d-flex align-center gap-3 text-base py-1">
                <span> إجمالي المتبقي : </span>
                <span>
                  {{ ConvertToArabicNumbers(orderDetails?.order?.remain_amount) }}
                  <small>{{ orderCurrency }}</small>
                </span>
              </VCol>
              <VCol cols="6" class="d-flex align-center gap-3 text-base py-1">
                <span>الخصم :</span>
                <span>
                  {{ ConvertToArabicNumbers(orderDetails?.order?.discount_applied) ?? 0 }}
                  <small>{{ orderCurrency }}</small>
                </span>
              </VCol>
              <VCol cols="12" class="d-flex align-center gap-3 text-base py-1">
                <span> الإجمالي غير شامل الضريبة بعد الخصم : </span>
                <span>
                  {{ ConvertToArabicNumbers(orderDetails?.order?.total_amount_after_tax) ?? 0 }}
                  <small>{{ orderCurrency }}</small>
                </span>
              </VCol>
              <VCol cols="6" class="d-flex align-center gap-3 text-base py-1">
                <span>ضريبة القيمة المضافة : </span>
                <span>
                  {{ ConvertToArabicNumbers(orderDetails?.order?.tax_fees) }}
                  <small>{{ orderCurrency }}</small>
                </span>
              </VCol>
              <VCol cols="6" class="d-flex align-center gap-3 text-base py-1">
                <span> الإجمالي شامل الضريبة : </span>
                <span>
                  {{ ConvertToArabicNumbers(Number(orderDetails?.order?.order_subtotal)) }}
                  <small>{{ orderCurrency }}</small>
                </span>
              </VCol>
              <VCol cols="12" class="pt-3">
                <hr>
              </VCol>
              <VCol cols="12" class="d-flex align-center gap-3 text-base py-1">
                <span> الإجمالي شامل الضريبة بعد الخصم : </span>
                <h3>
                  {{ ConvertToArabicNumbers(parseFloat(orderDetails?.order?.final_amount)) ?? 0 }}
                  <small>{{ orderCurrency }}</small>
                </h3>
              </VCol>
            </VRow>
            <h3 class="d-flex align-center justify-space-between pa-2 mb-1 text-base" style="background-color: #ddd;">
              ملاحظات
            </h3>
            <p class="text-base">
              {{ orderDetails.order.comment ?? "لا يوجد" }}
            </p>
          </VCol>
        </VRow>
      </div>
      <div class="buttons">
        <AppButton type="primary" title="طباعة" @click="printInvoiceWithConfig" />
        <AppButton type="close" title="رجوع" @click="$router.push('/cashier/categories')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import CashierInvoice from '@/@core/components/CashierInvoice.vue'
import { useCashierStore } from '@/store/Cashier'
import html2pdf from 'html2pdf.js'
import moment from "moment"
import { computed, onMounted } from 'vue'

// import { useVueToPrint } from "vue-to-print"

const orderDetails = ref({})
const cashierStore = useCashierStore()
const route = useRoute()
const isLoading = ref(true)
const orderContainerRef = ref(null)

const formatCreatedDate = createdDate => {
  const formatedDate = moment(createdDate).format("DD-MM-YYYY")

  return ConvertToArabicNumbers(formatedDate)
}

const ConvertToArabicNumbers = num => {
  const arabicNumbers = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669"

  return String(num).replace(/[0123456789]/g, d => {
    return arabicNumbers[d]
  })
}

// const printOrder = () => window.print()

const generatePDF = () => {
  const element = document.getElementById('invoice') // Get the HTML element

  element.classList.remove('hide-on-screen')

  html2pdf()
    .from(element)
    .set({
      margin: 5,
      filename: 'تفاصيل الطلبية.pdf',
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: 'mm',
        format: [70, 200],
        orientation: 'portrait',
      },
    })
    .save()
    .finally(() => {
      element.classList.add('hide-on-screen')
    })
}

const printInvoiceWithConfig = () => {
  const element = document.getElementById('invoice') // Get the HTML element

  element.classList.remove('hide-on-screen') // Temporarily show hidden content

  html2pdf()
    .from(element)
    .set({
      margin: 5,
      filename: 'تفاصيل الطلبية.pdf', // Filename if downloaded (not used here)
      html2canvas: { scale: 2 }, // Ensure high-quality rendering
      jsPDF: {
        unit: 'mm',
        format: [80, 200], // Custom size
        orientation: 'portrait',
      },
    })
    .output('datauristring') // Generate a data URL for the PDF
    .then(pdfDataUri => {
      // Open the PDF in a new window for printing
      const printWindow = window.open('', '_blank')

      printWindow.document.write(`
        <html>
          <head>
            <title>تفاصيل الطلبية</title>
          </head>
          <body style="margin: 0; padding: 0;">
            <iframe
              src="${pdfDataUri}"
              style="border: none; width: 100%; height: 100vh;"
              onload="this.contentWindow.print();"
            ></iframe>
          </body>
        </html>
      `)
      printWindow.document.close()
    })
    .finally(() => {
      element.classList.add('hide-on-screen') // Re-hide elements
    })
}


const isUAEOrder = computed(() => orderDetails.value.order?.selected_address?.country_id == 4)

const orderCurrency = computed(() => {
  if (orderDetails.value.order?.selected_address?.country_id == 4) return 'درهم'

  return 'ريال'
})

const getOrderDetails = async () => {
  await cashierStore.orderDetails(route.params.id).then(response => {
    console.log(response)
    orderDetails.value = response?.data

  }).catch(error => {
    console.log(error)
  }).finally(() => {
    isLoading.value = false

  })
}

onMounted(() => getOrderDetails())
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
