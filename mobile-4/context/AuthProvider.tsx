import { User } from "@/types/type.db";
import { Provider, Session } from "@supabase/supabase-js";
import { SplashScreen } from "expo-router";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSupabaseClient } from "./SupabaseProvider";
import { useUserQuery } from "@/features/user/userQueries";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import useBottomSheetStore from "@/stores/useBottomSheetStore";
import { AppState } from "react-native";
import { supabase as SupabaseCustom } from "@/lib/supabase/client";
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as QueryParams from 'expo-auth-session/build/QueryParams'

SplashScreen.preventAutoHideAsync();
WebBrowser.maybeCompleteAuthSession();

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    SupabaseCustom.auth.startAutoRefresh()
  } else {
    SupabaseCustom.auth.stopAutoRefresh()
  }
});

type AuthContextProps = {
	session: Session | null | undefined;
	user: User | null | undefined;
	login: (params: { provider: Provider }) => Promise<void>;
	logout: () => Promise<void>;
};

type AuthProviderProps = {
	children: React.ReactNode;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider = ({children }: AuthProviderProps) => {
	const { openSheet } = useBottomSheetStore();
	const supabase = useSupabaseClient();
	const redirectUri = AuthSession.makeRedirectUri();
	const [session, setSession] = useState<Session | null | undefined>(undefined);
	const {
		data: user,
	} = useUserQuery({
		userId: session?.user.id,
	});

	// Functions
	const createSessionFromUrl = useCallback(async (url: string) => {
		const { params, errorCode } = QueryParams.getQueryParams(url);
		if (errorCode) throw new Error(errorCode);
		const { access_token, refresh_token } = params;

		if (!access_token) return;

		const { data, error } = await supabase.auth.setSession({
			access_token,
			refresh_token,
		});
		if (error) throw error;
		return data.session;
	}, [supabase.auth]);

	const login = useCallback(async ({ provider }: { provider: Provider }) => {
		switch (provider) {
			case "google":
				GoogleSignin.configure({
					scopes: ["https://www.googleapis.com/auth/drive.readonly"],
					iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
				})
				await GoogleSignin.hasPlayServices();
				const userInfo = await GoogleSignin.signIn();
				if (userInfo.type === 'cancelled') throw new Error('cancelled');
				if (!userInfo.data?.idToken) {
					throw new Error('No ID token received');
				}
				const { error: googleError } = await supabase.auth.signInWithIdToken({
					provider: 'google',
					token: userInfo.data.idToken,
				});
				if (googleError) throw googleError;
				break;
			default:
				const { data, error } = await supabase.auth.signInWithOAuth({
					provider: provider,
					options: {
						redirectTo: redirectUri,
						skipBrowserRedirect: true,
					},
				})
				if (error) throw error
				const res = await WebBrowser.openAuthSessionAsync(data?.url ?? '', redirectUri);
				if (res.type === 'success') {
					const { url } = res
					await createSessionFromUrl(url)
				}
				break;
		}
	}, [supabase.auth, redirectUri, createSessionFromUrl]);
	
	const logout = useCallback(async () => {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
	}, []);

	useEffect(() => {
		supabase.auth.getSession().then(({data: { session }}) => {
			setSession(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);
	
	useEffect(() => {
		if (session !== undefined) {
			SplashScreen.hide();
		}
	}, [session]);

	// Handle set username when user login for the first time
	useEffect(() => {
		const openUsernameSheet = async () => {
			const { default: BottomSheetSetUsername } = await import(
			"@/components/BottomSheets/sheets/BottomSheetSetUsername"
			);
			openSheet(BottomSheetSetUsername);
		};

		if (user && user.username === null) {
			openUsernameSheet();
		}
	}, [user]);

	return (
		<AuthContext.Provider
		value={{
			session: session,
			user: user,
			login: login,
			logout: logout,
		}}
		>
			{children}
		</AuthContext.Provider>
	);
};

const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export {
	AuthProvider,
	useAuth
};
