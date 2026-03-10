import React from "react";
import { useNavigate } from "react-router-dom";
import "../doctorCard.css";

function DoctorCard({ doctor }) {

  const navigate = useNavigate();

  return (

    <div className="doctor-card">

      <img
        src={doctor.profileImage}
        alt="doctor"
        className="doctor-img"
      />

      <div className="doctor-info">

        <h3>
          Dr. {doctor.firstName} {doctor.lastName}
        </h3>

        <p>
          <b>Specialization:</b> {doctor.specialization}
        </p>

        <p>
          <b>Experience:</b> {doctor.experience} years
        </p>

        <p>
          <b>Fees:</b> ₹{doctor.feePerConsultation}
        </p>

        <button
          className="book-btn"
          onClick={() =>
            navigate(`/book-appointment/${doctor._id}`)
          }
        >
          Book Appointment
        </button>

      </div>

    </div>

  );

}

export default DoctorCard;