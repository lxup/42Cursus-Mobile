import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthProvider";
import tw from "@/lib/tw";

const AgendaScreen = () => {
  const { user } = useAuth();
  return (
  <ThemedView style={tw`flex-1 gap-2`}>
    <ThemedText>Agenda Screen</ThemedText>
  </ThemedView>
  );
};

export default AgendaScreen;