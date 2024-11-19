import { useState } from "react";
import { SafeAreaView, View, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { COLORS } from "../constants/theme";
import { ThemedText } from "../components/ThemedText";
import { ThemedTextInput } from "../components/ThemedTextInput";
import { ModalAlert } from "../components/ModalAlert";
import { useDatabase } from "../useDatabase";

export default function UpdateQuiz() {
  const { quizId, name, description } = useLocalSearchParams();
  const [newName, setNewName] = useState(name as string);
  const [newDescription, setNewDescription] = useState(description as string);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(false);

  const { updateQuiz } = useDatabase();

  const handleUpdateQuiz = async () => {
    try {
      await updateQuiz(Number(quizId), newName, newDescription);
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
      console.error("Error updating quiz:", error);
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
            <ThemedText variant="h3">Update Quiz</ThemedText>
          </View>
          {/* input name field */}
          <View style={{ width: "100%" }}>
            <ThemedText
              variant="body"
              color={COLORS.white}
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
            value={newName}
            placeholder="Enter new quiz name..."
            handleChange={setNewName}
          />
          {/* input description field */}
          <View style={{ width: "100%" }}>
            <ThemedText
              variant="body"
              color={COLORS.white}
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
            value={newDescription}
            placeholder="Enter new quiz description..."
            handleChange={setNewDescription}
          />
        </View>

        {/* validation button  */}
        <TouchableOpacity
          onPress={() => {
            handleUpdateQuiz();
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
          <ThemedText variant="h3">Update Quiz</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Modal Alert */}
      <ModalAlert
        message="Quiz updated successfully !"
        modalVisible={modalVisible}
        errorCreate={errorUpdate}
      />
    </SafeAreaView>
  );
}
