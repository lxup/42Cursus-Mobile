import { OPEN_METEO_API_URL } from "@/lib/open-meteo";
import { OpenMeteoSearchResult } from "@/types/OpenMeteo";
import { useQuery } from "@tanstack/react-query"

export const useSearch = ({
	query,
} : {
	query: string;
}) => {
	return useQuery({
		queryKey: ['search', query],
		queryFn: async () => {
			console.log('Searching for:', query);
			const reponse = await fetch(`${OPEN_METEO_API_URL}/search?name=${encodeURIComponent(query)}`)
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
}