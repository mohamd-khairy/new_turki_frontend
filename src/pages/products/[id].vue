<script setup>
import { useProductsStore } from "@/store/Products"
import moment from "moment"

const productsListStore = useProductsStore()
const route = useRoute()

const product = ref({})
const isLoading = ref(false)

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

onMounted(() => {
  const id = route.params.id

  isLoading.value = true

  productsListStore.fetchProduct(id).then(response => {
    isLoading.value = false
    product.value = response.data.data
  }).catch(error => {
    isLoading.value = false
  })
})
</script>

<template>
  <div>
    <div
      v-if="!isLoading"
      class="card-wrapper"
    >
      <div class="card">
        <!-- card left -->
        <div class="product-imgs">
          <VCarousel
            hide-delimiter-background
            cycle
            :show-arrows="product.images > 1"
          >
            <VCarouselItem
              v-for="image in product.images"
              :key="image.id"
              cover
            >
              <img
                :src="image.image_url"
                alt=""
              >
            </VCarouselItem>
          </VCarousel>
        </div>
        <!-- card right -->
        <div class="product-content">
          <h2 class="product-title text-white pb-2">
            {{ product ? product.name_ar : "اسم المنتج" }}
          </h2>
          <p class="mb-5">
            {{ product.description_ar }}
          </p>

          <div class="product-detail mt-5">
            <h2 class="bg-light-primary px-5 py-2">
              <VIcon icon="clarity:details-line" />
              <span class="mx-2">
                تفاصيل المنتج
              </span>
            </h2>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  سعر المنتج :
                </span>
                <VChip class="mx-1">
                  {{ product ? ConvertToArabicNumbers(product.price) : ConvertToArabicNumbers(0) }}
                  ريال
                </VChip>
              </h3>
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  سعر البيع :
                </span>
                <VChip
                  class="font-weight-bold"
                  :class="{'text-error': product['sale price'] === 'undefined', 'text-success': product['sale price'] !== 'undefined' }"
                >
                  {{
                    product['sale price'] !== "undefined" ? ConvertToArabicNumbers(product['sale price']) : ConvertToArabicNumbers(0)
                  }} ريال
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  الوزن :
                </span>
                <VChip
                  class="font-weight-bold"
                  :class="{'text-error': product.weight === 'undefined', 'text-success': product.weight !== 'undefined' }"
                >
                  {{
                    product.weight !== "undefined" ? ConvertToArabicNumbers(product.weight) + "كيلو جرام" : "لا يوجد حجم"
                  }}
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  السعرات الحرارية :
                </span>
                <VChip
                  class="font-weight-bold"
                  :class="{'text-error': product.calories === 'undefined', 'text-success': product.calories !== 'undefined' }"
                >
                  {{
                    product.calories !== "undefined" ? ConvertToArabicNumbers(product.calories) + "كيلو جرام" : "لا يوجد "
                  }}
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  عدد مرات التقييم :
                </span>
                <VChip
                  class="font-weight-bold"
                  :class="{'text-error': product.no_rating === 'undefined', 'text-success': product.no_rating !== 'undefined' }"
                >
                  {{
                    product.no_rating !== "undefined" ? ConvertToArabicNumbers(product.no_rating) + " " + "مرات " : "لا يوجد  "
                  }}
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  عدد مرات البيع :
                </span>
                <VChip
                  class="font-weight-bold"
                  :class="{'text-error': product.no_sale === 'undefined', 'text-success': product.no_sale !== 'undefined' }"
                >
                  {{
                    product.no_sale !== "undefined" ? ConvertToArabicNumbers(product.no_sale ? product.no_sale : 0) + " " + "مرات " : "لا يوجد  "
                  }}
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  الفئة :
                </span>
                <VChip
                  class="font-weight-bold"
                  :class="{'text-error': product.category === 'undefined', 'text-success': product.category !== 'undefined' }"
                >
                  {{
                    product.category ? product.category.type_ar : "لايوجد"
                  }}
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  الفئة الفرعية :
                </span>
                <VChip
                  class="font-weight-bold"
                  :class="{'text-error': product.sub_category === 'undefined', 'text-success': product.sub_category !== 'undefined' }"
                >
                  {{
                    product.sub_category ? product.sub_category.type_ar : "لايوجد"
                  }}
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  المدن :
                </span>
                <VChip
                  v-for="city in product.cities"
                  :key="city.id"
                  class="font-weight-bold mx-1"
                >
                  {{ city.name_ar }}
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  وسائل الدفع :
                </span>
                <VChip
                  v-for="payment in product.payment_types"
                  :key="payment.id"
                  class="font-weight-bold mx-1"
                >
                  {{ payment.name_ar }}
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  الأحجام :
                </span>
                <VChip
                  v-if="product.sizes === []"
                  class="font-weight-bold mx-1"
                >
                  لا يوجد
                </VChip>
                <VChip
                  v-for="size in product.sizes"
                  v-else
                  :key="size.id"
                  class="font-weight-bold mx-1"
                >
                  {{ size.name_ar }}
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  القطع :
                </span>
                <VChip
                  v-if="product.cuts === []"
                  class="font-weight-bold mx-1"
                >
                  لا يوجد
                </VChip>
                <VChip
                  v-for="cut in product.cuts"
                  v-else
                  :key="cut.id"
                  class="font-weight-bold mx-1"
                >
                  {{ cut.name_ar }}
                </VChip>
              </h3>
            </div>
            <div class="product-price">
              <h3 class="text-base font-weight-bold mb-2">
                <VIcon
                  icon="arcticons:destiny-item-manager"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  التجهيز :
                </span>
                <VChip
                  v-if="product.preparations == []"
                  class="font-weight-bold mx-1"
                >
                  لا يوجد
                </VChip>
                <VChip
                  v-for="preparation in product.preparations"
                  v-else
                  :key="preparation.id"
                  class="font-weight-bold mx-1"
                >
                  {{ preparation.name_ar }}
                </VChip>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="loader_wrap"
    >
      <img
        src="@/assets/images/logo.png"
        alt="turki"
        width="100"
      >
      <p class="text-2xl">
        جاري جلب البيانات ...
      </p>
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

.product-content {
  padding-block: 2rem;
  padding-inline: 1rem;
}

.product-title {
  position: relative;
  font-size: 3rem;
  font-weight: 700;
  inline-size: fit-content;

  //color: #12263a;
  margin-block: 1rem;
  margin-inline: 0;
  text-transform: capitalize;
}

.product-title::after {
  position: absolute;
  background: rgb(var(--v-global-theme-primary));
  block-size: 4px;
  content: "";
  inline-size: 50%;
  inset-block-end: 0;
  inset-inline-end: 0;
}

.product-detail h2 {
  position: relative;
  inline-size: fit-content;
  margin-block-end: 20px;
}

.product-detail h2::after {
  position: absolute;
  background: rgb(var(--v-global-theme-primary));
  block-size: 4px;
  content: "";
  inline-size: 100%;
  inset-block-end: 0;
  inset-inline-end: 0;
}

.product-link {
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
    display: grid;
    grid-gap: 1.5rem;
    grid-template-columns: 1fr 2fr;
  }

  .card-wrapper {
    align-items: center;
    //height: 100vh;
    //display: flex;
    justify-content: center;
  }

  .product-imgs {
    max-inline-size: 500px;
  }

  .product-content {
    padding-block-start: 0;
  }
}
</style>
