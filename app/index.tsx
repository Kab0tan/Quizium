import { Text, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useFonts } from "expo-font";
import {
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_500Medium_Italic,
} from "@expo-google-fonts/montserrat";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemedText } from "./components/ThemedText";
import { COLORS } from "./constants/theme";

export default function Index() {
  const [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_500Medium_Italic,
  });

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
        padding: 20,
        flexDirection: "column",
      }}
    >
      <View style={{ flexDirection: "row", gap: 15 }}>
        {/* Create quiz */}
        <Link href="/screens/CreateQuiz" asChild>
        {/* <Link href="/screens/CreateQuiz" asChild> */}
          <TouchableOpacity
            style={{
              flex: 1,
              borderRadius: 20,
              backgroundColor: COLORS.create,
              height: 200,
              flexDirection: "column-reverse",
              padding: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <ThemedText variant="h3" color={COLORS.black}>
                Create Quiz
              </ThemedText>
            </View>
            <View style={{ flex: 4, alignItems: "flex-end" }}>
              <AntDesign name="plussquareo" size={40} color="black" />
            </View>
          </TouchableOpacity>
        </Link>

        {/* List quiz */}
        <Link href="/screens/ListQuiz" asChild>
          <TouchableOpacity
            style={{
              flex: 1,
              borderRadius: 20,
              backgroundColor: COLORS.explore,
              height: 200,
              flexDirection: "column-reverse",
              padding: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <ThemedText variant="h3" color={COLORS.black}>
                Explore
              </ThemedText>
            </View>
            <View style={{ flex: 4, alignItems: "flex-end" }}>
              <Entypo name="magnifying-glass" size={40} color="black" />
            </View>
          </TouchableOpacity>
        </Link>

      </View>
    </View>
  );
}
