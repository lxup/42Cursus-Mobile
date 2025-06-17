import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocation } from '@/context/LocationProvider';
import tw from '@/lib/tw';

export default function WeeklyScreen() {
  const { activeLocation } = useLocation();
  return (
    <SafeAreaView style={styles.container}>
      <ThemedText>Weekly</ThemedText>
      {activeLocation && (
        <>
          <ThemedText style={tw`font-bold`}>{activeLocation.name}</ThemedText>
          <ThemedText>
          {activeLocation.data?.latitude}, {activeLocation.data?.longitude}
          </ThemedText>
        </>
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
