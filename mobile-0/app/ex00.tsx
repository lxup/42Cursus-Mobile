import { Button, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function Ex00() {
	return (
	<ThemedView style={styles.stepContainer}>
		<ThemedText style={styles.text}>A simple text</ThemedText>
		<Button title='Click me' onPress={() => console.log('Button pressed')} />
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
