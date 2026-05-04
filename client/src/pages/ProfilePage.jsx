import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const navigate = useNavigate();

  const { authUser, updateProfile } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    selectedImg: null,
  });

  // ✅ fill data when authUser loads
  useEffect(() => {
    if (authUser) {
      setFormData({
        name: authUser.fullName || "",
        bio: authUser.bio || "",
        selectedImg: null,
      });
    }
  }, [authUser]);

  // text input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setFormData((prev) => ({
      ...prev,
      selectedImg: file,
    }));
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, bio, selectedImg } = formData;

    try {
      if (!selectedImg) {
        await updateProfile({ fullName: name, bio });
        navigate("/");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(selectedImg);

      reader.onload = async () => {
        const base64Image = reader.result;

        await updateProfile({
          profilePic: base64Image,
          fullName: name,
          bio,
        });

        navigate("/");
      };
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className="text-lg font-semibold">Profile details</h3>

          {/* Image Upload */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              hidden
              onChange={handleImageChange}
            />

            <img
              src={
                formData.selectedImg
                  ? URL.createObjectURL(formData.selectedImg)
                  : authUser?.profilePic || assets.avatar_icon
              }
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />

            <span>Upload profile image</span>
          </label>

          {/* Name */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className="p-2 rounded-md bg-transparent border border-gray-500 outline-none"
          />

          {/* Bio */}
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write bio..."
            className="p-2 rounded-md bg-transparent border border-gray-500 outline-none"
          />

          {/* Button */}
          <button
            type="submit"
            className="bg-violet-600 py-2 rounded-md hover:opacity-90 transition cursor-pointer"
          >
            Save Changes
          </button>
        </form>

        {/* RIGHT SIDE PREVIEW */}
        <div className="flex-1 flex justify-center items-center p-5">
          <img
            src={
              formData.selectedImg
                ? URL.createObjectURL(formData.selectedImg)
                : authUser?.profilePic || assets.logo_icon
            }
            alt="preview"
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;