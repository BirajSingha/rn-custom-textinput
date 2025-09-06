# React Native Custom TextInput

A highly customizable TextInput component for React Native that allows you to style every single element with your own custom styles while maintaining all the functionality of the native TextInput.

## 🎯 Features

- ✅ **Fully customizable styling** for every element
- ✅ **Built-in label, error, and helper text** support
- ✅ **Left and right icon** support
- ✅ **Focus and disabled states** with custom styling
- ✅ **OTP input support** with auto-navigation and paste functionality
- ✅ **Split fields** for multi-input forms (First Name/Last Name, Date inputs, etc.)
- ✅ **TypeScript support** with comprehensive type definitions
- ✅ **Ref forwarding** support for accessing TextInput methods
- ✅ **Accessibility** features built-in
- ✅ **Production ready** with extensive validation

## 📦 Installation

```bash
npm install rn-custom-textinput
```

or

```bash
yarn add rn-custom-textinput
```

## 🚀 Quick Start

```typescript
import React, { useState } from 'react';
import { View } from 'react-native';
import CustomTextInput from 'rn-custom-textinput';

const App = () => {
  const [text, setText] = useState('');

  return (
    <View style={{ padding: 20 }}>
      <CustomTextInput
        label="Email Address"
        placeholder="Enter your email"
        value={text}
        onChangeText={setText}
        labelRequired
      />
    </View>
  );
};
```

## 📖 Usage Examples

### Regular Text Input

```typescript
import React, { useState } from 'react';
import { View } from 'react-native';
import CustomTextInput from 'rn-custom-textinput';

const BasicExample = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={{ padding: 20 }}>
      {/* Email Input with Custom Styling */}
      <CustomTextInput
        label="Email Address"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        labelRequired
        keyboardType="email-address"
        error={email && !email.includes('@') ? 'Invalid email' : undefined}
        helperText="We'll never share your email"
        // Custom Styles
        containerStyle={{ marginBottom: 20 }}
        labelStyle={{ color: '#1F2937', fontWeight: '600' }}
        inputContainerStyle={{
          borderRadius: 12,
          backgroundColor: '#F9FAFB',
          borderWidth: 2,
        }}
        focusedInputContainerStyle={{
          borderColor: '#10B981',
          backgroundColor: '#FFFFFF',
        }}
        inputStyle={{ fontSize: 16, fontWeight: '500' }}
      />

      {/* Password Input with Toggle Visibility */}
      <CustomTextInput
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        labelRequired
        helperText="Minimum 8 characters"
        // Custom Styles
        containerStyle={{ marginBottom: 20 }}
        inputContainerStyle={{
          borderRadius: 12,
          backgroundColor: '#FEF7F0',
          borderColor: '#FB923C',
        }}
        focusedInputContainerStyle={{
          borderColor: '#EA580C',
          borderWidth: 2,
        }}
      />

      {/* Multiline Text Area */}
      <CustomTextInput
        label="Comments"
        placeholder="Enter your comments..."
        multiline
        numberOfLines={4}
        helperText="Maximum 500 characters"
        maxLength={500}
        // Custom Styles
        inputContainerStyle={{
          minHeight: 100,
          alignItems: 'flex-start',
          paddingTop: 12,
        }}
        inputStyle={{ textAlignVertical: 'top' }}
      />
    </View>
  );
};
```

### OTP Input

