import { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { ThemedText } from "../components/ThemedText";
import { ThemedTextInput } from "../components/ThemedTextInput";
import { ModalAlert } from "../components/ModalAlert";
import { ImgReaderButton } from "../components/FileReader";
import { useDatabase } from "../useDatabase";
import { COLORS } from "../constants/theme";

interface Question {
  id: number;
  question_type: string;
  question_text: string;
  correct_answer: string;
  options: string[];
  img_string: string | null;
}

export default function UpdateQuestion() {
  const { questionId } = useLocalSearchParams();
  const { isDbReady, getQuestion, updateQuestion } = useDatabase();

  const [oldCorrectAnswer, setOldCorrectAnswer] = useState("");

  const [newQuestionType, setNewQuestionType] = useState("");
  const [newQuestionText, setNewQuestiontext] = useState("");
  const [newCorrectAnswer, setNewCorrectAnswer] = useState("");
  const [newOptions, setNewOptions] = useState<string[]>([]);
  const [newImg, setNewImg] = useState<string | null>(null);
  //other
  const [modalVisible, setModalVisible] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (isDbReady) {
        loadQuestion();
      }
    }, [isDbReady])
  );

  const loadQuestion = async () => {
    try {
      const loadedQuestion = (await getQuestion(
        Number(questionId)
      )) as Question;
      if (loadedQuestion) {
        setOldCorrectAnswer(loadedQuestion.correct_answer);
        setNewQuestionType(loadedQuestion.question_type);
        setNewQuestiontext(loadedQuestion.question_text);
        setNewCorrectAnswer(loadedQuestion.correct_answer);
        setNewOptions(JSON.parse(loadedQuestion.options as unknown as string));
        setNewImg(loadedQuestion.img_string);
      }
    } catch (error) {
      console.error("Error loading question:", error);
    }
  };

  const handleUpdateQuestion = async () => {
    try {
      await updateQuestion(
        Number(questionId),
        newQuestionType,
        newQuestionText,
        newCorrectAnswer,
        newOptions,
        newImg
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
                Update Question
              </ThemedText>
            </View>

            {/* input QuestionText field */}
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
                  value={newQuestionText}
                  placeholder="Enter new question text..."
                  handleChange={setNewQuestiontext}
                />
              </View>
              {/* add image button  */}
              <ImgReaderButton onFileread={setNewImg}/>
            </View>

            {/* input image field */}
            {newImg && (
              <Image
                source={{ uri: `data:image/jpeg;base64,${newImg}` }}
                style={{ width: 200, height: 200, marginTop: 20 }}
                resizeMode="contain"
              />
            )}

            {/* input correctAnswer field */}
            <View style={{ width: "100%" }}>
              <ThemedText
                color={COLORS.white}
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
            

            {newOptions && newOptions.map(
              (option: string, index: number) =>
                option != oldCorrectAnswer && (
                  <View key={index} style={{ width: "100%" }}>
                    <ThemedText
                      variant="body"
                      color={COLORS.white}
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
