import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthProvider";
import { useDiaryNoteQuery } from "@/features/user/userQueries";
import { useThemeColor } from "@/hooks/useThemeColor";
import tw from "@/lib/tw";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as z from 'zod';
import * as Burnt from 'burnt';
import { useDiaryNotesUpdateMutation } from "@/features/user/userMutations";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import getFeelingIcon from "@/hooks/getFeelingIcon";
import { Picker } from "@react-native-picker/picker";
import { IconSymbol } from "@/components/ui/IconSymbol";

const TITLE_MIN_LENGTH = 1;
const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

const NoteScreen = () => {
	const { user } = useAuth();
	const isPresented = router.canGoBack();
	const noteParams = useLocalSearchParams<any>();
	const updateDiaryNoteMutation = useDiaryNotesUpdateMutation();
	// Colors
	const foregroundColor = useThemeColor({}, 'text');
	const mutedColor = useThemeColor({}, 'muted');
	const mutedForegroundColor = useThemeColor({}, 'mutedForeground');
	const {
		data: note,
		isLoading: noteIsLoading,
		isError,
	} = useDiaryNoteQuery({
		id: Number(noteParams.id),
		initialData: noteParams
	});
	const feelingIcon = useMemo(() => {
		if (!note?.feeling) return undefined;
		return getFeelingIcon(note.feeling);
	}, [note?.feeling]);
	// States
	const [ isEditing, setIsEditing ] = useState(false);
	const [ isLoading, setIsLoading ] = useState(false);
	// Form
	const newNoteSchema = z.object({
		feeling: z
			.enum(['happy', 'neutral', 'sad', 'angry', 'tired', 'excited']),
		title: z
			.string()
			.min(TITLE_MIN_LENGTH)
			.max(TITLE_MAX_LENGTH),
		description: z
			.string()
			.max(DESCRIPTION_MAX_LENGTH)
			.optional(),
		date: z
			.date(),
	});
	type NewNoteFormValues = z.infer<typeof newNoteSchema>;
	const defaultValues: Partial<NewNoteFormValues> = {
		feeling: note?.feeling || 'neutral',
		title: note?.title || '',
		description: note?.description || '',
		date: note ? new Date(note.date) : new Date(),
	};
	const form = useForm<NewNoteFormValues>({
		resolver: zodResolver(newNoteSchema),
		defaultValues: defaultValues,
		mode: 'onChange',
	});
	// Handlers
	const handleSubmit = async (data: NewNoteFormValues) => {
		try {
			setIsLoading(true);
			if (!user) throw new Error('User is not authenticated');
			await updateDiaryNoteMutation.mutateAsync({
				id: noteParams.id,
				feeling: data.feeling,
				title: data.title,
				description: data.description,
				date: data.date,
			});
			setIsEditing(false);
			Burnt.toast({
				title: "Updated",
				preset: 'done',
			});
		} catch (error: any) {
			Burnt.toast({
				title: error.message,
				preset: 'error',
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (note) {
			form.reset({
				feeling: note.feeling || 'neutral',
				title: note.title,
				description: note.description || '',
				date: new Date(note.date),
			});
		}
	}, [note, form]);

	if (noteIsLoading || note === undefined) {
		return (
			<ThemedView style={tw`flex-1 items-center justify-center`}>
				<ActivityIndicator />
			</ThemedView>
		)
	}
	if (isError) {
		return (
			<ThemedView style={tw`flex-1 items-center justify-center`}>
				<Text style={tw`text-red-500`}>Error loading note</Text>
			</ThemedView>
		)
	}
	if (!note) {
		return (
			<ThemedView style={tw`flex-1 items-center justify-center`}>
				<Text style={[tw``, { color: mutedForegroundColor }]}>Note not found</Text>
			</ThemedView>
		)
	}
	return (
		<ThemedView style={tw`flex-1 items-center gap-2 py-2 px-4`}>
			<View style={tw`flex-row items-center justify-between w-full mb-2`}>
				{isPresented && (
					<TouchableOpacity
					disabled={isLoading}
					onPress={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
					>
						<ThemedText>{isEditing ? 'Cancel' : 'Edit'}</ThemedText>
					</TouchableOpacity>
				)}
				{user?.id === note?.user_id && (
					<TouchableOpacity
					disabled={isLoading}
					onPress={isEditing ? form.handleSubmit(handleSubmit) : router.back}
					>
						{/* <ThemedText>{isEditing ? 'Save' : 'Edit'}</ThemedText> */}
						{isEditing ? <ThemedText>Save</ThemedText> : <IconSymbol name="xmark" color={mutedForegroundColor} size={16} />}
					</TouchableOpacity>
				)}
			</View>
			{!isEditing ? <View style={tw`w-full gap-2`}>
				<ThemedText style={tw`text-4xl text-center`}>{feelingIcon}</ThemedText>
				<View style={tw``}>
					<ThemedText style={tw`text-lg font-bold text-center`}>{note.title}</ThemedText>
					<ThemedText style={[tw`text-sm text-center italic`, { color: mutedForegroundColor }]}>
						{new Date(note.date).toLocaleDateString()}
					</ThemedText>
				</View>
				{note.description ? (
					<ThemedText style={tw`text-sm`}>{note.description}</ThemedText>
				) : (
					<ThemedText style={[tw`text-sm text-center`, { color: mutedForegroundColor }]}>No description</ThemedText>
				)}
			</View> : (
				<>
				<Controller
				control={form.control}
				render={({field: { onChange, onBlur, value }}) => (
					<View style={tw`gap-1 w-full`}>
						<ThemedText style={tw`text-sm font-bold`}>Feeling</ThemedText>
						<Picker
						selectedValue={value}
						onValueChange={(itemValue) => onChange(itemValue)}>
							<Picker.Item label={`${getFeelingIcon('happy')} Happy`} value="happy" />
							<Picker.Item label={`${getFeelingIcon('neutral')} Neutral`} value="neutral" />
							<Picker.Item label={`${getFeelingIcon('sad')} Sad`} value="sad" />
							<Picker.Item label={`${getFeelingIcon('angry')} Angry`} value="angry" />
							<Picker.Item label={`${getFeelingIcon('tired')} Tired`} value="tired" />
							<Picker.Item label={`${getFeelingIcon('excited')} Excited`} value="excited" />
						</Picker>
						{form.formState.errors.feeling?.message ? (
							<ThemedText style={[tw`text-xs text-red-500`]}>{form.formState.errors.feeling.message}</ThemedText>
						) : null}
					</View>
				)}
				name="feeling"
				rules={{
					required: true,
				}}
				/>
				<Controller
				control={form.control}
				render={({field: { onChange, onBlur, value }}) => (
					<View style={tw`gap-1 w-full`}>
						<ThemedText style={tw`text-sm font-bold`}>Title</ThemedText>
						<TextInput
						nativeID="username"
						placeholder="Banger"
						placeholderTextColor={mutedForegroundColor}
						style={[
							{ color: foregroundColor, backgroundColor: mutedColor },
							tw`rounded-md p-2 h-10`
						]}
						textAlignVertical="center"
						value={value}
						onChangeText={onChange}
						onBlur={onBlur}
						autoCapitalize="none"
						autoCorrect={false}
						autoComplete="username"
						/>
						{form.formState.errors.title?.message ? (
							<ThemedText style={[tw`text-xs text-red-500`]}>{form.formState.errors.title.message}</ThemedText>
						) : null}
					</View>
				)}
				name="title"
				rules={{
					required: true,
				}}
				/>
				<Controller
				control={form.control}
				render={({field: { onChange, onBlur, value }}) => (
					<View style={tw`gap-1 w-full`}>
						<ThemedText style={tw`text-sm font-bold`}>Description</ThemedText>
						<TextInput
						nativeID="description"
						placeholder="Ouai ouai pole emploi...."
						placeholderTextColor={mutedForegroundColor}
						style={[
							{ color: foregroundColor, backgroundColor: mutedColor },
							tw`rounded-md p-2 h-24`
						]}
						
						multiline
						textAlignVertical="center"
						value={value}
						onChangeText={onChange}
						onBlur={onBlur}
						autoCapitalize="none"
						autoCorrect={false}
						/>
						{form.formState.errors.description?.message ? (
							<ThemedText style={[tw`text-xs text-red-500`]}>{form.formState.errors.description.message}</ThemedText>
						) : null}
					</View>
				)}
				name="description"
				/>
				<Controller
				control={form.control}
				render={({field: { onChange, onBlur, value }}) => (
					<View style={tw`gap-1 w-full`}>
						<ThemedText style={tw`text-sm font-bold`}>Date</ThemedText>
						<View style={tw`items-center`}>
							<RNDateTimePicker
							value={value}
							onChange={(event, date) => {
								if (date) {
									onChange(date);
								}
							}}
							mode="date"
							display="spinner"
							/>
						</View>
						{form.formState.errors.date?.message ? (
							<ThemedText style={[tw`text-xs text-red-500`]}>{form.formState.errors.date.message}</ThemedText>
						) : null}
					</View>
				)}
				name="date"
				rules={{
					required: true,
				}}
				/>
				</>
			)}
		</ThemedView>
	)
};

export default NoteScreen;