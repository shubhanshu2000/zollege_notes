// src/components/Navbar.tsx
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import { eventBus } from "../../utils/eventBus";

interface NavbarProps {
  onSearch?: (query: string) => void; // Make search optional
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation(); // To check current route
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if we're on the notes page
  const isNotesPage = location.pathname === "/notes";

  const loadUsername = () => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      const cleanUsername = storedUsername.replace(/['"]+/g, "").trim();
      setUsername(cleanUsername);
    }
  };

  useEffect(() => {
    loadUsername();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    // Subscribe to profile updates
    eventBus.subscribe("PROFILE_UPDATED", loadUsername);

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      eventBus.unsubscribe("PROFILE_UPDATED", loadUsername);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query); // Optional chaining as onSearch is optional
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const getUserInitial = () => {
    return username ? username.charAt(0).toUpperCase() : "";
  };

  const getInitialsBgColor = () => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];

    if (!username) return colors[0];
    const index = username.length % colors.length;
    return colors[index];
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/notes" className="text-xl font-bold text-blue-600">
              Notes App
            </Link>
          </div>

          {/* Search Bar - Only show on notes page */}
          {isNotesPage && onSearch && (
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>
            </div>
          )}

          {/* Page Title - Show on non-notes pages */}
          {!isNotesPage && (
            <div className="flex-1 text-center">
              <h1 className="text-xl font-semibold text-gray-800">
                {location.pathname === "/profile" ? "Profile Settings" : ""}
              </h1>
            </div>
          )}

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div
                className={`w-8 h-8 rounded-full ${getInitialsBgColor()} flex items-center justify-center text-white font-medium`}
              >
                {getUserInitial()}
              </div>
              <span className="hidden md:block text-gray-700">{username}</span>
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                  Signed in as
                  <br />
                  <span className="font-medium text-gray-900">{username}</span>
                </div>

                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile Settings
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
