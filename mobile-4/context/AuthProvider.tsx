import { User } from "@/types/type.db";
import { Provider, Session } from "@supabase/supabase-js";
import { SplashScreen } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
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

	useEffect(() => {
		supabase.auth.getSession().then(({data: { session }}) => {
			setSession(session);
			SplashScreen.hide();
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	const login = async ({ provider }: { provider: Provider }) => {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: provider,
			options: {
				redirectTo: "exp://localhost:19006/signin",
			},
		});
		if (error) throw error;
	};

	const logout = async () => {
		await supabase.auth.signOut();
	};


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
