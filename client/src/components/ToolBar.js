import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const ToolBar = () => {
  const [me, setMe] = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await axios.patch("/users/logout");
      setMe();
      toast.success("Log Out!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <>
      <Link to="/">Home</Link>
      {me ? (
        <span onClick={logoutHandler} style={{ float: "right" }}>
          Logout ({me.name})
        </span>
      ) : (
        <>
          <Link to="/auth/login" style={{ float: "right" }}>
            Login
          </Link>
          <Link to="/auth/register" style={{ float: "right", marginRight: 10 }}>
            SignUp
          </Link>
        </>
      )}
    </>
  );
};

export default ToolBar;
