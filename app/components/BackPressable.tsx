import { Pressable, View, type TextProps } from "react-native";
import { Href, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../constants/theme";

type Prop = TextProps & {
  pathname?: Href<string | object>;
};

export function BackPressable({ pathname }: Prop) {
  return (
    <View>
      <Pressable
        onPress={() => router.push(pathname ?? "/")}
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
