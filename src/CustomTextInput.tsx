// src/CustomTextInput.tsx
import React, {
  useState,
  forwardRef,
  useRef,
  useEffect,
  ReactNode,
  RefObject,
} from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInputFocusEventData,
} from "react-native";

// Type definitions
export type InputType = "default" | "otp" | "split";

export interface SplitField {
  key: string;
  placeholder?: string;
  value?: string;
  flex?: number;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  maxLength?: number;
  secureTextEntry?: boolean;
  editable?: boolean;
}

export interface SplitFieldValues {
  [key: string]: string;
}

export interface CustomTextInputProps
  extends Omit<TextInputProps, "style" | "onChangeText"> {
  // Basic Props
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;

  // Content Props
  label?: string;
  labelRequired?: boolean;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;

  // OTP Props
  type?: InputType;
  otpLength?: number;
  otpValue?: string;
  onOtpChange?: (otp: string) => void;
  otpAutoFocus?: boolean;

  // Split Props
  splitFields?: SplitField[];
  splitValues?: SplitFieldValues;
  onSplitChange?: (
    values: SplitFieldValues,
    key: string,
    value: string
  ) => void;
  splitSpacing?: number;

  // Style Props
  containerStyle?: ViewStyle;
  labelContainerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  requiredStyle?: TextStyle;
  inputContainerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  leftIconContainerStyle?: ViewStyle;
  rightIconContainerStyle?: ViewStyle;
  errorContainerStyle?: ViewStyle;
  errorStyle?: TextStyle;
  helperTextContainerStyle?: ViewStyle;
  helperTextStyle?: TextStyle;
  focusedInputContainerStyle?: ViewStyle;
  focusedInputStyle?: TextStyle;
  disabledInputContainerStyle?: ViewStyle;
  disabledInputStyle?: TextStyle;

  // OTP Style Props
  otpContainerStyle?: ViewStyle;
  otpInputContainerStyle?: ViewStyle;
  otpInputStyle?: TextStyle;
  otpFocusedInputContainerStyle?: ViewStyle;
  otpFocusedInputStyle?: TextStyle;

  // Split Style Props
  splitContainerStyle?: ViewStyle;
  splitInputContainerStyle?: ViewStyle;
  splitInputStyle?: TextStyle;
  splitFocusedInputContainerStyle?: ViewStyle;
  splitFocusedInputStyle?: TextStyle;
}

// Validation functions
const validateOtpLength = (length: number): boolean => {
  return Number.isInteger(length) && length >= 1 && length <= 20;
};

const validateOtpValue = (value: string, maxLength: number): boolean => {
  return typeof value === "string" && value.length <= maxLength;
};

const validateSplitFields = (fields: SplitField[]): boolean => {
  if (!Array.isArray(fields) || fields.length === 0) {
    return false;
  }

  const keys = fields.map((field) => field.key);
  const uniqueKeys = new Set(keys);

  if (keys.length !== uniqueKeys.size) {
    console.warn("CustomTextInput: Split fields must have unique keys");
    return false;
  }

  return fields.every(
    (field) =>
      field.key && typeof field.key === "string" && field.key.trim().length > 0
  );
};

