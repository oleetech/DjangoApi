import React from "react";
import styles from "./HamburgerButton.module.css";

function HamburgerButton({ active, onClick }) {
  return (
    <div
      className={`${active ? styles.open : ""} ${styles["nav-icon-5"]}`}
      onClick={onClick}
    >
      <span className="bg-black"></span>
      <span className="bg-black"></span>
      <span className="bg-black"></span>
    </div>
  );
}

export default HamburgerButton;
