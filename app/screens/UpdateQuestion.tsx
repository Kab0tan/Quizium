import { useState } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemedText } from "../components/ThemedText";
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

  console.log(newOptions);
  console.log(newOptions[0]);
  const handleUpdateQuestion = async () => {
    try {
      await updateQuestion(
        Number(questionId),
        newQuestionText,
        newCorrectAnswer,
        newOptions
      );
      console.log("Question updated successfully");
      setModalVisible(true);
    } catch (error) {
      console.error("Error updating question:", error);
      setErrorUpdate(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
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
          <TextInput
            value={newQuestionText}
            placeholder="Enter new question text..."
            style={{
              width: "100%",
              borderRadius: 10,
              padding: 15,
              fontSize: 20,
              backgroundColor: COLORS.white,
            }}
            // Add these props for better UX
            autoCapitalize="words"
            autoCorrect={false}
            placeholderTextColor={COLORS.black}
            onChangeText={(text) => {
              setNewQuestiontext(text);
            }}
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
          <TextInput
            value={newCorrectAnswer}
            multiline
            placeholder="New correct answer..."
            placeholderTextColor={COLORS.dark_grey}
            style={{
              width: "100%",
              borderRadius: 10,
              padding: 15,
              fontSize: 20,
              backgroundColor: COLORS.white,
            }}
            autoCapitalize="words"
            autoCorrect={false}
            onChangeText={(text) => {
              setNewCorrectAnswer(text);
            }}
          />
          {/* input Options field */}
          {newOptions.map((option: string, index: number) => (
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
              <TextInput
                value={option}
                multiline
                placeholder={`New option ${index + 1}...`}
                placeholderTextColor={COLORS.dark_grey}
                style={{
                  width: "100%",
                  borderRadius: 10,
                  padding: 15,
                  fontSize: 20,
                  backgroundColor: COLORS.white,
                }}
                autoCapitalize="words"
                autoCorrect={false}
                onChangeText={(text) => {
                  const updatedOptions = [...newOptions];
                  updatedOptions[index] = text;
                  setNewOptions(updatedOptions);
                }}
              />
            </View>
          ))}
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

      {/* modal */}
      <Modal animationType="slide" visible={modalVisible} transparent={true}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 20,
              height: 200,
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
            <ThemedText>Question updated successfully !</ThemedText>
            {!errorUpdate ? (
              <TouchableOpacity
                style={{ marginTop: 20 }}
                onPress={() => {
                  setModalVisible(false);
                  setErrorUpdate(false);
                  router.back();
                }}
              >
                <AntDesign
                  name={errorUpdate ? "closecircle" : "checkcircle"}
                  size={50}
                  color={errorUpdate ? COLORS.error : COLORS.success}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ marginTop: 20 }}
                onPress={() => {
                  setModalVisible(false);
                  setErrorUpdate(false);
                  router.back();
                }}
              >
                <AntDesign
                  Questiontext="closecircle"
                  size={50}
                  color={COLORS.error}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
