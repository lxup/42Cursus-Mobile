import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { userKeys } from "./userKeys"
import { useSupabaseClient } from "@/context/SupabaseProvider";

/* ---------------------------------- USER ---------------------------------- */

/**
 * Fetches the user details
 * @param userId The user id
 * @returns The user details
*/
export const useUserQuery = ({
	userId,
	enabled,
} : {
	userId?: string
	enabled?: boolean
}) => {
	const supabase = useSupabaseClient();
	return useQuery({
		queryKey: userKeys.detail(userId as string),
		queryFn: async () => {
			if (!userId) return null;
			const { data, error } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', userId)
				.single();
			if (error) throw error;
			return data;	
		},
		enabled: enabled ? enabled : userId !== undefined,
	});
};

/* -------------------------------------------------------------------------- */

// fetch diary notes
export const useDiaryNotesInfiniteQuery = ({
	userId,
	filters,
} : {
	userId?: string,
	filters: {
		perPage: number;
		sortBy: 'date';
		sortOrder: 'asc' | 'desc';
	};
}) => {
	const supabase = useSupabaseClient();
	return useInfiniteQuery({
		queryKey: userKeys.diaryNotes(userId as string),
		queryFn: async ({ pageParam = 0 }) => {
			if (!userId) return [];
			let from = (pageParam - 1) * filters.perPage;
	  		let to = from - 1 + filters.perPage;
			let request = supabase
				.from('diary_notes')
				.select('*')
				.eq('user_id', userId)
				.range(from, to)
				// .order('created_at', { ascending: false });
			if (filters) {
				if (filters.sortBy === 'date' && filters.sortOrder) {
					switch (filters.sortBy) {
						case 'date':
							request = request.order('date', { ascending: filters.sortOrder === 'asc' });
							break;
						default:
							request = request.order('created_at', { ascending: filters.sortOrder === 'asc' });
							break;
					}
				}
			}
			const { data, error } = await request;
			if (error) throw error;
			return data;
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, pages) => {
			return lastPage?.length === filters.perPage ? pages.length + 1 : undefined;
		},
	});
};