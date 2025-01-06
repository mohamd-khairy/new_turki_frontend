<template>
  <div id="invoice" class="text-center invoice hide-on-screen">
    <div class="text-center">
      <img src="@/assets/images/logo.png" alt="turki">
      <p class="">
        الرياض
      </p>
    </div>
    <div class="table">
      <p class="text-center">
        =========================================================
      </p>
    </div>
    <p class="text-center">
      الفاتورة الضريبة المبسطة
    </p>
    <h4 class="d-flex align-center justify-center gap-3 mb-3 text-base">
      <div>رقم السجل الضريبي: </div>
      <div>
        {{ ConvertToArabicNumbers(310841577800003) }}
      </div>
    </h4>
    <h4 class="d-flex align-center justify-center gap-3 mb-3 text-base">
      <div>رقم الطلب:</div>
      <div>
        {{ ConvertToArabicNumbers(cashierStore.orderInfo.order?.ref_no) }}
      </div>
    </h4>
    <div v-if="!isVisitor" class="table">
      <p class="text-center">
        =========================================================
      </p>
    </div>
    <p v-if="!isVisitor" class="d-flex  justify-space-between w-100">
      <span>اسم العميل:</span>
      <span>{{ cashierStore.orderInfo.order?.customer?.name }}</span>
    </p>
    <p v-if="!isVisitor" class="d-flex  justify-space-between w-100">
      <span>رقم الجوال:</span>
      <span dir="ltr">{{ cashierStore.orderInfo.order?.customer?.mobile }}</span>
    </p>

    <p v-if="(cashierStore.orderInfo.order?.selected_address || cashierStore.orderInfo.order?.customer?.default_addresses) && orderDetails?.order?.customer.mobile != '+9660123456789'" class="d-flex  justify-space-between w-100">
      <span>المدينة:</span>
      <span>{{ cashierStore.orderInfo.order.selected_address?.city?.name_ar ??
        cashierStore.orderInfo.order.customer?.default_addresses?.city?.name_ar }}</span>
    </p>
    <p v-if="(cashierStore.orderInfo.order?.selected_address || cashierStore.orderInfo.order?.customer?.default_addresses) && orderDetails?.order?.customer.mobile != '+9660123456789'" class="d-flex  justify-space-between w-100">
      <span>العنوان:</span>
      <span>{{ cashierStore.orderInfo.order.selected_address?.address ??
        cashierStore.orderInfo.order.customer?.default_addresses?.address }}</span>
    </p>

    <div v-if="cashierStore.orderInfo.order?.delivery_date" class="table">
      <p class="text-center">
        =========================================================
      </p>
    </div>
    <p v-if="cashierStore.orderInfo.order?.delivery_date" class="d-flex  justify-space-between w-100">
      <span> تاريخ التسليم:</span>
      <span>{{ cashierStore.orderInfo.order?.delivery_date }}</span>
    </p>
    <p v-if="cashierStore.orderInfo.order?.delivery_period?.name_ar" class="d-flex  justify-space-between w-100">
      <span> وقت التسليم:</span>
      <span dir="ltr">{{ cashierStore.orderInfo.order?.delivery_period?.name_ar }}</span>
    </p>
    <div class="table">
      <p class="text-center">
        =========================================================
      </p>
    </div>
    <div class="table">
      <div class="head">
        <div class="cell text-center">
          الكمية
        </div>
        <div class="cell description">
          الوصف
        </div>
        <div class="cell price">
          السعر
        </div>
      </div>
      <div class="table">
        <p class="text-center">
          =========================================================
        </p>
      </div>
      <div v-for="product in cashierStore.orderInfo.products" :key="product.id" class="body">
        <div class="item nowraping">
          <div class="cell text-center">
            {{ product.quantity }}
            <br>
            <VChip v-if="product.is_refund" class="text-error">
              مرتجع
            </VChip>
          </div>
          <div class="cell description">
            {{ product.product?.name_ar }}

            <div class="addons">
              <div v-if="product?.size?.name_ar">
                الحجم: {{ product?.size?.name_ar }}
              </div>
              <div v-if="product?.cut?.name_ar">
                التقطيع: {{ product?.cut?.name_ar }}
              </div>
              <div v-if="product?.preparation?.name_ar">
                التجهيز: {{ product?.preparation?.name_ar }}
              </div>
              <div class="flex flex-col gap-1">
                <div class="d-flex gap-2">
                  {{ product.is_Ras ? 'بدون رأس -' : '' }}
                  {{ product.is_lyh ? 'بدون لية -' : '' }}
                  {{ product.is_kwar3 ? 'بدون كوارع -' : '' }}
                </div>
                <div class="d-flex gap-2">
                  {{ product.is_karashah ? 'بدون كرشة -' : '' }}
                  {{ product.shalwata ? 'مع شلوطة' : '' }}
                </div>
              </div>
            </div>
          </div>
          <div class="cell price">
            {{ product.total_price }} ريال
          </div>
        </div>
      </div>
      <div class="table">
        <p class="text-center">
          =========================================================
        </p>
      </div>
      <div class="head">
        <div class="cell description">
          المجموع الفرعي
        </div>
        <div class="cell price">
          {{ cashierStore.orderInfo.order?.total_amount_after_tax }} ريال
        </div>
      </div>
      <div class="head">
        <div class="cell description">
          الضريبة 15%
        </div>
        <div class="cell price">
          {{ cashierStore.orderInfo.order?.tax_fees }} ريال
        </div>
      </div>
      <div class="table">
        <p class="text-center">
          =========================================================
        </p>
      </div>
    </div>

    <div class="d-flex bold justify-space-between w-100">
      <div>الاجمالي:</div>
      <div>{{ cashierStore.orderInfo.order?.total_amount }} ريال</div>
    </div>
    <p class="text-center">
      المجموع يشمل ضريبة القيمة المضافة
    </p>
    <div class="table">
      <p class="text-center">
        =========================================================
      </p>
    </div>
    <p class="d-flex bold justify-space-between w-100">
      <span>طريقة الدفع</span>
      <span>{{ cashierStore.orderInfo.order?.payment_type?.name_ar }}</span>
    </p>

    <div class="table">
      <p class="text-center">
        =========================================================
      </p>
    </div>
    <p class="d-flex bold justify-space-between w-100">
      <span> الملاحظات: </span>
      <span>{{ cashierStore.orderInfo.order?.comment ?? ' لايوجد ' }}</span>
    </p>

    <div class="table">
      <p class="text-center">
        =========================================================
      </p>
    </div>
    <br>
    <div class="nowraping text-center">
      <QrcodeVue :value="cashierStore.orderInfo?.order?.qr_string" :size="170" level="H" render-as="svg" />
    </div>
  </div>
