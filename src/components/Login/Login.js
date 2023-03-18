import React, { useContext, useEffect, useReducer, useState } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../store/auth-context";

const ReducerActionType = {
  USER_INPUT: "USER_INPUT",
  INPUT_BLUR: "INPUT_BLUR",
};

const emailReducer = (state, action) => {
  switch (action.type) {
    case ReducerActionType.USER_INPUT:
      return { value: action.val, isValid: action.val.includes("@") };
    case ReducerActionType.INPUT_BLUR:
      return { value: state.value, isValid: state.isValid };
    default:
      return { value: "", isValid: false };
  }
};

const passwordReducer = (state, action) => {
  switch (action.type) {
    case ReducerActionType.USER_INPUT:
      return { value: action.val, isValid: action.val.trim().length > 6 };
    case ReducerActionType.INPUT_BLUR:
      return { value: state.value, isValid: state.isValid };
    default:
      return { value: "", isValid: false };
  }
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const ctx = useContext(AuthContext)
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  useEffect(() => {
    console.log("Effect running");
    return () => {
      console.log("Effect cleanup");
    };
  }, []);

  const { isValid: isEmailValid } = emailState;
  const { isValid: isPasswordValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(isEmailValid && isPasswordValid);
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [isEmailValid, isPasswordValid]); // we can use object element in dependencies like [emailState.isValid, password.isValid]

  const emailChangeHandler = (event) => {
    dispatchEmail({
      type: ReducerActionType.USER_INPUT,
      val: event.target.value,
    });
    setFormIsValid(
      event.target.value.includes("@") && passwordState.value.trim().length > 6
    );
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({
      type: ReducerActionType.USER_INPUT,
      val: event.target.value,
    });
    setFormIsValid(
      event.target.value.trim().length > 6 && emailState.value.includes("@")
    );
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: ReducerActionType.INPUT_BLUR });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: ReducerActionType.INPUT_BLUR });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    ctx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            isPasswordValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
