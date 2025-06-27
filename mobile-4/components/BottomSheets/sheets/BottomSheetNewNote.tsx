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

interface BottomSheetNewNoteProps extends Omit<React.ComponentPropsWithoutRef<typeof TrueSheet>, 'children'> {
	id: string;
};

const TITLE_MIN_LENGTH = 1;
const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

const BottomSheetNewNote = React.forwardRef<
	React.ComponentRef<typeof TrueSheet>,
	BottomSheetNewNoteProps
>(({ id, ...props }, ref) => {
	const { closeSheet } = useBottomSheetStore();
	const { user } = useAuth();
	const { inset } = useTheme();
	// Colors
	const foregroundColor = useThemeColor({}, 'text');
	const mutedForegroundColor = useThemeColor({}, 'mutedForeground');
	const mutedColor = useThemeColor({}, 'muted');
	// States
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	/* ------------------------------- FORM SCHEMA ------------------------------ */
	const newNoteSchema = z.object({
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
			if (!form.formState.isValid) throw new Error('Form is not valid');
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
	{...props}
	>
		<View
		style={[
			{ paddingBottom: inset.bottom },
			tw`flex-1 items-center gap-2 px-4`,
		]}
		>
			<View style={tw`flex-row items-center justify-between w-full`}>
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