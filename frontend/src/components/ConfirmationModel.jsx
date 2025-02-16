import React, { useState, useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { IoPersonOutline } from "react-icons/io5";
import { FaEnvelope } from "react-icons/fa";
import { FaUnlockAlt } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/appContext";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../custom/custom.css";
const ConfirmModel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { confirmModel, setConfirmModel, backendUrl, user, userToken } =
    useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      NProgress.start();
      const { data } = await axios.delete(
        backendUrl + `/api/users/delete-experience/${confirmModel}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        window.location.reload();
      }
    } catch (error) {
      toast.error("An error occurred while checking email.");
      console.log(error);
    } finally {
      NProgress.done();
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [user]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-sm transform transition-all duration-300 scale-100"
      >
        {/* Close Button */}
        <IoCloseOutline
          onClick={(e) => setConfirmModel(false)}
          className="absolute top-6 right-6 text-2xl text-gray-500 hover:text-red-500 cursor-pointer transition-all hover:scale-110"
        />

        {/* Header */}
        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Are you sure?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            Do you really want to delete this experience? This action cannot be
            undone.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              type="submit"
              className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-5 py-2 rounded-lg transition font-medium shadow-md"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={(e) => setConfirmModel(false)}
              className="bg-gray-300 cursor-pointer hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg transition font-medium shadow-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ConfirmModel;
