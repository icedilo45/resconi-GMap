import { View, StyleSheet } from "react-native";
import { Link, Stack } from "expo-router";

export default function NotFoundScreen() {
    return (
        <>
        <Stack.Screen
          name="not-found"
          options={{
            title: "Ooops! Not Found",
          }}
        />
        <View style={styles.container}>
          <Link href="/index" style={styles.button}>
            Go back to Home Screen
          </Link>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#25292e",
    },
    button: {
        fontSize: 15,
        color: "#fff",
        textDecorationLine: "underline",
    }
})