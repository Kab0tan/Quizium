import { Pressable, View, type TextProps } from "react-native";
import { router } from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';
import { COLORS } from "../constants/theme";

export function HomePressable() {
  const handlePress = () => {
    router.push({
      pathname: "/",
    });
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
        <Entypo name="home" size={24} color={COLORS.white} />
      </Pressable>
    </View>
  );
}
