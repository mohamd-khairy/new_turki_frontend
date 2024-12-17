<template>
  <div id="invoice" class="text-center invoice hide-on-screen">
    <div class="text-center">
      <img src="@/assets/images/logo.png" alt="turki">
      <p class="">
        الرياض
      </p>
    </div>
    <p class="text-center">
      =========================================================
    </p>
    <h4 class="d-flex align-center justify-center gap-3 mb-3 text-base">
      <span>رقم السجل الضريبي: </span>
      <span>
        {{ ConvertToArabicNumbers(310841577800003) }}
      </span>
    </h4>
    <p>الفاتورة الضريبة المبسطة</p>
    <p>Simplified Tax Invoice</p>
    <p class="text-center">
      =========================================================
    </p>
    <p v-if="orderDetails?.order?.customer.mobile != '+9660123456789'" class="d-flex  justify-space-between w-100">
      <span>اسم العميل:</span>
      <span>{{ cashierStore.orderInfo.order?.customer?.name }}</span>
    </p>
    <p v-if="orderDetails?.order?.customer.mobile != '+9660123456789'" class="d-flex  justify-space-between w-100">
      <span>رقم الجوال:</span>
      <span dir="ltr">{{ cashierStore.orderInfo.order?.customer?.mobile }}</span>
    </p>
    <p class="text-center">
      =========================================================
    </p>
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
      <p class="text-center">
        =========================================================
      </p>
      <div v-for="product in cashierStore.orderInfo.products" :key="product.id" class="body">
        <div class="item">
          <div class="cell text-center">
            {{ product.quantity }}
          </div>
          <div class="cell description">
            {{ product.product?.name_ar }}
            <div class="addons">
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
      <p class="text-center">
        =========================================================
      </p>
      <div class="head">
        <div class="cell description">
          <p>المجموع النهائى</p>
        </div>
        <div class="cell price">
          {{ cashierStore.orderInfo.order?.total_amount_after_tax }} ريال
        </div>
      </div>
      <div class="head">
        <div class="cell description">
          <p>الضريبة 15%</p>
        </div>
        <div class="cell price">
          {{ cashierStore.orderInfo.order?.tax_fees }} ريال
        </div>
      </div>
      <p class="text-center">
        =========================================================
      </p>
    </div>

    <p class="d-flex bold justify-space-between w-100">
      <span>الاجمالي:</span>
      <span>{{ cashierStore.orderInfo.order?.total_amount }} ريال</span>
    </p>
    <p>المجموع يشمل ضريبة القيمة المضافة</p>
    <p class="text-center">
      =========================================================
    </p>
    <p class="d-flex bold justify-space-between w-100">
      <span>طريقة الدفع</span>
      <span>{{ cashierStore.orderInfo.order?.payment_type?.name_ar }}</span>
    </p>
  </div>
</template>

<script setup>
import { useCashierStore } from '@/store/Cashier';
import { ref } from 'vue';

const cashierStore = useCashierStore()
const qrBase64 = ref(null) // To store the Base64 QR code

const convertImageUrlToBase64 = async url => {
  console.log(url)
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

//   console.log("qrUrl", qrUrl)
//   if (qrUrl) qrBase64.value = await convertImageUrlToBase64(qrUrl)

// })

// watch(() => cashierStore.orderInfo, async () => {
//   if (cashierStore.orderInfo?.order?.qr) qrBase64.value = await convertImageUrlToBase64(cashierStore.orderInfo?.order?.qr).then(res => console.log(res))
// })
</script>

<style lang='scss' scoped>
img {
  max-block-size: 100px;
}

.hide-on-screen {
  display: none;
}

@media print {
  .hide-on-screen {
    display: flex;
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

.invoice {
  padding: 0;
  margin: 0;

  /* Ensure full width */
  block-size: auto;
  direction: rtl;
  font-size: 16px;
  inline-size: 100%;
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
