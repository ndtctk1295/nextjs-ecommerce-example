"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { signIn } from "next-auth/react";

function LoginComponent() {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useUser();
  const router = useRouter();
  const axiosInstance = axios.create({
    baseURL: baseURL,
  });
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("public/user/login", {
        username,
        password,
      });
      const { jwt, refreshToken } = response.data.data;
      // console.log(refreshToken);
      login(jwt, username, refreshToken);
      // router.push("/");
      // Set logged in state to true
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage("Invalid username or password!");
      }
    }
    router.push("/");
  };
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   const result = await signIn("credentials", {
  //     redirect: false,
  //     username,
  //     password,
  //   });

  //   if (result.error) {
  //     setErrorMessage(result.error);
  //     console.log(result.error);
  //   }

  //   // Redirect the user after successful login
  //   // if (result.ok) {
  //   //   window.location.href = "/";
  //   // }
  // };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-bold text-center text-gray-700">Logo</h1>
        <form className="mt-6" onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-800"
            >
              Username
            </label>
            <input
              type="username"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-800"
            >
              Password
            </label>
            <input
              type="password"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Link
            href="/forget"
            className="text-xs text-blue-600 hover:underline"
          >
            Forget Password?
          </Link>
          <div className="mt-2">
            {errorMessage && <div>{errorMessage}</div>}
            <button
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>

        <p className="mt-4 text-sm text-center text-gray-700">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginComponent;
