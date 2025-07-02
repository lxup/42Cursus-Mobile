import { createClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext, useMemo } from "react";

const SupabaseContext = createContext<SupabaseClient<Database> | undefined>(undefined);

export const SupabaseProvider = ({
	children,
} : {
	children: React.ReactNode;
}) => {
	const supabase = useMemo(() => {
		return createClient();
	}, []);
	return (
		<SupabaseContext.Provider value={supabase}>
			{children}
		</SupabaseContext.Provider>
	);
}

export const useSupabaseClient = () => {
	const context = useContext(SupabaseContext);
	if (!context) {
		throw new Error('useSupabaseClient must be used within a SupabaseProvider');
	}
	return context;
};