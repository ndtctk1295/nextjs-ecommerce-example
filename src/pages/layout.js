import React from "react";
import Header from "@/app/components/header";

const CustomerLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default CustomerLayout;