```typescript
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import CustomTextInput from 'rn-custom-textinput';

const OTPExample = () => {
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setOtpError(''); // Clear error when user types
    
    // Auto-submit when OTP is complete
    if (value.length === 6) {
      verifyOtp(value);
    }
  };

  const verifyOtp = (otpValue: string) => {
    // Your OTP verification logic here
    if (otpValue === '123456') {
      Alert.alert('Success', 'OTP verified successfully!');
    } else {
      setOtpError('Invalid OTP. Please try again.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {/* 6-digit OTP */}
      <CustomTextInput
        type="otp"
        label="Enter OTP"
        otpLength={6}
        otpValue={otp}
        onOtpChange={handleOtpChange}
        error={otpError}
        helperText="Enter the 6-digit code sent to your phone"
        // Custom OTP Styling
        otpContainerStyle={{ marginVertical: 20 }}
        otpInputContainerStyle={{
          backgroundColor: '#F9FAFB',
          borderColor: '#E5E7EB',
          borderRadius: 12,
          width: 50,
          height: 60,
        }}
        otpFocusedInputContainerStyle={{
          borderColor: '#10B981',
          backgroundColor: '#ECFDF5',
        }}
        otpInputStyle={{
          fontSize: 20,
          fontWeight: '700',
          color: '#1F2937',
        }}
      />

      {/* 4-digit PIN */}
      <CustomTextInput
        type="otp"
        label="Enter PIN"
        otpLength={4}
        onOtpChange={(value) => console.log('PIN:', value)}
        secureTextEntry
        helperText="Enter your 4-digit PIN"
        // Custom Styling for PIN
        otpInputContainerStyle={{
          width: 60,
          height: 60,
          borderRadius: 30, // Circular inputs
          backgroundColor: '#FEF7F0',
          borderColor: '#FB923C',
        }}
        otpInputStyle={{
          fontSize: 24,
          color: '#EA580C',
        }}
      />

      {/* Custom Length OTP */}
      <CustomTextInput
        type="otp"
        label="Verification Code"
        otpLength={8}
        onOtpChange={(value) => console.log('Code:', value)}
        helperText="Enter the 8-character verification code"
        keyboardType="default" // Allow letters and numbers
      />
    </View>
  );
};
```

### Split Fields

```typescript
import React, { useState } from 'react';
import { View } from 'react-native';
import CustomTextInput from 'rn-custom-textinput';

const SplitFieldsExample = () => {
  const [nameValues, setNameValues] = useState({});
  const [dateValues, setDateValues] = useState({});
  const [addressValues, setAddressValues] = useState({});

  return (
    <View style={{ padding: 20 }}>
      {/* First Name / Last Name */}
      <CustomTextInput
        type="split"
        label="Full Name"
        labelRequired
        splitFields={[
          {
            key: 'firstName',
            placeholder: 'First Name',
            autoCapitalize: 'words'
          },
          {
            key: 'lastName',
            placeholder: 'Last Name',
            autoCapitalize: 'words'
          }
        ]}
        splitValues={nameValues}
        onSplitChange={(values, key, value) => {
          setNameValues(values);
          console.log(`${key} changed to: ${value}`);
        }}
        helperText="Enter your first and last name"
      />

      {/* Date Input (Month/Day/Year) */}
      <CustomTextInput
        type="split"
        label="Date of Birth"
        splitFields={[
          {
            key: 'month',
            placeholder: 'MM',
            maxLength: 2,
            flex: 1,
            keyboardType: 'numeric'
          },
          {
            key: 'day',
            placeholder: 'DD',
            maxLength: 2,
            flex: 1,
            keyboardType: 'numeric'
          },
          {
            key: 'year',
            placeholder: 'YYYY',
            maxLength: 4,
            flex: 2,
            keyboardType: 'numeric'
          }
        ]}
        splitValues={dateValues}
        onSplitChange={setDateValues}
        splitSpacing={8}
        // Custom Split Styling
        splitInputContainerStyle={{
          borderRadius: 6,
          backgroundColor: '#F9FAFB',
        }}
        splitFocusedInputContainerStyle={{
          borderColor: '#10B981',
        }}
      />

      {/* Address Fields */}
      <CustomTextInput
        type="split"
        label="Address"
        splitFields={[
          {
            key: 'city',
            placeholder: 'City',
            flex: 2,
            autoCapitalize: 'words'
          },
          {
            key: 'state',
            placeholder: 'State',
            flex: 1,
            autoCapitalize: 'characters',
            maxLength: 2
          },
          {
            key: 'zip',
            placeholder: 'ZIP',
            flex: 1,
            keyboardType: 'numeric',
            maxLength: 5
          }
        ]}
        splitValues={addressValues}
        onSplitChange={setAddressValues}
        splitSpacing={10}
      />

      {/* Credit Card Expiry */}
      <CustomTextInput
        type="split"
        label="Card Expiry"
        splitFields={[
          {
            key: 'month',
            placeholder: 'MM',
            maxLength: 2,
            keyboardType: 'numeric'
          },
          {
            key: 'year',
            placeholder: 'YY',
            maxLength: 2,
            keyboardType: 'numeric'
          }
        ]}
        onSplitChange={(values) => console.log('Expiry:', values)}
        // Custom styling for card inputs
        splitInputContainerStyle={{
          backgroundColor: '#1F2937',
          borderColor: '#374151',
        }}
        splitInputStyle={{
          color: '#FFFFFF',
          textAlign: 'center',
          fontWeight: '600',
        }}
        splitFocusedInputContainerStyle={{
          borderColor: '#10B981',
        }}
      />
    </View>
  );
};
```

