import { useQuery } from "@tanstack/react-query"
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