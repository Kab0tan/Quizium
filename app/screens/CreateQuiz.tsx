import { useState } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemedText } from "../components/ThemedText";
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
      console.log("Quiz created with ID:", quizId); //type returned is number
      setQuizId(quizId as number);
      setModalVisible(true);

      // Clear input fields
      setName("");
      setDescription("");

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
            <ThemedText variant="h3">Create Quiz</ThemedText>
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
            value={name}
            multiline
            placeholder="Enter quiz name..."
            style={{
              width: "100%",
              borderRadius: 10,
              padding: 15,
              fontSize: 20,
              backgroundColor: COLORS.white,
            }}
            autoCapitalize="words"
            autoCorrect={false}
            placeholderTextColor={COLORS.black}
            onChangeText={(text) => {
              setName(text);
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
            value={description}
            multiline
            placeholder="Enter quiz description..."
            style={{
              width: "100%",
              borderRadius: 10,
              padding: 15,
              fontSize: 20,
              backgroundColor: COLORS.white,
            }}
            autoCapitalize="words"
            autoCorrect={false}
            placeholderTextColor={COLORS.black}
            onChangeText={(text) => {
              setDescription(text);
            }}
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
            <ThemedText>Quiz created successfully !</ThemedText>
            {!errorCreate ? (
              <Link
                href={{
                  pathname: "./CreateQuestion",
                  params: { quizId: quizId },
                }}
                asChild
              >
                <TouchableOpacity
                  style={{ marginTop: 20 }}
                  onPress={() => {
                    setModalVisible(false);
                    setErrorCreate(false);
                  }}
                >
                  <AntDesign
                    name={errorCreate ? "closecircle" : "checkcircle"}
                    size={50}
                    color={errorCreate ? COLORS.error : COLORS.success}
                  />
                </TouchableOpacity>
              </Link>
            ) : (
              <TouchableOpacity
                style={{ marginTop: 20 }}
                onPress={() => {
                  setModalVisible(false);
                  setErrorCreate(false);
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
