import { defineStore } from "pinia"
import { storeIds } from "./store-ids";

export const commonStore = defineStore({
    id: storeIds.common,
    state: () => ({}),
    getters: {},
    actions: {},
});

