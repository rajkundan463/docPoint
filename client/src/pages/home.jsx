import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import DoctorCard from "../components/DoctorCard";

function Home() {

  const [doctors, setDoctors] = useState([]);

  const getDoctorsData = async () => {

    try {

      const response = await axios.get(
        "/api/user/get-all-approved-doctors",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Cache-Control": "no-cache"
          }
        }
      );

      if (response.data.success) {

        setDoctors(response.data.data);

      }

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  return (

    <Layout>

      <h1 className="page-title">Doctors</h1>

      <div className="doctor-list">

        {doctors.map((doctor) => (
          <DoctorCard doctor={doctor} key={doctor._id} />
        ))}

      </div>

    </Layout>

  );

}

export default Home;