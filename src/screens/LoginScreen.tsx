import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/StackNavigation";
import { useAuth } from "../context/AuthContext";
import { useForm, Controller } from "react-hook-form";

import { UserAccountStorage } from "../services/storage.services";
import { mockComparePassword } from "../utils/auth";
import { colors } from "../theme/colors";
import { CustomButton } from "../components/CustomButton";
import { CustomTextInput } from "../components/CustomTextInput";

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Login">;
};

type FormData = {
  email: string;
  password: string;
};

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setLoginError(null);

    try {
      const storedUser = await UserAccountStorage.findUserByEmail(data.email);

      if (!storedUser) {
        setLoginError("Invalid email or password.");
        setLoading(false);
        return;
      }

      const isPasswordMatch = await mockComparePassword(
        data.password,
        storedUser.hashedPassword
      );

      if (!isPasswordMatch) {
        setLoginError("Invalid email or password.");
        setLoading(false);
        return;
      }

      await login(storedUser);
    } catch (error) {
      console.error("Login error:", error);
      let message = "An unexpected error occurred. Please try again.";
      if (error instanceof Error) {
        message = error.message;
      }
      setLoginError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>✓</Text>
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomTextInput
                label="EMAIL ADDRESS"
                placeholder="Enter your email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: "Password is required",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomTextInput
                label="PASSWORD"
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                secureTextEntry
                autoCapitalize="none"
              />
            )}
          />

          {loginError && (
            <View style={styles.errorContainer}>
              <Text style={styles.formErrorText}>{loginError}</Text>
            </View>
          )}

          <CustomButton
            title="SIGN IN"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
          />

          <TouchableOpacity
            style={styles.signUpLink}
            onPress={() => navigation.navigate("Signup")}
            activeOpacity={0.7}
          >
            <Text style={styles.signUpText}>
              Don't have an account?{" "}
              <Text style={styles.signUpTextBold}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.shadowPrimary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    fontSize: 40,
    color: colors.white,
    fontWeight: "700",
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  errorContainer: {
    backgroundColor: colors.errorBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  formErrorText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 12,
    color: colors.textPlaceholder,
    marginHorizontal: 16,
    fontWeight: "600",
  },
  socialButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  socialButtonApple: {
    backgroundColor: colors.shadow,
    borderColor: colors.shadow,
  },
  socialButtonText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  socialButtonTextApple: {
    color: colors.white,
  },
  signUpLink: {
    alignItems: "center",
    marginTop: 16,
  },
  signUpText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signUpTextBold: {
    color: colors.primary,
    fontWeight: "600",
  },
});
