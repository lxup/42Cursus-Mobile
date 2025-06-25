import React from 'react';
import { useNavigation } from 'expo-router';
import useBottomSheetStore from '@/stores/useBottomSheetStore';
import { useThemeColor } from '@/hooks/useThemeColor';

export const BottomSheetManager = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const navigation = useNavigation();
  const { sheets, closeSheet, removeSheet } = useBottomSheetStore();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      sheets.forEach(async (sheet) => {
        if (!sheet.persistent && sheet.ref?.current) {
          await closeSheet(sheet.id);
        }
      });
    });

    return unsubscribe;
  }, [sheets, closeSheet, navigation]);
  return (
    <>
      {sheets.map(({ id, content: Content, props, sizes, ref }) => (
        <Content
        key={id}
        ref={ref}
        id={id}
        sizes={sizes}
        cornerRadius={24}
        backgroundColor={backgroundColor}
        closeSheet={closeSheet}
        removeSheet={removeSheet}
        onDismiss={() => {
          removeSheet(id);
        }}
        contentContainerStyle={{
          paddingTop: 16,
        }}
        {...props}
        />
      ))}
    </>
  );
};