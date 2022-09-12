<template>
    <div>Login</div>
</template>

<script setup lang="ts">
//#region import
//#endregion

import { router } from '@/routes';
import { routeNames } from '@/routes/route-names';
import { service } from '@/services';
//#region props
//#endregion

//#region variables
//#endregion

//#region hooks
//#endregion

//#region function
const login = (): void => {
    service.localStorage.setAccessToken('Nghia')
    router.push({ name: routeNames.home })
}
//#endregion

//#region computed
//#endregion

//#region reactive
//#endregion
</script>

<style lang="scss" scoped>

</style>