import { useState, useEffect, useContext } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";
import axios from "axios";
import { AppContext } from "../context/appContext";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../custom/custom.css";
import { toast } from "react-toastify";
const EditSkillsModal = ({ userId, onClose, onSave }) => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, backendUrl, userToken, isModalOpen, setIsModalOpen } =
    useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (skills.length === 0) {
      toast.error("Please add at least one skill.");
      return;
    }

    try {
      NProgress.start();
      setLoading(true);

      const { data } = await axios.put(
        backendUrl + "/api/users/update-skills",
        { skills }, // Send the skills array as the body
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error("An error occurred while updating skills.");
      console.log(error);
    } finally {
      NProgress.done();
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.skills) {
      setSkills(user.skills);
      setLoading(false);
    }
  }, [user]);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const saveSkills = async () => {
    try {
      await axios.put(`/api/users/${userId}/skills`, { skills });
      onSave(skills);
    } catch (error) {
      console.error("Error saving skills:", error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-white/30 z-50">
        <div className="bg-white/70 backdrop-blur-lg p-6 rounded-lg shadow-lg w-96 border border-gray-300">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-black/20 z-50">
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-96 border border-gray-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Skills</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <FaTimes size={22} />
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="border p-2 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50 placeholder-gray-600"
            placeholder="Add a skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addSkill()}
          />
          <button
            onClick={addSkill}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <FaPlus />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full shadow-sm border border-gray-300"
            >
              <span className="text-gray-800 font-medium">{skill}</span>
              <button
                onClick={() => removeSkill(skill)}
                className="text-red-500 hover:text-red-700 transition"
              >
                <FaTimes size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSubmitHandler}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSkillsModal;
