import { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useLocalSearchParams, useFocusEffect, router } from "expo-router";
import { ThemedText } from "../components/ThemedText";
import { ThemedTextInput } from "../components/ThemedTextInput";
import { ImgReaderButton } from "../components/FileReader";
import { ModalAlert } from "../components/ModalAlert";
import { useDatabase } from "../useDatabase";
import { COLORS } from "../constants/theme";

export default function CreateQuestion() {
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [options, setOptions] = useState(["", "", ""]);
  //Validation variables
  const [questionValid, setQuestionValid] = useState(true);
  const [correctAnswerValid, setCorrectAnswerValid] = useState(true);
  const [optionsValid, setOptionsValid] = useState(true);
  //handling image
  const [img, setImg] = useState("");
  //other
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
    const questionEmpty = !question;
    const correctAnswerEmpty = !correctAnswer;
    const optionsEmpty = options.some((option) => !option);
    if (questionEmpty) {
      setQuestionValid(false);
    }
    if (correctAnswerEmpty) {
      setCorrectAnswerValid(false);
    }
    if (optionsEmpty) {
      setOptionsValid(false);
    }
    if (!questionEmpty && !correctAnswerEmpty && !optionsEmpty) {
      try {
        if (img) {
          await addQuestion(
            Number(quizId),
            "img",
            question,
            correctAnswer,
            options,
            img
          );
        } else {
          await addQuestion(
            Number(quizId),
            "text",
            question,
            correctAnswer,
            options
          );
        }
        setModalVisible(true);

        // Hide the modal after 1 second
        const timer = setTimeout(() => {
          setModalVisible(false);
          setErrorAdding(false);
          router.push({
            pathname: "./ListQuestions",
            params: { quizId: Number(quizId) },
          });
        }, 1000);

        // Clean up the timer when the component unmounts or the state changes
        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Error adding question:", error);
        setErrorAdding(true);
      }
    }
  };

  const handleImage = (img: string) => {
    setImg(img);
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
              <ThemedText variant="h3" style={{ textAlign: "center" }}>
                Create Question
              </ThemedText>
            </View>

            {/* input Question field */}
            <View style={{ width: "100%" }}>
              <ThemedText
                color={COLORS.white}
                style={{
                  marginTop: 30,
                  marginBottom: 5,
                  alignSelf: "flex-start",
                }}
              >
                Question
              </ThemedText>
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <ThemedTextInput
                  value={question}
                  placeholder="Enter quiz Question..."
                  placeholderTextColor={
                    questionValid ? COLORS.dark_grey : COLORS.light_error
                  }
                  handleChange={(question) => {
                    setQuestion(question);
                    setQuestionValid(true);
                  }}
                  style={
                    questionValid ? {} : { borderColor: COLORS.light_error }
                  }
                />
              </View>
              {/* add image button  */}
              <ImgReaderButton onFileread={handleImage} />
            </View>

            {/* input image field */}
            {img && (
              <Image
                source={{ uri: `data:image/jpeg;base64,${img}` }}
                style={{ width: 200, height: 200, marginTop: 20 }}
                resizeMode="contain"
              />
            )}

            {/* input correctAnswer field */}
            <View style={{ width: "100%" }}>
              <ThemedText
                color={COLORS.white}
                style={{
                  marginTop: 20,
                  marginBottom: 5,
                  alignSelf: "flex-start",
                }}
              >
                Correct answer
              </ThemedText>
            </View>
            <ThemedTextInput
              value={correctAnswer}
              placeholder="Enter correct answer..."
              placeholderTextColor={
                correctAnswerValid ? COLORS.dark_grey : COLORS.light_error
              }
              handleChange={(corrAnswer) => {
                setCorrectAnswer(corrAnswer);
                setCorrectAnswerValid(true);
              }}
              style={
                correctAnswerValid ? {} : { borderColor: COLORS.light_error }
              }
            />
            {/* input options field */}
            {options.map((option, index) => (
              <View key={index} style={{ width: "100%" }}>
                <ThemedText
                  color={COLORS.white}
                  style={{
                    marginVertical: 5,
                    alignSelf: "flex-start",
                  }}
                >
                  Wrong answer {index + 1}
                </ThemedText>
                <ThemedTextInput
                  value={option}
                  placeholder={`Enter wrong answer ${index + 1}...`}
                  placeholderTextColor={
                    optionsValid ? COLORS.dark_grey : COLORS.light_error
                  }
                  handleChange={(text) => {
                    const newOptions = [...options];
                    newOptions[index] = text;
                    setOptions(newOptions);
                    if (newOptions.every((opt) => opt !== ""))
                      setOptionsValid(true);
                  }}
                  style={
                    optionsValid ? {} : { borderColor: COLORS.light_error }
                  }
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
      <ModalAlert
        message="Question added successfully !"
        modalVisible={modalVisible}
        errorCreate={errorAdding}
      />
    </SafeAreaView>
  );
}
