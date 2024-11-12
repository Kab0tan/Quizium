import { useState } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ThemedText } from "../components/ThemedText";
import { ThemedTextInput } from "../components/ThemedTextInput";
import { ModalAlert } from "../components/ModalAlert";
import { useDatabase } from "../useDatabase";
import { COLORS } from "../constants/theme";

export default function UpdateQuestion() {
  const { questionId, questionText, correctAnswer, options } =
    useLocalSearchParams();
  const [newQuestionText, setNewQuestiontext] = useState(
    questionText as string
  );
  const [newCorrectAnswer, setNewCorrectAnswer] = useState(
    correctAnswer as string
  );
  const [newOptions, setNewOptions] = useState(JSON.parse(options as string));
  const [modalVisible, setModalVisible] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(false);

  const { updateQuestion } = useDatabase();

  const handleUpdateQuestion = async () => {
    try {
      await updateQuestion(
        Number(questionId),
        newQuestionText,
        newCorrectAnswer,
        newOptions
      );
      setModalVisible(true);
      // Hide the modal after 1 second
      const timer = setTimeout(() => {
        setModalVisible(false);
        setErrorUpdate(false);
        router.back();
      }, 1000);
      // Clean up the timer when the component unmounts or the state changes
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error updating question:", error);
      setErrorUpdate(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 20,
            opacity: modalVisible ? 0.2 : 1,
          }}
        >
          <View style={{ width: "70%", alignItems: "center" }}>
            {/* title */}
            <View
              style={{
                backgroundColor: COLORS.create,
                height: 80,
                width: "70%",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                marginVertical: 15,
              }}
            >
              <ThemedText variant="h3">Update Question</ThemedText>
            </View>
            {/* input QuestionText field */}
            <View style={{ width: "100%" }}>
              <ThemedText
                variant="body"
                color="white"
                style={{
                  marginTop: 30,
                  marginBottom: 5,
                  alignSelf: "flex-start",
                }}
              >
                Question
              </ThemedText>
            </View>
            <ThemedTextInput
              value={newQuestionText}
              placeholder="Enter new question text..."
              handleChange={setNewQuestiontext}
            />
            {/* input correctAnswer field */}
            <View style={{ width: "100%" }}>
              <ThemedText
                variant="body"
                color="white"
                style={{
                  marginTop: 30,
                  marginBottom: 5,
                  alignSelf: "flex-start",
                }}
              >
                Correct answer
              </ThemedText>
            </View>
            <ThemedTextInput
              value={newCorrectAnswer}
              placeholder="New correct answer..."
              handleChange={setNewCorrectAnswer}
            />
            {/* input Options field */}
            {newOptions.map(
              (option: string, index: number) =>
                option != correctAnswer && (
                  <View key={index} style={{ width: "100%" }}>
                    <ThemedText
                      variant="body"
                      color="white"
                      style={{
                        marginBottom: 5,
                        alignSelf: "flex-start",
                      }}
                    >
                      Option {index + 1}
                    </ThemedText>
                    <ThemedTextInput
                      value={option}
                      placeholder={`New option ${index + 1}...`}
                      handleChange={(text) => {
                        const updatedOptions = [...newOptions];
                        updatedOptions[index] = text;
                        setNewOptions(updatedOptions);
                      }}
                    />
                  </View>
                )
            )}
          </View>
          {/* validation button  */}
          <TouchableOpacity
            onPress={() => {
              handleUpdateQuestion();
            }}
            style={{
              backgroundColor: COLORS.explore,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 25,
              marginVertical: 15,
              paddingHorizontal: 20,
            }}
          >
            <ThemedText variant="h3">Update Question</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* modal */}
      <ModalAlert
        message="Question updated successfully !"
        modalVisible={modalVisible}
        errorCreate={errorUpdate}
      />
    </SafeAreaView>
  );
}
