import React, { useState, useContext } from "react";
import CustomInput from "../components/CustomInput";
import { toast } from "react-toastify";
import axios, { Axios } from "axios";
import { AuthContext } from "../context/AuthContext";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [me, setMe] = useContext(AuthContext);

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      if (username.length < 3)
        throw new Error(
          "Username is too short. Please make longer than 3 characters"
        );
      if (password.length < 6)
        throw new Error(
          "Password is too short. Please make longer than 6 characters"
        );
      if (password != passwordCheck)
        throw new Error("Password is different from confirmation.");
      const result = await axios.post("/users/register", {
        name,
        username,
        password,
      });
      setMe({
        userId: result.data.userId,
        sessionId: result.data.sessionId,
        name: result.data.name,
      });
      toast.success("Success");
    } catch (err) {
      toast.error(err.message);
    }
  };
  return (
    <div
      style={{
        marginTop: 100,
        maxWidth: 350,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h3>Register</h3>
      <form onSubmit={submitHandler}>
        <CustomInput label="Name" value={name} setValue={setName} />
        <CustomInput label="Username" value={username} setValue={setUsername} />
        <CustomInput
          label="Password"
          value={password}
          setValue={setPassword}
          type="password"
        />
        <CustomInput
          label="Confirm Password"
          value={passwordCheck}
          setValue={setPasswordCheck}
          type="password"
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
