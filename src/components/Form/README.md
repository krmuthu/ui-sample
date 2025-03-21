# Form Components

## Overview

The Form components provide a comprehensive set of accessible, composable elements for building forms in React applications. These components handle form layout, validation, error states, and accessibility to create intuitive and user-friendly forms.

## Installation

```bash
npm install clipper-ui
# or
yarn add clipper-ui
```

## Import

```jsx
import { 
  Form, 
  FormControl, 
  FormLabel, 
  FormErrorMessage, 
  FormHelperText,
  TextField,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Switch
} from 'clipper-ui';
```

## Components

### Form

The container component that provides context for form elements.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSubmit` | `(event: React.FormEvent) => void` | - | Handler called when the form is submitted |
| `onChange` | `(event: React.ChangeEvent) => void` | - | Handler called when any form field changes |
| `children` | `ReactNode` | - | Form content |
| `className` | `string` | - | Additional CSS classes |
| `id` | `string` | - | HTML ID attribute |
| `noValidate` | `boolean` | `false` | If true, disables browser default validation |
| `autoComplete` | `string` | - | Controls browser autocomplete behavior |

### FormControl

A wrapper for form elements that provides context for validation and accessibility.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | ID for the form control |
| `isRequired` | `boolean` | `false` | If true, form control is marked as required |
| `isInvalid` | `boolean` | `false` | If true, form control is marked as invalid |
| `isDisabled` | `boolean` | `false` | If true, form control is disabled |
| `isReadOnly` | `boolean` | `false` | If true, form control is read-only |
| `children` | `ReactNode` | - | Form control content |
| `className` | `string` | - | Additional CSS classes |

### FormLabel

A label for form elements with automatic association to form controls.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `htmlFor` | `string` | - | ID of the form element the label is for |
| `children` | `ReactNode` | - | Label content |
| `className` | `string` | - | Additional CSS classes |
| `required` | `boolean` | `false` | If true, adds a visual required indicator |
| `optionalText` | `string` | `'(optional)'` | Text to show when field is optional |
| `showOptionalIndicator` | `boolean` | `false` | Whether to show optional indicator for non-required fields |

### FormErrorMessage

Displays error message when the form control is invalid.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Error message content |
| `className` | `string` | - | Additional CSS classes |
| `id` | `string` | - | HTML ID attribute |

### FormHelperText

Displays additional guidance about the form field.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Helper text content |
| `className` | `string` | - | Additional CSS classes |
| `id` | `string` | - | HTML ID attribute |

## Form Validation

The Form components support several validation approaches:

### 1. HTML5 Validation

```jsx
<Form>
  <FormControl>
    <FormLabel htmlFor="email">Email</FormLabel>
    <TextField
      id="email"
      type="email"
      required
      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
    />
    <FormHelperText>We'll never share your email.</FormHelperText>
  </FormControl>
</Form>
```

### 2. Controlled Validation

```jsx
function ControlledValidationExample() {
  const [email, setEmail] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const validateEmail = (value) => {
    if (!value) {
      setIsInvalid(true);
      setErrorMessage('Email is required');
      return false;
    }
    
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(value)) {
      setIsInvalid(true);
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    
    setIsInvalid(false);
    setErrorMessage('');
    return true;
  };
  
  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };
  
  return (
    <Form>
      <FormControl isInvalid={isInvalid}>
        <FormLabel htmlFor="email">Email</FormLabel>
        <TextField
          id="email"
          type="email"
          value={email}
          onChange={handleChange}
          onBlur={() => validateEmail(email)}
        />
        {isInvalid && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
        <FormHelperText>We'll never share your email.</FormHelperText>
      </FormControl>
    </Form>
  );
}
```

### 3. Form Library Integration

The Form components are designed to work seamlessly with form libraries like Formik, React Hook Form, or Yup.

#### React Hook Form Example

```jsx
import { useForm } from 'react-hook-form';

function ReactHookFormExample() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();
  
  const onSubmit = (data) => {
    console.log(data);
  };
  
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.email}>
        <FormLabel htmlFor="email">Email</FormLabel>
        <TextField
          id="email"
          {...register('email', { 
            required: 'Email is required', 
            pattern: {
              value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
              message: 'Please enter a valid email address'
            }
          })}
        />
        {errors.email && (
          <FormErrorMessage>{errors.email.message}</FormErrorMessage>
        )}
      </FormControl>
      
      <Button type="submit" mt={4}>Submit</Button>
    </Form>
  );
}
```

#### Formik Example

```jsx
import { Formik, Form as FormikForm, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
});

