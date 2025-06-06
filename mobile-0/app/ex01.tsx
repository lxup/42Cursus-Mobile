import { Button, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCallback, useMemo, useState } from 'react';

export default function Ex01() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const text = useMemo(() => ['A simple text', 'Hello World!'], []);
	const onPress = useCallback(() => {
		setCurrentIndex((prev) => (prev + 1) % text.length);
		console.log('Button pressed');
	}, [text.length]);
	return (
		<ThemedView style={styles.stepContainer}>
			<ThemedText style={styles.text}>{text[currentIndex]}</ThemedText>
			<Button title='Click me' onPress={onPress} />
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	stepContainer: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		backgroundColor: 'green',
		padding: 8,
		borderRadius: 8,
	}
});