## 📚 API Reference

### Basic Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | string | - | The text input value |
| `onChangeText` | function | - | Callback when text changes |
| `placeholder` | string | - | Placeholder text |
| `placeholderTextColor` | string | - | Placeholder text color |
| `secureTextEntry` | boolean | false | Whether to hide text input |
| `keyboardType` | KeyboardTypeOptions | 'default' | Keyboard type |
| `autoCapitalize` | string | 'none' | Auto capitalization |
| `editable` | boolean | true | Whether input is editable |
| `multiline` | boolean | false | Allow multiple lines |
| `numberOfLines` | number | 1 | Number of lines for multiline |
| `maxLength` | number | - | Maximum text length |

### Content Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | - | Label text above input |
| `labelRequired` | boolean | false | Show required asterisk |
| `error` | string | - | Error message |
| `helperText` | string | - | Helper text below input |
| `leftIcon` | ReactNode | - | Left icon component |
| `rightIcon` | ReactNode | - | Right icon component |
| `onRightIconPress` | function | - | Right icon press handler |

### Input Type Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | 'default' \| 'otp' \| 'split' | 'default' | Input component type |

### OTP Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `otpLength` | number | 6 | Number of OTP input boxes |
| `otpValue` | string | '' | Pre-filled OTP value |
| `onOtpChange` | (otp: string) => void | - | Callback when OTP changes |
| `otpAutoFocus` | boolean | true | Auto focus first OTP input |

### Split Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `splitFields` | SplitField[] | [] | Array of field configurations |
| `splitValues` | SplitFieldValues | {} | Object with field values |
| `onSplitChange` | function | - | Callback when any split field changes |
| `splitSpacing` | number | 12 | Spacing between split inputs |

### SplitField Interface
```typescript
interface SplitField {
  key: string;                    // Unique identifier
  placeholder?: string;           // Placeholder text
  value?: string;                // Initial value
  flex?: number;                 // Flex ratio (default: 1)
  keyboardType?: KeyboardType;   // Keyboard type
  autoCapitalize?: string;       // Auto capitalization
  maxLength?: number;            // Maximum length
  secureTextEntry?: boolean;     // Hide text
  editable?: boolean;           // Enable/disable input
}
```

### Styling Props
| Prop | Type | Description |
|------|------|-------------|
| `containerStyle` | ViewStyle | Main container style |
| `labelContainerStyle` | ViewStyle | Label container style |
| `labelStyle` | TextStyle | Label text style |
| `requiredStyle` | TextStyle | Required asterisk style |
| `inputContainerStyle` | ViewStyle | Input container style |
| `inputStyle` | TextStyle | Input text style |
| `leftIconContainerStyle` | ViewStyle | Left icon container style |
| `rightIconContainerStyle` | ViewStyle | Right icon container style |
| `errorContainerStyle` | ViewStyle | Error container style |
| `errorStyle` | TextStyle | Error text style |
| `helperTextContainerStyle` | ViewStyle | Helper text container style |
| `helperTextStyle` | TextStyle | Helper text style |
| `focusedInputContainerStyle` | ViewStyle | Focused state input container style |
| `focusedInputStyle` | TextStyle | Focused state input style |
| `disabledInputContainerStyle` | ViewStyle | Disabled state container style |
| `disabledInputStyle` | TextStyle | Disabled state input style |

