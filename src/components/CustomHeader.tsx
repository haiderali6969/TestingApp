import React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

type CustomHeaderProps = {
  title: string
  showBackButton?: boolean
  navigation?: any
  rightButton?: {
    label: string
    onPress: () => void
  }
}

const CustomHeader = ({
  title,
  showBackButton = false,
  navigation,
  rightButton,
}: CustomHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {showBackButton && navigation ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}

        <Text style={styles.title}>{title}</Text>

        {rightButton ? (
          <TouchableOpacity
            style={styles.rightButton}
            onPress={rightButton.onPress}
          >
            <Text style={styles.rightButtonText}>{rightButton.label}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.rightButton} />
        )}
      </View>
    </View>
  )
}

export default CustomHeader

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 16,
    paddingBottom: 16,
    minHeight: Platform.OS === "ios" ? 100 : 56,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  backButtonText: {
    fontSize: 28,
    color: "#007AFF",
    fontWeight: "300",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  rightButton: {
    width: 60,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-end",
    position: "absolute",
    right: 16,
    top: Platform.OS === "ios" ? 60 : 16,
  },
  rightButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
})
