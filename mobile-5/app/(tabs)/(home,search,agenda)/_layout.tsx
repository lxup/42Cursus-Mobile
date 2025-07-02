import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
  search: { initialRouteName: 'search' },
  agenda: { initialRouteName: 'agenda' },
};

const AppLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}/>
  );
};

export default AppLayout;