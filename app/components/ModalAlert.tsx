import { Modal, View, TouchableOpacity } from "react-native";
import { Href, Link } from "expo-router";
import { ThemedText } from "./ThemedText";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

type Prop = {
  message?: string;
  modalVisible?: boolean;
  errorCreate?: boolean;
  modalDeleteVisible?: boolean;
  messageDelete?: string;
  handleDelete?: () => void;
  handleCancel?: () => void;
};

export function ModalAlert({ message, modalVisible, errorCreate }: Prop) {
  return (
    <Modal animationType="slide" visible={modalVisible} transparent={true}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
            height: 200,
            width: 250,
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
          {!errorCreate ? (
            <ThemedText style={{textAlign: 'center'}}>{message}</ThemedText>
          ) : (
            <ThemedText>Error creating element</ThemedText>
          )}
          {!errorCreate ? (
            <AntDesign
              name={errorCreate ? "closecircle" : "checkcircle"}
              size={50}
              color={errorCreate ? COLORS.error : COLORS.success}
              style={{ marginTop: 20 }}
            />
          ) : (
            <AntDesign
              name="closecircle"
              size={50}
              color={COLORS.error}
              style={{ marginTop: 20 }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

export function ModalDelete({
  modalDeleteVisible,
  messageDelete,
  handleDelete,
  handleCancel,
}: Prop) {
  return (
    <Modal
      animationType="slide"
      visible={modalDeleteVisible}
      transparent={true}
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
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            borderRadius: 20,
            width: 300,
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
          <ThemedText variant="h3">{messageDelete}</ThemedText>
          <ThemedText
            variant="italic"
            color={COLORS.dark_grey}
            style={{ marginVertical: 10 }}
          >
            (This action is irreversible)
          </ThemedText>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginTop: 20,
              gap: 10,
            }}
          >
            <TouchableOpacity style={{}} onPress={handleCancel}>
              <ThemedText color={COLORS.dark_grey}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={{}} onPress={handleDelete}>
              <ThemedText color={COLORS.delete}>Delete</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
