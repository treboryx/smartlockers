<script>
	import MapGL from '$lib/MapGL.svelte';
	import MapStylePicker from '$lib/MapStylePicker.svelte';
	let deck;
	let map;
	let currentStyle = 'mapbox://styles/treboryx/cl8t68z9s001b16phmp3p97g2';

	let viewState = {
		longitude: 23.6709,
		latitude: 37.9432,
		zoom: 9,
		maxZoom: 20,
		style: currentStyle
	};
</script>

<MapStylePicker
	{currentStyle}
	on:changed={(e) => {
		map.setStyle(e.detail.style);
		currentStyle = e.detail.style;
	}}
/>
<div class="map">
	<MapGL {viewState} bind:deck bind:map />
</div>

<style>
	.map {
		position: absolute;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vw;
		overflow: hidden;
	}
</style>
