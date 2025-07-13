import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


const API_URL = "http://localhost:8000/api/profile/";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    axios
      .get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setProfile(res.data);
        setValue("email", res.data.email);
      })
      .catch(() => setError("Failed to load profile"));
  }, [setValue]);

  const onSubmit = async (data) => {
    setError("");
    const formData = new FormData();
    if (data.profile_picture && data.profile_picture[0]) {
      formData.append("profile_picture", data.profile_picture[0]);
    }
    const token = localStorage.getItem('access_token');
    try {
      const res = await axios.put(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });
      setProfile(res.data);
      setEditMode(false);
    } catch {
      setError("Failed to update profile.");
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="profile-bg">
      <div className="profile-card">
        <h2 className="profile-title">My Profile</h2>
        <img
          src={
            profile.profile_picture
              ? `http://localhost:8000${profile.profile_picture}`
              : "/images/the_user.png"
          }
          alt="Profile"
          className="profile-avatar"
        />
        <div className="profile-info">
          <div className="profile-name">{profile.username}</div>
          <div className="profile-email">{profile.email}</div>
        </div>
        {editMode ? (
          <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
            <label className="profile-label">Profile Picture</label>
            <input type="file" {...register("profile_picture")} accept="image/*" className="profile-input" />
            <button type="submit" className="profile-btn">Save</button>
            <button type="button" className="profile-btn profile-cancel" onClick={() => setEditMode(false)}>Cancel</button>
            {error && <div className="error">{error}</div>}
          </form>
        ) : (
          <button onClick={() => setEditMode(true)} className="profile-btn">Edit</button>
        )}
        <button
  className="profile-btn profile-back"
  onClick={() => navigate('/routes')}
  style={{ marginTop: "1rem" }}
>
  ← Back to Route Planner
</button>

      </div>
      <style>{`
        .profile-bg {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
        }
        .profile-card {
          background: rgba(0, 0, 0, 0.65);
          border-radius: 32px;
          box-shadow: 0 4px 32px rgba(33, 150, 243, 0.10);
          padding: 3rem 2.5rem 2.5rem 2.5rem;
          width: 380px;
          display: flex;
          flex-direction: column;
          align-items: center;
          backdrop-filter: blur(5px); 
        }
        .profile-title {
          font-size: 2rem;
          font-weight: 700;
          color: #5e6472;
          margin-bottom: 1.5rem;
        }
        .profile-avatar {
          width: 108px;
          height: 108px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 1.2rem;
          box-shadow: 0 2px 12px rgba(33,150,243,0.07);
        }
        .profile-info {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .profile-name {
          font-size: 1.4rem;
          font-weight: 600;
          color: #1976d2;
        }
        .profile-email {
          font-size: 1.05rem;
          color: #888;
          margin-top: 0.4rem;
          font-weight: 400;
        }
        .profile-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .profile-label {
          font-size: 1rem;
          margin-bottom: 0.4rem;
          color: #444;
          font-weight: 500;
        }
        .profile-input {
          margin-bottom: 1rem;
        }
        .profile-btn {
          background: #1976d2;
          color: #fff;
          border: none;
          border-radius: 24px;
          padding: 0.6rem 2.2rem;
          margin: 0.2rem 0.3rem;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(33,150,243,0.08);
          transition: background 0.2s;
        }
        .profile-btn:hover {
          background: #125ca1;
        }
        .profile-cancel {
          background: #bbb;
          color: #222;
        }
        .profile-cancel:hover {
          background: #888;
        }
        .error {
          color: #d32f2f;
          margin-top: 0.5rem;
        }
        @media (max-width: 500px) {
          .profile-card {
            padding: 1.5rem 0.5rem;
            width: 95vw;
          }
        }
          .profile-back {
  background: #263238;
  color: #fff;
}
.profile-back:hover {
  background: #1976d2;
}

      `}</style>
    </div>
  );
}

export default ProfilePage;
