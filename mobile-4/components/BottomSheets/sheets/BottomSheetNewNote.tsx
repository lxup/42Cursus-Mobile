import React from 'react';
import tw from '@/lib/tw';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { ThemedText } from '../../ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import useBottomSheetStore from '@/stores/useBottomSheetStore';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/context/ThemeProvider';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Burnt from 'burnt';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useDiaryNotesInsertMutation } from '@/features/user/userMutations';
import {Picker} from '@react-native-picker/picker';
import getFeelingIcon from '@/hooks/getFeelingIcon';

interface BottomSheetNewNoteProps extends Omit<React.ComponentPropsWithoutRef<typeof TrueSheet>, 'children'> {
	id: string;
};

const TITLE_MIN_LENGTH = 1;
const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

const BottomSheetNewNote = React.forwardRef<
	React.ComponentRef<typeof TrueSheet>,
	BottomSheetNewNoteProps
>(({ id, sizes, ...props }, ref) => {
	const { closeSheet } = useBottomSheetStore();
	const { user } = useAuth();
	const { inset } = useTheme();
	const insertDiaryNoteMutation = useDiaryNotesInsertMutation({
		userId: user?.id,
	});
	// Colors
	const foregroundColor = useThemeColor({}, 'text');
	const mutedForegroundColor = useThemeColor({}, 'mutedForeground');
	const mutedColor = useThemeColor({}, 'muted');
	// States
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	/* ------------------------------- FORM SCHEMA ------------------------------ */
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
		feeling: 'neutral',
		title: '',
		date: new Date(),
	};
	/* -------------------------------------------------------------------------- */
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
			await insertDiaryNoteMutation.mutateAsync({
				feeling: data.feeling,
				title: data.title,
				description: data.description,
				date: data.date,
			});
			closeSheet(id);
			Burnt.toast({
				title: "Created",
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

	return (
	<TrueSheet
	ref={ref}
	onLayout={async () => {
		if (typeof ref === 'object' && ref?.current?.present) {
			await ref.current.present();
		};
	}}
	sizes={["large"]}
	{...props}
	>
		<View
		style={[
			{ paddingBottom: inset.bottom },
			tw`flex-1 items-center gap-2 px-4`,
		]}
		>
			<View style={tw`flex-row items-center justify-between w-full mb-2`}>
				<TouchableOpacity
				disabled={isLoading}
				onPress={() => closeSheet(id)}
				>
					<ThemedText>Cancel</ThemedText>
				</TouchableOpacity>
				<ThemedText style={tw`font-bold`}>
					Add a new note
				</ThemedText>
				<TouchableOpacity
				disabled={isLoading}
				onPress={form.handleSubmit(handleSubmit)}
				>
					<ThemedText>Save</ThemedText>
				</TouchableOpacity>
			</View>
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
		</View>
	</TrueSheet>
	);
});
BottomSheetNewNote.displayName = 'BottomSheetNewNote';

export default BottomSheetNewNote;