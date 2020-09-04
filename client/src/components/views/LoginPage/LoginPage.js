import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_action/user_action";
import axios from "axios";
import SocialLogin from "./SocialLogin";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="/">
        My Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function LoginPage(props) {
  const classes = useStyles();

  const rememberMeChecked = localStorage.getItem("rememberme") ? true : false;

  const dispatch = useDispatch();

  const [Email, setEmail] = useState(
    rememberMeChecked ? localStorage.getItem("rememberme") : ""
  );
  const [Password, setPassword] = useState("");
  const [RememberMe, setRememberMe] = useState(rememberMeChecked);

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    let body = {
      email: Email,
      password: Password,
    };

    dispatch(loginUser(body)).then((response) => {
      if (response.payload.loginSuccess) {
        if (RememberMe === true) {
          window.localStorage.setItem("rememberme", response.payload.email);
        } else {
          localStorage.removeItem("rememberme");
        }
        props.history.push("/");
      } else {
        alert("Fail");
      }
    });
  };
  const responseKaKao = (response) => {
    const data = response;
    axios
      .post("http://localhost:5000/api/users/kakaologin", data, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.loginSuccess) {
          localStorage.setItem("userId", response.data.userId);
          props.history.push("/");
        } else {
          alert("로그인 실패");
        }
      });
  };
  const onRememberMeHandler = () => {
    // console.log(123);
    setRememberMe(!RememberMe);
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar> */}
        <Typography component="h1" variant="h5">
          로그인
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            value={Email}
            onChange={onEmailHandler}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            value={Password}
            onChange={onPasswordHandler}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            onChange={onRememberMeHandler}
            control={
              <Checkbox value="remember" color="primary" checked={RememberMe} />
            }
            label="Remember me"
          />
          <Button
            onClick={onSubmitHandler}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <SocialLogin responseKaKao={responseKaKao} />
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
