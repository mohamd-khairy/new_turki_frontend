<template>
  <div class="text-center invoice hide-on-screen">
    <div class="text-center">
      <img src="@/assets/images/logo.png" alt="turki">
      <p class="">
        الرياض
      </p>
    </div>
    <p>=======================================</p>
    <h4 class="d-flex align-center justify-center gap-3 mb-3 text-base">
      <span>رقم السجل الضريبي: </span>
      <span>
        {{ ConvertToArabicNumbers(310841577800003) }}
      </span>
    </h4>
    <span>الفاتورة الضريبة المبسطة</span>
    <span>Simplified Tax Invoice</span>
    <p>=======================================</p>

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
      <p>=======================================</p>
      <div v-for="product in cashierStore.orderInfo.products" :key="product.id" class="body">
        <div class="cell text-center">
          {{ product.quantity }}
        </div>
        <div class="cell description">
          {{ product.product?.name_ar }}
          <div class="addons">
            <div>{{ product.is_Ras ? '- بدون رأس' : '' }}</div>
            <div>{{ product.is_lyh ? '- بدون لية' : '' }}</div>
            <div>{{ product.is_kwar3 ? '- بدون كوارع' : '' }}</div>
            <div>{{ product.is_karashah ? '- بدون كرشة' : '' }}</div>
            <div>{{ product.shalwata ? '- مع شلوطة' : '' }}</div>
          </div>
        </div>
        <div class="cell price">
          {{ product.total_price }} ريال
        </div>
      </div>
      <p>=======================================</p>
      <div class="head">
        <div class="cell text-center" />
        <div class="cell description">
          <p>Net Total</p>
          <p>المجموع النهائى</p>
        </div>
        <div class="cell price">
          {{ cashierStore.orderInfo.order?.total_amount }} ريال
        </div>
      </div>
      <div class="head">
        <div class="cell text-center" />
        <div class="cell description">
          <p>VAT 15%</p>
          <p>الضريبة</p>
        </div>
        <div class="cell price">
          {{ cashierStore.orderInfo.order?.tax_fees }} ريال
        </div>
      </div>
      <p>=======================================</p>
    </div>

    <p class="d-flex bold justify-space-between w-100">
      <span>Total:</span>
      <span>{{ cashierStore.orderInfo.order?.total_amount_after_tax }} ريال</span>
    </p>
    <p>المجموع يشمل ضريبة القيمة المضافة</p>
    <p>=======================================</p>
    <p class="d-flex bold justify-space-between w-100">
      <span>PAID BY:</span>
      <span>طريقة الدفع</span>
    </p>
    <p class="d-flex bold justify-space-between w-100">
      <span>{{ cashierStore.orderInfo.order?.payment_type?.name_ar }}/{{ cashierStore.orderInfo.order?.payment_type?.name_en }}</span>
      <span>{{ cashierStore.orderInfo.order?.total_amount_after_tax }} ريال</span>
    </p>
    <p>=======================================</p>
  </div>
</template>

<script setup>
import { useCashierStore } from '@/store/Cashier'
import { computed } from 'vue'

const cashierStore = useCashierStore()

const ConvertToArabicNumbers = num => {
  const arabicNumbers = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669"

  return String(num).replace(/[0123456789]/g, d => {
    return arabicNumbers[d]
  })
}
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
  size: a5 portrait;
}

.invoice {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
  direction: rtl;
  font-size: 12px;
  inline-size: 80mm;
  line-height: 1.5;
  margin-block: 0;
  margin-inline: auto;
}

p {
  margin-block-end: 0;
}

p,
h4,
.table {
  /* Prevent page breaks inside elements */
  page-break-after: avoid;
  page-break-inside: avoid;
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
    margin-block-end: 10px;
  }
}

p.d-felx {
  justify-content: space-between;
  inline-size: 100%;
}

.bold {
  font-size: 14px;
  font-weight: 700;
}
</style>
