import React, { useCallback, useEffect, useMemo } from 'react';
import tw from '@/lib/tw';
import { TouchableOpacity, View } from 'react-native';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Image } from 'expo-image';
import useBottomSheetStore from '@/stores/useBottomSheetStore';
import { useAuth } from '@/context/AuthProvider';
import { Provider } from "@supabase/supabase-js";
import {
	GoogleSignin,
	GoogleSigninButton,
	statusCodes
} from '@react-native-google-signin/google-signin';
import { useSupabaseClient } from '@/context/SupabaseProvider';

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
	const supabase = useSupabaseClient();
	const { closeSheet } = useBottomSheetStore();
	const { session, login } = useAuth();
	const inset = useSafeAreaInsets();
	const mutedColor = useThemeColor({}, 'muted');
	GoogleSignin.configure({
		scopes: ["https://www.googleapis.com/auth/drive.readonly"],
		iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
	})
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
			console.log(`Connecting with ${provider}`);
			await login({
				provider: provider
			});
			closeSheet(id);
		} catch (error) {
			console.error(`Error connecting with ${provider}:`, error);
		}
	}
	const handleGoogleSignIn = useCallback(async () => {
		try {
			await GoogleSignin.hasPlayServices();
			const userInfo = await GoogleSignin.signIn();
			if (!userInfo.data?.idToken) {
				throw new Error('No ID token received');
			}
			const { error } = await supabase.auth.signInWithIdToken({
				provider: 'google',
				token: userInfo.data.idToken,
			});
			if (error) throw error;
		} catch (error: any) {
			if (error.code === statusCodes.SIGN_IN_CANCELLED) {
			} else if (error.code === statusCodes.IN_PROGRESS) {
			} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
			} else {
				console.error('Google Sign-In error:', error);
			}
		}
	}, [supabase.auth]);

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
				<GoogleSigninButton
				size={GoogleSigninButton.Size.Wide}
				color={GoogleSigninButton.Color.Light}
				onPress={handleGoogleSignIn}
				/>
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