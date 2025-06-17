import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocation } from '@/context/LocationProvider';

export default function CurrentlyScreen() {
  const { activeLocation } = useLocation();
  return (
    <SafeAreaView style={styles.container}>
      <ThemedText>Currently</ThemedText>
      {activeLocation && (
        activeLocation.source === 'geolocation' ? (
          <ThemedText>{activeLocation.data?.latitude}, {activeLocation.data?.longitude}</ThemedText>
        ) : (
          <ThemedText>{activeLocation.name}</ThemedText>
        )
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
