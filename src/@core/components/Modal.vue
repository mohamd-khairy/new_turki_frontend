<template>
  <VDialog v-model="dialog" :persistent="persistent" :max-width="width" @afterLeave="$emit('afterLeave')">
    <!-- <div v-if="isCloseable" :class="locale" class="close" @click="dialog = false" v-html="icons.CloseIcon" /> -->
    <VCard>
      <div v-if="title" class="title">
        <VCardTitle v-if="title">
          {{ title }}
        </VCardTitle>
        <slot v-else name="title" />
      </div>
      <div class="content">
        <AppLoading v-if="!isDataLoaded" />
        <slot v-else name="content" />
      </div>
      <template v-if="!customAction" #actions>
        <slot name="actions" />
      </template>
      <div v-if="isLoading" class="loader_wrap">
        <div class="loading_spin" />
      </div>
    </VCard>
  </VDialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  width: [String, Number],
  isCloseable: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: '',
  },
  persistent: {
    type: Boolean,
    default: true,
  },
  customAction: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  isDataLoaded: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'afterLeave'])

const { locale } = useI18n()

import AppLoading from './AppLoading.vue';

const dialog = ref(props.modelValue)

watch(dialog, newValue => {
  emit('update:modelValue', newValue)
})

watch(
  () => props.modelValue,
  newValue => {
    dialog.value = newValue
  },
)
</script>

<style lang="scss" scoped>
::v-deep {
  .v-card {
    margin: 1rem;
    background-color: #eee;
  }

  .title {
    padding-block: 2rem;
    padding-inline: 2.5rem;

    .v-card-title {
      padding: 0;
      font-size: 1.5rem;
    }
  }

  .title + .content {
    padding-block: 0 2rem;
    padding-inline: 2.5rem;
  }

  .v-card-actions {
    justify-content: flex-start !important;
    gap: 1rem;

    .v-btn ~ .v-btn:not(.v-btn-toggle .v-btn) {
      margin-inline-start: 0 !important;
    }
  }

  .v-field__field {
    align-items: center;
  }
}

.close {
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 6px;
  background-color: rgba(var(--v-theme-background), 1);
  block-size: 32px;
  box-shadow: 0 2px 4px 0 #a5a3ae4d;
  color: rgba(var(--v-theme-text_800), 1);
  cursor: pointer;
  inline-size: 32px;
  inset-block-start: 0;

  &.ar {
    inset-inline-start: 10px;
  }

  &.en {
    inset-inline-end: 10px;
  }

  ::v-deep {
    svg {
      block-size: 12px;
      inline-size: 12px;
    }
  }
}

.content {
  position: relative;
  padding: 2.5rem;
  block-size: 100%;
}
</style>
