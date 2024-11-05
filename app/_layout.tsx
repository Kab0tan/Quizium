import {  Pressable } from "react-native";
import { Stack, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BackPressable } from "./components/BackPressable";
import { COLORS } from "./constants/theme";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.background },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screens/CreateQuiz"
        options={{
          title: "",
          headerLeft: () => (
            <BackPressable />
          ),
        }}
      />
      <Stack.Screen
        name="screens/UpdateQuiz"
        options={{
          title: "",
          headerLeft: () => (
            <BackPressable pathname="./ListQuiz" />
          ),
        }}
      />
      <Stack.Screen
        name="screens/UpdateQuestion"
        options={{
          title: "",
          headerLeft: () => (
            <BackPressable pathname="./ListQuestions" />
          ),
        }}
      />
      <Stack.Screen
        name="screens/Quiz"
        options={{
          title: "",
          headerLeft: () => (
            <BackPressable pathname="./ListQuiz" />
          ),
        }}
      />
      <Stack.Screen
        name="screens/ListQuiz"
        options={{
          title: "",
          headerLeft: () => (
            <BackPressable />
          ),
        }}
      />
      <Stack.Screen
        name="screens/CreateQuestion"
        options={{
          title: "",
          headerLeft: () => (
            <BackPressable pathname="./ListQuestions" />
          ),
        }}
      />
      <Stack.Screen
        name="screens/ListQuestions"
        options={{
          title: "",
          headerLeft: () => (
            <BackPressable pathname="./ListQuiz" />
          ),
        }}
      />
    </Stack>
  );
}
