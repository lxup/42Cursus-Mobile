import { useDiaryNotesStatsQuery } from "@/features/user/userQueries";
import { Skeleton } from "../ui/Skeleton";
import tw from "@/lib/tw";
import { FlatList, Text, View } from "react-native";
import { ThemedText } from "../ThemedText";
import getFeelingIcon from "@/hooks/getFeelingIcon";
import { Feeling } from "@/types/type.db";
import { useThemeColor } from "@/hooks/useThemeColor";

interface DiaryNotesStatsProps extends React.ComponentPropsWithRef<typeof View> {
	userId: string;
};

const DiaryNotesStats = ({ userId, ...props } : DiaryNotesStatsProps) => {
	// Colors
	const mutedColor = useThemeColor({}, 'muted');
	const mutedForegroundColor = useThemeColor({}, 'mutedForeground');
	// Queries
	const {
		data,
		isLoading,
		isError,
	} = useDiaryNotesStatsQuery({
		userId,
	});
	return (
		<View {...props}>
			{isLoading ? (
				<Skeleton style={tw`w-full h-24 rounded-md`}/>
			) : (
				<View
				style={[
						tw`border rounded-md p-2 gap-2`,
						{ borderColor: mutedColor },
				]}
				>
					<View style={tw``}>
						<ThemedText style={tw`font-bold text-center`}>Stats <Text style={[tw`font-normal`, { color: mutedForegroundColor }]}>({data?.totalCount} notes)</Text></ThemedText>
					</View>
					<FlatList
					data={data?.counts || []}
					keyExtractor={(item) => item.feeling}
					horizontal
					renderItem={({ item }) => {
						const percent = ((item.count / (data?.totalCount || 1)) * 100).toFixed(0);
						const feelingIcon = item.feeling ? getFeelingIcon(item.feeling as Feeling) : null;
						return (
							<View style={tw`items-center`}>
								<ThemedText style={tw`text-lg font-bold`}>{feelingIcon}</ThemedText>
								<ThemedText style={tw`text-xs font-bold`}>{percent}%</ThemedText>
								<Text style={[tw`text-xs`, { color: mutedForegroundColor }]}>{item.count}</Text>
							</View>
						);
					}}
					contentContainerStyle={[
						tw`w-full justify-between gap-1`,
						{ borderColor: mutedColor },
					]}
					scrollEnabled={false}
					/>
				</View>
			)}
		</View>
	)
};

export default DiaryNotesStats;