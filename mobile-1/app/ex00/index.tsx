import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CurrentlyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedText>Currently</ThemedText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
