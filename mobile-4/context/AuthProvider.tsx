import { User } from "@/types/type.db";
import { Provider, Session } from "@supabase/supabase-js";
import { SplashScreen } from "expo-router";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSupabaseClient } from "./SupabaseProvider";
import { useUserQuery } from "@/queries/user/userQueries";

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
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: provider,
			options: {
				redirectTo: "exp://localhost:19006/signin",
			},
		});
		console.log("Login data:", data);
		console.log("Login error:", error);
		if (error) throw error;
	}, []);
	
	const logout = useCallback(async () => {
		await supabase.auth.signOut();
	}, []);

	useEffect(() => {
		supabase.auth.getSession().then(({data: { session }}) => {
			setSession(session);
			SplashScreen.hide();
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

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
