import { StyleSheet, TouchableHighlight, useWindowDimensions, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Row } from '@/components/Row';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

type Button = {
	label: string;
	value: string;
	theme: 'default' | 'accent' | 'muted';
}

export default function Ex02() {
	// Colors
	const secondaryColor = useThemeColor({}, "secondary");
	const secondarySelectedColor = useThemeColor({}, "secondarySelected");
	const mutedColor = useThemeColor({}, "muted");
	const mutedSelectedColor = useThemeColor({}, "mutedSelected");
	const accentColor = useThemeColor({}, "accent");
	const accentSelectedColor = useThemeColor({}, "accentSelected");
	
	// State
	const { width, height } = useWindowDimensions();
	const isPortrait = height >= width;
	const buttonPerRow = isPortrait ? 4 : 5;
	const paddingButtonContainer = 4;
	const buttonWidth = isPortrait ? (width / buttonPerRow) - (paddingButtonContainer * 2) : (width / buttonPerRow) - (paddingButtonContainer * 2);
	const buttonHeight = isPortrait ? buttonWidth : (height / buttonPerRow) - (paddingButtonContainer * 2) - height * 0.1;

	const buttons: Button[] = useMemo(() => [
		{
			label: 'AC',
			value: 'AC',
			theme: 'muted'
		},
		{
			label: '±',
			value: '±',
			theme: 'muted'
		},
		{
			label: '%',
			value: '%',
			theme: 'muted'
		},
		{
			label: '÷',
			value: '/',
			theme: 'accent'
		},
		{
			label: '7',
			value: '7',
			theme: 'default'
		},
		{
			label: '8',
			value: '8',
			theme: 'default'
		},
		{
			label: '9',
			value: '9',
			theme: 'default'
		},
		{
			label: 'x',
			value: '*',
			theme: 'accent'
		},
		{
			label: '4',
			value: '4',
			theme: 'default'
		},
		{
			label: '5',
			value: '5',
			theme: 'default'
		},
		{
			label: '6',
			value: '6',
			theme: 'default'
		},
		{
			label: '-',
			value: '-',
			theme: 'accent'
		},
		{
			label: '1',
			value: '1',
			theme: 'default'
		},
		{
			label: '2',
			value: '2',
			theme: 'default'
		},
		{
			label: '3',
			value: '3',
			theme: 'default'
		},
		{
			label: '+',
			value: '+',
			theme: 'accent'
		},
		{
			label: 'C',
			value: 'C',
			theme: 'default'
		},
		{
			label: '0',
			value: '0',
			theme: 'default'
		},
		{
			label: ',',
			value: '.',
			theme: 'default'
		},
		{
			label: '=',
			value: '=',
			theme: 'accent'
		}
	], []);

	const verticalOrder = useMemo(() => [
		'AC', '±', '%', '/',
		'7', '8', '9', '*',
		'4', '5', '6', '-',
		'1', '2', '3', '+',
		'C', '0', '.', '='
	], []);
	const horizontalOrder = useMemo(() => [
		'7', '8', '9', 'AC', '/',
		'4', '5', '6', '±', '*',
		'1', '2', '3', '%', '-',
		'C', '0', '.', '=', '+'
	], []);

	const orderedButtons = useMemo(() => {
		const order = isPortrait ? verticalOrder : horizontalOrder;
		return order.map(text => buttons.find(button => button.value === text)).filter(Boolean) as Button[];
	}, [isPortrait, verticalOrder, horizontalOrder, buttons]);

	return (
		<SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
			<View style={[styles.expressionContainer]}>
				<ThemedText style={styles.expression}>
					{'0'}
				</ThemedText>
				<ThemedText style={[styles.result, { color: mutedColor }]} type='defaultSemiBold'>
					{'0'}
				</ThemedText>
			</View>
			<View style={[{ gap: paddingButtonContainer }]}>
				{Array.from({ length: Math.ceil(orderedButtons.length / buttonPerRow) }).map((_, rowIndex) => (
					<Row key={rowIndex} style={{ gap: paddingButtonContainer, justifyContent: 'space-between', paddingHorizontal: paddingButtonContainer }}>
						{orderedButtons.slice(rowIndex * buttonPerRow, (rowIndex + 1) * buttonPerRow).map((button, index) => (
							<TouchableHighlight
								key={index}
								onPress={() => {
									console.log(`Button pressed: ${button.label}`);
								}}
								underlayColor={button.theme === 'default' ? secondarySelectedColor : button.theme === 'muted' ? mutedSelectedColor : button.theme === 'accent' ? accentSelectedColor : undefined}
								style={[
									styles.button,
									{
										width: buttonWidth,
										height: buttonHeight
									},
									{
										backgroundColor: button.theme === 'default' ?
											secondaryColor 
											: button.theme === 'muted' ?
											mutedColor
											: button.theme === 'accent' ?
											accentColor
											: undefined,
									}
								]}
							>
								<ThemedText style={{ color: 'white', fontSize: isPortrait ? (buttonWidth * 0.3) : (buttonHeight / 2), lineHeight: isPortrait ? (buttonWidth * 0.3) : (buttonHeight / 2) }}>
									{button.label}
								</ThemedText>
							</TouchableHighlight>
						))}
					</Row>
				))}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		height: '100%',
		display: 'flex',
		flex: 1,
	},
	expressionContainer: {
		flex: 1,
		padding: 12,
	},
	expression: {
		width: '100%',
		textAlign: 'right',
		fontSize: 40,
		lineHeight: 48,
		fontWeight: 'bold',
	},
	result: {
		textAlign: 'right',
		fontSize: 24,
    	lineHeight: 32,
		flexShrink: 0,
	},
	button: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 999,
		flexShrink: 1,
	},
});
