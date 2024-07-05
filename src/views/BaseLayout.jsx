import React from "react";
import Settings from "../components/Settings";
import BaseLayoutHeader from "./BaseLayoutHeader";

const BaseLayout = ({ children }) => {
  return (
    <div>
      <BaseLayoutHeader />
      {children}
      <Settings />
    </div>
  );
};

export default BaseLayout;
