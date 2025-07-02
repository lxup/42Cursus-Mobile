import useOrientation from "@/hooks/useOrientation";
import { createContext, useContext } from "react";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

type ThemeContextType = {
	inset: EdgeInsets;
	orientation: 'portrait' | 'landscape';
};
  
const ThemeContext = createContext<ThemeContextType>({
	inset: {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
	orientation: 'portrait',
});


type ThemeProviderProps = {
	children?: React.ReactNode;
};
  
const ThemeProvider = ({children}: ThemeProviderProps) => {
	const inset = useSafeAreaInsets();
	const orientation = useOrientation();

	return (
		<ThemeContext.Provider
		value={{
			inset,
			orientation,
		}}
		>
			{children}
		</ThemeContext.Provider>
	);
};

const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};

export {
	ThemeProvider,
	useTheme,
};