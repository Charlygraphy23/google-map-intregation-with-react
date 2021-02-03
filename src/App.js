import "./App.css";
import {
	GoogleMap,
	useJsApiLoader,
	useLoadScript,
	Marker,
} from "@react-google-maps/api";

// import usePlacesAutocomplete, {
// 	getGeocode,
// 	getLatLng,
// } from "use-places-autocomplete";
import { useState, useCallback, useRef, useEffect } from "react";
import Autocomplete from "react-autocomplete";
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng,
} from "react-places-autocomplete";

const containerStyle = {
	width: "100vw",
	height: "80vh",
};

// const center = {
// 	lat: 20.5937,
// 	lng: 78.9629,
// };
const libraries = ["places"];

const options = {
	disableDefaultUI: true,
	zoomControl: true,
};

function App() {
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: "APIKEY",
		libraries,
	});

	const [center, setCenter] = useState({
		lat: 20.5937,
		lng: 78.9629,
	});

	// auto complete
	// const {
	// 	ready,
	// 	value,
	// 	suggestions: { status, data },
	// 	setValue,
	// 	clearSuggestions,
	// } = usePlacesAutocomplete({
	// 	requestOptions: {
	// 		location: { lat: () => 20.5937, lng: () => 78.9629 },
	// 		radius: 200 * 1000, // converting to km to miter
	// 	},
	// });

	const mapRef = useRef(null);
	const onMapLoad = useCallback((map) => {
		mapRef.current = map;
	}, []);

	const [marker, setMarker] = useState({
		lat: 0,
		lng: 0,
	});
	const onMapClick = useCallback((e) => {
		setMarker({
			lat: e.latLng.lat(),
			lng: e.latLng.lng(),
			time: new Date().getTime(),
		});
	}, []);

	const [state, setState] = useState({ address: "" });

	// useEffect(() => {

	// }, [state]);

	const handleClick = (address) => {
		console.log("Google List", address);

		geocodeByAddress(address)
			.then((results) => {
				console.log("Results", results);
				getLatLng(results[0]).then((result) => {
					console.log("Lat", result);
					setMarker({
						lat: result.lat,
						lng: result.lng,
					});
					setCenter({
						lat: result.lat,
						lng: result.lng,
					});
				});

				let reverse = results[0].address_components;
			})
			.then((latLng) => console.log("Success", latLng))
			.catch((error) => console.error("Error", error));

		// if (state.address !== "") {
		// 	console.log("Address", state.address);
		// 	let temp = state.address.split(", ");
		// 	console.log("Splited Value", temp);
		// 	let reveseArray = temp.reverse();
		// 	console.log("Reversed Array", reveseArray);
		// }
	};

	if (loadError) return "Error loading maps";
	if (!isLoaded) return "Loading maps";

	const renderFunc = ({
		getInputProps,
		getSuggestionItemProps,
		suggestions,
		loading,
	}) => (
		<div className='autocomplete-root'>
			<input {...getInputProps()} />
			<div className='autocomplete-dropdown-container'>
				{loading && <div>Loading...</div>}
				{suggestions.map((suggestion, i) => (
					<div key={i} {...getSuggestionItemProps(suggestion)}>
						<span>{suggestion.description}</span>
					</div>
				))}
			</div>
		</div>
	);

	return (
		<div className='App'>
			{/* <input
				type='text'
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
				}}
				disabled={!ready}
				placeholder='Address'
			/>
			{status === "OK" &&
				data.map(({ id, description }) => (
					<div>{console.log(description)}</div>
				))} */}
			<PlacesAutocomplete
				value={state.address}
				onChange={(address) => setState({ address })}
				onSelect={handleClick}>
				{renderFunc}
			</PlacesAutocomplete>
			<button onClick={handleClick}>Add</button>

			<GoogleMap
				mapContainerStyle={containerStyle}
				zoom={8}
				center={center}
				options={options}
				onClick={onMapClick}
				onLoad={onMapLoad}>
				<Marker
					position={{
						lat: marker && marker.lat,
						lng: marker && marker.lng,
					}}></Marker>
			</GoogleMap>
		</div>
	);
}

export default App;
