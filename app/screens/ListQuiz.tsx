import { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import { Link, useFocusEffect } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { ThemedText } from "../components/ThemedText";
import { useDatabase } from "../useDatabase";
import { COLORS } from "../constants/theme";

export default function ListQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [currentItemToDelete, setCurrentItemToDelete] = useState(0);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { isDbReady, getQuizzes, deleteQuiz } = useDatabase();

  const filteredQuizes = searchText
    ? quizzes.filter((quiz) =>
        (quiz["title"] as string)
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
    : quizzes;

  useFocusEffect(
    useCallback(() => {
      if (isDbReady) {
        loadQuizzes();
      }
    }, [isDbReady])
  );

  const loadQuizzes = async () => {
    try {
      const loadedQuizzes = await getQuizzes();
      console.log("Loaded quizzes:", loadedQuizzes);
      setQuizzes(loadedQuizzes);
    } catch (error) {
      console.error("Error loading quizzes:", error);
    }
  };

  const handleDeleteQuiz = async (quizId: number) => {
    try {
      console.log("Deleting quiz with ID:", quizId);
      await deleteQuiz(quizId);
      await loadQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          opacity: showModalDelete ? 0.2 : 1,
        }}
      >
        {/* title */}
        <View
          style={{
            backgroundColor: COLORS.explore,
            height: 80,
            width: 200,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            paddingVertical: 15,
            marginTop: 20,
            marginBottom: 40,
          }}
        >
          <ThemedText variant="h2">Liste Quiz</ThemedText>
        </View>

        {/* search bar */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: 350,
            height: 50,
            borderRadius: 20,
            paddingHorizontal: 20,
            marginBottom: 20,
            backgroundColor: COLORS.white,
          }}
        >
          <Entypo name="magnifying-glass" size={30} color="black" />
          <TextInput
            value={searchText}
            multiline
            placeholder={"SearchBar..."}
            placeholderTextColor={COLORS.dark_grey}
            style={{
              width: "100%",
              fontSize: 20,
              paddingLeft: 5,
            }}
            autoCapitalize="words"
            autoCorrect={false}
            onChangeText={(text) => {
              setSearchText(text);
            }}
          />
        </View>

        {/* list of quiz */}
        <FlatList
          data={filteredQuizes}
          renderItem={({ item }) => (
            <Link
              href={{ pathname: `./Quiz`, params: { quizId: item["id"] } }}
              asChild
            >
              <TouchableOpacity
                style={{
                  borderRadius: 20,
                  backgroundColor: COLORS.white,
                  width: 350,
                  flexDirection: "column",
                  paddingHorizontal: 20,
                  paddingBottom: 10,
                  marginBottom: 15,
                }}
              >
                {/* title and buttons */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginVertical: 10,
                  }}
                >
                  <ThemedText
                    variant="h3"
                    style={{ flex: 1, flexWrap: "wrap", paddingRight: 5 }}
                  >
                    {item["title"]}
                  </ThemedText>
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    {/* edit button  */}
                    <Link
                      href={{
                        pathname: `./UpdateQuiz`,
                        params: {
                          quizId: item["id"],
                          name: item["title"],
                          description: item["description"],
                        },
                      }}
                      asChild
                    >
                      <TouchableOpacity
                        style={{
                          backgroundColor: COLORS.create,
                          padding: 5,
                          borderRadius: 6,
                        }}
                      >
                        <FontAwesome6 name="edit" size={24} color="black" />
                      </TouchableOpacity>
                    </Link>
                    {/* acces to questions */}
                    <Link
                      href={{
                        pathname: `./ListQuestions`,
                        params: { quizId: item["id"] },
                      }}
                      asChild
                    >
                      <TouchableOpacity
                        onPress={() => console.log("List button pressed")}
                        style={{
                          backgroundColor: COLORS.explore,
                          padding: 5,
                          borderRadius: 6,
                        }}
                      >
                        <FontAwesome5 name="list-ul" size={24} color="black" />
                      </TouchableOpacity>
                    </Link>
                    {/* delete button  */}
                    <TouchableOpacity
                      onPress={() => {
                        setShowModalDelete(true);
                        setCurrentItemToDelete(item["id"]);
                      }}
                      style={{
                        backgroundColor: COLORS.delete,
                        padding: 5,
                        borderRadius: 6,
                      }}
                    >
                      <AntDesign name="delete" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
                {/* divider */}
                <View
                  style={{
                    height: 1,
                    backgroundColor: COLORS.dark_grey,
                    width: "100%",
                    marginBottom: 15,
                  }}
                />
                <ThemedText> {item["description"]}</ThemedText>
              </TouchableOpacity>
            </Link>
          )}
          keyExtractor={(item) => item["id"]}
        />
      </View>
      {/* delete modal */}
      <Modal animationType="slide" visible={showModalDelete} transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
              borderRadius: 20,
              width: 300,
              backgroundColor: COLORS.white,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <ThemedText variant="h3">Delete this quiz ?</ThemedText>
            <ThemedText
              variant="italic"
              color={COLORS.dark_grey}
              style={{ marginVertical: 10 }}
            >
              (This action is irreversible)
            </ThemedText>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: 20,
                gap: 10,
              }}
            >
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  setShowModalDelete(false);
                }}
              >
                <ThemedText color={COLORS.dark_grey}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  handleDeleteQuiz(currentItemToDelete);
                  setShowModalDelete(false);
                }}
              >
                <ThemedText color={COLORS.delete}>Delete</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
