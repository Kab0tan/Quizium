import { useState, useCallback, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  Animated,
  useAnimatedValue,
  Easing,
  FlatList,
  Image,
} from "react-native";
import { useLocalSearchParams, useFocusEffect, router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ThemedText } from "../components/ThemedText";
import { useDatabase } from "../useDatabase";
import { COLORS } from "../constants/theme";

export default function Quiz() {
  const { quizId } = useLocalSearchParams();
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [currentOptionSelected, setCurrentOptionSelected] = useState<
    string | null
  >(null);
  const [correctOption, setCorrectOption] = useState<string | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [score, setScore] = useState(0);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const { isDbReady, getQuestions } = useDatabase();
  const { width } = Dimensions.get("window");
  const [containerWidth, setContainerWidth] = useState(0);
  const progress = useAnimatedValue(0);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      if (isDbReady) {
        loadQuestions();
      }
    }, [isDbReady, quizId])
  );

  useEffect(() => {
    const currentQuestion = allQuestions[currentQuestionIndex];
    if (currentQuestion) {
      const options = [
        ...JSON.parse(currentQuestion["options"]),
        currentQuestion["correct_answer"],
      ];
      setShuffledOptions(shuffleArray(options));
    }
    const unsubscribe = navigation.addListener("blur", () => {
      // Do something when the screen blurs
      restartQuiz();
    });

    return unsubscribe;
  }, [currentQuestionIndex, allQuestions, navigation]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const loadQuestions = async () => {
    try {
      const loadedQuestions = await getQuestions(Number(quizId));
      const shuffledQuestions = shuffleArray(loadedQuestions);
      setAllQuestions(shuffledQuestions);
    } catch (error) {
      console.error("Error loading questions:", error);
    }
  };

  const validateAnswer = (selectedOption: string) => {
    let correct_answer = allQuestions[currentQuestionIndex]?.["correct_answer"];
    setCorrectOption(correct_answer);
    setCurrentOptionSelected(selectedOption);
    setIsSelected(true);
    if (selectedOption === correct_answer) {
      setScore(score + 1);
    }
    setTimeout(handleNextQuestion, 1000);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex == allQuestions.length - 1) {
      setShowScoreModal(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentOptionSelected(null);
      setCorrectOption(null);
    }
    setIsSelected(false);
    Animated.timing(progress, {
      toValue: currentQuestionIndex + 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
  };

  const renderQuestion = () => {
    return (
      <View style={{ width: "100%", marginBottom: 30 }}>
        {/* question_counter */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          <ThemedText
            style={{
              opacity: 0.5,
            }}
            color={COLORS.white}
          >
            {currentQuestionIndex + 1}
          </ThemedText>
          <ThemedText
            style={{
              opacity: 0.5,
            }}
            color={COLORS.white}
          >
            / {allQuestions.length}
          </ThemedText>
        </View>
        <ThemedText variant="h2" color={COLORS.white}>
          {allQuestions[currentQuestionIndex]?.["question_text"]}
        </ThemedText>
      </View>
    );
  };

  const renderImage = () => {
    return (
      <Image
        source={{
          uri: `data:image/jpeg;base64,${allQuestions?.[currentQuestionIndex]?.["img_string"]}`,
        }}
        style={{ width: "100%", height: 200 }}
        resizeMode="contain"
      />
    );
  };

  const renderOption = (option: string) => {
    const currentQuestion = allQuestions[currentQuestionIndex];

    // Check if the current question and its options are available
    if (!currentQuestion) {
      return (
        <View style={{ paddingLeft: 20 }}>
          <ThemedText>Loading...</ThemedText>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, marginHorizontal: 5 }}>
        <TouchableOpacity
          onPress={() => validateAnswer(option)}
          disabled={isSelected}
          style={{
            borderRadius: 20,
            backgroundColor:
              option == correctOption
                ? COLORS.success
                : option == currentOptionSelected
                ? COLORS.error
                : COLORS.white,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginVertical: 10,
            height: 80,
          }}
        >
          <ThemedText
            color={
              option == correctOption
                ? COLORS.white
                : option == currentOptionSelected
                ? COLORS.white
                : COLORS.black
            }
            style={{
              fontSize: width * 0.06,
            }}
          >
            {option}
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  };

  const restartQuiz = () => {
    setShowScoreModal(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setCurrentOptionSelected(null);
    setCorrectOption(null);
    progress.setValue(0);
    const shuffledQuestions = shuffleArray(allQuestions);
    setAllQuestions(shuffledQuestions);
  };

  const backToList = () => {
    setShowScoreModal(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setCurrentOptionSelected(null);
    setCorrectOption(null);
    router.back();
  };

  const renderProgressBar = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <View
          style={{
            flex: 1,
            height: 20,
            borderRadius: 20,
            backgroundColor: COLORS.white,
            overflow: "hidden",
          }}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setContainerWidth(width); // Get the actual width of parent container
          }}
        >
          <Animated.View
            style={[
              {
                position: "absolute",
                width: "100%",
                backgroundColor: COLORS.progress,
                height: 20,
                borderRadius: 20,
                transform: [
                  {
                    translateX: progress.interpolate({
                      inputRange: [0, allQuestions.length],
                      outputRange: [-containerWidth, 0],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>

        <TouchableOpacity onPress={() => restartQuiz()} style={{ padding: 5 }}>
          <MaterialCommunityIcons
            name="restart"
            size={35}
            color={COLORS.dark_grey}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Progress Bar */}
      <View
        style={{
          width: "100%",
          height: 80,
          paddingHorizontal: 20,
        }}
      >
        {renderProgressBar()}
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          paddingHorizontal: 20,
          backgroundColor: COLORS.background,
          opacity: showScoreModal ? 0.2 : 1,
        }}
      >
        {/* Question */}
        {renderQuestion()}

        {/* Render image */}
        {allQuestions?.[currentQuestionIndex]?.["question_type"] === "img" &&
          renderImage()}

        {/* Options */}
        <FlatList
          key={`${
            allQuestions?.[currentQuestionIndex]?.["question_type"] === "text"
              ? "1col"
              : "2col"
          }`}
          data={shuffledOptions}
          renderItem={({ item }) => renderOption(item)}
          keyExtractor={(option) => option}
          numColumns={
            allQuestions?.[currentQuestionIndex]?.["question_type"] === "text"
              ? 1
              : 2
          }
          style={{ width: "100%" }}
        />
        {/* Score */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showScoreModal}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.white,
                padding: 20,
                width: "90%",
                borderRadius: 20,
                alignItems: "center",
              }}
            >
              <ThemedText variant="h2" style={{ marginBottom: 20 }}>
                {score} out of {allQuestions.length}
              </ThemedText>
              <AntDesign
                name={
                  score != allQuestions.length ? "closecircle" : "checkcircle"
                }
                color={
                  score != allQuestions.length ? COLORS.error : COLORS.success
                }
                size={50}
                style={{ marginBottom: 20 }}
              />
              <TouchableOpacity
                onPress={() => backToList()}
                style={{
                  backgroundColor: COLORS.explore,
                  width: "100%",
                  padding: 20,
                  borderRadius: 20,
                  marginBottom: 10,
                }}
              >
                <ThemedText
                  style={{
                    textAlign: "center",
                  }}
                >
                  Back to list
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => restartQuiz()}
                style={{
                  backgroundColor: COLORS.create,
                  width: "100%",
                  padding: 20,
                  borderRadius: 20,
                }}
              >
                <ThemedText
                  style={{
                    textAlign: "center",
                  }}
                >
                  Restart
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
