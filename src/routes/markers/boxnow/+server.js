import { json } from '@sveltejs/kit';
import { $fetch } from 'ohmyfetch';
/** @type {import('./$types').RequestHandler} */

export async function GET() {
	const lockers = await $fetch(
		`https://lockersloadfiles.blob.core.windows.net/lockerslarge/all.json`
	);
	const markers = Object.keys(lockers).reduce(function (prev, current) {
		return [...prev, lockers[current]];
	}, []);

	const geojson = {
		type: 'FeatureCollection',
		features: markers.map((marker) => {
			return {
				type: 'Feature',
				properties: { company: 'BOXNOW', address: marker.address, title: marker.title },
				geometry: {
					type: 'Point',
					coordinates: [marker.lng, marker.lat]
				}
			};
		})
	};

	return json(geojson);
}
