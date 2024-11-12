import { Stack } from "expo-router";
import { BackPressable } from "./components/BackPressable";
import { HomePressable } from "./components/HomePressable";
import { COLORS } from "./constants/theme";

const ANIMATION = "fade_from_bottom";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.background },
        headerShadowVisible: false,
        headerRight: () => (
          <HomePressable />
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          animation:ANIMATION
        }}
      />
      <Stack.Screen
        name="screens/CreateQuiz"
        options={{
          title: "",
          headerLeft: () => (
            <BackPressable />
          ),
          animation:ANIMATION
        }}
      />
      <Stack.Screen
        name="screens/UpdateQuiz"
        options={{
          title: "",
          headerLeft: () => (
            <BackPressable pathname="./ListQuiz" />
          ),
          animation:ANIMATION
        }}
      />
      <Stack.Screen
        name="screens/UpdateQuestion"
        options={{
          title: "",
          headerLeft: () => (
            <BackPressable useBack={true} />
          ),
          animation:ANIMATION
        }}
      />
      <Stack.Screen
        name="screens/Quiz"
        options={{
          title: "",
          headerLeft: () => (
            <BackPressable pathname="./ListQuiz" />
          ),
          animation:ANIMATION
        }}
      />
      <Stack.Screen
        name="screens/ListQuiz"
        options={{
          title: "",
          headerLeft: () => (
            <BackPressable />
          ),
          animation:ANIMATION
        }}
      />
      <Stack.Screen
        name="screens/CreateQuestion"
        options={{
          title: "",
          headerLeft: () => (
            <BackPressable pathname="./ListQuestions" />
          ),
          animation:ANIMATION
        }}
      />
      <Stack.Screen
        name="screens/ListQuestions"
        options={{
          title: "",
          headerLeft: () => (
            <BackPressable pathname="./ListQuiz" />
          ),
          animation:ANIMATION
        }}
      />
    </Stack>
  );
}
