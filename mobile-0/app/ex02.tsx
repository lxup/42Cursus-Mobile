import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Row } from '@/components/Row';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

type Button = {
	text: string;
	onPress?: () => void;
	theme: 'default' | 'accent' | 'muted';
}

export default function Ex02() {
	const { width, height } = useWindowDimensions();
	const backgroundColor = useThemeColor({}, 'background');
	const [currentExpression, setCurrentExpression] = useState('1 + 2 * 3');
	const [currentValue, setCurrentValue] = useState(7);
	const isPortrait = height >= width;
	const buttonPerRow = isPortrait ? 4 : 5;
	const paddingButtonContainer = 4;
	const buttonWidth = isPortrait ? (width / buttonPerRow) - (paddingButtonContainer * 2) : (width / buttonPerRow) - (paddingButtonContainer * 2);
	const buttonHeight = isPortrait ? buttonWidth : (height / buttonPerRow) - (paddingButtonContainer * 2) - height * 0.1;
	
	const buttons: Button[] = [
		{
			text: 'AC',
			onPress: () => {},
			theme: 'muted'
		},
		{
			text: 'C',
			onPress: () => {},
			theme: 'muted'
		},
		{
			text: '%',
			onPress: () => {},
			theme: 'muted'
		},
		{
			text: '/',
			onPress: () => {},
			theme: 'accent'
		},
		{
			text: '7',
			onPress: () => {},
			theme: 'default'
		},
		{
			text: '8',
			onPress: () => {},
			theme: 'default'
		},
		{
			text: '9',
			onPress: () => {},
			theme: 'default'
		},
		{
			text: 'x',
			onPress: () => {},
			theme: 'accent'
		},
		{
			text: '4',
			onPress: () => {},
			theme: 'default'
		},
		{
			text: '5',
			onPress: () => {},
			theme: 'default'
		},
		{
			text: '6',
			onPress: () => {},
			theme: 'default'
		},
		{
			text: '-',
			onPress: () => {},
			theme: 'accent'
		},
		{
			text: '1',
			onPress: () => {},
			theme: 'default'
		},
		{
			text: '2',
			onPress: () => {},
			theme: 'default'
		},
		{
			text: '3',
			onPress: () => {},
			theme: 'default'
		},
		{
			text: '+',
			onPress: () => {},
			theme: 'accent'
		},
		{
			text: '±',
			onPress: () => {},
			theme: 'muted'
		},
		{
			text: '0',
			onPress: () => {},
			theme: 'default'
		},
		{
			text: '.',
			onPress: () => {},
			theme: 'default'
		},
		{
			text: '=',
			onPress: () => {},
			theme: 'accent'
		}
	]
	return (
		<ThemedView style={styles.container}>
			<View style={[{ backgroundColor }, styles.expressionContainer]}>
				{/* EXPRESSION */}
				<ThemedText style={styles.expression} type='title'>
					{currentExpression}
				</ThemedText>
				{/* RESULTS PREVIEW */}
				<ThemedText style={styles.result} type='defaultSemiBold'>
					{currentValue.toLocaleString()}
				</ThemedText>
			</View>
			<SafeAreaView style={[{ gap: paddingButtonContainer }]} edges={['left', 'right']}>
				{/* {buttons.map((row, rowIndex) => (
					<Row key={rowIndex} style={{ gap: paddingButtonContainer, justifyContent: 'space-between', paddingHorizontal: paddingButtonContainer }}>
						{row.map((button, index) => (
							<TouchableHighlight
							key={index}
							underlayColor={'red'}
							onPress={() => {
								console.log(`Button pressed: ${button.text}`);
								button.onPress?.()
							}}
							style={[styles.button]}
							>
								<ThemedText>
									{button.text}
								</ThemedText>
							</TouchableHighlight>
						))}
					</Row>
				))} */}
				{Array.from({ length: Math.ceil(buttons.length / buttonPerRow) }).map((_, rowIndex) => (
					<Row key={rowIndex} style={{ gap: paddingButtonContainer, justifyContent: 'space-between', paddingHorizontal: paddingButtonContainer }}>
						{buttons.slice(rowIndex * buttonPerRow, (rowIndex + 1) * buttonPerRow).map((button, index) => (
							<TouchableOpacity
								key={index}
								onPress={() => {
									console.log(`Button pressed: ${button.text}`);
									button.onPress?.();
								}}
								style={[styles.button, { width: buttonWidth, height: buttonHeight } ]}
							>
								<ThemedText style={{ color: 'white' }}>
									{button.text}
								</ThemedText>
							</TouchableOpacity>
						))}
					</Row>
				))}
			</SafeAreaView>
		</ThemedView>
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

	},
	result: {
		fontSize: 24,
    	lineHeight: 32,
	},
	button: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'blue',
		borderRadius: 999,
		flexShrink: 0,
	},
});