function FormikExample() {
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ errors, touched }) => (
        <FormikForm>
          <FormControl isInvalid={errors.email && touched.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Field as={TextField} id="email" name="email" />
            {errors.email && touched.email && (
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            )}
          </FormControl>
          
          <FormControl isInvalid={errors.password && touched.password} mt={4}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Field as={TextField} id="password" name="password" type="password" />
            {errors.password && touched.password && (
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            )}
          </FormControl>
          
          <Button type="submit" mt={4}>Submit</Button>
        </FormikForm>
      )}
    </Formik>
  );
}
```

## Accessibility Features

The Form components implement best practices for form accessibility:

### ARIA Attributes

- Form controls use appropriate ARIA attributes like `aria-invalid`, `aria-describedby`, and `aria-required`
- Error messages are linked to form controls via `aria-describedby`
- Required fields are properly identified with `aria-required="true"`
- Disabled fields use `aria-disabled="true"`

### Keyboard Navigation

- All form controls are fully keyboard navigable
- Focus states are clearly visible
- Logical tab order is maintained
- Form submission can be triggered with Enter key

### Screen Reader Support

- Form labels are properly associated with inputs
- Error messages are announced to screen readers
- Helper text provides additional context for screen reader users
- Required and optional states are announced appropriately

### Color and Contrast

- Error states use both color and text to indicate errors (not just color)
- All elements maintain sufficient color contrast ratios
- Focus states are clearly visible
- Validation states are visually distinguishable

## Examples

### Basic Form Layout

```jsx
<Form onSubmit={handleSubmit}>
  <FormControl>
    <FormLabel htmlFor="name">Name</FormLabel>
    <TextField id="name" />
  </FormControl>
  
  <FormControl mt={4}>
    <FormLabel htmlFor="email">Email</FormLabel>
    <TextField id="email" type="email" />
    <FormHelperText>We'll never share your email.</FormHelperText>
  </FormControl>
  
  <FormControl mt={4}>
    <FormLabel htmlFor="message">Message</FormLabel>
    <Textarea id="message" />
  </FormControl>
  
  <Button type="submit" mt={6}>Submit</Button>
</Form>
```

### Form with Validation

```jsx
<Form onSubmit={handleSubmit}>
  <FormControl isRequired isInvalid={!!errors.name}>
    <FormLabel htmlFor="name">Name</FormLabel>
    <TextField 
      id="name" 
      value={name} 
      onChange={handleNameChange} 
    />
    {errors.name && (
      <FormErrorMessage>{errors.name}</FormErrorMessage>
    )}
  </FormControl>
  
  <FormControl mt={4} isRequired isInvalid={!!errors.email}>
    <FormLabel htmlFor="email">Email</FormLabel>
    <TextField 
      id="email" 
      type="email" 
      value={email} 
      onChange={handleEmailChange} 
    />
    {errors.email && (
      <FormErrorMessage>{errors.email}</FormErrorMessage>
    )}
    <FormHelperText>We'll never share your email.</FormHelperText>
  </FormControl>
  
  <Button type="submit" mt={6}>Submit</Button>
