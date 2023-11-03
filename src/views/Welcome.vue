<template>
	<MapBox />
</template>

<script type="text/javascript">
import MapBox from '@/components/MapBox'

export default {
	name: 'Welcome',
	components: {
		MapBox,
	},
}
</script>

<style type="text/scss">
	.navbar {
		width: 100vh;
		padding-right: 10vh;
	}
</style>
