import React, { useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import openEyeSvg from "../utils/open-eye-svg.svg";
import closeEyeSvg from "../utils/close-eye-svg.svg";
import api from "../api";

function Signup() {
  console.log("signup");
  const [inputType, setInputType] = useState(true);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const handleName = (event) => {
    setName(event.target.value);
  };

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleMail = (event) => {
    setMail(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleClick = async (event) => {
    event.preventDefault();
    if (name === "" || username === "" || mail === "" || password === "") {
      setMail("");
      setName("");
      setPassword("");
      setUsername("");
      toast.warning("All fields are mandatory");
    } else {
      try {
        const response = await api.post("/gambit/signup/", {
          name: name,
          username: username,
          email: mail,
          password: password,
        });
        if (response) {
          navigate("/signin");
          toast.success("User created successfully, Now SignIn please!");
        }
      } catch (err) {
        toast.error(err.response.data.error);
        console.error("Error :", err.response.data);
      }
    }
  };

  return (
    <div className="bg-custom-bg flex flex-col justify-center items-center h-screen w-screen bg-cover bg-no-repeat">
      <div className="flex flex-col items-center p-10 space-y-4 rounded-md border-2 shadow-lg text-white bg-tranparent bg-black bg-opacity-85">
        <div className="text-3xl font-bold">SignUp</div>
        <div>
          <div>Name</div>
          <input
            className="border-2 text-black border-white bg-gray-200 w-72 h-8 px-1 focus:bg-gray-100 transition"
            type="text"
            value={name}
            onChange={handleName}
          />
        </div>
        <div>
          <div>Username</div>
          <input
            className="border-2 text-black border-white bg-gray-200 w-72 h-8 px-1 focus:bg-gray-100 transition"
            type="text"
            value={username}
            onChange={handleUsername}
          />
        </div>
        <div>
          <div>Email</div>
          <input
            className="border-2 text-black border-white bg-gray-200 w-72 h-8 px-1 focus:bg-gray-100 transition"
            type="text"
            value={mail}
            onChange={handleMail}
          />
        </div>
        <div>
          <div>Password</div>
          <div className="relative flex items-center">
            <input
              type={inputType ? "password" : "text"}
              value={password}
              onChange={handlePassword}
              className="border-2 border-white bg-gray-200 text-black w-72 h-8 p-1 focus:bg-gray-100 transition"
            />
            {!inputType ? (
              <img
                src={closeEyeSvg}
                onClick={() => {
                  setInputType(!inputType);
                }}
                alt="Toggle visibility"
                className="absolute inset-y-0 right-0 w-6 h-6 m-1 mt-2 cursor-pointer"
              />
            ) : (
              <img
                src={openEyeSvg}
                onClick={() => {
                  setInputType(!inputType);
                }}
                alt="Toggle visibility"
                className="absolute inset-y-0 right-0 w-6 h-6 m-1 cursor-pointer"
              />
            )}
          </div>
        </div>
        <div>
          <button
            className="border border-whiter rounded-md h-10 mt-8 w-40 transition transform active:scale-95 focus:outline-none bg-transparent hover:bg-gray-100 hover:text-black"
            onClick={handleClick}
          >
            Sign Up
          </button>
        </div>
      </div>
      <div className="mt-3 text-white text-lg">
        Already have an account?{" "}
        <Link to={"/signin"} className="underline font-bold">
          SignIn here
        </Link>
      </div>
    </div>
  );
}
export default Signup;
