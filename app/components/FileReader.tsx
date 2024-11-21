import React, { useState } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { readString } from "react-native-csv";
import { ThemedText } from "./ThemedText";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

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
        return;
      }

      setFileName(result.assets[0].name);

      const content = await FileSystem.readAsStringAsync(result.assets[0].uri);

      // Parse the CSV/TXT file
      try {
        const parsedContent = readString(content, { header: true });
        // Filter out invalid or empty questions, we only return key data
        const validContent = (parsedContent.data as DataItem[]).filter(
          (item: DataItem) => Boolean(item?.question?.trim())
        );
        if (onFileread) onFileread(validContent);
      } catch (error) {
        Alert.alert("Error", "An error occurred while reading the CSV file");
      }
      Alert.alert("Success", "File read successfully!");
    } catch (err) {
      Alert.alert("Error", "An error occurred while reading the file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={{
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
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
        <FontAwesome name="upload" size={35} color={COLORS.black} />
      </TouchableOpacity>
      {/* Filename */}
      {fileName && (
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <ThemedText color={COLORS.white}>File: {fileName}</ThemedText>
          <TouchableOpacity
            onPress={() => {
              setFileName("");
              onFileread?.([]);
            }}
          >
            <AntDesign name="closecircle" size={15} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export function ImgReaderButton({ onFileread }: Prop) {
  const [loaded, setLoaded] = useState(false);

  const handleFileRead = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const imageb64 = await FileSystem.readAsStringAsync(
        result.assets[0].uri,
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );

      Alert.alert("Success", "Image loaded successfully!");
      if (onFileread) {
        onFileread(imageb64); //returning the image as base64 string
      }
    } catch (err) {
      Alert.alert("Error", "An error occurred while loading the image");
    } finally {
      setLoaded(true);
    }
  };

  const handleClearImage = () => {
    setLoaded(false);
    if (onFileread) onFileread(""); // Clear the image by returning empty string
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (loaded) handleClearImage();
          else handleFileRead();
        }}
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: loaded ? COLORS.delete : COLORS.create,
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 12,
          maxHeight: 50,
        }}
      >
        {loaded ? (
          <AntDesign name="closecircle" size={25} />
        ) : (
          <FontAwesome6 name="image" size={25} />
        )}
      </TouchableOpacity>
    </View>
  );
}
