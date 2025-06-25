import React, { useState, useEffect } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "../assets/graphics/mainlogo2.png";
import useAuth from "../hooks/useAuth";

function NavBar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { auth } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [activeDashboard, setActiveDashboard] = useState(
    localStorage.getItem("activeDashboard")
  );
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 70 && !scrolled) {
        setScrolled(true);
      } else if (window.pageYOffset <= 70 && scrolled) {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const navItems = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "GED",
      path: "/ged-practice-test-papers",
    },
    {
      name: "TEAS",
      path: "/teas-practice-test-papers",
    },
    {
      name: "HESI",
      path: "/hesi-practice-test-papers",
    },
    {
      name: "Other Services",
      path: "/other-services",
    },
    {
      name: "Take My Exam",
      path: "/my-test",
    },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-primary/95 backdrop-blur-md border-b border-white/10 shadow-lg shadow-primary/20"
            : "bg-primary/90 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="relative group">
                <img
                  src={Logo}
                  className="h-[80px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  alt="Logo"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-1">
              {navItems?.map((item, index) => (
                <NavLink
                  to={item.path}
                  key={index}
                  className={({ isActive }) =>
                    `relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                      isActive
                        ? "text-secondary bg-secondary/10 shadow-inner"
                        : "text-light hover:text-secondary hover:bg-white/5"
                    }`
                  }
                >
                  <span className="relative z-10">{item.name}</span>
                </NavLink>
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden xl:flex items-center space-x-3">
              {!auth?.userId ? (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-light font-medium hover:text-secondary transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="group relative overflow-hidden bg-gradient-to-r from-secondary to-green-600 hover:from-green-500 hover:to-secondary text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-secondary/25 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    <span className="relative z-10">Sign Up</span>
                  </Link>
                </div>
              ) : (
                <Link
                  to={`${
                    auth?.roles?.includes("Client")
                      ? activeDashboard
                      : auth?.roles?.includes("Admin")
                      ? "/dashboard"
                      : auth?.roles?.includes("Writer")
                      ? "/writer"
                      : auth?.roles?.includes("Manager")
                      ? "/dashboard"
                      : "/Unauthorized"
                  }`}
                  className="group relative overflow-hidden bg-gradient-to-r from-secondary to-green-600 hover:from-green-500 hover:to-secondary text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-secondary/25 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  <span className="relative z-10 capitalize">Dashboard</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="xl:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
            >
              {mobileMenu ? (
                <MdClose size={28} color="#06D001" />
              ) : (
                <MdMenu size={28} color="#06D001" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenu && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 xl:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-primary/95 backdrop-blur-md border-r border-white/10 z-50 xl:hidden transform transition-transform duration-300 ${
          mobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <img src={Logo} className="h-12 w-auto object-contain" alt="Logo" />
          <button
            onClick={() => setMobileMenu(false)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
          >
            <MdClose size={24} color="#06D001" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems?.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  onClick={() => setMobileMenu(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 text-light font-medium rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-secondary/20 text-secondary border-l-4 border-secondary"
                        : "hover:bg-white/5 hover:text-secondary hover:translate-x-1"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Auth Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          {!auth?.userId ? (
            <div className="space-y-3">
              <Link
                to="/login"
                onClick={() => setMobileMenu(false)}
                className="block w-full text-center py-3 text-light font-medium border border-white/20 rounded-lg hover:bg-white/5 transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenu(false)}
                className="block w-full text-center py-3 bg-gradient-to-r from-secondary to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <Link
              to={`${
                auth?.roles?.includes("Client")
                  ? activeDashboard
                  : auth?.roles?.includes("Admin")
                  ? "/dashboard"
                  : auth?.roles?.includes("Writer")
                  ? "/writer"
                  : auth?.roles?.includes("Manager")
                  ? "/dashboard"
                  : "/Unauthorized"
              }`}
              onClick={() => setMobileMenu(false)}
              className="block w-full text-center py-3 bg-gradient-to-r from-secondary to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 capitalize"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
