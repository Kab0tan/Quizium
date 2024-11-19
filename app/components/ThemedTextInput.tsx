import { TextInput, StyleSheet, type TextInputProps } from "react-native";
import { COLORS } from "../constants/theme";

const styles = StyleSheet.create({
  body: {
    width: "100%",
    borderRadius: 10,
    padding: 12,
    fontSize: 20,
    backgroundColor: COLORS.white,
    borderWidth: 3
  },
  searchBar: {
    width: "100%",
    fontSize: 20,
    paddingLeft: 5,
  },
});

type Prop = TextInputProps & {
  value?: string;
  placeholder?: string;
  handleChange: (t: string) => void;
  variant?: keyof typeof styles;
};
export function ThemedTextInput({
  value,
  placeholder,
  handleChange,
  variant,
  style,
  ...rest
}: Prop) {
  return (
    <TextInput
      value={value}
      placeholder={placeholder}
      placeholderTextColor= {COLORS.dark_grey}
      multiline
      style={[styles[variant ?? "body"], style]}
      autoCapitalize="sentences"
      autoCorrect={false}
      onChangeText={handleChange}
      {...rest}
    />
  );
}
