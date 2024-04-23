import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { useParams } from "react-router-dom";

function PatientProfile() {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    console.log("Appointment ID from URL:", params.appointmentId);
    async function fetchData() {
      try {
        dispatch(showLoading());
        const response = await axios.get(
          `/api/user/get-patient-details-by-appointment/${params.appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        dispatch(hideLoading());

        if (response.data.success) {
          setProfileData(response.data.data);
        } else {
          setError("Server responded with success: false");
          console.error("Server response:", response);
        }
      } catch (error) {
        console.error("Axios Error:", error);
        setError("An error occurred while fetching data");
        dispatch(hideLoading());
      }
    }

    fetchData();
  }, [dispatch, params.appointmentId]);

  return (
    <Layout>
      <h1 className="page-title">Patient Profile</h1>
      <hr />
      {error ? (
        <p>Error: {error}</p>
      ) : profileData ? (
        <div>
          <p><strong>ID:</strong> {profileData._id}</p>
          <p><strong>Name:</strong> {profileData.name}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          {/* Avoid displaying passwords */}
          <p><strong>Is Doctor:</strong> {profileData.isDoctor.toString()}</p>
          <p><strong>Is Admin:</strong> {profileData.isAdmin.toString()}</p>
          <p><strong>Seen Notifications:</strong></p>
          <ul>
            {profileData.seenNotifications.map((notification, index) => (<li key={index}>{notification}</li> ))}
          </ul>
          <p><strong>Unseen Notifications:</strong></p>
          <ul>
            {profileData.seenNotifications.map((notification, index) => (<li key={index}>{notification}</li> ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </Layout>
  );
}

export default PatientProfile;
