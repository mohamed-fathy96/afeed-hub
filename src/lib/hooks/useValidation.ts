import * as Yup from "yup";

// export interface ValidationHooksProps {
//   validations: any;
// }

export const useValidations = () => {
  const validations = {
    email: Yup.string()
      .email("Please use a valid email")
      .required("Please use a valid email"),
    number: Yup.string()
      .required("Number is required")
      .matches(/^[0-9]*$/, "Must be a valid number"),
    name: Yup.string()
      .trim()
      .required("Please fill this field as it is required"),
    country: Yup.string().required("Please fill this field as it is required"),
    area: Yup.number().required(),
    // .of(
    //   Yup.object().shape({
    //     value: Yup.number().required(),
    //   })
    // )
    postalcode: Yup.string().required(
      "Please fill this field as it is required"
    ),
    address: Yup.string().required("Please fill this field as it is required"),
    phone: Yup.string()
      .required("Please fill this field as it is required")
      .matches(/^[0-9]*$/, "Phone number should contain only numbers")

      .min(6, "Phone number should be more than 6 characters"),
    date: Yup.string().required("Please fill this field as it is required"),
    gender: Yup.boolean().required("Selecting the gender field is required"),
    file: Yup.mixed().required("Please fill this field as it is required"),
    notrequired: Yup.string(),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number"
      )
      .required("Password is required"),

    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref("password" || "newPassword")], "Passwords must match")
      .required("Please enter your password again"),

    limitNumber: Yup.number()
      .required("Limit number is required.")
      .positive("number must be positive.")
      .integer("number must be an integer."),
    vatCR: Yup.string().matches(
      /^[0-9]{1,15}$/,
      "Must be a number with a maximum of 15 digits."
    ),
    commercialRecord: Yup.string().matches(
      /^[0-9]{1,10}$/,
      "Must be a number with a maximum of 10 digits."
    ),
    bankAccountNumber: Yup.string()
      .matches(
        /^(SA){1}[0-9]{2}[a-zA-Z0-9]{1,29}$/,
        'Bank account number must start with "SA" followed by 2 digits and contain up to 29 alphanumeric characters after that.'
      )
      .required("This field is required."),
  };
  return { validations };
};
