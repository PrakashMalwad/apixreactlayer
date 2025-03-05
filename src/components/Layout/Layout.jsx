import React from "react";
import PropTypes from "prop-types";
// import Navbar from "./Navbar/Navbar";

export default function Layout({ children }) {
  return (
    <>
      <main className="flex flex-col items-center w-full min-h-screen bg-gray-100">
        <div className="w-full max-w-7xl flex-1 ">
          {/* <Navbar/> */}
          {children}
        </div>
      </main>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
