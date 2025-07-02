import { useSupabaseClient } from "@/context/SupabaseProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "./userKeys";
import { DiaryNote, Feeling } from "@/types/type.db";

export const useUserUpdateMutation = ({
	userId,
} : {
	userId?: string;
}) => {
	const supabase = useSupabaseClient();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			fullName,
			username,
		} : {
			fullName?: string;
			username?: string;
		}) => {
			if (!userId) throw Error('Missing user id');
			const { data, error } = await supabase
				.from('profiles')
				.update({
					full_name: fullName,
					username: username,
				})
				.eq('id', userId)
				.select('*')
				.single();
				if (error) throw error;
				return data;
			},
		onSuccess: (data) => {
			queryClient.setQueryData(userKeys.detail(data.id), data);
		}
	});
};


/* ------------------------------- DIARY NOTES ------------------------------ */

export const useDiaryNotesInsertMutation = ({
	userId,
} : {
	userId?: string;
}) => {
	const supabase = useSupabaseClient();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			feeling,
			title,
			description,
			date,
		} : {
			feeling: Feeling;
			title: string;
			description?: string;
			date: Date;
		}) => {
			if (!userId) throw Error('Missing user id');
			const { data, error } = await supabase
				.from('diary_notes')
				.insert({
					feeling,
					title,
					description,
					date: date.toISOString(),
					user_id: userId,
				})
				.select('*')
				.single();
			if (error) throw error;
			return data;
		},
		onSuccess: (data) => {
			// queryClient.setQueryData(userKeys.diaryNotes(data.user_id), (oldData: any) => {
			// 	if (!oldData) return [data];
			// 	return {
			// 		...oldData,
			// 		pages: [data, ...oldData.pages],
			// 		pageParams: [1, ...oldData.pageParams],
			// 	};
			// });
			queryClient.invalidateQueries({
				queryKey: userKeys.diaryNotes(data.user_id),
			});
		}
	});
};

export const useDiaryNotesDeleteMutation = ({
	userId,
} : {
	userId?: string;
}) => {
	const supabase = useSupabaseClient();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
		} : {
			id: number;
		}) => {
			if (!userId) throw Error('Missing user id');
			const { data, error } = await supabase
				.from('diary_notes')
				.delete()
				.eq('id', id)
				.eq('user_id', userId)
				.select('*')
				.single();
			if (error) throw error;
			return data;
		},
		onSuccess: (data) => {
			// queryClient.setQueryData(userKeys.diaryNotes(data.user_id), (oldData: { pages: DiaryNote[]; pageParams: any[]; }) => {
			// 	if (!oldData) return [];
			// 	return {
			// 		...oldData,
			// 		pages: oldData.pages.filter((note: DiaryNote) => note.id !== data.id),
			// 		pageParams: oldData.pageParams,
			// 	};
			// });
			queryClient.invalidateQueries({
				queryKey: userKeys.diaryNotes(data.user_id),
			});
		}
	});
};

export const useDiaryNotesUpdateMutation = () => {
	const supabase = useSupabaseClient();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			feeling,
			title,
			description,
			date,
		} : {
			id: number;
			feeling?: Feeling;
			title?: string;
			description?: string;
			date?: Date;
		}) => {
			const { data, error } = await supabase
				.from('diary_notes')
				.update({
					feeling,
					title,
					description,
					date: date ? date.toISOString() : undefined,
				})
				.eq('id', id)
				.select('*')
				.single();
			if (error) throw error;
			return data;
		},
		onSuccess: (data) => {
			queryClient.setQueryData(userKeys.diaryNote(data.id), (oldData: DiaryNote | undefined) => {
				if (!oldData) return data;
				return {
					...oldData,
					...data,
				};
			});
			// queryClient.setQueryData(userKeys.diaryNotes(data.user_id), (oldData: { pages: DiaryNote[]; pageParams: any[]; }) => {
			// 	if (!oldData) return [];
			// 	return {
			// 		...oldData,
			// 		pages: oldData.pages.map((note: DiaryNote) => note.id === data.id ? data : note),
			// 		pageParams: oldData.pageParams,
			// 	};
			// });
			queryClient.invalidateQueries({
				queryKey: userKeys.diaryNotes(data.user_id),
			});
		}
	});
};


/* -------------------------------------------------------------------------- */