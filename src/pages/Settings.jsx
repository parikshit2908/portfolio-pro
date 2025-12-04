import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { supabase } from "../supabase/config";
import "./Settings.css";

export default function Settings() {
  const { user, logout } = useAuth(); // from your AuthContext. :contentReference[oaicite:4]{index=4}
  const { theme, toggleTheme } = useTheme(); // ThemeContext. :contentReference[oaicite:5]{index=5}

  // form state (initialize from user metadata when available)
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.display_name || ""
  );
  const [avatarUrl, setAvatarUrl] = useState(
    user?.user_metadata?.avatar_url || ""
  );
  const [bio, setBio] = useState(user?.user_metadata?.bio || "");
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  // if user changes (on initial load), seed local state
  useEffect(() => {
    setDisplayName(user?.user_metadata?.display_name || "");
    setAvatarUrl(user?.user_metadata?.avatar_url || "");
    setBio(user?.user_metadata?.bio || "");
  }, [user]);

  // helper: refresh auth user (so UI sees updated user_metadata)
  const refreshUser = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      // Note: AuthContext listens to onAuthStateChange; this ensures server returns latest metadata
      return data?.user ?? null;
    } catch (err) {
      // ignore - best effort
      return null;
    }
  };

  // Save profile (auth metadata + profiles table)
  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      setStatusMsg("");
      setErrorMsg("");

      // 1) update user metadata in Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: { display_name: displayName, avatar_url: avatarUrl, bio },
      });
      if (authError) throw authError;

      // 2) refresh the user session so UI & AuthContext get updated metadata
      await refreshUser();

      // 3) upsert profile row in `profiles` table (fields per your table)
      const { error: dbError } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: displayName || null, // Schema uses full_name, not display_name
        avatar_url: avatarUrl || null,
        bio: bio || null,
      });

      if (dbError) throw dbError;

      setStatusMsg("Profile updated successfully ✅");
    } catch (error) {
      setErrorMsg(error.message || String(error));
    } finally {
      setSaving(false);
    }
  };

  // Upload avatar (to "avatars" bucket) and update metadata + profiles
  const handleUploadPhoto = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setStatusMsg("");
      setErrorMsg("");

      const fileExt = file.name.split(".").pop();
      // include timestamp to avoid caching same filename
      const filePath = `users/${user.id}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: false });

      // If it's already present (rare) or upsert desired, you can use upsert: true
      if (uploadError) throw uploadError;

      // getPublicUrl returns object with { publicUrl }
      const { data: publicData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = publicData?.publicUrl;
      if (!publicUrl) throw new Error("Failed to get public URL for avatar.");

      // update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });
      if (authError) throw authError;

      // refresh session so UI sees new avatar
      await refreshUser();

      // update profiles table
      const { error: dbError } = await supabase.from("profiles").upsert({
        id: user.id,
        avatar_url: publicUrl,
      });
      if (dbError) throw dbError;

      setAvatarUrl(publicUrl);
      setStatusMsg("Profile picture updated successfully ✅");
    } catch (error) {
      setErrorMsg(error.message || String(error));
    } finally {
      setUploading(false);
    }
  };

  // Remove profile photo (set to null + optionally remove from storage)
  const handleRemovePhoto = async () => {
    try {
      setRemoving(true);
      setStatusMsg("");
      setErrorMsg("");

      // remove avatar metadata from Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: { avatar_url: null },
      });
      if (authError) throw authError;

      // refresh
      await refreshUser();

      // update profiles table
      const { error: dbError } = await supabase.from("profiles").upsert({
        id: user.id,
        avatar_url: null,
      });
      if (dbError) throw dbError;

      setAvatarUrl(null);
      setStatusMsg("Profile picture removed ✅");
    } catch (error) {
      setErrorMsg(error.message || String(error));
    } finally {
      setRemoving(false);
    }
  };

  // Password reset email (use redirectTo so user lands on your site to finish flow)
  const handlePasswordReset = async () => {
    try {
      setStatusMsg("");
      setErrorMsg("");

      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: window.location.origin + "/update-password",
      });
      if (error) throw error;

      setStatusMsg("Password reset email sent successfully 📩");
    } catch (error) {
      setErrorMsg(error.message || String(error));
    }
  };

  // Small guard — only allow saving when there is a user
  if (!user) {
    return (
      <div className="settings-page page-container">
        <div className="settings-card mx-auto">
          <p>Please sign in to manage settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page page-container">
      <motion.div
        className="settings-card mx-auto"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h3 className="mb-4 text-center">Account Settings</h3>

        {/* Avatar */}
        <div className="text-center mb-4 profile-row">
          <div className="profile-avatar">
            <img
              src={
                avatarUrl ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="Profile"
              className="settings-avatar mb-2"
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            <label className="upload-btn btn-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadPhoto}
                disabled={uploading}
              />
              <span className="btn-upload">{uploading ? "Uploading..." : "Upload Photo"}</span>
            </label>

            <button
              className="btn btn-outline-danger"
              onClick={handleRemovePhoto}
              disabled={removing || !avatarUrl}
            >
              {removing ? "Removing..." : "Remove"}
            </button>
          </div>
        </div>

        {/* Display Name */}
        <div className="mb-3">
          <label className="form-label">Display Name</label>
          <input
            className="form-control"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

        {/* Bio */}
        <div className="mb-3">
          <label className="form-label">Bio</label>
          <textarea
            className="form-control"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Short bio shown on your public portfolio"
          />
        </div>

        {/* Save */}
        <div className="mb-3 d-grid">
          <button
            className="btn btn-primary w-100"
            onClick={handleUpdateProfile}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Password Reset */}
        <div className="mb-3">
          <button
            className="btn btn-warning w-100"
            onClick={handlePasswordReset}
          >
            Send Password Reset Email
          </button>
        </div>

        {/* Theme toggle */}
        <div className="mb-3">
          <button className="theme-btn w-100" onClick={toggleTheme}>
            Toggle to {theme === "light" ? "Dark" : "Light"} Mode
          </button>
        </div>

        {/* Logout */}
        <div className="mb-3">
          <button className="btn btn-danger w-100" onClick={logout}>
            Logout
          </button>
        </div>

        {/* Messages */}
        {statusMsg && <div className="alert alert-success mt-2">{statusMsg}</div>}
        {errorMsg && <div className="alert alert-danger mt-2">{errorMsg}</div>}
      </motion.div>
    </div>
  );
}
