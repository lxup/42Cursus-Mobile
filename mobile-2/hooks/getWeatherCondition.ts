import { SFSymbol } from "expo-symbols";

export type WeatherCondition = {
	code: number;
	label: string;
	icon: SFSymbol;
};

const getWeatherCondition = (weatherCode: number): WeatherCondition | undefined => {
	switch (weatherCode) {
		case 0:
			return {
				code: weatherCode,
				label: 'Clear sky',
				icon: 'sun.max.fill',
			};
		case 1:
			return {
				code: weatherCode,
				label: 'Mainly clear',
				icon: 'cloud.sun.fill',
			};
		case 2:
			return {
				code: weatherCode,
				label: 'Partly cloudy',
				icon: 'cloud.sun.fill',
			};
		case 3:
			return {
				code: weatherCode,
				label: 'Overcast',
				icon: 'cloud.fill',
			};
		case 45:
			return {
				code: weatherCode,
				label: 'Fog',
				icon: 'cloud.fog.fill',
			};
		case 48:
			return {
				code: weatherCode,
				label: 'Depositing rime fog',
				icon: 'cloud.fog.fill',
			};
		case 51:
			return {
				code: weatherCode,
				label: 'Drizzle light',
				icon: 'cloud.drizzle.fill',
			};
		case 53:
			return {
				code: weatherCode,
				label: 'Drizzle moderate',
				icon: 'cloud.drizzle.fill',
			};
		case 55:
			return {
				code: weatherCode,
				label: 'Drizzle dense',
				icon: 'cloud.drizzle.fill',
			};
		case 56:
			return {
				code: weatherCode,
				label: 'Freezing drizzle light',
				icon: 'cloud.drizzle.fill',
			};
		case 57:
			return {
				code: weatherCode,
				label: 'Freezing drizzle dense',
				icon: 'cloud.drizzle.fill',
			};
		case 61:
			return {
				code: weatherCode,
				label: 'Rain slight',
				icon: 'cloud.rain.fill',
			};
		case 63:
			return {
				code: weatherCode,
				label: 'Rain moderate',
				icon: 'cloud.rain.fill',
			};
		case 65:
			return {
				code: weatherCode,
				label: 'Rain heavy',
				icon: 'cloud.rain.fill',
			};
		case 66:
			return {
				code: weatherCode,
				label: 'Freezing rain light',
				icon: 'cloud.rain.fill',
			};
		case 67:
			return {
				code: weatherCode,
				label: 'Freezing rain heavy',
				icon: 'cloud.rain.fill',
			};
		case 71:
			return {
				code: weatherCode,
				label: 'Snow fall slight',
				icon: 'cloud.snow.fill',
			};
		case 73:
			return {
				code: weatherCode,
				label: 'Snow fall moderate',
				icon: 'cloud.snow.fill',
			};
		case 75:
			return {
				code: weatherCode,
				label: 'Snow fall heavy',
				icon: 'cloud.snow.fill',
			};
		case 77:
			return {
				code: weatherCode,
				label: 'Snow grains',
				icon: 'cloud.snow.fill',
			};
		case 80:
			return {
				code: weatherCode,
				label: 'Rain showers slight',
				icon: 'cloud.rain.fill',
			};
		case 81:
			return {
				code: weatherCode,
				label: 'Rain showers moderate',
				icon: 'cloud.rain.fill',
			};
		case 82:
			return {
				code: weatherCode,
				label: 'Rain showers violent',
				icon: 'cloud.rain.fill',
			};
		case 85:
			return {
				code: weatherCode,
				label: 'Snow showers slight',
				icon: 'cloud.snow.fill',
			};
		case 86:
			return {
				code: weatherCode,
				label: 'Snow showers heavy',
				icon: 'cloud.snow.fill',
			};
		case 95:
			return {
				code: weatherCode,
				label: 'Thunderstorm slight',
				icon: 'cloud.bolt.fill',
			};
		case 96:
			return {
				code: weatherCode,
				label: 'Thunderstorm with slight hail',
				icon: 'cloud.bolt.fill',
			};
		case 99:
			return {
				code: weatherCode,
				label: 'Thunderstorm with heavy hail',
				icon: 'cloud.bolt.fill',
			};
		default:
			return undefined;
	}
};

export default getWeatherCondition;