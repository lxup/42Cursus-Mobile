import { useSupabaseClient } from "@/context/SupabaseProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "./userKeys";

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
