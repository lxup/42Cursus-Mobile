import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocation } from '@/context/LocationProvider';

export default function WeeklyScreen() {
  const { activeLocation } = useLocation();
  return (
    <SafeAreaView style={styles.container}>
      <ThemedText>Weekly</ThemedText>
      {activeLocation && (
        <ThemedText>{activeLocation.name}</ThemedText>
      )}
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
