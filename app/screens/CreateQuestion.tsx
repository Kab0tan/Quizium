import { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import { Link, useLocalSearchParams, useFocusEffect } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemedText } from "../components/ThemedText";
import { useDatabase } from "../useDatabase";
import { COLORS } from "../constants/theme";

export default function CreateQuestion() {

  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [options, setOptions] = useState(["", "", ""]);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorAdding, setErrorAdding] = useState(false);
  const { quizId } = useLocalSearchParams();

  const { addQuestion } = useDatabase();


  useFocusEffect(
    useCallback(() => {
      // Reset all form states
      setQuestion("");
      setCorrectAnswer("");
      setOptions(["", "", ""]);
      setModalVisible(false);
      setErrorAdding(false);
    }, [quizId])
  );

  const handleAddingQuestion = async () => {
    try {
      await addQuestion(Number(quizId), question, correctAnswer, [...options, correctAnswer]);
      setModalVisible(true);
    } catch (error) {
      console.error("Error adding question:", error);
      setErrorAdding(true);
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
          <View
            style={{ width: "70%", alignItems: "center", marginBottom: 30 }}
          >
            {/* title */}
            <View
              style={{
                backgroundColor: COLORS.create,
                height: 80,
                width: "70%",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
              }}
            >
              <ThemedText variant="h3">Create Question</ThemedText>
            </View>
            {/* input Question field */}
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
              value={question}
              multiline
              placeholder="Enter quiz Question..."
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
                setQuestion(text);
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
              value={correctAnswer}
              multiline
              placeholder="Correct answer..."
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
                setCorrectAnswer(text);
              }}
            />
            {/* input options field */}
            {options.map((option, index) => (
              <View key={index} style={{ width: "100%" }}>
                <ThemedText
                  variant="body"
                  color="white"
                  style={{
                    marginVertical: 5,
                    alignSelf: "flex-start",
                  }}
                >
                  Option {index + 1}
                </ThemedText>
                <TextInput
                  value={option}
                  multiline
                  placeholder={`Option ${index + 1}...`}
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
                    const newOptions = [...options];
                    newOptions[index] = text;
                    setOptions(newOptions);
                  }}
                />
              </View>
            ))}
          </View>

          {/* validation button  */}
          <TouchableOpacity
            onPress={() => {
              handleAddingQuestion();
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
            <ThemedText variant="h3">Add question</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
              width: 200,
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
            <ThemedText>Question added successfully !</ThemedText>
            <Link
              href={{
                pathname: `./ListQuestions`,
                params: { quizId: quizId },
              }}
              asChild
            >
              <TouchableOpacity
                style={{ marginTop: 20 }}
                onPress={() => {
                  setModalVisible(false);
                  setErrorAdding(false);
                }}
              >
                <AntDesign
                  name={errorAdding ? "closecircle" : "checkcircle"}
                  size={50}
                  color={errorAdding ? COLORS.error : COLORS.success}
                />
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
