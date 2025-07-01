import React, { useMemo } from 'react';
import tw from '@/lib/tw';
import { Alert, TouchableOpacity, View } from 'react-native';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { ThemedText } from '../../ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import useBottomSheetStore from '@/stores/useBottomSheetStore';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/context/ThemeProvider';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';
import { SFSymbol } from 'expo-symbols';

interface BottomSheetUserNavProps extends Omit<React.ComponentPropsWithoutRef<typeof TrueSheet>, 'children'> {
	id: string;
};

const BottomSheetUserNav = React.forwardRef<
	React.ComponentRef<typeof TrueSheet>,
	BottomSheetUserNavProps
>(({ id, ...props }, ref) => {
	const router = useRouter();
	// Colors
	const mutedForegroundColor = useThemeColor({}, 'mutedForeground');
	// States
	const { inset } = useTheme();
	const { closeSheet } = useBottomSheetStore();
	const { user, logout } = useAuth();

	const items: { label: string; icon: SFSymbol, onPress: () => void }[] = useMemo(() => [
		{
			label: 'Profile',
			icon: 'person.crop.circle',
			onPress: () => {
				router.push(`/user/${user?.username}`);
				closeSheet(id);
			},
		},
		{
			label: 'Sign Out',
			icon: 'rectangle.portrait.and.arrow.right',
			onPress: () => {
				Alert.alert(
				'Confirm Logout',
				'Are you sure you want to log out?',
				[
					{ text: 'Cancel', style: 'cancel' },
					{ text: 'OK', onPress: async () => {
						try {
							await logout();
							router.replace('/welcome');
							closeSheet(id);
						} catch (error) {
							console.error('Error logging out:', error);
						}
					}},
				],
			);
			}
		},
	], [user?.username, closeSheet, id, logout, router]);

	return (
	<TrueSheet
	ref={ref}
	onLayout={async () => {
		if (typeof ref === 'object' && ref?.current?.present) {
			await ref.current.present();
		};
	}}
	{...props}
	>
		<View
		style={[
			{ paddingBottom: inset.bottom },
			tw`flex-1`,
		]}
		>
			<View
			style={[
				tw`gap-4 p-4`,
			]}
			>
				{items.map((item, index) => (
					<TouchableOpacity
					key={index}
					onPress={item.onPress}
					style={tw`flex-row items-center gap-2 w-full`}
					>
						<IconSymbol name={item.icon} color={mutedForegroundColor} size={24} />
						<ThemedText>{item.label}</ThemedText>
					</TouchableOpacity>
				))}
			</View>
		</View>
	</TrueSheet>
	);
});
BottomSheetUserNav.displayName = 'BottomSheetUserNav';

export default BottomSheetUserNav;