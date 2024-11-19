import { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { Link, useFocusEffect, router } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { ThemedText } from "../components/ThemedText";
import { ThemedTextInput } from "../components/ThemedTextInput";
import { ModalDelete } from "../components/ModalAlert";
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
      setQuizzes(loadedQuizzes as any);
    } catch (error) {
      console.error("Error loading quizzes:", error);
    }
  };

  const handleDeleteQuiz = async (quizId: number) => {
    try {
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
          <Entypo name="magnifying-glass" size={30} color={COLORS.black} />
          <ThemedTextInput
            value={searchText}
            placeholder={"SearchBar..."}
            handleChange={setSearchText}
            variant="searchBar"
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
                        <FontAwesome6 name="edit" size={24} color={COLORS.black} />
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
                        style={{
                          backgroundColor: COLORS.explore,
                          padding: 5,
                          borderRadius: 6,
                        }}
                      >
                        <FontAwesome5 name="list-ul" size={24} color={COLORS.black} />
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
                      <AntDesign name="delete" size={24} color={COLORS.black} />
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
      <ModalDelete
        modalDeleteVisible={showModalDelete}
        messageDelete="Delete this quiz ?"
        handleDelete={() => {
          handleDeleteQuiz(currentItemToDelete);
          setShowModalDelete(false);
        }}
        handleCancel={() => {
          setShowModalDelete(false);
        }}
      />
    </SafeAreaView>
  );
}
