import React from "react";
import { View, ViewProps } from "react-native";

export type RowProps = ViewProps & {
};

export const Row: React.FC<RowProps> = ({ children, style, ...props }) => {
  return (
    <View
      style={[{ flexDirection: "row" }, style]}
      {...props}
    >
      {children}
    </View>
  );
};