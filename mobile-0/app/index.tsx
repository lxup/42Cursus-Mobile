import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="title">Exercice</ThemedText>
        <Link href="/ex00">
          <ThemedText type="link">Exercice 00</ThemedText>
        </Link>
        <Link href="/ex01">
          <ThemedText type="link">Exercice 01</ThemedText>
        </Link>
        <Link href="/ex02">
          <ThemedText type="link">Exercice 02</ThemedText>
        </Link>
        <Link href="/ex03">
          <ThemedText type="link">Exercice 03</ThemedText>
        </Link>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    gap: 8,
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
});
