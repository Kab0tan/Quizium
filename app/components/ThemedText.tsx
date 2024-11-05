import { StyleSheet, Text, type TextProps } from "react-native";

const styles = StyleSheet.create({
  body: {
    fontSize: 20,
    fontFamily: "Montserrat_500Medium",
  },
  h2: {
    fontSize: 30,
    fontFamily: "Montserrat_600SemiBold",
  },
  h3: {
    fontSize: 25,
    fontFamily: "Montserrat_600SemiBold",
  },
  h4: {
    fontSize: 20,
    fontFamily: "Montserrat_600SemiBold",
  },
  score: {
    fontSize: 10,
    fontFamily: "Montserrat_500Medium",
  },
  italic: {
    fontSize: 20,
    fontFamily: "Montserrat_500Medium_Italic",
  }
});

type Prop = TextProps & {
  variant?: keyof typeof styles;
  color?: string;
};

export function ThemedText({ variant, color, style, ...rest }: Prop) {
  return (
    <Text style={[styles[variant ?? "body"], { color }, style]} {...rest} />
  );
}
