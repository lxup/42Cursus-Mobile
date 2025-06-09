import { StyleSheet, TouchableHighlight, useWindowDimensions, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Row } from '@/components/Row';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

type Button = {
	text: string;
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
	const isPortrait = height >= width;
	const buttonPerRow = isPortrait ? 4 : 5;
	const paddingButtonContainer = 4;
	const buttonWidth = isPortrait ? (width / buttonPerRow) - (paddingButtonContainer * 2) : (width / buttonPerRow) - (paddingButtonContainer * 2);
	const buttonHeight = isPortrait ? buttonWidth : (height / buttonPerRow) - (paddingButtonContainer * 2) - height * 0.1;

	const isOperator = (text: string) => {
		return ['+', '-', 'x', '/', '%'].includes(text);
	};

	const handleButtonPress = (text: string) => {
		console.log(`Button pressed: ${text}`);
		if (text === 'AC') {
			setCurrentExpression('');
			setPrevExpression('');
		} else if (text ==='C') {
			setCurrentExpression(currentExpression.slice(0, -1));
		} else if (!isNaN(parseFloat(text))) {
			if (text === '0' && currentExpression === '') {
				return;
			} else if (currentExpression === '0') {
				setCurrentExpression(text);
			} else {
				setCurrentExpression(prev => prev + text);
			}
		} else if (text === ',') {
			const lastNumber = currentExpression.split(/[\+\-x\/%]/).pop();
			console.log('Last number:', lastNumber);
			if (lastNumber && !lastNumber.includes(',')) {
				if (currentExpression.endsWith(')')) {
					setCurrentExpression(prev => prev + 'x0,');
				} else {
					setCurrentExpression(prev => prev + ',');
				}
			} else if (isOperator(currentExpression.slice(-1)) || currentExpression === '') {
				setCurrentExpression(prev => prev + '0,');
			}
		} else if (isOperator(text)) {
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
					} else {
						setCurrentExpression(prev => prev + text);
					}
					break;
			}
		} else if (text === '=') {
			try {
				const evaluatedResult = eval(currentExpression.replace(/,/g, '.').replace(/x/g, '*'));
				const evaluatedResultFormat = evaluatedResult.toString().replace(/\./g, ',');
				setPrevExpression(currentExpression);
				setCurrentExpression(evaluatedResultFormat);
			} catch (error) {
				console.error('Error evaluating expression:', error);
				setCurrentExpression('Error');
			}
		} else if (text === '±') {
			if (currentExpression) {
				const lastNumberMatch = currentExpression.match(/(\(?-?\d+(?:,\d+)?\)?)$/);
				const lastNumber = lastNumberMatch?.[0];
				if (lastNumber) {
					const startIndex = currentExpression.length - lastNumber.length;
					let toggled;

					if (lastNumber.startsWith('(') && lastNumber.endsWith(')')) {
						toggled = lastNumber.replace(/^\(|\)$/g, '').replace('-', '').replace(',', '.');
					} else {
						toggled = `(${lastNumber.replace(',', '.')} * -1)`;
					}

					console.log('Toggled:', toggled);
					try {
						const evaluatedResult = eval(toggled);
						const evaluatedResultFormat = evaluatedResult < 0 ? `(${evaluatedResult.toString().replace(/\./g, ',')})` : evaluatedResult.toString().replace(/\./g, ',');
						console.log('Evaluated Result:', evaluatedResultFormat);
						setCurrentExpression(currentExpression.slice(0, startIndex) + evaluatedResultFormat);
					} catch (error) {
						console.error('Error evaluating expression:', error);
						setCurrentExpression('Error');
						return;
					}
				}
			}
		}
	};

	const buttons: Button[] = useMemo(() => [
		{
			text: 'AC',
			theme: 'muted'
		},
		{
			text: '±',
			theme: 'muted'
		},
		{
			text: '%',
			theme: 'muted'
		},
		{
			text: '/',
			theme: 'accent'
		},
		{
			text: '7',
			theme: 'default'
		},
		{
			text: '8',
			theme: 'default'
		},
		{
			text: '9',
			theme: 'default'
		},
		{
			text: 'x',
			theme: 'accent'
		},
		{
			text: '4',
			theme: 'default'
		},
		{
			text: '5',
			theme: 'default'
		},
		{
			text: '6',
			theme: 'default'
		},
		{
			text: '-',
			theme: 'accent'
		},
		{
			text: '1',
			theme: 'default'
		},
		{
			text: '2',
			theme: 'default'
		},
		{
			text: '3',
			theme: 'default'
		},
		{
			text: '+',
			theme: 'accent'
		},
		{
			text: 'C',
			theme: 'default'
		},
		{
			text: '0',
			theme: 'default'
		},
		{
			text: ',',
			theme: 'default'
		},
		{
			text: '=',
			theme: 'accent'
		}
	], []);

	const verticalOrder = useMemo(() => [
		'AC', '±', '%', '/',
		'7', '8', '9', 'x',
		'4', '5', '6', '-',
		'1', '2', '3', '+',
		'C', '0', ',', '='
	], []);
	const horizontalOrder = useMemo(() => [
		'7', '8', '9', 'AC', '/',
		'4', '5', '6', '±', 'x',
		'1', '2', '3', '%', '-',
		'C', '0', ',', '=', '+'
	], []);

	const orderedButtons = useMemo(() => {
		const order = isPortrait ? verticalOrder : horizontalOrder;
		return order.map(text => buttons.find(button => button.text === text)).filter(Boolean) as Button[];
	}, [isPortrait, verticalOrder, horizontalOrder]);

	return (
		<SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
			<View style={[styles.expressionContainer]}>
				{/* EXPRESSION */}
				<ThemedText style={styles.expression} type='title'>
					{currentExpression || '0'}
				</ThemedText>
				{/* RESULTS PREVIEW */}
				<ThemedText style={[styles.result, { color: mutedColor }]} type='defaultSemiBold'>
					{prevExpression.toLocaleString()}
				</ThemedText>
			</View>
			<View style={[{ gap: paddingButtonContainer }]}>
				{Array.from({ length: Math.ceil(orderedButtons.length / buttonPerRow) }).map((_, rowIndex) => (
					<Row key={rowIndex} style={{ gap: paddingButtonContainer, justifyContent: 'space-between', paddingHorizontal: paddingButtonContainer }}>
						{orderedButtons.slice(rowIndex * buttonPerRow, (rowIndex + 1) * buttonPerRow).map((button, index) => (
							<TouchableHighlight
								key={index}
								onPress={() => {
									handleButtonPress(button.text);
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
								<ThemedText style={{ color: 'white', fontSize: buttonWidth * 0.3, lineHeight: buttonWidth * 0.3 }}>
									{button.text}
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
		flexDirection: 'column',
		alignItems: 'flex-end',
		padding: 16,
	},
	expression: {
		textAlign: 'right',
	},
	result: {
		textAlign: 'right',
		fontSize: 24,
    	lineHeight: 32,
	},
	button: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 999,
		flexShrink: 1,
	},
});
