import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../../api/modules/user.api";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";


import YupPassword from 'yup-password';
YupPassword(Yup);


const SignupForm = ({ switchAuthState }) => {
  const dispatch = useDispatch();

  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const signinForm = useFormik({
    initialValues: {
      password: "",
      email: "",
      displayName: "",
      confirmPassword: ""
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address.").matches(/[a-zA-Z0-9]{3,}[@]{1}[a-zA-Z]{3,}[.]{1}[.a-zA-Z]{3,}$/,"Invalid email address."),
      password: Yup.string()
        .minLowercase(1, 'password must contain at least 1 lower case letter')
        .minUppercase(1, 'password must contain at least 1 upper case letter')
        .minNumbers(1, 'password must contain at least 1 number')
        .minSymbols(1, 'password must contain at least 1 special character')
        .min(8, "password requeried minimum 8 characters")
        .required("password is required"),
      displayName: Yup.string()
        .min(8, "displayName minimum 8 characters")
        .required("displayName is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "confirmPassword not match")
        .min(8, "confirmPassword minimum 8 characters")
        .required("confirmPassword is required")
    }),
    onSubmit: async values => {
      setErrorMessage(undefined);
      setIsLoginRequest(true);
      const { response, err } = await userApi.signup(values);
      setIsLoginRequest(false);

      if (response) {
        signinForm.resetForm();
        // localStorage.setItem("user",response.)
        dispatch(setAuthModalOpen({payload: true}));
        toast.success("Sign up success");
        toast.success("mail sendes for activate your account");
      }

      if (err) setErrorMessage(err.message);
    }
  });

  return (
    <Box component="form" onSubmit={signinForm.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          type="text"
          placeholder="email"
          name="email"
          fullWidth
          value={signinForm.values.email}
          onChange={signinForm.handleChange}
          onBlur = {signinForm.handleBlur}
          color="success"
          error={(signinForm.touched.email || signinForm.values.email) && signinForm.errors.email !== undefined}
          helperText={(signinForm.touched.email || signinForm.values.email) && signinForm.errors.email}
          // className = {signinForm.errors.username && signinForm.touched.username ? "input-error" : ""}
        />
        <TextField
          type="text"
          placeholder="display name"
          name="displayName"
          fullWidth
          value={signinForm.values.displayName}
          onChange={signinForm.handleChange}
          onBlur = {signinForm.handleBlur}
          color="success"
          error={(signinForm.touched.displayName || signinForm.values.displayName) && signinForm.errors.displayName !== undefined}
          helperText={(signinForm.touched.displayName || signinForm.values.displayName) && signinForm.errors.displayName}
        />
        <TextField
          type="password"
          placeholder="password"
          name="password"
          fullWidth
          value={signinForm.values.password}
          onChange={signinForm.handleChange}
          onBlur = {signinForm.handleBlur}
          color="success"
          error={(signinForm.values.password || signinForm.touched.password) && signinForm.errors.password !== undefined}
          helperText={(signinForm.values.password || signinForm.touched.password) && signinForm.errors.password}
        />
        <TextField
          type="password"
          placeholder="confirm password"
          name="confirmPassword"
          fullWidth
          value={signinForm.values.confirmPassword}
          onChange={signinForm.handleChange}
          onBlur = {signinForm.handleBlur}
          color="success"
          error={(signinForm.values.confirmPassword || signinForm.touched.confirmPassword) && signinForm.errors.confirmPassword !== undefined}
          helperText={(signinForm.values.confirmPassword || signinForm.touched.confirmPassword) && signinForm.errors.confirmPassword}
        />
      </Stack>

      <LoadingButton
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        sx={{ marginTop: 4 }}
        loading={isLoginRequest}
      >
        sign up
      </LoadingButton>

      <Button
        fullWidth
        sx={{ marginTop: 1 }}
        onClick={() => switchAuthState()}
      >
        sign in
      </Button>

      {errorMessage && (
        <Box sx={{ marginTop: 2 }}>
          <Alert severity="error" variant="outlined" >{errorMessage}</Alert>
        </Box>
      )}
    </Box>
  );
};

export default SignupForm;