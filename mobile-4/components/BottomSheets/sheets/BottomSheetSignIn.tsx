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
	img: any;
}[];

const providers: Providers = [
	{
		name: "google",
		label: "Google",
		img: require("@/assets/images/providers/google.png")
	},
	{
		name: "github",
		label: "GitHub",
		img: require("@/assets/images/providers/github.png"),
	}
]

const BottomSheetSignIn = React.forwardRef<
	React.ComponentRef<typeof TrueSheet>,
	BottomSheetSignInProps
>(({ id, ...props }, ref) => {
	const { closeSheet } = useBottomSheetStore();
	const { session, login } = useAuth();
	const { inset } = useTheme();
	const mutedColor = useThemeColor({}, 'muted');
	// Handlers
	const handleProviderPress = async (provider: Provider) => {
		try {
			await login({
				provider: provider
			});
			closeSheet(id);
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === 'cancelled') return;
			}
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
						<Image source={provider.img} style={tw`h-8 w-8`} contentFit="cover" />
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