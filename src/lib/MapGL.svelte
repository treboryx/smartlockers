<script>
	import mapbox from 'mapbox-gl';
	import { onMount } from 'svelte';

	export let map = null;

	let container = null;
	let options = {};

	export let viewState = {};
	onMount(() => {
		mapbox.accessToken = import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN;
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = 'https://unpkg.com/mapbox-gl/dist/mapbox-gl.css';

		const optionsWithDefaults = Object.assign(
			{
				container: container,
				style: viewState.style,
				center: [viewState.longitude, viewState.latitude],
				zoom: viewState.zoom,
				interactive: true
			},
			options
		);

		document.head.appendChild(link);

		link.onload = async () => {
			map = new mapbox.Map(optionsWithDefaults);
			const markers = await fetch('/markers/boxnow').then((res) => res.json());

			map.on('load', () => {
				map.addSource('markers', {
					type: 'geojson',
					data: markers,
					cluster: true,
					clusterMaxZoom: 14, // Max zoom to cluster points on
					clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
				});
				map.addLayer({
					id: 'clusters',
					type: 'circle',
					source: 'markers',
					filter: ['has', 'point_count'],
					paint: {
						'circle-color': [
							'step',
							['get', 'point_count'],
							'#51bbd6',
							100,
							'#f1f075',
							750,
							'#f28cb1'
						],
						'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
					}
				});

				map.addLayer({
					id: 'cluster-count',
					type: 'symbol',
					source: 'markers',
					filter: ['has', 'point_count'],
					layout: {
						'text-field': '{point_count_abbreviated}',
						'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
						'text-size': 12
					}
				});

				map.addLayer({
					id: 'unclustered-point',
					type: 'circle',
					source: 'markers',
					filter: ['!', ['has', 'point_count']],
					paint: {
						'circle-color': '#92c054',
						'circle-radius': 12,
						'circle-stroke-width': 1,
						'circle-stroke-color': '#fff'
					}
				});
			});

			map.on('click', 'clusters', (e) => {
				const features = map.queryRenderedFeatures(e.point, {
					layers: ['clusters']
				});
				const clusterId = features[0].properties.cluster_id;
				map.getSource('markers').getClusterExpansionZoom(clusterId, (err, zoom) => {
					if (err) return;

					map.easeTo({
						center: features[0].geometry.coordinates,
						zoom: zoom
					});
				});
			});

			map.on('click', 'unclustered-point', (e) => {
				const coordinates = e.features[0].geometry.coordinates.slice();
				const props = e.features[0].properties;

				while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
					coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
				}

				new mapbox.Popup()
					.setLngLat(coordinates)
					.setHTML(`${props.title}\n${props.address}`)
					.addTo(map);
			});

			map.on('mouseenter', 'clusters', () => {
				map.getCanvas().style.cursor = 'pointer';
			});
			map.on('mouseleave', 'clusters', () => {
				map.getCanvas().style.cursor = '';
			});

			// for (const marker of markers) {
			// 	// Create a DOM element for each marker.
			// 	const el = document.createElement('div');
			// 	const width = 16;
			// 	const height = 22;
			// 	el.className = 'marker';
			// 	el.style.backgroundImage = `url(/boxnow.png)`;
			// 	el.style.width = `${width}px`;
			// 	el.style.height = `${height}px`;
			// 	el.style.backgroundSize = '100%';

			// 	el.addEventListener('click', () => {
			// 		window.alert(marker.properties.message);
			// 	});

			// 	// Add markers to the map.
			// 	new mapbox.Marker(el).setLngLat([marker.lng, marker.lat]).addTo(map);
			// }
		};

		// return () => {
		// 	map.remove();
		// 	link.parentNode.removeChild(link);
		// };
	});
</script>

<div class="main-container">
	<div class="map-container" bind:this={container} />
</div>

<style>
	.main-container {
		width: 100%;
		height: 100%;
		position: relative;
	}
	.map-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #e5e9ec;
		overflow: hidden;
	}
</style>
