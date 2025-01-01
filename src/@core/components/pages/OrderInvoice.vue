<script setup>
import moment from "moment"
import { useI18n } from "vue-i18n"

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  invoice: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'update:isOpen',
])

const isLoading = ref(false)

const { t } = useI18n()

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

const dialogModelValueUpdate = val => {
  emit('update:isOpen', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650"
    :model-value="props.isOpen"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-9 pa-5">
      <div class="logo p-2 text-center mb-2">
        <VIcon
          icon="iconoir:n-square"
          color="primary"
          size="50"
        />
      </div>
      <hr class="my-3">
      <div class="invoice p-5 mt-3 text-center">
        <h3>تم تأكيد الطلب الخاص بك !</h3>
        <div class="payment border-top mt-3 mb-3 border-bottom table-responsive">
          <table class="table table-borderless">
            <tbody>
              <tr>
                <td>
                  <div class="py-2 px-3">
                    <span class="d-block text-muted font-weight-bold">تاريخ الطلب</span>
                    <span>{{ ConvertToArabicNumbers(formatDateTime(new Date()).date) }}</span>
                  </div>
                </td>
                <td>
                  <div class="py-2 px-3">
                    <span class="d-block text-muted font-weight-bold">رقم الطلب</span> <span>MT12332345</span>
                  </div>
                </td>
                <td>
                  <div class="py-2 px-3">
                    <span class="d-block text-muted font-weight-bold">طريقة الدفع</span>
                    <VIcon
                      icon="game-icons:cash"
                      color="success"
                      size="32"
                    />
                  </div>
                </td>
                <td>
                  <div class="py-2">
                    <span class="d-block text-muted font-weight-bold">عنوان التوصيل</span>
                    <span>الرياض </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="product border-bottom table-responsive">
          <table class="table table-borderless">
            <tbody>
              <tr>
                <td width="20%">
                  <img
                    src="https://turki.almaraacompany.com/admin/public/storage/category_images/img_vRF4ASftb5HbVvlzQGfHcJQhVoLGISeXjEBihSvg.png"
                    width="90"
                  >
                </td>
                <td width="60%">
                  <span class="font-weight-bold">منتجات ألبان</span>
                  <div class="product-qty">
                    <span class="d-block font-weight-bold text-base">
                      <span>الكمية:</span>
                      {{ ConvertToArabicNumbers(10) }}
                    </span>
                  </div>
                </td>
                <td width="20%">
                  <div class="text-right">
                    <span class="font-weight-bold">
                      {{ ConvertToArabicNumbers(Intl.NumberFormat().format(106.50)) }} ريال
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <hr class="my-3 text-primary">
        <div class="row d-flex justify-content-end">
          <div class="col-md-5">
            <table class="table table-borderless">
              <tbody class="totals">
                <tr>
                  <td>
                    <div class="text-left">
                      <span class="text-muted text-base">المجموع الفرعي :</span>
                    </div>
                  </td>
                  <td>
                    <div class="text-right">
                      <span class="mx-2 text-success text-base">
                        {{ ConvertToArabicNumbers(Intl.NumberFormat().format(92.50)) }} ريال
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="text-left">
                      <span class="text-muted text-base">رسوم الشحن: </span>
                    </div>
                  </td>
                  <td>
                    <div class="text-right">
                      <span class="mx-2 text-success text-base">
                        {{ ConvertToArabicNumbers(Intl.NumberFormat().format(2.50)) }} ريال
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="text-left">
                      <span class="text-muted text-base">الرسوم الضريبية :</span>
                    </div>
                  </td>
                  <td>
                    <span class="mx-2 text-success text-base">
                      {{ ConvertToArabicNumbers(Intl.NumberFormat().format(7.50)) }} ريال
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="text-left">
                      <span class="text-muted text-base">الخصم : </span>
                    </div>
                  </td>
                  <td>
                    <div class="text-right text-base">
                      <span class="mx-2 text-error">
                        - {{ ConvertToArabicNumbers(Intl.NumberFormat().format(0)) }} ريال
                      </span>
                    </div>
                  </td>
                </tr>
                <tr class="border-top border-bottom">
                  <td>
                    <div class="text-left">
                      <span class="font-weight-bold text-base">المجموع الكلي: </span>
                    </div>
                  </td>
                  <td>
                    <div class="text-right">
                      <span class="mx-2 font-weight-bold text-success text-base">
                        {{ ConvertToArabicNumbers(Intl.NumberFormat().format(106.5)) }} ريال
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!--      <p>We will be sending shipping confirmation email when the item shipped successfully!</p> -->
        <!--      <p class="font-weight-bold mb-0">Thanks for shopping with us!</p> <span>Nike Team</span> -->
      </div>
      <!--    <div class="d-flex justify-content-between footer p-3"><span>Need Help? visit our <a href="#" -->
      <!--    > help center</a></span> <span>12 June, 2020</span></div> -->
    </VCard>
  </VDialog>
</template>

<style scoped lang="scss">
.logo {
  //background-color: #eeeeeea8
}

.totals tr td {
  font-size: 13px;
}

.footer {
  background-color: #eeeeeea8;
}

.footer span {
  font-size: 12px;
}

.product-qty span {
  color: #dedbdb;
  font-size: 12px;
}
</style>
