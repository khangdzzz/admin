<template>
  <div v-if="isShowPagination" :class="CommonPagination.pagination">
    <a-pagination
      :current="currentPage"
      :page-size="pageSize"
      :total="total"
      :pageSizeOptions="['20', '30', '40', '50']"
      show-size-changer
      @showSizeChange="onShowSizeChange"
      @change="onChange"
      :class="['ant-pagination', 'd-flex', 'justify-end']"
    >
      <template #itemRender="item">
        <a-button
          :class="[CommonPagination.btnPagination, 'mt-10']"
          type="primary"
          ghost
          v-if="item.type === 'prev' && isShowPrevBtn"
        >
          <img
            src="@/assets/icons/ic_prev.svg"
            :class="[CommonPagination.btnIconPrev]"
          />
          <span :class="[CommonPagination.action]">{{
            $t("previous_btn")
          }}</span>
        </a-button>
        <a-button
          :class="[CommonPagination.btnPagination, 'mt-10', 'mr-15']"
          type="primary"
          ghost
          v-else-if="item.type === 'next' && isShowNextBtn"
        >
          <span :class="[CommonPagination.action]">{{ $t("next_btn") }}</span>
          <img
            src="@/assets/icons/ic_next.svg"
            :class="[CommonPagination.btnIconNext]"
          />
        </a-button>

        <component
          v-else-if="item.type === 'page'"
          :is="item.originalElement"
        ></component>
      </template>

      <template #buildOptionText="{ value }">
        <div class="options-text">
          <span class="mr-13">{{ value }} </span>
          <img src="@/assets/icons/ic_arrow.svg" />
        </div>
      </template>
    </a-pagination>
  </div>
</template>

<script setup lang="ts">
//#===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆import
//#endregion===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆===🍆
//#===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props
defineProps({
  isShowPagination: {
    type: Boolean,
    default: false
  },
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: [Number, String],
    default: 20
  },
  total: {
    type: Number,
    default: 0
  },
  isShowPrevBtn: {
    type: Boolean,
    default: false
  },
  isShowNextBtn: {
    type: Boolean,
    default: false
  }
});
//#endregion===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜===👜Props

//#===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎Variables
//#endregion===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎===🍎

//#===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌Hooks
//#endregion===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌===🦌

//#===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊Methods
const onChange = (pageNumber: number): void => {
  emit("onChange", pageNumber);
};

const onShowSizeChange = (current: number, pageSize: number): void => {
  emit("onShowSizeChange", current, pageSize);
};

//#endregion===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊===🌊

//#===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏Computed
//#endregion===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏===🍏

//#===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍Emits
const emit = defineEmits<{
  (e: "onChange", value: number): void;
  (e: "onShowSizeChange", current: number, pageSize: number): void;
}>();
//#endregion===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍===🐍

//===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀Watchers
//#endregion===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀===👀
</script>

<style lang="scss" module="CommonPagination">
@mixin size-btn($width, $height) {
  min-width: $width;
  height: $height;
}

@mixin text($fontWeight, $fontSize, $lineHeight) {
  font-weight: $fontWeight;
  font-size: $fontSize;
  line-height: $lineHeight;
}
.pagination {
  text-align: end;
  background-color: #fff;
  height: 60px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  .btnPagination {
    @include size-btn(82px, 40px);
    border-color: $grey-1;
    background-color: #fff;
    border-radius: 6px;

    .btnIconPrev {
      margin-right: 8px;
    }

    .btnIconNext {
      margin-left: 8px;
    }
  }

  .action {
    @include text(700, 14px, 18px);
    text-align: center;
    color: $neutral-600;
  }
}
</style>
