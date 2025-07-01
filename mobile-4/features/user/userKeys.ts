export const userKeys = {
	all: ['user'] as const,
	/**
	 * Fetches details of a user
	 * @param userId The user id
	 * @returns The user details
	 */
	detail: (userId: string) => [...userKeys.all, userId] as const,

	diaryNotes: (userId: string) => [...userKeys.detail(userId), 'diaryNotes'] as const,

	diaryNote: (noteId: number) => [...userKeys.all, 'diaryNote', noteId] as const,
};
