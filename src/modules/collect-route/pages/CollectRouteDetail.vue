<template>
  <div class="tw">
    <a-spin
      :spinning="loading"
      :tip="$t('common_loading')"
      class="w-full h-full"
    >
      <div class="flex flex-col h-full p-[30px] bg-primary-50">
        <div class="flex justify-between mb-5">
          <div class="flex items-center gap-5">
            <img src="@/assets/icons/ic_back.svg" />
            <div class="font-bold text-2.5xl text-neutral-600">
              {{ pageTitle }}
            </div>
          </div>
          <div v-if="disablePage" class="flex gap-[15px]">
            <div class="btn--text-primary-400 w-[120px]" @click="handleEdit">
              <img src="@/assets/icons/ic_btn_edit.svg" />{{ $t("edit_btn") }}
            </div>
            <div class="btn--text-red-500 w-[120px]" @click="handleDelete">
              <IcDelete :color="'#f54e4e'" />{{ $t("delete_btn") }}
            </div>
          </div>
        </div>
        <div class="card grid grid-cols-2 gap-5">
          <a-form @validate="validate">
            <BaseForm v-model="formFields" :loading="loading" />
          </a-form>
          <BaseMap
            ref="map"
            v-model:linePoints="linePoints"
            :loading="loading"
            :center="center"
            :markers="markers"
            v-model:drawable="drawable"
          />
        </div>
        <div class="mt-5 flex justify-center gap-5" v-if="!disablePage">
          <div class="btn--text-primary-400 w-[180px]" @click="handleCancel">
            {{ $t("btn_cancel") }}
          </div>
          <div
            class="btn w-[180px]"
            :class="[disableSubmit ? 'btn--disabled' : 'bg-primary-400']"
            @click="handleSubmit"
          >
            {{ $t("btn_submit") }}
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script lang="ts">
import IcDelete from "@/assets/icons/IcDelete.vue";
import collectionPoint from "@/assets/icons/ic_collection_point_marker.svg";
import { useForm, getFormRequestData } from "@/composable/form";
import Messager from "@/composable/message";
import BaseMap from "@/modules/base/components/BaseMap.vue";
import BaseForm from "@/modules/base/components/forms/BaseForm.vue";
import {
  FormItems,
  IFormField
} from "@/modules/base/components/forms/form-models";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { CollectionPoint } from "@/modules/collection-point-management/models/collection-point.model";
import { service } from "@/services";
import { defineComponent, inject, onMounted, ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { CollectRouteViewModel } from "../models/collect-route-model";
import { workPlace } from "@/modules/staff-management/models/staff.model";
import { WorkPlaceType } from "@/modules/workplace/models/workplace.model";
import { ICONS } from "@/modules/workplace/models/workplace.config";
import { i18n } from "@/i18n";

export default defineComponent({
  components: {
    BaseMap,
    BaseForm,
    IcDelete
  },
  setup() {
    const { t } = i18n.global;
    const messenger: (param: MessengerParamModel) => void =
      inject("messenger")!;
    const workplaceIcons = ref(ICONS);
    const workPlaces = ref<workPlace[]>([]);
    const route = ref(useRoute());
    const pageMode = ref(route.value.params.mode);
    const loading = ref(false);
    const drawable = computed(() => pageMode.value !== "detail");
    const center = ref<number[]>([138.322486, 36.848156]);
    const collect_points = ref<CollectionPoint[]>([]);
    const map = ref(null);
    const linePoints = ref<number[][]>([]);
    const setCenterByWorkplaceId = (id: number) => {
      const workplace = workPlaces.value.find((x) => x.id === id);
      if (!workplace) return;
      center.value = [workplace.longitude, workplace.latitude];
    };
    const formFields = ref<IFormField<CollectRouteViewModel, workPlace>>({
      name: {
        label: t("name"),
        component: FormItems.INPUT,
        value: "",
        disabled: true
      },
      workPlace: {
        label: t("work_place"),
        component: FormItems.INPUT,
        value: "",
        disabled: true
      },
      start_point_id: {
        label: t("start_point"),
        component: FormItems.SELECT,
        value: "",
        options: [],
        fieldNames: { label: "name", value: "id" },
        change: (id) => setCenterByWorkplaceId(id)
      },
      end_point_id: {
        label: t("end_point"),
        component: FormItems.SELECT,
        value: "",
        options: [],
        fieldNames: { label: "name", value: "id" },
        change: (id) => setCenterByWorkplaceId(id)
      },
      list_coordinates: {
        label: t("route"),
        component: "CollectionRouteNote",
        value: "",
        noDivider: true
      }
    });
    onMounted(() => {
      watch(
        workPlaces,
        () => {
          formFields.value.start_point_id.options = workPlaces.value;
          formFields.value.end_point_id.options = workPlaces.value;
        },
        {
          deep: true
        }
      );
      watch(
        pageMode,
        () => {
          setTimeout(() => {
            if (map.value) {
              (map.value as { refreshMap: () => void }).refreshMap();
            }
          }, 300);
          ["start_point_id", "end_point_id"].forEach((key) => {
            formFields.value[key].disabled = pageMode.value === "detail";
          });
          Object.keys(formFields.value).forEach((key) => {
            formFields.value[key].readonly = pageMode.value === "detail";
          });
          formFields.value.list_coordinates.noDivider =
            pageMode.value === "detail";
        },
        {
          deep: true,
          flush: "post"
        }
      );
      watch(
        linePoints,
        () => {
          formFields.value.list_coordinates.value = linePoints.value.length
            ? JSON.stringify(linePoints.value)
            : "";
        },
        {
          deep: true
        }
      );
      watch(
        () => formFields.value.list_coordinates.value,
        () => {
          if (map.value) {
            (map.value as { refreshMap: () => void }).refreshMap();
          }
        },
        {
          deep: true,
          flush: "post"
        }
      );
    });

    return {
      messenger,
      linePoints,
      formFields,
      map,
      collect_points,
      center,
      drawable,
      loading,
      pageMode,
      workPlaces,
      t,
      workplaceIcons
    };
  },
  computed: {
    collectionPoint() {
      return collectionPoint;
    },
    markers() {
      const collectPoints = this.collect_points.map((x) => ({
        coordinate: [x.longitude, x.latitude],
        icon: collectionPoint,
        name: x.name
      }));
      const { end_point_id, start_point_id } = this.formFields;
      const workplaces = this.workPlaces
        .filter((x) =>
          [end_point_id.value, start_point_id.value].includes(x.id)
        )
        .map((x) => ({
          coordinate: [x.longitude, x.latitude],
          icon: this.workplaceIcons[
            x.workPlaceType || WorkPlaceType.COLLECTION_BASE
          ][x.id === start_point_id.value ? "start" : "end"],
          name: x.name
        }));
      return [...workplaces, ...collectPoints];
    },
    pageTitle() {
      switch (this.pageMode) {
        case "detail":
          return this.$t("route_detail");
        case "edit":
          return this.$t("edit_route");
        default:
          return this.$t("create_new_route");
      }
    },
    disablePage() {
      return this.pageMode === "detail";
    },
    isEditing() {
      return this.pageMode === "edit";
    },
    disableSubmit() {
      return !this.formFields.list_coordinates.value;
    }
  },
  async mounted() {
    const { id } = this.$route.params;
    if (!id) return;
    this.loading = true;
    await service.staff.getListWorkPlace().then((res) => {
      const validTypes = [
        WorkPlaceType.COLLECTION_BASE,
        WorkPlaceType.DISPOSAL,
        WorkPlaceType.PARTNER
      ];
      if (!res || !res.results) return;
      this.workPlaces = res.results.filter(
        (x) =>
          x.latitude &&
          x.longitude &&
          x.workPlaceType &&
          x.workPlaceType in validTypes
      );
    });
    const collectRes = await service.collectRoute.getCollectRoute(+id);
    let data = { ...collectRes };
    if (collectRes) {
      this.linePoints = this.parseListCoordinates(collectRes.list_coordinates);
      if (!this.pageMode) {
        this.pageMode = "detail";
        this.$router.replace({
          params: {
            mode: this.pageMode
          }
        });
      }
    } else {
      this.pageMode = "create";
      this.$router.replace({
        params: {
          mode: this.pageMode
        }
      });
    }
    const collectionRes = await service.collectionRoute.getCollectionRouteById(
      +id
    );
    if (collectionRes) {
      data = {
        ...data,
        ...collectionRes
      };
      this.formFields = useForm(this.formFields, data);
      this.collect_points = collectionRes.listCollectionPoint || [];
      const { start_point_id, end_point_id } = this.formFields;
      if (start_point_id.value) {
        const workplace = this.workPlaces.find(
          (x) => x.id === start_point_id.value
        );
        if (workplace) this.center = [workplace.longitude, workplace.latitude];
      } else if (end_point_id.value) {
        const workplace = this.workPlaces.find(
          (x) => x.id === end_point_id.value
        );
        if (workplace) this.center = [workplace.longitude, workplace.latitude];
      } else
        this.center = collectionRes.listCollectionPoint?.map((x) => [
          x.longitude,
          x.latitude
        ])[0] || [138.322486, 36.848156];
    }
    this.loading = false;
  },
  methods: {
    parseListCoordinates(list_coordinates: string) {
      try {
        return JSON.parse(list_coordinates);
      } catch {
        return [];
      }
    },
    validate(e) {
      console.log(e);
    },
    handleEdit() {
      this.pageMode = "edit";
      this.$router.replace({
        params: {
          mode: this.pageMode
        }
      });
    },
    async handleDelete() {
      Messager.confirmDelete(this.messenger, this.delete);
    },
    async delete() {
      const { id } = this.$route.params;
      if (!id) return;
      this.loading = true;
      const success = await service.collectRoute.deleteCollectRoute([+id]);
      this.loading = false;
      if (success) {
        Messager.success.delete(this.messenger, () => history.back());
        this.resetForm();
      } else Messager.error.delete(this.messenger);
    },
    resetForm() {
      ["start_point_id", "end_point_id", "list_coordinates"].forEach((key) => {
        this.formFields[key].value = "";
      });
      this.linePoints = [];
      this.disableDrawMap();
    },
    disableDrawMap() {
      if (this.map) (this.map as { disableDraw: () => void }).disableDraw();
    },
    async handleSubmit() {
      this.loading = true;
      const { id } = this.$route.params;

      const data = {
        ...getFormRequestData(this.formFields),
        collect_order_id: +id
      };
      const res = await service.collectRoute.createCollectRoute(
        data,
        this.isEditing
      );
      if (res) {
        if (this.isEditing) Messager.success.update(this.messenger);
        else Messager.success.create(this.messenger);
        this.pageMode = "detail";
        this.$router.replace({
          params: {
            mode: this.pageMode
          }
        });
        this.disableDrawMap();
      } else {
        if (this.isEditing) Messager.error.update(this.messenger);
        else Messager.error.create(this.messenger);
      }
      this.loading = false;
    },
    handleCancel() {
      history.back();
    }
  }
});
</script>
