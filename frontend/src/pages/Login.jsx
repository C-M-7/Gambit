import React from "react";

function Login() {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="flex flex-col items-center p-10 space-y-4 rounded-md border border-black">
        <div className="text-3xl font-bold">SignIn</div>
        <div>
          <div>Email</div>
          <input className="border border-black w-72 h-8" type="text" />
        </div>
        <div>
          <div>Password</div>
          <input className="border border-black w-72 h-8" type="text" />
        </div>
        <div>
          <button className="border border-black rounded-md h-10 mt-8 w-40 hover:bg-black hover:text-white">
            Sign    In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
