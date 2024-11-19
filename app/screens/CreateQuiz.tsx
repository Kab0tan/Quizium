import { useState } from "react";
import { SafeAreaView, View, TouchableOpacity, Modal } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "../components/ThemedText";
import { ThemedTextInput } from "../components/ThemedTextInput";
import { FileReaderButton } from "../components/FileReader";
import { ModalAlert } from "../components/ModalAlert";
import { useDatabase } from "../useDatabase";
import { COLORS } from "../constants/theme";
import { addQuestion } from "../database";

export default function CreateQuiz() {
  const [name, setName] = useState("");
  const [nameValid, setNameValid] = useState(true);
  const [description, setDescription] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [errorCreate, setErrorCreate] = useState(false);
  const [fileContent, setFileContent] = useState<any | null>(null);
  const { createQuiz, addQuestion } = useDatabase();
  
  const handleManualCreation = async () => {
    try {
      const quizId_ = await createQuiz(name, description);
      // setQuizId(quizId_ as number);
      setModalVisible(true);

      // Clear input fields
      setName("");
      setDescription("");
      // Hide the modal after 1 second
      const timer = setTimeout(() => {
        setModalVisible(false);
        setErrorCreate(false);
        router.push({
          pathname: "./CreateQuestion",
          params: { quizId: quizId_ as number },
        });
      }, 1000);

      // Clean up the timer when the component unmounts or the state changes
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error creating quiz:", error);
      setErrorCreate(true);
    }
  };

  const handleAutomaticCreation = async (content: any) => {
    try {
      const quizId_ = await createQuiz(name, description);
      for (const item of content) {
        // Convert options to an array if it's a single string
        let optionsArray = item["options"]
          .split(",")
          .map((item: string) => item.trim());
        await addQuestion(
          quizId_ as number,
          item["question"],
          item["correct_answer"],
          optionsArray
        );
      }
      setModalVisible(true);

      // Clear input fields
      setName("");
      setDescription("");
      // Hide the modal after 1 second
      const timer = setTimeout(() => {
        setModalVisible(false);
        setErrorCreate(false);
        router.push({
          pathname: "./ListQuestions",
          params: { quizId: quizId_ as number },
        });
      }, 1000);

      // Clean up the timer when the component unmounts or the state changes
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error creating quiz:", error);
      setErrorCreate(true);
    }
  };

  const handleCreateQuiz = async () => {
    if (name) {
      setNameValid(true);
      if (fileContent.length > 0) { 
        handleAutomaticCreation(fileContent);
      } else {
        handleManualCreation();
      }
    } else {
      setNameValid(false);
    }
  };

  const handleFileContent = (content: object) => {
    setFileContent(content);
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
            <ThemedText variant="h3" style={{ textAlign: "center" }}>
              Create Quiz
            </ThemedText>
          </View>
          {/* input name field */}
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
              Name
            </ThemedText>
          </View>
          <ThemedTextInput
            value={name}
            placeholder="Enter quiz name..."
            placeholderTextColor={nameValid ? COLORS.dark_grey : COLORS.light_error}
            handleChange={(text) => {
              setName(text);
              setNameValid(true);
            }}
            style={ nameValid ? {} : { borderColor: COLORS.light_error  } }
          />
          {/* input description field */}
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
              Description (optional)
            </ThemedText>
          </View>
          <ThemedTextInput
            value={description}
            placeholder="Enter quiz description..."
            handleChange={setDescription}
          />

          {/* file reader */}
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
              Create from CSV/TXT file (optional)
            </ThemedText>
            <FileReaderButton onFileread={handleFileContent} />
          </View>
        </View>

        {/* validation button  */}
        <TouchableOpacity
          onPress={() => {
            handleCreateQuiz();
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
          <ThemedText variant="h3">Generate Quiz</ThemedText>
        </TouchableOpacity>
      </View>

      <ModalAlert
        message="Quiz created successfully!"
        modalVisible={modalVisible}
        errorCreate={errorCreate}
      />
    </SafeAreaView>
  );
}
