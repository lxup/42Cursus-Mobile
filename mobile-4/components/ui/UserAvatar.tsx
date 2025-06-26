import * as React from 'react';
import Avatar from '../ui/Avatar';
import tw from '@/lib/tw';
import { Skeleton } from './Skeleton';

interface UserAvatarProps extends Omit<React.ComponentPropsWithRef<typeof Avatar.Root>, 'alt'> {
	full_name?: string | null;
	avatar_url?: string | null;
	skeleton?: boolean;
}

const UserAvatar = React.forwardRef<
	React.ComponentRef<typeof Avatar.Root>,
	UserAvatarProps
>(({ full_name, avatar_url, skeleton, style, ...props }, ref) => {
	if (!full_name || skeleton) {
		return (
			<Skeleton
			borderRadius={9999}
			style={[
				tw.style('h-10 w-10'),
				style,
			]}
			/>
		)
	}
	return (
		<Avatar.Root
		ref={ref}
		alt={full_name}
		style={[style]}
		{...props}
		>
			<Avatar.Image source={{ uri: avatar_url ?? '' }}/>
			<Avatar.Fallback />
		</Avatar.Root>
	)
});
UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;