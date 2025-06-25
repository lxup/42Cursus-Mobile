import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import useDebounce from "@/hooks/useDebounce";
import { useThemeColor } from "@/hooks/useThemeColor";
import tw from "@/lib/tw";
import { useCallback, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const Search = () => {
  // Colors
  const foregroundColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');
  const mutedForegroundColor = useThemeColor({}, 'mutedForeground');

  const inset = useSafeAreaInsets();
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);

  const renderSearch = useCallback(() => {
    if (debouncedSearch.length === 0) {
      return (
        <View style={tw`items-center justify-center`}>
          <ThemedText style={{ color: mutedForegroundColor }}>Search for users by name or username</ThemedText>
        </View>
      )
    }
    return (
      <View>
        <ThemedText>Results</ThemedText>
      </View>
    )
  }, [debouncedSearch]);
  return (
    <ThemedView
		style={[
			{ paddingTop: inset.top },
			tw`flex-1 gap-4 px-2`
		]}
		>
			<View
			style={[
				{ backgroundColor: mutedColor },
				tw`flex-row items-center gap-2 rounded-md px-2 py-1`,
			]}
			>
				<IconSymbol name="magnifyingglass" color={foregroundColor} size={20} />
				<TextInput
				placeholder="Search users..."
				placeholderTextColor={mutedForegroundColor}
				style={[
					{ color: foregroundColor },
					tw`flex-1 py-2 pr-2`,
				]}
				textAlignVertical="center"
				value={search}
				onChangeText={setSearch}
				/>
        {search && (<TouchableOpacity onPress={() => setSearch("")}>
					<IconSymbol size={15} name="xmark" color={foregroundColor} style={{ opacity: 0.8 }} />
				</TouchableOpacity>)}
			</View>
			{renderSearch()}
		</ThemedView>
  );
};

export default Search;