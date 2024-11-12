import { useState } from "react";
import { SafeAreaView, View, TouchableOpacity, Modal } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "../components/ThemedText";
import { ThemedTextInput } from "../components/ThemedTextInput";
import { ModalAlert } from "../components/ModalAlert";
import { useDatabase } from "../useDatabase";
import { COLORS } from "../constants/theme";

export default function CreateQuiz() {
  const [quizId, setQuizId] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [errorCreate, setErrorCreate] = useState(false);

  const { createQuiz } = useDatabase();

  const handleCreateQuiz = async () => {
    try {
      const quizId = await createQuiz(name, description);
      setQuizId(quizId as number);
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
          params: { quizId: quizId as number },
        });
      }, 1000);


      // Clean up the timer when the component unmounts or the state changes
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error creating quiz:", error);
      setErrorCreate(true);
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
            <ThemedText variant="h3" style={{ textAlign: "center" }}>Create Quiz</ThemedText>
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
            handleChange={setName}
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
              Description
            </ThemedText>
          </View>
          <ThemedTextInput
            value={description}
            placeholder="Enter quiz description..."
            handleChange={setDescription}
          />
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