### OTP Styling Props
| Prop | Type | Description |
|------|------|-------------|
| `otpContainerStyle` | ViewStyle | OTP container wrapper style |
| `otpInputContainerStyle` | ViewStyle | Individual OTP input container style |
| `otpInputStyle` | TextStyle | Individual OTP input text style |
| `otpFocusedInputContainerStyle` | ViewStyle | Focused OTP input container style |
| `otpFocusedInputStyle` | TextStyle | Focused OTP input text style |

### Split Styling Props
| Prop | Type | Description |
|------|------|-------------|
| `splitContainerStyle` | ViewStyle | Split container wrapper style |
| `splitInputContainerStyle` | ViewStyle | Individual split input container style |
| `splitInputStyle` | TextStyle | Individual split input text style |
| `splitFocusedInputContainerStyle` | ViewStyle | Focused split input container style |
| `splitFocusedInputStyle` | TextStyle | Focused split input text style |

## ⚡ Advanced Features

### OTP Features

#### Auto Navigation
- Automatically moves to the next input box when a digit is entered
- Moves back to the previous input box on backspace when current box is empty
- Smart focus management for seamless user experience

#### Paste Support
- **Smart Paste Distribution**: Automatically distributes pasted content across OTP boxes
- **Text Cleaning**: Removes spaces and handles various paste formats
- **Auto Focus Management**: Focuses the next empty box or completion state after paste

```javascript
// Users can paste OTP in any of these formats:
// "123456" -> fills boxes: [1][2][3][4][5][6]
// "1 2 3 4 5 6" -> automatically removes spaces: [1][2][3][4][5][6]
// "12 34 56" -> fills sequentially: [1][2][3][4][5][6]
```

#### Customizable Length
- Support for any OTP length (1-20 characters)
- Each input box is individually styled and managed

### Split Fields Features

#### Flexible Layout
- **Custom Flex Ratios**: Each field can have different widths using the `flex` property
- **Responsive Spacing**: Configurable spacing between fields
- **Uniform Styling**: Consistent styling across all split fields

#### Individual Field Configuration
- **Unique Properties**: Each field can have its own keyboard type, placeholder, validation
- **Independent State**: Each field maintains its own focus and validation state
- **Custom Behavior**: Different autoCapitalize, maxLength, and input types per field

#### Common Use Cases
- **Name Fields**: First Name / Last Name
- **Date Inputs**: Month / Day / Year or MM / YY
- **Address Forms**: City / State / ZIP
- **Phone Numbers**: Area Code / Exchange / Number
- **Credit Cards**: Number / Expiry / CVV

## 🔧 Ref Support

You can access the underlying TextInput ref for regular inputs:

```typescript
import React, { useRef } from 'react';
import CustomTextInput from 'rn-custom-textinput';

const App = () => {
  const inputRef = useRef<TextInput>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <CustomTextInput
      ref={inputRef}
      label="Email"
      placeholder="Enter email"
      // ... other props
    />
  );
};
```

## 🎨 Theming

### Custom Theme Example

```typescript
import React from 'react';
import { View } from 'react-native';
import CustomTextInput from 'rn-custom-textinput';

const DarkThemeExample = () => {
  const darkTheme = {
    containerStyle: { marginBottom: 20 },
    labelStyle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
    inputContainerStyle: {
      backgroundColor: '#1F2937',
      borderColor: '#374151',
      borderRadius: 8,
    },
    inputStyle: { color: '#FFFFFF', fontSize: 16 },
    focusedInputContainerStyle: {
      borderColor: '#10B981',
      borderWidth: 2,
    },
    errorStyle: { color: '#F87171' },
    helperTextStyle: { color: '#9CA3AF' },
  };

  return (
    <View style={{ backgroundColor: '#111827', padding: 20, flex: 1 }}>
      <CustomTextInput
        label="Dark Theme Input"
        placeholder="Enter text..."
        helperText="This input uses a dark theme"
        {...darkTheme}
      />
    </View>
  );
};
```

