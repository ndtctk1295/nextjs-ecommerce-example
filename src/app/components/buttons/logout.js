"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUser } from "../../context/UserContext";
export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useUser();
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  // const { jwt, logout } = useUser();
  const jwt = localStorage.getItem("jwt");
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        baseURL + "public/user/logout",
        {},
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );

      if (response.status !== 200) throw new Error("Logout failed");
      logout();
      // Redirect to "/" after successful logout
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      type="button"
      className="hover:bg-clip-text hover:text-transparent bg-gradient-to-br from-[#2b68e0] to-[#e710ea] border-solid border-2 border-[#5356e3]  font-bold text-white px-5 py-2 rounded-full "
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
