import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { useParams } from "react-router-dom";
import { ReactMic } from "react-mic";

function PatientDetails() {
  const [profileData, setProfileData] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const dispatch = useDispatch();
  const params = useParams();
  console.log("User ID from URL:", params.userId); // Log the appointmentId to console
  const handleLinkClick = (url) => {
    console.log("Button clicked!");
    const newTab = window.open(url, "_blank");
    newTab.focus();
  };

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching user data...");
        dispatch(showLoading());
        const response = await axios.post(
          "/api/user/get-user-info-by-id",
          {
            userId: params._id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        dispatch(hideLoading());

        if (response.data.success) {
          console.log("User data fetched successfully:", response.data.data);
          setProfileData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        dispatch(hideLoading());
      }
    }

    fetchData();
  }, [dispatch, params.userId]);

  const onStartRecording = () => {
    console.log("Recording started...");
    setIsRecording(true);
  };

  const onStopRecording = (recordedBlob) => {
    console.log("Recording stopped. Recorded Blob:", recordedBlob);
    setRecordedBlob(recordedBlob);
    setIsRecording(false);
  };

  const handlePlay = () => {
    const audioElement = document.getElementById("audio-preview");
    if (audioElement) {
      audioElement.play();
    }
  };

  const handlePause = () => {
    const audioElement = document.getElementById("audio-preview");
    if (audioElement) {
      audioElement.pause();
    }
  };
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard:", text);
      alert("Text copied to clipboard");
      setIsCopied(true);

      // Reset the "Copied!" state after a certain duration (e.g., 3 seconds)
      setTimeout(() => {
        setIsCopied(false);
        console.log("hello");
      }, 1000); // Reset to "Copy to clipboard" after 3 seconds
    } catch (error) {
      console.error("Error copying text:", error);
    }
  };

  return (
    <Layout>
      <h1 className="page-title">User Profile</h1>
      <hr />
      {profileData ? (
        <div>
          <p>
            <strong>ID:</strong> {profileData._id}
          </p>
          <p>
            <strong>Name:</strong> {profileData.name}
          </p>
          <p>
            <strong>Age:</strong> {profileData.age}
          </p>
          <p>
            <strong>Gender:</strong> {profileData.gender}
          </p>
          <p>
            <strong>Bloodgroup:</strong> {profileData.bloodgroup}
          </p>
          <p>
            <strong>Dateofbirth:</strong> {profileData.dateofbirth}
          </p>
          <p>
            <strong>Address:</strong> {profileData.address}
          </p>

          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
          {/* Note: Displaying passwords is not recommended */}
          <p>
            <strong>Seen Notifications:</strong>{" "}
            {profileData.seenNotifications.length}
          </p>
          <p>
            <strong>Unseen Notifications:</strong>{" "}
            {profileData.unseenNotifications.length}
          </p>
          <p>
            <strong>Meta mask key:</strong>{" "}
            <button
              className="clipboard"
              onClick={() => copyToClipboard(profileData.metamaskkey)}
            >
              {copyToClipboard ? "Copy to clipboard" : "Copied!"}
            </button>
          </p>
          <button
            className="record-btn"
            onClick={() => handleLinkClick("http://localhost:3001/")}
          >
            Record Your session
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </Layout>
  );
}

export default PatientDetails;
