// src/components/Profile.tsx
import { useState, useEffect } from "react";
import { useApi, ENDPOINTS } from "../../hooks/useApi";
import Navbar from "../components/navbar";
import { eventBus } from "../../utils/eventBus";

interface UserData {
  username: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const { execute, isLoading, error } = useApi();
  const [userData, setUserData] = useState<UserData>({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUserData((prev) => ({
        ...prev,
        username: storedUsername,
      }));
    }
  }, []);

  const validateForm = () => {
    if (userData.newPassword && userData.newPassword.length < 6) {
      setValidationError("New password must be at least 6 characters long");
      return false;
    }

    if (
      userData.newPassword &&
      userData.newPassword !== userData.confirmPassword
    ) {
      setValidationError("New passwords do not match");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setValidationError("");

    if (!validateForm()) return;

    try {
      // Only send necessary data to the server
      const updateData = {
        username: userData.username,
        email: userData.email,
        currentPassword: userData.currentPassword,
        ...(userData.newPassword && { newPassword: userData.newPassword }),
      };

      const response = await execute({
        endpoint: ENDPOINTS.USER.UPDATE_PROFILE,
        method: "PUT",
        body: updateData,
        requiresAuth: true,
      });

      if (response.data) {
        localStorage.setItem("username", response.data.username);

        // Notify navbar to update
        eventBus.emit("PROFILE_UPDATED");

        setSuccessMessage("Profile updated successfully!");

        // Clear password fields
        setUserData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }
    } catch (err) {
      console.error("Profile update error:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

            {(error || validationError) && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error?.message || validationError}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Information Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Profile Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      type="text"
                      value={userData.username}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Change Password
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={userData.currentPassword}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={userData.newPassword}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Leave blank to keep current password"
                    />
                    {userData.newPassword && (
                      <p className="mt-1 text-sm text-gray-500">
                        Password must be at least 6 characters long
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={userData.confirmPassword}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
