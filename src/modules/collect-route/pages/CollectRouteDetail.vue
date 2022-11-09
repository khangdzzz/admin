<template>
  <div class="tw">
    <a-spin :spinning="loading" :tip="$t('common_loading')" class="w-full h-full">
      <div class="flex flex-col h-full p-[30px] bg-primary-50">
        <CollectRouteHeader :allowBack="allowBack" :title="pageTitle" :disabled="!readOnlyPage" @back="handleCancel"
          @delete="handleDelete" @edit="handleEdit" />
        <div class="card grid grid-cols-2 gap-5">
          <a-form @validate="validate">
            <BaseForm v-model="formFields" :loading="loading" />
          </a-form>
          <BaseMap ref="map" v-model:linePoints="linePoints" :loading="loading" v-model:center="center"
            :markers="markers" v-model:drawable="drawable" />
        </div>
        <div class="mt-5 flex justify-center gap-5" v-if="!readOnlyPage">
          <div class="btn--text-primary-400 w-[180px]" @click="handleCancel">
            {{ $t("btn_cancel") }}
          </div>
          <div class="btn w-[180px]" :class="[disableSubmit ? 'btn--disabled' : 'bg-primary-400']"
            @click="handleSubmit">
            {{ $t("btn_submit") }}
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script lang="ts">
import collectionPoint from "@/assets/icons/ic_collection_point_marker.svg";
import { getFormRequestData, useForm } from "@/composable/form";
import Messager from "@/composable/message";
import { i18n } from "@/i18n";
import BaseMap from "@/modules/base/components/BaseMap.vue";
import BaseForm from "@/modules/base/components/forms/BaseForm.vue";
import {
  FormItems,
  IFormField
} from "@/modules/base/components/forms/form-models";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import { CollectionPoint } from "@/modules/collection-point-management/models/collection-point.model";
import { workPlace } from "@/modules/staff-management/models/staff.model";
import { ICONS } from "@/modules/workplace/models/workplace.config";
import { WorkPlaceType } from "@/modules/workplace/models/workplace.model";
import { routeNames } from "@/routes/route-names";
import { service } from "@/services";
import { computed, defineComponent, inject, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import {
  CollectRouteDto,
  CollectRouteViewModel
} from "../models/collect-route-model";
import CollectRouteHeader from "./CollectRouteHeader.vue";

enum PageMode {
  DETAIL = "detail",
  CREATE = "create",
  EDIT = "edit"
}

export default defineComponent({
  components: {
    BaseMap,
    BaseForm,
    CollectRouteHeader
  },
  setup() {
    const prevRoute = ref(routeNames.listCollectionRoute);
    const fetchedWorkplaces = ref(false);
    const { t } = i18n.global;
    const messenger: (param: MessengerParamModel) => void =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      inject("messenger")!;
    const workplaceIcons = ref(ICONS);
    const workPlaces = ref<workPlace[]>([]);
    const route = ref(useRoute());
    const pageMode = ref(route.value.params.mode);
    const loading = ref(false);
    const drawable = computed(() => pageMode.value !== PageMode.DETAIL);
    const center = ref<number[]>([138.322486, 36.848156]);
    const collect_points = ref<CollectionPoint[]>([]);
    const map = ref(null);
    const linePoints = ref<number[][]>([]);

    const fitMap = (): void => {
      if (map.value) (map.value as { fitMap: () => void }).fitMap();
    };
    const getListWorkplaces = (): void => {
      if (fetchedWorkplaces.value) return;
      loading.value = true;
      service.staff
        .getListWorkPlace()
        .then((res) => {
          const validTypes = [
            WorkPlaceType.COLLECTION_BASE,
            WorkPlaceType.DISPOSAL,
            WorkPlaceType.PARTNER
          ];
          if (!res || !res.results) return;
          workPlaces.value = res.results.filter(
            (x) =>
              x.latitude &&
              x.longitude &&
              x.workPlaceType &&
              x.workPlaceType in validTypes
          );
          fetchedWorkplaces.value = true;
        })
        .finally(() => (loading.value = false));
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
        change: fitMap
      },
      end_point_id: {
        label: t("end_point"),
        component: FormItems.SELECT,
        value: "",
        options: [],
        fieldNames: { label: "name", value: "id" },
        change: fitMap
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
          if (pageMode.value !== "detail") {
            getListWorkplaces();
          }
          setTimeout(() => {
            if (map.value) {
              (map.value as { refreshMap: () => void }).refreshMap();
            }
          }, 300);
          ["start_point_id", "end_point_id"].forEach((key) => {
            formFields.value[key].disabled = pageMode.value === PageMode.DETAIL;
          });
          Object.keys(formFields.value).forEach((key) => {
            formFields.value[key].readonly = pageMode.value === PageMode.DETAIL;
          });
          formFields.value.list_coordinates.noDivider =
            pageMode.value === PageMode.DETAIL;
        },
        {
          deep: true,
          immediate: true,
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
      workplaceIcons,
      fetchedWorkplaces,
      getListWorkplaces,
      fitMap,
      prevRoute
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
        case PageMode.DETAIL:
          return this.$t("route_detail");
        case PageMode.EDIT:
          return this.$t("edit_route");
        default:
          return this.$t("create_new_route");
      }
    },
    readOnlyPage() {
      return this.pageMode === PageMode.DETAIL;
    },
    isEditing() {
      return this.pageMode === PageMode.EDIT;
    },
    allowBack() {
      return this.pageMode !== PageMode.CREATE;
    },
    disableSubmit() {
      return !this.formFields.list_coordinates.value;
    }
  },
  beforeRouteEnter(to, from, next) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    next((vm: any) => {
      if (from.name) vm.prevRoute = from.name;
    });
  },
  async mounted() {
    const { id } = this.$route.params;
    if (!id) return;
    this.loading = true;
    let data = {} as CollectRouteDto;
    const collectRes = await service.collectRoute.getCollectRoute(+id);
    data = { ...collectRes } as CollectRouteDto;
    if (collectRes) {
      this.linePoints = this.parseListCoordinates(collectRes.list_coordinates);
      if (!this.pageMode) {
        this.pageMode = PageMode.DETAIL;
        this.$router.replace({
          params: {
            mode: this.pageMode
          }
        });
      }
    } else {
      this.pageMode = PageMode.CREATE;
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
      this.initFormData(data);
      const {
        listCollectionPoint,
        start_point_workplace,
        end_point_workplace
      } = data;
      if (this.pageMode === PageMode.DETAIL) {
        this.workPlaces = [start_point_workplace, end_point_workplace].filter(
          (x) => x
        );
      }
      this.collect_points = listCollectionPoint || [];
      this.fitMap();
    } else {
      this.$router.push({
        name: routeNames.listCollectionRoute
      });
    }
    this.loading = false;
  },
  methods: {
    initFormData(data) {
      this.formFields = useForm(this.formFields, data);
    },
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
      this.pageMode = PageMode.EDIT;
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
        Messager.success.delete(this.messenger, () => this.handleCancel());
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
        this.pageMode = PageMode.DETAIL;
        this.$router.replace({
          params: {
            mode: this.pageMode,
            id: id,
            routeId: res.id
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
      this.$router.push({ name: this.prevRoute });
    }
  }
});
</script>