</Form>
```

### Complex Form

```jsx
<Form onSubmit={handleSubmit}>
  <Grid columns={2} gap={6}>
    <FormControl isRequired>
      <FormLabel htmlFor="firstName">First Name</FormLabel>
      <TextField id="firstName" />
    </FormControl>
    
    <FormControl>
      <FormLabel htmlFor="lastName">Last Name</FormLabel>
      <TextField id="lastName" />
    </FormControl>
  </Grid>
  
  <FormControl mt={4} isRequired>
    <FormLabel htmlFor="email">Email</FormLabel>
    <TextField id="email" type="email" />
  </FormControl>
  
  <FormControl mt={4}>
    <FormLabel htmlFor="phone">Phone</FormLabel>
    <TextField id="phone" type="tel" />
  </FormControl>
  
  <FormControl mt={4}>
    <FormLabel htmlFor="country">Country</FormLabel>
    <Select id="country">
      <option value="us">United States</option>
      <option value="ca">Canada</option>
      <option value="uk">United Kingdom</option>
      <option value="au">Australia</option>
    </Select>
  </FormControl>
  
  <FormControl mt={4}>
    <FormLabel>Interests</FormLabel>
    <CheckboxGroup>
      <Checkbox value="design">Design</Checkbox>
      <Checkbox value="development">Development</Checkbox>
      <Checkbox value="marketing">Marketing</Checkbox>
      <Checkbox value="business">Business</Checkbox>
    </CheckboxGroup>
  </FormControl>
  
  <FormControl mt={4}>
    <FormLabel>How did you hear about us?</FormLabel>
    <RadioGroup>
      <Radio value="search">Search Engine</Radio>
      <Radio value="social">Social Media</Radio>
      <Radio value="friend">Friend</Radio>
      <Radio value="other">Other</Radio>
    </RadioGroup>
  </FormControl>
  
  <FormControl mt={4}>
    <FormLabel htmlFor="message">Message</FormLabel>
    <Textarea id="message" />
  </FormControl>
  
  <FormControl mt={4}>
    <Checkbox>Subscribe to newsletter</Checkbox>
  </FormControl>
  
  <Button type="submit" mt={6}>Submit</Button>
</Form>
```

### Form with Accessibility Features

```jsx
<Form
  onSubmit={handleSubmit}
  aria-labelledby="form-title"
  noValidate
>
  <h2 id="form-title">Contact Us</h2>
  <p id="form-description">
    Please fill out this form to get in touch with our team.
    Required fields are marked with an asterisk (*).
  </p>
  
  <FormControl 
    isRequired 
    isInvalid={!!errors.name}
    aria-describedby="name-error name-hint"
  >
    <FormLabel htmlFor="name">Name</FormLabel>
    <TextField 
      id="name" 
      value={name} 
      onChange={handleNameChange}
      aria-required="true"
      aria-invalid={!!errors.name}
    />
    {errors.name && (
      <FormErrorMessage id="name-error">{errors.name}</FormErrorMessage>
    )}
    <FormHelperText id="name-hint">
      Enter your full name as it appears on official documents.
    </FormHelperText>
  </FormControl>
  
  <FormControl 
    mt={4} 
    isRequired 
    isInvalid={!!errors.email}
    aria-describedby="email-error email-hint"
  >
    <FormLabel htmlFor="email">Email</FormLabel>
    <TextField 
      id="email" 
      type="email" 
      value={email} 
      onChange={handleEmailChange}
      aria-required="true"
      aria-invalid={!!errors.email}
    />
    {errors.email && (
      <FormErrorMessage id="email-error">{errors.email}</FormErrorMessage>
    )}
    <FormHelperText id="email-hint">
      We'll use this to respond to your inquiry.
    </FormHelperText>
  </FormControl>
  
  <Button type="submit" mt={6}>Submit</Button>
</Form>
```

## Best Practices

### Form Design

- Group related fields together logically
- Use clear, concise labels for all form controls
- Place labels above form controls for better readability
- Use one column for mobile, consider two columns for desktop
- Keep forms as short as possible
- Use fieldsets to group related form controls
- Use legends to label fieldsets

### Validation

- Validate on blur for a better user experience
- Show error messages inline, near the relevant field
- Use clear, actionable error messages
- Validate the entire form on submission
- Provide both client-side and server-side validation
- Preserve user input when validation fails

### Accessibility

- Always use form labels (not placeholders as substitutes)
- Use proper markup for required fields
- Ensure keyboard navigability with a logical tab order
- Make error states perceivable by all users
- Test forms with screen readers and keyboard navigation
- Provide contextual help text where needed
- Maintain appropriate color contrast
- Support autofill where appropriate

### Internationalization

- Support right-to-left languages
- Use localized validation messages
- Support different date and number formats
- Allow for text expansion in translated content

## Related Components

- **TextField**: Text input component
- **Textarea**: Multiline text input component
- **Select**: Dropdown select component
- **Checkbox**: Single checkbox component
- **CheckboxGroup**: Group of related checkboxes
- **Radio**: Single radio button component
- **RadioGroup**: Group of related radio buttons
- **Switch**: Toggle switch component
- **DatePicker**: Date selection component
- **TimePicker**: Time selection component
- **FileUpload**: File input component 