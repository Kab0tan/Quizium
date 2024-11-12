import { TextInput, StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

const styles = StyleSheet.create({
  body: {
    width: "100%",
    borderRadius: 10,
    padding: 10,
    fontSize: 20,
    backgroundColor: COLORS.white,
  },
  searchBar: {
    width: "100%",
    fontSize: 20,
    paddingLeft: 5,
  },
});

type Prop = {
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
  ...rest
}: Prop) {
  return (
    <TextInput
      value={value}
      placeholder={placeholder}
      placeholderTextColor= {COLORS.dark_grey}
      multiline
      style={styles[variant ?? "body"]}
      autoCapitalize="sentences"
      autoCorrect={false}
      onChangeText={handleChange}
      {...rest}
    />
  );
}
