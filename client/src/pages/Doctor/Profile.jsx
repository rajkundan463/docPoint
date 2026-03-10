import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import DoctorForm from "../../components/DoctorForm";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";

function DoctorProfile() {

  const [doctor, setDoctor] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);

  const getDoctorData = async () => {

    try {

      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-user-id",
        { userId: user._id },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );

      if (response.data.success) {
        setDoctor(response.data.data);
      }

    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    getDoctorData();
  }, []);

  const onFinish = async (formData) => {

    try {

      dispatch(showLoading());

      formData.append("userId", user._id);

      const response = await axios.post(
        "/api/doctor/update-doctor-profile",
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "multipart/form-data"
          }
        }
      );

      dispatch(hideLoading());

      if (response.data.success) {
        toast.success(response.data.message);
        window.location.reload();
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {

      dispatch(hideLoading());
      toast.error("Something went wrong");

    }

  };

  return (
    <Layout>
      <h1 className="page-title">Doctor Profile</h1>
      <hr />

      {doctor && (
        <DoctorForm
          onFinish={onFinish}
          initivalValues={doctor}
        />
      )}

    </Layout>
  );
}

export default DoctorProfile;