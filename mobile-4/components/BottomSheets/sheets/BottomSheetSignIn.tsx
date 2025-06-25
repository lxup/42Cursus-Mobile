import React, { useEffect, useMemo } from 'react';
import tw from '@/lib/tw';
import { TouchableOpacity, View } from 'react-native';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Image } from 'expo-image';
import useBottomSheetStore from '@/stores/useBottomSheetStore';
import { useAuth } from '@/context/AuthProvider';

interface BottomSheetSignInProps extends Omit<React.ComponentPropsWithoutRef<typeof TrueSheet>, 'children'> {
	id: string;
};

type Provider = {
	name: string;
	path: string;
};

const BottomSheetSignIn = React.forwardRef<
	React.ComponentRef<typeof TrueSheet>,
	BottomSheetSignInProps
>(({ id, ...props }, ref) => {
	const { closeSheet } = useBottomSheetStore();
	const { session } = useAuth();
	const inset = useSafeAreaInsets();
	const mutedColor = useThemeColor({}, 'muted');
	const providers: Provider[] = useMemo(() => [
		{
			name: "Google",
			path: "@/assets/images/providers/google.png",
		},
		{
			name: "GitHub",
			path: "@/assets/images/providers/github.png",
		}
	], []);

	useEffect(() => {
		if (session) {
			closeSheet(id);
		}
	}, [session, closeSheet, id]);

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
			<View style={tw`flex-1 items-center justify-center gap-2`}>
				<ThemedText>Connect with</ThemedText>
				{providers.map((provider, index) => (
					<TouchableOpacity key={index} style={[tw`flex-row items-center justify-center border-2 overflow-hidden rounded-full w-full px-4 py-1 gap-2`, { borderColor: mutedColor }]}>
						<Image source={provider.path} style={tw`h-8 w-8`} contentFit="cover" />
						<ThemedText>{provider.name}</ThemedText>
					</TouchableOpacity>
				))}
			</View>
			<ThemedText>SignIn</ThemedText>
		</View>
	</TrueSheet>
	);
});
BottomSheetSignIn.displayName = 'BottomSheetSignIn';

export default BottomSheetSignIn;