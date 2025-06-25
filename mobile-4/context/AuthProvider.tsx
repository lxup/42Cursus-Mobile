import { User } from "@/types/type.db";
import { Provider, Session } from "@supabase/supabase-js";
import { SplashScreen } from "expo-router";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSupabaseClient } from "./SupabaseProvider";
import { useUserQuery } from "@/queries/user/userQueries";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

SplashScreen.preventAutoHideAsync();

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
	const supabase = useSupabaseClient();
	const [session, setSession] = useState<Session | null | undefined>(undefined);
	const {
		data: user,
	} = useUserQuery({
		userId: session?.user.id,
	});
	
	const login = useCallback(async ({ provider }: { provider: Provider }) => {
		switch (provider) {
			case "google":
				GoogleSignin.configure({
					scopes: ["https://www.googleapis.com/auth/drive.readonly"],
					iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
				})
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
				break;
			default:
				throw new Error(`Unsupported provider -> ${provider}`);
		}
	}, []);
	
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
