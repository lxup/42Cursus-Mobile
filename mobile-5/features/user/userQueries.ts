import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { userKeys } from "./userKeys"
import { useSupabaseClient } from "@/context/SupabaseProvider";
import { DiaryNote, User } from "@/types/type.db";

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

export const useUserQueryByUsername = ({
	username,
	enabled,
	initialData,
} : {
	username?: string;
	enabled?: boolean;
	initialData?: User | null;
}) => {
	const supabase = useSupabaseClient();
	return useQuery({
		queryKey: userKeys.detailByUsername(username as string),
		queryFn: async () => {
			if (!username) return null;
			const { data, error } = await supabase
				.from('profiles')
				.select('*')
				.eq('username', username)
				.single();
			if (error) throw error;
			return data;
		},
		enabled: enabled ? enabled : username !== undefined,
		initialData: initialData ? initialData : undefined,
	});
};

export const useSearchUsersInfiniteQuery = ({
	query,
	filters,
} : {
	query?: string,
	filters?: {
		perPage?: number;
	}
}) => {
	const mergeFilters = {
		perPage: 20,
		...filters,
	};
	const supabase = useSupabaseClient();
	return useInfiniteQuery({
		queryKey: userKeys.searchUsers(query as string, mergeFilters),
		queryFn: async ({ pageParam = 0 }) => {
			if (!query) return [];
			let from = (pageParam - 1) * mergeFilters.perPage;
	  		let to = from - 1 + mergeFilters.perPage;
			const { data, error } = await supabase
				.from('profiles')
				.select('*')
				.ilike('username', `%${query}%`)
				.range(from, to);
			if (error) throw error;
			return data;
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, pages) => {
			return lastPage?.length === mergeFilters.perPage ? pages.length + 1 : undefined;
		},
	});
};
/* -------------------------------------------------------------------------- */

// fetch diary notes
export const useDiaryNotesInfiniteQuery = ({
	userId,
	filters,
} : {
	userId?: string,
	filters?: {
		perPage?: number;
		sortBy?: 'date';
		sortOrder?: 'asc' | 'desc';
		dateFrom?: string;
		dateTo?: string;
	};
}) => {
	const mergeFilters = {
		perPage: 20,
		sortBy: 'date',
		sortOrder: 'desc',
		...filters,
	};
	const supabase = useSupabaseClient();
	return useInfiniteQuery({
		queryKey: userKeys.diaryNotes(userId as string, mergeFilters),
		queryFn: async ({ pageParam = 0 }) => {
			if (!userId) return [];
			let from = (pageParam - 1) * mergeFilters.perPage;
	  		let to = from - 1 + mergeFilters.perPage;
			let request = supabase
				.from('diary_notes')
				.select('*')
				.eq('user_id', userId)
				.range(from, to);
			if (mergeFilters) {
				if (mergeFilters.sortBy === 'date' && mergeFilters.sortOrder) {
					switch (mergeFilters.sortBy) {
						case 'date':
							request = request.order('date', { ascending: mergeFilters.sortOrder === 'asc' });
							break;
						default:
							request = request.order('created_at', { ascending: mergeFilters.sortOrder === 'asc' });
							break;
					}
				}
				if (mergeFilters.dateFrom) {
					request = request.gte('date', mergeFilters.dateFrom);
				}
				if (mergeFilters.dateTo) {
					request = request.lte('date', mergeFilters.dateTo);
				}
			}
			const { data, error } = await request;
			if (error) throw error;
			return data;
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, pages) => {
			return lastPage?.length === mergeFilters.perPage ? pages.length + 1 : undefined;
		},
	});
};

export const useDiaryNotesStatsQuery = ({
	userId,
} : {
	userId?: string,
}) => {
	const supabase = useSupabaseClient();
	return useQuery({
		queryKey: userKeys.diaryNotes(userId as string),
		queryFn: async () => {
			if (!userId) return null;
			const { data, error } = await supabase
				.rpc('get_diary_notes_stats', {
					user_id: userId,
				})
			if (error) throw error;
			return {
				totalCount: data.at(0)?.total_count,
				counts: data.map((item: { feeling: string, count: number }) => ({
					feeling: item.feeling,
					count: item.count,
				})),
			}
		},
		enabled: !!userId,
	});
};

export const useDiaryNoteQuery = ({
	id,
	initialData,
} : {
	id?: number,
	initialData?: DiaryNote | null,
}) => {
	const supabase = useSupabaseClient();
	return useQuery({
		queryKey: userKeys.diaryNote(id as number),
		queryFn: async () => {
			if (!id) throw new Error('Missing note id');
			const { data, error } = await supabase
				.from('diary_notes')
				.select('*')
				.eq('id', id)
				.single();
			if (error) throw error;
			return data;
		},
		enabled: !!id,
		initialData: initialData ? initialData : undefined,
	});
};