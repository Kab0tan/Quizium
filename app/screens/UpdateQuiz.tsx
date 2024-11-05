import { useState } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { COLORS } from "../constants/theme";
import { ThemedText } from "../components/ThemedText";
import { useDatabase } from "../useDatabase";
import AntDesign from "@expo/vector-icons/AntDesign";

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
      console.log("Quiz updated successfully");
      setModalVisible(true);
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
          <TextInput
            value={newName}
            placeholder="Enter new quiz name..."
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
              setNewName(text);
            }}
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
          <TextInput
            value={newDescription}
            multiline
            placeholder="Enter new quiz description..."
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
              setNewDescription(text);
            }}
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
            <ThemedText>Quiz updated successfully !</ThemedText>
            {!errorUpdate ? (
              <Link
                href={{
                  pathname: "./ListQuiz",
                }}
                asChild
              >
                <TouchableOpacity
                  style={{ marginTop: 20 }}
                  onPress={() => {
                    setModalVisible(false);
                    setErrorUpdate(false);
                  }}
                >
                  <AntDesign
                    name={errorUpdate ? "closecircle" : "checkcircle"}
                    size={50}
                    color={errorUpdate ? COLORS.error : COLORS.success}
                  />
                </TouchableOpacity>
              </Link>
            ) : (
              <TouchableOpacity
                style={{ marginTop: 20 }}
                onPress={() => {
                  setModalVisible(false);
                  setErrorUpdate(false);
                }}
              >
                <AntDesign name="closecircle" size={50} color={COLORS.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
