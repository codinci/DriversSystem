import { useState, useEffect, useRef } from "react";
// import axios from "../api/axios";
// import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useInput from "../hooks/useInput";
import useToggle from "../hooks/useToggle";

import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApiSlice";


const Login = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, resetUser, userAttributes] = useInput("user", "");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [check, toggleCheck] = useToggle("persist", false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await login({ user, pwd }).unwrap();
      dispatch(setCredentials({ ...response, user }));

      // console.log(JSON.stringify(response?.accessToken));
      // const accessToken = response?.accessToken;
      // console.log(accessToken);
      // setAuth({ user, accessToken });
      // setUser("");
      resetUser();
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      if (!err?.status) {
        setErrMsg("No response from the server");
      } else if (err?.status === 400) {
        setErrMsg("Missing username or password");
      } else if (err?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login has failed");
      }
      errRef.current.focus();
    }
  };

  // const togglePersist = () => {
  //   setPersist((prev) => !prev);
  // };

  // useEffect(() => {
  //   localStorage.setItem("persist", persist);
  // }, [persist]);

  const content = isLoading ? (
    <h1>Loading ...</h1>
  ) : (
    <section>
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          {...userAttributes}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
        />
        <button>Sign In</button>
        <div className="persistCheck">
          <input
            type="checkbox"
            id="persist"
            onChange={toggleCheck}
            checked={check}
          />
          <label htmlFor="persist">Trust this device</label>
        </div>
        <p>
          Need an account?
          <br />
          <span className="line">
            {/* Enter registration router link here */}
            <Link to="/register">Sign Up</Link>
          </span>
        </p>
      </form>
    </section>
  );
  return content;
};

export default Login;
