import React, { useEffect } from 'react';
import tw from '@/lib/tw';
import { ActivityIndicator, TextInput, View } from 'react-native';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { ThemedText } from '../../ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import useBottomSheetStore from '@/stores/useBottomSheetStore';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@/context/ThemeProvider';
import { Button } from '@react-navigation/elements';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useDebounce from '@/hooks/useDebounce';
import useUsernameAvailability from '@/hooks/useUsernameAvailability';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useUserUpdateMutation } from '@/features/user/userMutations';
import * as Burnt from 'burnt';

interface BottomSheetSetUsernameProps extends Omit<React.ComponentPropsWithoutRef<typeof TrueSheet>, 'children'> {
	id: string;
};

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 15;

const BottomSheetSetUsername = React.forwardRef<
	React.ComponentRef<typeof TrueSheet>,
	BottomSheetSetUsernameProps
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
	const updateProfileMutation = useUserUpdateMutation({
		userId: user?.id,
	});
	/* ------------------------------- FORM SCHEMA ------------------------------ */
	const usernameSchema = z.object({
		username: z
		.string()
		.min(USERNAME_MIN_LENGTH, {
			// message: t('common.form.length.char_min', { count: USERNAME_MIN_LENGTH }),
		})
		.max(USERNAME_MAX_LENGTH, {
			// message: common('form.length.char_max', { count: USERNAME_MAX_LENGTH }),
		})
		.regex(/^[^\W]/, {
			// message: common('form.username.schema.first_char'),
		})
		.regex(/^(?!.*\.\.)/, {
			// message: common('form.username.schema.double_dot'),
		})
		.regex(/^(?!.*\.$)/, {
			// message: common('form.username.schema.ends_with_dot'),
		})
		.regex(/^[\w.]+$/, {
			// message: common('form.username.schema.format'),
		})
	});
	type UsernameFormValues = z.infer<typeof usernameSchema>;
	const defaultValues: Partial<UsernameFormValues> = {
		username: '',
	};
	/* -------------------------------------------------------------------------- */
	const form = useForm<UsernameFormValues>({
		resolver: zodResolver(usernameSchema),
		defaultValues: defaultValues,
		mode: 'onChange',
	});
	const usernameAvailability = useUsernameAvailability();
	const usernameToCheck = useDebounce(form.watch('username'), 500);

	// Handlers
	const handleSubmit = async (data: UsernameFormValues) => {
		try {
			setIsLoading(true);
			if (!user) throw new Error('User is not authenticated');
			if (!form.formState.isValid) throw new Error('Form is not valid');
			if (!usernameAvailability.isAvailable) {
				throw new Error(`Username "${data.username}" is already taken.`);
			}
			await updateProfileMutation.mutateAsync({
				username: data.username,
			});
			closeSheet(id);
			Burnt.toast({
				title: "Saved",
				preset: 'done',
			})
		} catch (error: any) {
			if (error instanceof Error) {
				console.error('Error setting username:', error.message);
			} else {
				console.error('Unexpected error setting username:', error);
			}
			Burnt.toast({
				title: error.message,
				preset: 'error',
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!form.formState.errors.username?.message && usernameToCheck) {
			usernameAvailability.check(usernameToCheck);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [usernameToCheck]);

	useEffect(() => {
		if (usernameAvailability.isAvailable === false) {
			form.setError('username', {
				message: `Username "${usernameToCheck}" is already taken.`,
			});
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [usernameAvailability.isAvailable]);

	useEffect(() => {
		if (user && user.username) {
			closeSheet(id);
		}
	}, [user, closeSheet, id]);

	return (
	<TrueSheet
	ref={ref}
	onLayout={async () => {
		if (typeof ref === 'object' && ref?.current?.present) {
			await ref.current.present();
		};
	}}
	dismissible={false}
	{...props}
	>
		<View
		style={[
			{ paddingBottom: inset.bottom },
			tw`flex-1 items-center justify-center gap-2 px-4`,
		]}
		>
			<ThemedText style={tw`text-xl font-bold`}>You need an username</ThemedText>
			<Controller
			control={form.control}
			render={({field: { onChange, onBlur, value }}) => (
				<>
				<View
				style={[
					{ backgroundColor: mutedColor },
					tw`flex-row items-center w-full gap-1 rounded-md p-2 h-10`
				]}>
					<TextInput
					nativeID="username"
					placeholder="dicaprio"
					placeholderTextColor={mutedForegroundColor}
					style={[
						{ color: foregroundColor },
						tw`flex-1`,
					]}
					textAlignVertical="center"
					value={value}
					onChangeText={onChange}
					onBlur={onBlur}
					autoCapitalize="none"
					autoCorrect={false}
					autoComplete="username"
					/>
					{usernameAvailability.isLoading ? (
						<ActivityIndicator size={16} />
					) : usernameAvailability.isAvailable !== undefined ? (
						<View style={tw`rounded-full p-1 ${usernameAvailability.isAvailable ? "bg-green-500" : "bg-red-500"}`}>
							<IconSymbol name={usernameAvailability.isAvailable ? "checkmark" : "xmark"} color={foregroundColor} size={14} />
						</View>
					) : null}
				</View>
				{form.formState.errors.username?.message ? (
					<ThemedText style={[tw`text-xs text-red-500`]}>{form.formState.errors.username.message}</ThemedText>
				) : null}
				</>
			)}
			name="username"
			rules={{
				required: true,
			}}
			/>
			<Button onPressIn={form.handleSubmit(handleSubmit)} style={tw`w-full`} disabled={!form.formState.isValid || isLoading}>
				Enregistrer
			</Button>
		</View>
	</TrueSheet>
	);
});
BottomSheetSetUsername.displayName = 'BottomSheetSetUsername';

export default BottomSheetSetUsername;