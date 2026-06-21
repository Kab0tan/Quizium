import { Pressable, View, type TextProps } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../constants/theme";

type Prop = TextProps & {
  pathname?: string;
  useBack?: boolean;
};

export function BackPressable({ pathname, useBack = false }: Prop) {
  const handlePress = () => {
    if (useBack) {
      router.back();
    } else {
      router.push({
        pathname: pathname ?? "/",
      });
    }
  };

  return (
    <View>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
          padding: 8,
        })}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.white} />
      </Pressable>
    </View>
  );
}