</template>

<script setup>
import { useCashierStore } from '@/store/Cashier'
import QrcodeVue from 'qrcode.vue'
import { computed, ref } from 'vue'


const isVisitor = computed(() => cashierStore.orderInfo.order?.customer?.mobile === '+9660123456789')
const cashierStore = useCashierStore()
const qrBase64 = ref(null) // To store the Base64 QR code

const convertImageUrlToBase64 = async url => {
  try {
    const response = await fetch(url) // Fetch image from the provided URL
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const blob = await response.blob() // Convert response to a Blob object

    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onloadend = () => resolve(reader.result) // Base64 encoded string
      reader.onerror = error => reject(`Failed to convert image: ${error}`)
      reader.readAsDataURL(blob) // Start the conversion to Base64
    })
  } catch (error) {
    console.error("Error fetching the image:", error)

    return null
  }
}

const ConvertToArabicNumbers = num => {
  const arabicNumbers = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669"

  return String(num).replace(/[0123456789]/g, d => {
    return arabicNumbers[d]
  })
}

// onMounted(async () => {
//   const qrUrl = cashierStore.orderInfo?.order?.qr // QR URL from your store

//   if (qrUrl) qrBase64.value = await convertImageUrlToBase64(qrUrl)

// })

// watch(() => cashierStore.orderInfo, async () => {
//   if (cashierStore.orderInfo?.order?.qr) qrBase64.value = await convertImageUrlToBase64(cashierStore.orderInfo?.order?.qr).then(res => console.log(res))
// })
</script>

<style lang='scss' scoped>
.hide-on-screen {
  display: none;
}

img {
  max-inline-size: 100px;
}

@media print {
  .hide-on-screen {
    display: flex;
  }

  .nowraping,
  p,
  .item {
    break-inside: avoid;
    page-break-after: avoid;
    page-break-inside: avoid;
  }

  svg {
    block-size: 170px;
    break-inside: avoid;
    inline-size: 170px;
    page-break-after: avoid;
    page-break-inside: avoid;
  }

  .invoice {
    padding: 0;
    margin: auto;

    /* Ensure full width */
    block-size: auto;
    break-inside: avoid;
    direction: rtl;
    font-size: 16px;
    max-inline-size: 100%;
    page-break-after: avoid;
    page-break-inside: avoid;
  }
}

@page {
  margin: 0;
  size: auto;
}

@page {
  margin: 0;

  // size: a5 portrait;
}

.item *,
.head {
  font-size: 14px;
}

.invoice {
  padding: 0;
  margin: 0;

  /* Ensure full width */
  block-size: auto;
  break-inside: avoid;
  direction: rtl;
  font-size: 16px;
  max-inline-size: 100%;
  page-break-after: avoid;
  page-break-inside: avoid;
}

.nowraping,
svg,
p,
.item {
  break-inside: avoid;
  page-break-after: avoid;
  page-break-inside: avoid;
}

p {
  margin-block-end: 0;
}

.qr {
  inline-size: 80%;
  max-block-size: unset;
  max-inline-size: 200px;
}

.table {
  display: flex;
  flex-direction: column;
  align-items: center;
  inline-size: 100%;

  .flex-1 {
    flex: 1;
  }

  .head,
  .body {
    display: flex;
    gap: 1rem;
    inline-size: 100%;

    .cell {
      min-inline-size: 50px;

      &.description {
        flex: 1;
        text-align: start;
      }

      &.price {
        inline-size: 100px;
      }

      .addons {
        margin-inline-start: 5px;
      }
    }
  }

  .body {
    flex-direction: column;
    gap: 0.5rem;
  }

  .item {
    display: flex;
  }

  .body {
    margin-block-end: 10px;
  }
}

p.d-felx {
  justify-content: space-between;
  inline-size: 100%;
}

.bold {
  font-size: 16px;
  font-weight: 700;
}
</style>
