<template>
  <div class="flex flex-col">
    <p>ادخل الكمية</p>

    <div class="number">
      {{ modelValue }}
    </div>

    <div class="calcNum">
      <VBtn v-for="button in buttons" :key="button.label" @click="handleButtonClick(button.action)">
        {{ button.label }}
      </VBtn>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const modelValue = defineModel({
  name: "modelValue",
  type: [String, Number],
  required: true,
})


const buttons = [
  { label: "1", action: () => appendNum(1) },
  { label: "2", action: () => appendNum(2) },
  { label: "3", action: () => appendNum(3) },
  { label: "4", action: () => appendNum(4) },
  { label: "5", action: () => appendNum(5) },
  { label: "6", action: () => appendNum(6) },
  { label: "7", action: () => appendNum(7) },
  { label: "8", action: () => appendNum(8) },
  { label: "9", action: () => appendNum(9) },
  { label: ".", action: () => addDecimal() },
  { label: "0", action: () => appendNum(0) },
  { label: "C", action: () => clearValue() },
]

const appendNum = num => {
  if (modelValue.value === "0" && num === "0") return
  modelValue.value += num
}

const addDecimal = () => {
  if (!modelValue.value.includes(".")) {
    modelValue.value += modelValue.value ? "." : "0."
  }
}

const clearValue = () => modelValue.value = ""


const handleButtonClick = action => action()
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

p {
  font-size: 2rem;
  margin-block-end: 0;
}

.number {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  block-size: 50px;
  font-size: 1.2rem;
  font-weight: bold;
  inline-size: 100%;
}

.calcNum {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(3, 1fr);
  inline-size: 100%;
}

:deep(.v-btn) {
  background-color: #fff !important;
  block-size: 80px;
  color: #333 !important;
  font-size: 1.5rem;
  text-align: center;
}
</style>
