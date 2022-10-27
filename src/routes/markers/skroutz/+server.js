import { json } from '@sveltejs/kit';
import { $fetch } from 'ohmyfetch';
/** @type {import('./$types').RequestHandler} */

export async function GET() {
	const markers = await $fetch(
		'https://www.skroutz.gr/checkout/fetch_skroutz_points?coordinates%5Blat%5D=38.84413499818644&coordinates%5Blng%5D=22.842781878749985&radius=1000',
		{
			headers: {
				accept: 'application/json, text/plain, */*',
				'accept-language': 'en-US,en;q=0.9',
				'sec-ch-ua': '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-origin',
				'x-csrf-token':
					'a0RTrPIV3dRvrmZMbW6C6vE4z+PbHC3RrDjFc+ZeUjuw+Qjs/UeW9llBNKMzuxoI2ryZAriocEhIPokfiB8PNA==',
				'x-requested-with': 'XMLHttpRequest',
				cookie: import.meta.env.VITE_SKROUTZ_COOKIE,
				Referer: 'https://www.skroutz.gr/checkout/details',
				'Referrer-Policy': 'strict-origin-when-cross-origin'
			},
			body: null,
			method: 'GET'
		}
	);

	const geojson = {
		type: 'FeatureCollection',
		color: '#fd671e',
		features: markers.skroutz_points.map((marker) => {
			return {
				type: 'Feature',
				properties: {
					company: 'Skroutz',
					address: `${marker.street_name} ${marker.street_number} ${marker.zip} ${marker.city} ${marker.region}`,
					title: marker.name
				},
				geometry: {
					type: 'Point',
					coordinates: [marker.location[0], marker.location[1]]
				}
			};
		})
	};

	return json(geojson);
}
