<template lang="pug">
header
	VisionHeader
main
	router-view
</template>

<script>
import {defineAsyncComponent} from "vue";

export default {
	name: 'App',
	components: {
		'VisionHeader': defineAsyncComponent(() => import('@/components/VisionHeader'))
	}
}
</script>
