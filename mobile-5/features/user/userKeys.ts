export const userKeys = {
	all: ['user'] as const,
	/**
	 * Fetches details of a user
	 * @param userId The user id
	 * @returns The user details
	 */
	detail: (userId: string) => [...userKeys.all, userId] as const,
	detailByUsername: (username: string) => [...userKeys.all, 'byUsername', username] as const,

	diaryNotes: (
		userId: string,
		filters?: {
			perPage?: number;
			sortBy?: string;
			sortOrder?: string;
		}
	) => filters ? [...userKeys.detail(userId), 'diaryNotes', filters] as const : [...userKeys.detail(userId), 'diaryNotes'] as const,
	diaryNotesStats: (
		userId: string,
	) => [...userKeys.detail(userId), 'diaryNotesStats'] as const,

	diaryNote: (noteId: number) => [...userKeys.all, 'diaryNote', noteId] as const,

	searchUsers: (
		query: string,
		filters?: { perPage?: number }
	) => filters ? [...userKeys.all, 'searchUsers', query, filters] as const : [...userKeys.all, 'searchUsers', query] as const
};