## 🧪 Form Validation Example

```typescript
import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import CustomTextInput from 'rn-custom-textinput';

const FormValidationExample = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: '',
    name: {},
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    }
    
    if (!formData.name.firstName) {
      newErrors.name = 'First name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert('Success', 'Form submitted successfully!');
      console.log('Form Data:', formData);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <CustomTextInput
        label="Email Address"
        value={formData.email}
        onChangeText={(email) => {
          setFormData(prev => ({ ...prev, email }));
          if (errors.email) {
            setErrors(prev => ({ ...prev, email: '' }));
          }
        }}
        keyboardType="email-address"
        error={errors.email}
        labelRequired
        containerStyle={{ marginBottom: 20 }}
      />

      <CustomTextInput
        label="Password"
        value={formData.password}
        onChangeText={(password) => {
          setFormData(prev => ({ ...prev, password }));
          if (errors.password) {
            setErrors(prev => ({ ...prev, password: '' }));
          }
        }}
        secureTextEntry
        error={errors.password}
        helperText="Minimum 8 characters"
        labelRequired
        containerStyle={{ marginBottom: 20 }}
      />

      <CustomTextInput
        type="otp"
        label="Verification Code"
        onOtpChange={(otp) => {
          setFormData(prev => ({ ...prev, otp }));
          if (errors.otp) {
            setErrors(prev => ({ ...prev, otp: '' }));
          }
        }}
        error={errors.otp}
        labelRequired
        containerStyle={{ marginBottom: 20 }}
      />

      <CustomTextInput
        type="split"
        label="Full Name"
        splitFields={[
          { key: 'firstName', placeholder: 'First Name', autoCapitalize: 'words' },
          { key: 'lastName', placeholder: 'Last Name', autoCapitalize: 'words' }
        ]}
        splitValues={formData.name}
        onSplitChange={(name) => {
          setFormData(prev => ({ ...prev, name }));
          if (errors.name) {
            setErrors(prev => ({ ...prev, name: '' }));
          }
        }}
        error={errors.name}
        labelRequired
        containerStyle={{ marginBottom: 30 }}
      />

      <Button title="Submit Form" onPress={handleSubmit} />
    </View>
  );
};
```

## 🔒 TypeScript Support

This package is built with TypeScript and provides comprehensive type definitions:

```typescript
import CustomTextInput, { 
  CustomTextInputProps, 
  InputType, 
  SplitField, 
  SplitFieldValues 
} from 'rn-custom-textinput';

// All props are fully typed
const MyComponent: React.FC = () => {
  const [values, setValues] = useState<SplitFieldValues>({});
  
  const splitFields: SplitField[] = [
    { 
      key: 'email', 
      placeholder: 'Email', 
      keyboardType: 'email-address' 
    }
  ];

  return (
    <CustomTextInput
      type="split"
      splitFields={splitFields}
      splitValues={values}
      onSplitChange={setValues}
    />
  );
};
```

## 📱 Platform Support

- ✅ **iOS** - Full support with platform-specific optimizations
- ✅ **Android** - Full support with platform-specific optimizations
- ✅ **Expo** - Compatible with Expo managed workflow
- ✅ **React Native CLI** - Works with standard React Native projects

## 📋 Requirements

- React Native >= 0.60.0
- React >= 16.8.0
- TypeScript >= 4.0.0 (for TypeScript projects)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/BirajSingha/rn-custom-textinput.git
cd rn-custom-textinput

# Install dependencies
npm install

# Run TypeScript compiler
npm run build

# Run type checking
npm run typecheck
```

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with React Native and TypeScript
- Inspired by the need for highly customizable form inputs
- Thanks to the React Native community for feedback and contributions

## 📞 Support

- 📚 [Documentation](https://github.com/BirajSingha/rn-custom-textinput#readme)
- 🐛 [Issue Tracker](https://github.com/BirajSingha/rn-custom-textinput/issues)
- 💬 [Discussions](https://github.com/BirajSingha/rn-custom-textinput/discussions)

---

Made with ❤️ for the React Native community