import { OPEN_METEO_API_URL, OPEN_METEO_GEOCODING_API_URL } from "@/lib/open-meteo";
import { OpenMeteoSearchResult } from "@/types/OpenMeteo";
import { useQuery } from "@tanstack/react-query"
import { fetchWeatherApi } from "openmeteo";

export const useSearch = ({
	query,
} : {
	query: string;
}) => {
	return useQuery({
		queryKey: ['search', query],
		queryFn: async () => {
			const reponse = await fetch(`${OPEN_METEO_GEOCODING_API_URL}/search?name=${encodeURIComponent(query)}`)
			if (!reponse.ok) {
				throw new Error('Network response was not ok');
			}
			const data: { results: OpenMeteoSearchResult[] } = await reponse.json();
			if (!data.results || data.results.length === 0) {
				return [];
			}
			return data.results.map((result: OpenMeteoSearchResult) => result) || [];
		},
		enabled: !!query && query.length > 0,
	})
};

export const useMeteo = ({
	latitude,
	longitude,
} : {
	latitude?: number;
	longitude?: number;
}) => {
	return useQuery({
		queryKey: ['meteo', { latitude, longitude }],
		queryFn: async () => {
			if (latitude === undefined || longitude === undefined) {
				throw new Error('Latitude and longitude must be provided');
			}
			const url = `${OPEN_METEO_API_URL}/forecast`;
			const params = new URLSearchParams({
				latitude: latitude.toString(),
				longitude: longitude.toString(),
				past_days: '1',
				hourly: 'temperature_2m,weathercode,wind_speed_10m',
				daily: 'temperature_2m_max,temperature_2m_min,weathercode',
				current: 'temperature_2m,weathercode,wind_speed_10m',
				timezone: 'auto',
			});
			const [response] = await fetchWeatherApi(url, params);
			const utcOffsetSeconds = response.utcOffsetSeconds();

			// Hourly
			const hourly = response.hourly()!;
			const houlyTimes = [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
				(_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000).toISOString()
			);
			const houlyTemps = hourly.variables(0)!.valuesArray();
			const hourlyWeatherCodes = hourly.variables(1)!.valuesArray();
			const hourlyWindSpeed = hourly.variables(2)!.valuesArray();

			// Daily
			const daily = response.daily()!;
			const dailyTimes = [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
				(_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000).toISOString()
			);
			const dailyTempsMax = daily.variables(0)!.valuesArray();
			const dailyTempsMin = daily.variables(1)!.valuesArray();
			const dailyWeatherCodes = daily.variables(2)!.valuesArray();

			// Current weather
			const current = response.current()!;

			// Final weather data structure
			const weatherData = {
				current: current ?{
					time: new Date(Number(current?.time()) * 1000).toISOString(),
					temp: current.variables(0)?.value(),
					weatherCode: current.variables(1)?.value(),
					windSpeed: current.variables(2)?.value(),
				} : undefined,
				hourly: houlyTimes.map((time, i) => ({
					time: time,
					temp: houlyTemps?.[i],
					weatherCode: hourlyWeatherCodes?.[i] ?? hourlyWeatherCodes?.[i - 1],
					windSpeed: hourlyWindSpeed?.[i],
				})),
				daily: dailyTimes.map((time, i) => ({
					time,
					tempMax: dailyTempsMax?.[i],
					tempMin: dailyTempsMin?.[i],
					weatherCode: dailyWeatherCodes?.[i],
				})),
			};

			return weatherData;
		},
		enabled: !!latitude && !!longitude,
	})
};