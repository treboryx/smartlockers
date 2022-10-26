<script>
	export let currentStyle;
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let isOpen = false;

	const mapStyles = [
		{
			label: 'Light',
			value: 'mapbox://styles/treboryx/cl8t68z9s001b16phmp3p97g2',
			icon: './light.png'
		},
		{ label: 'Dark', value: 'mapbox://styles/mapbox/dark-v9', icon: './dark.png' }
	];
</script>

<div class="w-36 z-50 m-4">
	<div class="relative mt-1">
		<button
			on:click={() => (isOpen = !isOpen)}
			type="button"
			class="relative z-50 cursor-pointer w-full rounded-sm border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
			aria-haspopup="listbox"
			aria-expanded="true"
			aria-labelledby="listbox-label"
		>
			<span class="flex items-center">
				<img
					src={mapStyles.find((s) => s.value === currentStyle).icon}
					alt=""
					class="h-6 w-6 flex-shrink-0 rounded-full"
				/>
				<span class="ml-3 block truncate"
					>{mapStyles.find((s) => s.value === currentStyle).label}</span
				>
			</span>
			<span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
				<svg
					class="h-5 w-5 text-gray-400"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
						clip-rule="evenodd"
					/>
				</svg>
			</span>
		</button>
		{#if isOpen}
			<ul
				class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-sm bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
				tabindex="-1"
				role="listbox"
				aria-labelledby="listbox-label"
				aria-activedescendant="listbox-option-3"
			>
				{#each mapStyles as style}
					<li
						on:click={() => {
							dispatch('changed', {
								style: style.value
							});
							isOpen = false;
						}}
						class="text-gray-900 relative select-none py-2 pl-3 pr-9 hover:bg-gray-200 cursor-pointer"
						id="listbox-option-0"
						role="option"
						aria-selected={currentStyle === style.value ? 'true' : 'false'}
					>
						<div class="flex items-center">
							<img src={style.icon} alt="" class="h-6 w-6 flex-shrink-0 rounded-full" />
							<span
								class="ml-3 block truncate {currentStyle === style.value
									? 'font-semibold'
									: 'font-normal'}">{style.label}</span
							>
						</div>
						{#if currentStyle === style.value}
							<span class="absolute inset-y-0 right-0 flex items-center pr-4"> ✅ </span>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
