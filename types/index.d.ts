import { ComponentType } from 'react';
import { TextInput } from 'react-native';
import { CustomTextInputProps } from '../src/CustomTextInput';

declare module 'react-native-custom-textinput' {
  const CustomTextInput: ComponentType<CustomTextInputProps> & {
    displayName?: string;
  };
  
  export default CustomTextInput;
  export { CustomTextInput };
  export type { CustomTextInputProps, InputType } from '../src/CustomTextInput';
}

// Augment TextInput ref type for better IntelliSense
declare global {
  namespace ReactNative {
    interface TextInputStatic {
      prototype: TextInput;
    }
  }
}