import { useState, useContext, useEffect } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const navigate = useNavigate();

  const { login, authUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(currentState, formData);

      // ✅ clear form after success
      setFormData({
        fullName: "",
        email: "",
        password: "",
        bio: "",
      });

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= AUTO NAVIGATION =================
  useEffect(() => {
    if (authUser) {
      navigate("/"); // or "/home"
    }
  }, [authUser]);

  return (
    <div className="min-h-screen flex items-center justify-center gap-8 max-sm:flex-col bg-[#0f172a] text-white">

      {/* Left Logo */}
      <img
        src={assets.logo_big}
        alt="logo"
        className="w-[min(30vw,250px)]"
      />

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="border border-gray-600 pt-6 pb-6 pr-6 pl-10 flex flex-col gap-4 rounded-lg w-[300px] bg-white/10"
      >
        <h2 className="text-2xl font-medium text-center">
          {currentState}
        </h2>

        {/* Full Name (Signup only) */}
        {currentState === "Sign Up" && (
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="p-2 rounded-md bg-transparent border border-gray-500 outline-none"
            required
          />
        )}

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="p-2 rounded-md bg-transparent border border-gray-500 outline-none"
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="p-2 rounded-md bg-transparent border border-gray-500 outline-none"
          required
        />

        {/* Bio (Signup only) */}
        {currentState === "Sign Up" && (
          <textarea
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
            className="p-2 rounded-md bg-transparent border border-gray-500 outline-none"
          />
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-violet-600 py-2 rounded-md hover:opacity-90 transition cursor-pointer"
        >
          {loading ? "Please wait..." : currentState}
        </button>

        {/* Toggle */}
        <p className="text-sm text-center">
          {currentState === "Sign Up"
            ? "Already have an account?"
            : "Don't have an account?"}

          <span
            onClick={() =>
              setCurrentState(
                currentState === "Sign Up" ? "Login" : "Sign Up"
              )
            }
            className="text-violet-400 cursor-pointer ml-1 cursor-pointer"
          >
            {currentState === "Sign Up" ? "Login" : "Sign Up"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;