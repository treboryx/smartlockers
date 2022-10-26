import { json } from '@sveltejs/kit';
import { $fetch } from 'ohmyfetch';
/** @type {import('./$types').RequestHandler} */

export async function GET() {
	const lockers = await $fetch('https://www.acscourier.net/api/en/lockers');
	const acs = await $fetch('https://www.acscourier.net/en/myacs/my-tools/acs-points-locator/');
	const token = acs.split('publicToken="')[1].split('"')[0];
	const branches = await $fetch('https://api.acscourier.net/api/locators/branches', {
		headers: {
			Referer: 'https://www.acscourier.net/',
			Origin: 'https://www.acscourier.net',
			'x-encrypted-key': token
		}
	});

	const markers = [];
	for (const locker of lockers) {
		const [stationId, branchId] = locker.StationId.split('-');
		const branch = branches.items.find(
			(branch) => branch.stationId === stationId && branch.branchId === Number(branchId)
		);
		if (branch)
			markers.push({
				title: branch.storeDescription,
				address: branch.storeAddress,
				lng: branch.longtitude,
				lat: branch.latitude
			});
	}

	const geojson = {
		type: 'FeatureCollection',
		color: '#ff0000',
		features: markers.map((marker) => {
			return {
				type: 'Feature',
				properties: { company: 'ACS', address: marker.address, title: marker.title },
				geometry: {
					type: 'Point',
					coordinates: [marker.lng, marker.lat]
				}
			};
		})
	};

	return json(geojson);
}
