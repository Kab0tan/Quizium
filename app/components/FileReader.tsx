import React, { useState } from "react";
import { View, TouchableOpacity, Alert, ScrollView } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { readString } from "react-native-csv";
import { ThemedText } from "./ThemedText";
import { COLORS } from "../constants/theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type Prop = {
  onFileread?: (content: any) => void;
};

interface DataItem {
  question: string;
  correct_answer: string;
  options: string;
}

export function FileReaderButton({ onFileread }: Prop) {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileRead = async () => {
    try {
      setIsLoading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: "text/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log("User cancelled the picker");
        return;
      }

      setFileName(result.assets[0].name);

      const content = await FileSystem.readAsStringAsync(result.assets[0].uri);

      // If it's a CSV file, parse it
      if (result.assets[0].name.endsWith(".csv")) {
        try {
        } catch (error) {
          Alert.alert("Error", "An error occurred while reading the CSV file");
        }
      } else {
        // For TXT files, show the content as is
        const parsedContent = readString(content, { header: true });
        
        // Filter out invalid or empty questions, we only return key data
        const validContent = (parsedContent.data as DataItem[]).filter(
          (item: DataItem) => Boolean(item?.question?.trim())
        );
        console.log("validContent", validContent);
        if (onFileread) onFileread(validContent);
      }
      Alert.alert("Success", "File read successfully!");
    } catch (err) {
      Alert.alert("Error", "An error occurred while reading the file");
      console.log("Error: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={{ marginTop: 20, justifyContent: "center", alignItems: "center" }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: COLORS.explore,
          borderRadius: 10,
          paddingVertical: 15,
          paddingHorizontal: 17,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={handleFileRead}
        disabled={isLoading}
      >
        <FontAwesome name="upload" size={35} color="black" />
      </TouchableOpacity>

      {/* Filename */}
      {fileName && (
        <ThemedText style={{ marginTop: 10 }} color={COLORS.white}>
          File: {fileName}
        </ThemedText>
      )}
    </View>
  );
}
