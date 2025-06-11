import { Platform, StyleSheet, TouchableHighlight, useWindowDimensions, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Row } from '@/components/Row';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useCallback, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

type Button = {
	label: string;
	value: string;
	theme: 'default' | 'accent' | 'muted';
}

export default function Ex03() {
	// Colors
	const secondaryColor = useThemeColor({}, "secondary");
	const secondarySelectedColor = useThemeColor({}, "secondarySelected");
	const mutedColor = useThemeColor({}, "muted");
	const mutedSelectedColor = useThemeColor({}, "mutedSelected");
	const accentColor = useThemeColor({}, "accent");
	const accentSelectedColor = useThemeColor({}, "accentSelected");
	
	// State
	const { width, height } = useWindowDimensions();
	const [currentExpression, setCurrentExpression] = useState('');
	const [prevExpression, setPrevExpression] = useState('');
	const [prevIsResult, setPrevIsResult] = useState(false);
	const isPortrait = height >= width && width < 600;
	const buttonPerRow = isPortrait ? 4 : 5;
	const paddingButtonContainer = 4;
	const buttonWidth = isPortrait ? (width / buttonPerRow) - (paddingButtonContainer * 2) : (width / buttonPerRow) - (paddingButtonContainer * 2);
	const buttonHeight = isPortrait ? buttonWidth : (height / buttonPerRow) - (paddingButtonContainer * 2) - height * 0.1;

	const isOperator = useCallback((text: string) => {
		return ['+', '-', '*', '/', '%'].includes(text);
	}, []);

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

	const getDisplayExpression = useCallback((expression: string) => {
		if (expression === 'NaN' || expression === 'Infinity' || expression === '-Infinity') return 'Non défini';
		if (expression === 'Error') return 'Erreur mathématique';
		const valueToLabelMap = buttons.reduce((map, button) => {
			if (button.value !== button.label) {
			map[button.value] = button.label;
			}
			return map;
		}, {} as Record<string, string>);

		const formattedExpression = expression.replace(
			/(-?\d+\.?\d*)/g,
			(match) => {
				const splitted = match.split('.');
				const [ integerPart, decimalPart = '' ] = splitted;
				const formattedInteger = integerPart.replace(
					/\B(?=(\d{3})+(?!\d))/g,
					' '
				);
				return splitted.length > 1 ? `${formattedInteger}.${decimalPart}` : formattedInteger;
			}
		);
		return formattedExpression
			.split('')
			.map((char) => valueToLabelMap[char] || char)
			.join('');
	}, [buttons]);

	const formatter = useCallback((expression: string) => {
		let formattedExpression = expression
		// delete leading operators
		formattedExpression = formattedExpression.replace(/[+\-*\/%]+$/, '');
		// close all open parentheses
		const openParenthesesCount = (formattedExpression.match(/\(/g) || []).length;
		const closeParenthesesCount = (formattedExpression.match(/\)/g) || []).length;
		if (openParenthesesCount > closeParenthesesCount) {
			formattedExpression += ')'.repeat(openParenthesesCount - closeParenthesesCount);
		}
		return formattedExpression
	}, [])

	const handleButtonPress = useCallback((text: string) => {
		const disableAction = currentExpression === 'NaN' || currentExpression === 'Error' || currentExpression === 'Infinity' || currentExpression === '-Infinity';
		if (text === 'AC') {
			setCurrentExpression('');
			setPrevExpression('');
		} else if (text ==='C') {
			if (!disableAction) {
				setCurrentExpression(prev => prev.slice(0, -1));
			}
		} else if (!isNaN(parseFloat(text))) {
			const lastNumber = currentExpression.split(/[\+\-x\/%]/).pop();
			if (disableAction) {
				setCurrentExpression(text);
				setPrevExpression('');
			} else if (
				(text !== '0' || currentExpression !== '') // Prevent leading zero
				&& (lastNumber !== '0' || currentExpression === '') // Prevent multiple leading zeros
			) {
				if (currentExpression.endsWith(')')) {
					setCurrentExpression(prev => prev + '*' + text);
				} else {
					setCurrentExpression(prev => `${prevIsResult ? '' : prev}${text}`);
				}
			}
		} else if (text === '.') {
			const lastNumber = currentExpression.split(/[\+\-x\/%]/).pop();
			if (lastNumber && !lastNumber.includes('.')) {

				if (currentExpression.endsWith(')')) {
					setCurrentExpression(prev => prev + '*0.');
				} else {
					setCurrentExpression(prev => prev + '.');
				}
			} else if (isOperator(currentExpression.slice(-1)) || currentExpression === '') {
				setCurrentExpression(prev => prev + '0.');
			} else if (prevIsResult) {
				setCurrentExpression('0.');
			}
		} else if (isOperator(text)) {
			if (!disableAction) {
				const lastChar = currentExpression.slice(-1);
				const isLastCharOperator = isOperator(lastChar);
				switch (text) {
					case '-':
						if (lastChar === '+') {
							setCurrentExpression(prev => prev.slice(0, -1) + text);
						} else if (lastChar !== '-') {
							setCurrentExpression(prev => prev + text);
						}
						break;
					default:
						if (lastChar === '-' && isOperator(currentExpression.slice(-2, -1))) {
							setCurrentExpression(prev => prev.slice(0, -2) + text);
						} else if (isLastCharOperator) {
							setCurrentExpression(prev => prev.slice(0, -1) + text);
						} else if (!currentExpression) {
							setCurrentExpression(prev => prev + '0' + text);
						} else {
							setCurrentExpression(prev => prev + text);
						}
						break;
				}
			}
		} else if (text === '=') {
			if (!disableAction) {
				try {
					const expression = formatter(currentExpression);
					const evaluatedResult = eval(expression);
					setPrevExpression(expression);
					setCurrentExpression(evaluatedResult.toString());
					setPrevIsResult(true);
				} catch (error) {
					void(error);
					setCurrentExpression('Error');
					setPrevExpression(currentExpression);
				}
			}
		} else if (text === '±') {
			if (!disableAction && currentExpression) {
				const lastNumberMatch = currentExpression.match(/(\(?[+-]?\d+(?:,\d+)?\)?)$/);
				const [lastNumber] = lastNumberMatch || [];
				if (lastNumber) {
					if ((lastNumber.startsWith('-') || lastNumber.startsWith('+')) && lastNumber.length < currentExpression.length) {
						const charBeforeLastNumberIsOperator = isOperator(currentExpression.slice(-lastNumber.length - 1, -lastNumber.length));
						const operator = lastNumber.at(0);
						if (charBeforeLastNumberIsOperator) {
							if (operator === '-') {
								setCurrentExpression(currentExpression.slice(0, -lastNumber.length) + lastNumber.replace(/^[+-]/, ''));
							} else {
								setCurrentExpression(currentExpression.slice(0, -lastNumber.length) + lastNumber.replace(/^[+-]/, '-'));
							}
						} else {
							setCurrentExpression(currentExpression.slice(0, -lastNumber.length) + lastNumber.replace(/^[+-]/, operator === '-' ? '+' : '-'));
						}
					} else {
						const startIndex = currentExpression.length - lastNumber.length;
						let toggled;
						if (lastNumber.startsWith('(') && lastNumber.endsWith(')')) {
							toggled = lastNumber.replace(/^\(|\)$/g, '').replace('-', '');
						} else {
							toggled = `(${lastNumber} * -1)`;
						}
						try {
							const evaluatedResult = eval(toggled);
							const evaluatedResultFormat = evaluatedResult < 0 ? `(${evaluatedResult.toString()})` : evaluatedResult.toString();
							setCurrentExpression(currentExpression.slice(0, startIndex) + evaluatedResultFormat);
						} catch (error) {
							void(error);
							setCurrentExpression('Error');
							setPrevExpression(toggled);
							return;
						}
					}
				}
			}
		}

		if ((prevIsResult || !disableAction) && text !== '=' ) setPrevIsResult(false);
	}, [currentExpression, prevIsResult, formatter, isOperator]);

	return (
		<SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
			<View style={[styles.expressionContainer]}>
				<ThemedText style={styles.expression} numberOfLines={prevIsResult ? 3 : 1} ellipsizeMode='head' adjustsFontSizeToFit>
					{getDisplayExpression(currentExpression) || '0'}
				</ThemedText>
				{prevExpression && <ThemedText style={[styles.result, { color: mutedColor }]} type='defaultSemiBold' numberOfLines={1} ellipsizeMode='head' adjustsFontSizeToFit>
					{getDisplayExpression(prevExpression)}
				</ThemedText>}
			</View>
			<View style={[{ gap: paddingButtonContainer }]}>
				{Array.from({ length: Math.ceil(orderedButtons.length / buttonPerRow) }).map((_, rowIndex) => (
					<Row key={rowIndex} style={{ gap: paddingButtonContainer, justifyContent: 'space-between', paddingHorizontal: paddingButtonContainer }}>
						{orderedButtons.slice(rowIndex * buttonPerRow, (rowIndex + 1) * buttonPerRow).map((button, index) => (
							<TouchableHighlight
								key={index}
								onPress={() => {
									console.log(`Button pressed: ${button.label}`);
									if (Platform.OS === 'ios') {
										Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
									}
									handleButtonPress(button.value);
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