const CustomTextInput = forwardRef<TextInput, CustomTextInputProps>(
  (props, ref) => {
    const {
      // Text Input Props
      value = "",
      onChangeText,
      placeholder,
      placeholderTextColor,
      secureTextEntry = false,
      keyboardType = "default",
      autoCapitalize = "none",
      editable = true,
      multiline = false,
      numberOfLines = 1,
      maxLength,

      // Label Props
      label,
      labelRequired = false,

      // Error Props
      error,

      // Helper Text Props
      helperText,

      // Icon Props
      leftIcon,
      rightIcon,
      onRightIconPress,

      // OTP Props
      type = "default",
      otpLength = 6,
      otpValue = "",
      onOtpChange,
      otpAutoFocus = true,

      // Split Props
      splitFields = [],
      splitValues = {},
      onSplitChange,
      splitSpacing = 12,

      // Custom Styling Props
      containerStyle,
      labelContainerStyle,
      labelStyle,
      requiredStyle,
      inputContainerStyle,
      inputStyle,
      leftIconContainerStyle,
      rightIconContainerStyle,
      errorContainerStyle,
      errorStyle,
      helperTextContainerStyle,
      helperTextStyle,
      focusedInputContainerStyle,
      focusedInputStyle,
      disabledInputContainerStyle,
      disabledInputStyle,

      // OTP Styling Props
      otpContainerStyle,
      otpInputContainerStyle,
      otpInputStyle,
      otpFocusedInputContainerStyle,
      otpFocusedInputStyle,

      // Split Styling Props
      splitContainerStyle,
      splitInputContainerStyle,
      splitInputStyle,
      splitFocusedInputContainerStyle,
      splitFocusedInputStyle,

      // Other props
      ...otherProps
    } = props;

    // State
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [otpValues, setOtpValues] = useState<string[]>(
      new Array(otpLength).fill("")
    );
    const [otpFocusedIndex, setOtpFocusedIndex] = useState<number>(
      otpAutoFocus ? 0 : -1
    );
    const [splitFocusedKey, setSplitFocusedKey] = useState<string>("");
    const otpRefs = useRef<Array<React.RefObject<TextInput>>>([]);
    const splitRefs = useRef<{ [key: string]: React.RefObject<TextInput> }>({});

    // Validation on mount and prop changes
    useEffect(() => {
      if (type === "otp") {
        if (!validateOtpLength(otpLength)) {
          console.warn(
            `CustomTextInput: otpLength must be a positive integer between 1 and 20. Received: ${otpLength}`
          );
        }

        if (otpValue && !validateOtpValue(otpValue, otpLength)) {
          console.warn(
            `CustomTextInput: otpValue length cannot exceed otpLength (${otpLength}). Received: "${otpValue}"`
          );
        }
      }

      if (type === "split") {
        if (!validateSplitFields(splitFields)) {
          console.warn(
            `CustomTextInput: splitFields must be a non-empty array with unique keys. Received:`,
            splitFields
          );
        }
      }
    }, [type, otpLength, otpValue, splitFields]);

    // Initialize OTP refs
    useEffect(() => {
      if (type === "otp") {
        otpRefs.current = otpRefs.current.slice(0, otpLength);
        for (let i = otpRefs.current.length; i < otpLength; i++) {
          otpRefs.current[i] = React.createRef();
        }

        // Initialize OTP values from prop
        if (otpValue && otpValue.length <= otpLength) {
          const newValues = new Array(otpLength).fill("");
          for (let i = 0; i < otpValue.length; i++) {
            newValues[i] = otpValue[i] || "";
          }
          setOtpValues(newValues);
        }
      }
    }, [otpLength, type, otpValue]);

    // Initialize Split refs
    useEffect(() => {
      if (type === "split" && splitFields.length > 0) {
        const newRefs: {
          [key: string]: React.RefObject<TextInput> | undefined;
        } = {};
        splitFields.forEach((field) => {
          if (!splitRefs.current[field.key]) {
            newRefs[field.key] = React.createRef();
          } else {
            newRefs[field.key] = splitRefs.current[field.key];
          }
        });
        splitRefs.current = newRefs as { [key: string]: RefObject<TextInput> };
      }
    }, [type, splitFields]);

    // Auto focus first input for OTP
    useEffect(() => {
      if (type === "otp" && otpAutoFocus && otpRefs.current[0]) {
        const timer = setTimeout(() => {
          otpRefs.current[0]?.current?.focus();
        }, 100);

        return () => clearTimeout(timer);
      }
      return;
    }, [type, otpAutoFocus]);

    // OTP Functions
    const handleOtpChange = (text: string, index: number): void => {
      if (index < 0 || index >= otpLength) {
        console.warn(
          `CustomTextInput: Invalid OTP index ${index}. Must be between 0 and ${
            otpLength - 1
          }`
        );
        return;
      }

      // Handle paste operation (when text length > 1)
      if (text.length > 1) {
        handleOtpPaste(text, index);
        return;
      }

      const newValues = [...otpValues];
      newValues[index] = text;
      setOtpValues(newValues);

      // Call parent callback with complete OTP
      if (onOtpChange) {
        onOtpChange(newValues.join(""));
      }

      // Auto move to next input
      if (text && index < otpLength - 1) {
        otpRefs.current[index + 1]?.current?.focus();
      }
    };

    const handleOtpPaste = (pastedText: string, currentIndex: number): void => {
      if (currentIndex < 0 || currentIndex >= otpLength) {
        console.warn(`CustomTextInput: Invalid paste index ${currentIndex}`);
        return;
      }

      // Clean the pasted text (remove spaces, special characters if needed)
      const cleanedText = pastedText.replace(/\s/g, ""); // Remove spaces

      if (!cleanedText) return;

      const newValues = [...otpValues];
      let nextFocusIndex = currentIndex;

      // Distribute characters starting from current index
      for (
        let i = 0;
        i < cleanedText.length && currentIndex + i < otpLength;
        i++
      ) {
        const char = cleanedText[i];
        if (char !== undefined) {
          newValues[currentIndex + i] = char;
          nextFocusIndex = currentIndex + i;
        }
      }

      setOtpValues(newValues);

      // Call parent callback with complete OTP
      if (onOtpChange) {
        onOtpChange(newValues.join(""));
      }

      // Focus the next empty input or the last filled input
      const nextEmptyIndex = newValues.findIndex(
        (value, index) => !value && index > nextFocusIndex
      );

      if (nextEmptyIndex !== -1) {
        // Focus next empty input
        setTimeout(() => {
          otpRefs.current[nextEmptyIndex]?.current?.focus();
        }, 50);
      } else if (nextFocusIndex + 1 < otpLength) {
        // Focus next input if available
        setTimeout(() => {
          otpRefs.current[nextFocusIndex + 1]?.current?.focus();
        }, 50);
      } else {
        // Focus the last input and blur to show completion
        setTimeout(() => {
          otpRefs.current[nextFocusIndex]?.current?.blur();
        }, 50);
      }
    };

    const handleOtpKeyPress = (
      event: NativeSyntheticEvent<TextInputKeyPressEventData>,
      index: number
    ): void => {
      if (index < 0 || index >= otpLength) {
        console.warn(`CustomTextInput: Invalid key press index ${index}`);
        return;
      }

      // Handle backspace
      if (event.nativeEvent.key === "Backspace") {
        if (!otpValues[index] && index > 0) {
          // Move to previous input if current is empty
          otpRefs.current[index - 1]?.current?.focus();
        }
      }
    };

    const handleOtpFocus = (index: number): void => {
      if (index >= 0 && index < otpLength) {
        setOtpFocusedIndex(index);
      }
    };

    const handleOtpBlur = (): void => {
      setOtpFocusedIndex(-1);
    };

    // Split Functions
    const handleSplitChange = (key: string, text: string): void => {
      if (!splitFields.find((field) => field.key === key)) {
        console.warn(`CustomTextInput: Invalid split field key "${key}"`);
        return;
      }

      const newValues = { ...splitValues, [key]: text };

      if (onSplitChange) {
        onSplitChange(newValues, key, text);
      }
    };

    const handleSplitFocus = (key: string): void => {
      setSplitFocusedKey(key);
    };

    const handleSplitBlur = (): void => {
      setSplitFocusedKey("");
    };

    const getOtpInputContainerStyle = (index: number): ViewStyle[] => {
      const style: ViewStyle[] = [
        styles.otpInputContainer,
        otpInputContainerStyle ?? {},
      ].filter(Boolean);

      if (otpFocusedIndex === index) {
        style.push(styles.otpFocusedInputContainer);
        if (otpFocusedInputContainerStyle) {
          style.push(otpFocusedInputContainerStyle);
        }
      }

      if (!editable) {
        style.push(styles.disabledInputContainer);
        if (disabledInputContainerStyle) {
          style.push(disabledInputContainerStyle);
        }
      }

      if (error) {
        style.push(styles.errorInputContainer);
      }

      return style;
    };

    const getOtpInputStyle = (index: number): TextStyle[] => {
      const style: TextStyle[] = [styles.otpInput, otpInputStyle ?? {}].filter(
        Boolean
      );

      if (otpFocusedIndex === index && otpFocusedInputStyle) {
        style.push(otpFocusedInputStyle);
      }

      if (!editable) {
        style.push(styles.disabledInput);
        if (disabledInputStyle) {
          style.push(disabledInputStyle);
        }
      }

      return style;
    };

    const getSplitInputContainerStyle = (field: SplitField): ViewStyle[] => {
      const style: ViewStyle[] = [
        styles.splitInputContainer,
        splitInputContainerStyle ?? {},
      ].filter(Boolean);

      if (splitFocusedKey === field.key) {
        style.push(styles.splitFocusedInputContainer);
        if (splitFocusedInputContainerStyle) {
          style.push(splitFocusedInputContainerStyle);
        }
      }

      if (!field.editable && field.editable !== undefined) {
        style.push(styles.disabledInputContainer);
        if (disabledInputContainerStyle) {
          style.push(disabledInputContainerStyle);
        }
      }

      if (error) {
        style.push(styles.errorInputContainer);
      }

      return style;
    };

    const getSplitInputStyle = (field: SplitField): TextStyle[] => {
      const style: TextStyle[] = [styles.splitInput, splitInputStyle ?? {}].filter(
        Boolean
      );

      if (splitFocusedKey === field.key && splitFocusedInputStyle) {
        style.push(splitFocusedInputStyle);
      }

      if (!field.editable && field.editable !== undefined) {
        style.push(styles.disabledInput);
        if (disabledInputStyle) {
          style.push(disabledInputStyle);
        }
      }

      return style;
    };

    // Render OTP Component
    const renderOtpInputs = (): JSX.Element => {
      return (
        <View style={[styles.otpContainer, otpContainerStyle]}>
          {Array.from({ length: otpLength }, (_, index) => (
            <View
              key={`otp-input-${index}`}
              style={getOtpInputContainerStyle(index)}
            >
              <TextInput
                ref={otpRefs.current[index]}
                style={getOtpInputStyle(index)}
                value={otpValues[index] || ""}
                onChangeText={(text: string) => handleOtpChange(text, index)}
                onKeyPress={(event) => handleOtpKeyPress(event, index)}
                onFocus={() => handleOtpFocus(index)}
                onBlur={handleOtpBlur}
                maxLength={otpLength} // Allow longer input for paste detection
                keyboardType="numeric"
                textAlign="center"
                editable={editable}
                secureTextEntry={secureTextEntry}
                selectTextOnFocus
                {...otherProps}
              />
            </View>
          ))}
        </View>
      );
    };

    // Render Split Component
    const renderSplitInputs = (): JSX.Element => {
      return (
        <View style={[styles.splitContainer, splitContainerStyle]}>
          {splitFields.map((field, index) => (
            <View
              key={`split-field-${field.key}`}
              style={[
                getSplitInputContainerStyle(field),
                {
                  flex: field.flex || 1,
                  marginRight:
                    index < splitFields.length - 1 ? splitSpacing : 0,
                },
              ]}
            >
              <TextInput
                ref={splitRefs.current[field.key]}
                style={getSplitInputStyle(field)}
                value={splitValues[field.key] || ""}
                onChangeText={(text: string) =>
                  handleSplitChange(field.key, text)
                }
                onFocus={() => handleSplitFocus(field.key)}
                onBlur={handleSplitBlur}
                placeholder={field.placeholder}
                placeholderTextColor={
                  placeholderTextColor || styles.placeholder.color
                }
                keyboardType={field.keyboardType || keyboardType}
                autoCapitalize={field.autoCapitalize || autoCapitalize}
                maxLength={field.maxLength}
                secureTextEntry={field.secureTextEntry || secureTextEntry}
                editable={
                  field.editable !== undefined ? field.editable : editable
                }
                {...otherProps}
              />
            </View>
          ))}
        </View>
      );
    };

    // If OTP type, render OTP component
    if (type === "otp") {
      return (
        <View style={[styles.container, containerStyle]}>
          {/* Label Section */}
          {label && (
            <View style={[styles.labelContainer, labelContainerStyle]}>
              <Text style={[styles.label, labelStyle]}>
                {label}
                {labelRequired && (
                  <Text style={[styles.required, requiredStyle]}> *</Text>
                )}
              </Text>
            </View>
          )}

          {/* OTP Inputs */}
          {renderOtpInputs()}

          {/* Error Message */}
          {error && (
            <View style={[styles.errorContainer, errorContainerStyle]}>
              <Text style={[styles.error, errorStyle]}>{error}</Text>
            </View>
          )}

          {/* Helper Text */}
          {helperText && !error && (
            <View
              style={[styles.helperTextContainer, helperTextContainerStyle]}
            >
              <Text style={[styles.helperText, helperTextStyle]}>
                {helperText}
              </Text>
            </View>
          )}
        </View>
      );
    }

    // If Split type, render Split component
    if (type === "split") {
      return (
        <View style={[styles.container, containerStyle]}>
          {/* Label Section */}
          {label && (
            <View style={[styles.labelContainer, labelContainerStyle]}>
              <Text style={[styles.label, labelStyle]}>
                {label}
                {labelRequired && (
                  <Text style={[styles.required, requiredStyle]}> *</Text>
                )}
              </Text>
            </View>
          )}

          {/* Split Inputs */}
          {renderSplitInputs()}

          {/* Error Message */}
          {error && (
            <View style={[styles.errorContainer, errorContainerStyle]}>
              <Text style={[styles.error, errorStyle]}>{error}</Text>
            </View>
          )}

          {/* Helper Text */}
          {helperText && !error && (
            <View
              style={[styles.helperTextContainer, helperTextContainerStyle]}
            >
              <Text style={[styles.helperText, helperTextStyle]}>
                {helperText}
              </Text>
            </View>
          )}
        </View>
      );
    }

    // Regular TextInput handlers
    const handleFocus = (
      e: NativeSyntheticEvent<TextInputFocusEventData>
    ): void => {
      setIsFocused(true);
      if (props.onFocus) {
        props.onFocus(e);
      }
    };

    const handleBlur = (
      e: NativeSyntheticEvent<TextInputFocusEventData>
    ): void => {
      setIsFocused(false);
      if (props.onBlur) {
        props.onBlur(e);
      }
    };

    // Dynamic styles based on state
    const getInputContainerStyle = (): ViewStyle[] => {
      const style: ViewStyle[] = [
        styles.inputContainer,
        inputContainerStyle ?? {},
      ].filter(Boolean);

      if (isFocused) {
        style.push(styles.focusedInputContainer);
        if (focusedInputContainerStyle) {
          style.push(focusedInputContainerStyle);
        }
      }

      if (!editable) {
        style.push(styles.disabledInputContainer);
        if (disabledInputContainerStyle) {
          style.push(disabledInputContainerStyle);
        }
      }

      if (error) {
        style.push(styles.errorInputContainer);
      }

      return style;
    };

    const getInputStyle = (): TextStyle[] => {
      const style: TextStyle[] = [styles.input, inputStyle ?? {}].filter(Boolean);

      if (isFocused && focusedInputStyle) {
        style.push(focusedInputStyle);
      }

      if (!editable) {
        style.push(styles.disabledInput);
        if (disabledInputStyle) {
          style.push(disabledInputStyle);
        }
      }

      return style;
    };

    // Regular TextInput Component
    return (
      <View style={[styles.container, containerStyle]}>
        {/* Label Section */}
        {label && (
          <View style={[styles.labelContainer, labelContainerStyle]}>
            <Text style={[styles.label, labelStyle]}>
              {label}
              {labelRequired && (
                <Text style={[styles.required, requiredStyle]}> *</Text>
              )}
            </Text>
          </View>
        )}

        {/* Input Container */}
        <View style={getInputContainerStyle()}>
          {/* Left Icon */}
          {leftIcon && (
            <View style={[styles.leftIconContainer, leftIconContainerStyle]}>
              {leftIcon}
            </View>
          )}

          {/* Text Input */}
          <TextInput
            ref={ref}
            style={getInputStyle()}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={
              placeholderTextColor || styles.placeholder.color
            }
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            editable={editable}
            multiline={multiline}
            numberOfLines={numberOfLines}
            maxLength={maxLength}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...otherProps}
          />

          {/* Right Icon */}
          {rightIcon && (
            <TouchableOpacity
              style={[styles.rightIconContainer, rightIconContainerStyle]}
              onPress={onRightIconPress}
              disabled={!onRightIconPress}
              accessible={!!onRightIconPress}
              accessibilityRole={onRightIconPress ? "button" : undefined}
              accessibilityHint={
                onRightIconPress ? "Double tap to activate" : undefined
              }
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>

        {/* Error Message */}
        {error && (
          <View style={[styles.errorContainer, errorContainerStyle]}>
            <Text style={[styles.error, errorStyle]}>{error}</Text>
          </View>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <View style={[styles.helperTextContainer, helperTextContainerStyle]}>
            <Text style={[styles.helperText, helperTextStyle]}>
              {helperText}
            </Text>
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  required: {
    color: "#EF4444",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    minHeight: 48,
  },
  focusedInputContainer: {
    borderColor: "#3B82F6",
    borderWidth: 2,
  },
  disabledInputContainer: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
  },
  errorInputContainer: {
    borderColor: "#EF4444",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    paddingVertical: 12,
  },
  disabledInput: {
    color: "#9CA3AF",
  },
  placeholder: {
    color: "#9CA3AF",
  },
  leftIconContainer: {
    marginRight: 12,
  },
  rightIconContainer: {
    marginLeft: 12,
  },
  errorContainer: {
    marginTop: 4,
  },
  error: {
    fontSize: 14,
    color: "#EF4444",
  },
  helperTextContainer: {
    marginTop: 4,
  },
  helperText: {
    fontSize: 14,
    color: "#6B7280",
  },
  // OTP Styles
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  otpInputContainer: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  otpFocusedInputContainer: {
    borderColor: "#3B82F6",
    borderWidth: 2,
  },
  otpInput: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    width: "100%",
    height: "100%",
  },
  // Split Styles
  splitContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  splitInputContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    minHeight: 48,
    justifyContent: "center",
  },
  splitFocusedInputContainer: {
    borderColor: "#3B82F6",
    borderWidth: 2,
  },
  splitInput: {
    fontSize: 16,
    color: "#111827",
    paddingVertical: 12,
  },
});

CustomTextInput.displayName = "CustomTextInput";

export default CustomTextInput;
