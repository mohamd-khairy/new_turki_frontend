<template>
  <VBtn v-if="title != ''" :color="type" :loading="isLoading" :type="action" :class="type" :disabled="disabled" class="font-weight-bold">
    <span v-if="icon && iconPosition == 'right'" v-html="icon" />
    <span class="mx-3">
      {{ $t(title) }}
    </span>
    <span v-if="icon && iconPosition == 'left'" v-html="icon" />
  </VBtn>
  <VBtn v-else :loading="isLoading" :color="type" :type="action" :disabled="disabled" :class="type" class="font-weight-bold">
    <span v-html="icon" />
    <slot name="content" />
  </VBtn>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: () => '',
  },
  iconPosition: {
    type: String,
    default: () => 'left',
    validator(value) {
      return ['left', 'right'].includes(value)
    },
  },
  type: {
    type: String,
    default: 'primary',
    validator(value) {
      return [
        'primary',
        'danger',
        'warning',
        'close',
        'outline',
        'dark',
        'primary-outline',
        'icon-only',
        'sidebar',
        'hidden',
      ].includes(value)
    },
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  action: {
    type: String,
    default: () => 'button',
    validator(value) {
      return ['button', 'reset', 'submit'].includes(value)
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: [String, Object],
  },
})
</script>

<style lang="scss" scoped>
.v-btn {
  border-radius: 14px;
  block-size: 48px;
  box-shadow: none;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  min-inline-size: unset;

  ::v-deep {
    .v-btn__content {
      gap: inherit;
      line-height: 0;
    }

    .v-theme--light {
      color: rgba(var(--v-theme-on-info), 1) !important;
    }
  }

  &.primary-outline {
    border: 2px solid rgba(var(--v-theme-primary), 1);
    background-color: transparent !important;
    color: rgba(var(--v-theme-primary), 1) !important;
    transition: 0.4s;

    &:hover {
      border: 2px solid rgba(var(--v-theme-primary), 1);
      background-color: rgba(var(--v-theme-primary), 1) !important;
      color: rgba(var(--v-theme-on-info), 1) !important;
    }
  }

  &.primary {
    border: 2px solid rgba(var(--v-theme-primary), 1);
    background-color: rgba(var(--v-theme-primary), 1) !important;
    color: rgba(var(--v-theme-on-info), 1) !important;
    transition: 0.4s;

    &:hover {
      border: 2px solid rgba(var(--v-theme-primary), 1);
      background-color: transparent !important;
      color: rgba(var(--v-theme-primary), 1) !important;
    }

    &:disabled {
      border: none !important;
      background-color: rgba(var(--v-theme-primary), 1) !important;
      color: rgba(var(--v-theme-on-info), 1) !important;
      opacity: 0.5;
    }
  }

  &.danger {
    border: 2px solid rgba(var(--v-theme-error), 1);
    background-color: rgba(var(--v-theme-error), 1) !important;
    color: rgba(var(--v-theme-on-info), 1) !important;
  }

  &.close {
    border: 2px solid rgba(var(--v-theme-btn-close), 1);
    background-color: rgba(var(--v-theme-btn-close), 1);
    color: rgba(var(--v-theme-btn-close-text), 1);
  }

  &.bg-icon-only {
    padding: 0 !important;
    background-color: transparent !important;
    color: rgba(var(--v-theme-btn-disabled-text), 1);
    inline-size: 16px;
  }

  &.outline {
    border: 1px solid var(--Colors-Border-border-disabled, #d0d5dd);
  }

  &.dark {
    background-color: #11044c !important;
    color: #fff;
  }

  &.light_grey {
    background-color: #fafafa !important;
  }

  &.sidebar {
    background-color: rgba(var(--v-theme-sidebar_bg), 1) !important;
  }

  &.hidden {
    display: none;
  }

  &.remove-row {
    padding: 0;
    block-size: 60px;
    inline-size: 100%;
    margin-block-start: 2.3rem !important;

    :deep(svg) {
      block-size: 0.8rem;
      inline-size: 0.8rem;
    }
  }
}

@media (max-width: 600px) {
  .v-btn {
    padding-block: 10px;
    padding-inline: 16px;
  }
}
</style>
