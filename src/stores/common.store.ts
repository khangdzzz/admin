import { UserInfo } from "@/modules/auth/models";
import { defineStore } from "pinia";
import { storeIds } from "./store-ids";

export const commonStore = defineStore({
  id: storeIds.common,
  state: (): { user: UserInfo | undefined } => ({
    user: undefined
  }),
  getters: {},
  actions: {}
});
