import {
  StyleSheet,
  Text,
  View,
  TextInput,
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
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";

import { mockHashPassword } from "../utils/auth";
import { UserAccountStorage } from "../services/storage.services";
import { colors } from "../theme/colors";
import { CustomButton } from "../components/CustomButton";
import { CustomTextInput } from "../components/CustomTextInput";

type SignupScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Signup">;
};

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

const SignupScreen = ({ navigation }: SignupScreenProps) => {
  const { signup } = useAuth();
  const [countryCode, setCountryCode] = useState<CountryCode>("US");
  const [callingCode, setCallingCode] = useState("1");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
  });

  const password = watch("password");

  const onCountrySelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0] || "1");
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setSignupError(null);

    try {
      const hashedPassword = await mockHashPassword(data.password);

      const newUser = {
        email: data.email,
        hashedPassword: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: `+${callingCode}${data.phoneNumber}`,
      };

      const success = await UserAccountStorage.addUser(newUser);

      if (!success) {
        setSignupError("An account with this email already exists.");
        setLoading(false);
        return;
      }

      await signup(newUser);
    } catch (error) {
      console.error("Signup error:", error);
      let message = "An unknown error occurred. Please try again.";
      if (error instanceof Error) {
        message = `Signup failed: ${error.message}`;
      }
      setSignupError(message);
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Account setup</Text>
          <Text style={styles.subtitle}>
            Create your account to get started
          </Text>
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
                placeholder="Enter a email"
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
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message:
                  "Password must contain uppercase, lowercase and number",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomTextInput
                label="PASSWORD"
                placeholder="Enter a password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                secureTextEntry
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomTextInput
                label="CONFIRM PASSWORD"
                placeholder="Re-enter your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
                secureTextEntry
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="firstName"
            rules={{
              required: "First name is required",
              minLength: {
                value: 2,
                message: "First name must be at least 2 characters",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomTextInput
                label="FIRST NAME"
                placeholder="Enter your first name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.firstName?.message}
                autoCapitalize="words"
              />
            )}
          />

          <Controller
            control={control}
            name="lastName"
            rules={{
              required: "Last name is required",
              minLength: {
                value: 2,
                message: "Last name must be at least 2 characters",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomTextInput
                label="LAST NAME"
                placeholder="Enter your last name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.lastName?.message}
                autoCapitalize="words"
              />
            )}
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>PHONE NUMBER</Text>
            <View style={styles.phoneRow}>
              <TouchableOpacity
                style={styles.countryPickerButton}
                onPress={() => setShowCountryPicker(true)}
              >
                <CountryPicker
                  countryCode={countryCode}
                  withFilter
                  withFlag
                  withCallingCode
                  withEmoji
                  onSelect={onCountrySelect}
                  visible={showCountryPicker}
                  onClose={() => setShowCountryPicker(false)}
                />
                <Text style={styles.callingCode}>+{callingCode}</Text>
              </TouchableOpacity>

              <Controller
                control={control}
                name="phoneNumber"
                rules={{
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{6,15}$/,
                    message: "Invalid phone number",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.phoneInput,
                      errors.phoneNumber && styles.inputError,
                    ]}
                    placeholder="Enter a phone number"
                    placeholderTextColor={colors.textPlaceholder}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="phone-pad"
                  />
                )}
              />
            </View>
            {errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.signInLink}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.signInText}>
              Already registered?{" "}
              <Text style={styles.signInTextBold}>Sign in here</Text>
            </Text>
          </TouchableOpacity>

          {signupError && (
            <View style={styles.errorContainer}>
              <Text style={styles.formErrorText}>{signupError}</Text>
            </View>
          )}

          <CustomButton
            title="SAVE & START"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 32,
    color: colors.primary,
    fontWeight: "300",
  },
  header: {
    marginBottom: 32,
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorBackground,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
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
  countryPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundGray,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    marginRight: 8,
  },
  callingCode: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 8,
    fontWeight: "600",
  },
  phoneInput: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 16,
    color: colors.textPrimary,
  },
  signInLink: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  signInText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signInTextBold: {
    color: colors.primary,
    fontWeight: "600",
  },
  captchaContainer: {
    backgroundColor: colors.backgroundGray,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  captchaBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.borderLight,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: colors.white,
  },
  captchaText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  captchaLogo: {
    alignItems: "flex-end",
  },
  cloudflareText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.cloudflare,
    marginBottom: 2,
  },
  captchaLinks: {
    fontSize: 10,
    color: colors.textSecondary,
  },
});
