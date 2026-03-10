import React from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DoctorForm from "../components/DoctorForm";

function ApplyDoctor() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const onFinish = async (formData) => {

    try {

      dispatch(showLoading());

      formData.append("userId", user._id);

      const response = await axios.post(
        "/api/user/apply-doctor-account",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(hideLoading());

      if (response.data.success) {

        toast.success(response.data.message);
        toast("Redirecting to Home page");

        navigate("/");

      } else {

        toast.error(response.data.message);

      }

    } catch (error) {

      console.log(error);
      dispatch(hideLoading());
      toast.error("Something went wrong");

    }

  };

  return (

    <Layout>

      <h1 className="page-title">Apply Doctor</h1>

      <hr />

      <DoctorForm onFinish={onFinish} />

    </Layout>

  );

}

export default ApplyDoctor;