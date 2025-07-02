import React, { useEffect, useMemo } from 'react';
import tw from '@/lib/tw';
import { TouchableOpacity, View } from 'react-native';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { ThemedText } from '../../ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Image } from 'expo-image';
import useBottomSheetStore from '@/stores/useBottomSheetStore';
import { useAuth } from '@/context/AuthProvider';
import { Provider } from "@supabase/supabase-js";
import { useTheme } from '@/context/ThemeProvider';
import * as Burnt from 'burnt';

interface BottomSheetSignInProps extends Omit<React.ComponentPropsWithoutRef<typeof TrueSheet>, 'children'> {
	id: string;
};

type Providers = {
	name: Provider;
	label: string;
	path: string;
}[];

const BottomSheetSignIn = React.forwardRef<
	React.ComponentRef<typeof TrueSheet>,
	BottomSheetSignInProps
>(({ id, ...props }, ref) => {
	const { closeSheet } = useBottomSheetStore();
	const { session, login } = useAuth();
	const { inset } = useTheme();
	const mutedColor = useThemeColor({}, 'muted');
	// States
	const providers: Providers = useMemo(() => [
		{
			name: "google",
			label: "Google",
			path: "@/assets/images/providers/google.png",
		},
		{
			name: "github",
			label: "GitHub",
			path: "@/assets/images/providers/github.png",
		}
	], []);
	// Handlers
	const handleProviderPress = async (provider: Provider) => {
		try {
			await login({
				provider: provider
			});
			closeSheet(id);
		} catch {
			// if (error instanceof Error) {
			// 	console.error(`Error during ${provider} login:`, error.message);
			// } else {
			// 	console.error(`Unexpected error during ${provider} login:`, error);
			// }
			Burnt.toast({
				title: `Error`,
				message: `Failed to sign in with ${provider}. Please try again.`,
				preset: 'error',
			});
		}
	}

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
			tw`flex-1 items-center justify-center gap-2 px-4`,
		]}
		>
			<ThemedText>Connect with</ThemedText>
			<View style={tw`items-center justify-center gap-2`}>
				{providers.map((provider, index) => (
					<TouchableOpacity key={index} onPress={() => handleProviderPress(provider.name)} style={[tw`flex-row items-center border-2 overflow-hidden rounded-full w-full px-4 py-1 gap-2`, { borderColor: mutedColor }]}>
						<Image source={provider.path} style={tw`h-8 w-8 bg-red-500`} contentFit="cover" />
						<ThemedText>{provider.label}</ThemedText>
					</TouchableOpacity>
				))}
			</View>
		</View>
	</TrueSheet>
	);
});
BottomSheetSignIn.displayName = 'BottomSheetSignIn';

export default BottomSheetSignIn;