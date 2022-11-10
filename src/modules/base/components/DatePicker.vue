<template>
  <a-date-picker :showToday="false" :allowClear="false">
    <template #prevIcon>
      <div class="prev">
        <IcArrowPrev />
      </div>
    </template>
    <template #nextIcon>
      <div class="next">
        <IcArrowNext />
      </div>
    </template>
    <template #suffixIcon>
      <IcCalendar color="#3C3C3C" />
    </template>
  </a-date-picker>
</template>

<script setup lang="ts">
//#region import
import IcArrowPrev from "@/assets/icons/IcArrowPrev.vue";
import IcArrowNext from "@/assets/icons/IcArrowNext.vue";
import IcCalendar from "@/assets/icons/IcCalendar.vue";
//#endregion

//#region props
//#endregion

//#region variables
//#endregion

//#region hooks
//#endregion

//#region function
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss">
.ant-picker-header {
  display: grid !important;
  grid-template-areas: "monthYear monthYear monthYear monthYear . .";
  padding-left: 24px;
}

.ant-picker-header-view {
  grid-area: monthYear;
  text-align: left;
}

.ant-picker-header-next-btn {
  display: flex;
  justify-content: center;
}

.ant-picker-header-prev-btn {
  display: flex;
  justify-content: center;
}

.next {
  grid-area: next;
  text-align: right;
  width: 10px;
  color: rgba(0, 0, 0, 0.6);

  &:hover {
    color: #07a0b8 !important;
  }
}

.prev {
  grid-area: prev;
  text-align: right;
  width: 10px;
  color: rgba(0, 0, 0, 0.6);

  &:hover {
    color: #07a0b8 !important;
  }
}

.ant-picker-header-super-prev-btn {
  display: none !important;
}

.ant-picker-header-super-next-btn {
  display: none !important;
}

.ant-picker-cell-today {
  .ant-picker-cell-inner {
    &::before {
      border-radius: 50px !important;
    }
  }
}

.ant-picker-cell-inner {
  border-radius: 50px !important;
}

.ant-picker-panel-container {
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.2));
  border-radius: 10px;
}

.ant-picker-header {
  border-bottom: none;
}

.ant-picker-month-btn,
.ant-picker-year-btn {
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 24px !important;
  letter-spacing: 0.1px !important;
  color: rgba(0, 0, 0, 0.6) !important;

  &:hover {
    color: #07a0b8 !important;
  }
}

.ant-picker {
  height: 48px;
  border-radius: 10px;
  width: 100%;
}
</style>
