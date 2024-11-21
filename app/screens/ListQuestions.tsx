// React and React Native imports
import { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
// Expo and Navigation imports
import { useLocalSearchParams, Link, useFocusEffect } from "expo-router";
// Icon imports
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
// Custom component and hook imports
import { ThemedText } from "../components/ThemedText";
import { useDatabase } from "../useDatabase";
import { ModalDelete } from "../components/ModalAlert";
// Constants
import { COLORS } from "../constants/theme";

export default function ListQuestions() {
  const { quizId } = useLocalSearchParams();
  const [questions, setQuestions] = useState([]);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [currentQuestionToDelete, setCurrentQuestionToDelete] = useState(0);
  const { isDbReady, getQuestions, deleteQuestion } = useDatabase();

  useFocusEffect(
    useCallback(() => {
      if (isDbReady) {
        loadQuestions();
      }
    }, [isDbReady, quizId])
  );

  const loadQuestions = async () => {
    try {
      const loadedQuestions = await getQuestions(Number(quizId));
      setQuestions(loadedQuestions as any);
    } catch (error) {
      console.error("Error loading questions:", error);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      await deleteQuestion(questionId);
      await loadQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
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
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 20,
            marginBottom: 20,
            width: "100%",
          }}
        >
          <ThemedText variant="h2" color={COLORS.white}>
            List of questions
          </ThemedText>
          <Link
            href={{
              pathname: "./CreateQuestion",
              params: { quizId: quizId },
            }}
            asChild
          >
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.create,
                borderRadius: 6,
                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AntDesign name="plussquareo" size={40} color={COLORS.black} />
            </TouchableOpacity>
          </Link>
        </View>

        {/* list of questions */}
        <FlatList
          data={questions}
          renderItem={({ item }) => (
            <View
              style={{
                borderRadius: 20,
                backgroundColor: COLORS.white,
                width: 350,
                flexDirection: "column",
                paddingHorizontal: 20,
                paddingVertical: 10,
                marginBottom: 15,
              }}
            >
              {/* question text */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <ThemedText
                  variant="h4"
                  style={{ flex: 1, flexWrap: "wrap", paddingRight: 5 }}
                >
                  {item["question_text"]}
                </ThemedText>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  {/* edit button  */}
                  <Link
                    href={{
                      pathname: `./UpdateQuestion`,
                      params: {
                        questionId: item["id"],
                        questionText: item["question_text"],
                        correctAnswer: item["correct_answer"],
                        options: item["options"],
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
                      <FontAwesome6
                        name="edit"
                        size={24}
                        color={COLORS.black}
                      />
                    </TouchableOpacity>
                  </Link>
                  {/* delete button  */}
                  <TouchableOpacity
                    onPress={() => {
                      setShowModalDelete(true);
                      setCurrentQuestionToDelete(Number(item["id"])); //id of the question, not the same id as quizId
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
              {/* divider line */}
              <View
                style={{
                  height: 1,
                  backgroundColor: COLORS.dark_grey,
                  width: "100%",
                  marginBottom: 15,
                }}
              />
              {item["question_type"] == "img" && (
                <Image
                  source={{
                    uri: `data:image/jpeg;base64,${item["img_string"]}`,
                  }}
                  style={{ width: 200, height: 200, alignSelf: "center" }}
                  resizeMode="contain"
                />
              )}
              <ThemedText variant="h4">Correct answer :</ThemedText>
              <ThemedText>{item["correct_answer"]}</ThemedText>
              <ThemedText variant="h4"> Options : </ThemedText>
              <View style={{ paddingLeft: 20 }}>
                {JSON.parse(item["options"]).map(
                  (option: string, index: number) =>
                    option != item["correct_answer"] && (
                      <ThemedText key={index}>• {option}</ThemedText>
                    )
                )}
              </View>
            </View>
          )}
          keyExtractor={(item) => item["id"]}
        />
        {/* total number of questions */}
        <View style={{ padding: 10 }}>
          <ThemedText variant="h4" color={COLORS.white}>
            {questions.length} question(s)
          </ThemedText>
        </View>
      </View>

      <ModalDelete
        modalDeleteVisible={showModalDelete}
        messageDelete="Delete this question ?"
        handleDelete={() => {
          handleDeleteQuestion(currentQuestionToDelete);
          setShowModalDelete(false);
        }}
        handleCancel={() => {
          setShowModalDelete(false);
        }}
      />
    </SafeAreaView>
  );
}
