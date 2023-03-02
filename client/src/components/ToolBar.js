import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const ToolBar = () => {
  const [me, setMe] = useContext(AuthContext);

  const logoutHandler = async () => {
    try {
      await axios.patch(
        "/users/logout",
        {},
        { headers: { sessionid: me.sessionId } }
      );
      setMe();
      toast.success("Log Out!");
    } catch (err) {
      toast.error(err.message);
    }
  };
  return (
    <div>
      <Link to="/">
        <span>Home</span>
      </Link>
      {me ? (
        <span onClick={logoutHandler} style={{ float: "right" }}>
          {" "}
          LogOut
        </span>
      ) : (
        <>
          <Link to="/auth/login">
            <span style={{ float: "right" }}>Login</span>
          </Link>
          <Link to="/auth/register">
            <span style={{ float: "right", marginRight: 15 }}>SignIn</span>
          </Link>
        </>
      )}
    </div>
  );
};

export default ToolBar;
