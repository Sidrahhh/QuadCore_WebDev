import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa"; // Import bell icon from react-icons

const Alert = ({ message, onClose }) => {
  const [lineCount, setLineCount] = useState(1);

  // Measure the number of lines in the message
  useEffect(() => {
    const lines = message.split("\n").length; // Split by new lines
    setLineCount(lines);

    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Close after 5 seconds

    return () => clearTimeout(timer); // Clean up on unmount
  }, [message, onClose]);

  // Dynamically adjust bell icon size based on the number of lines
  const iconSize = lineCount > 2 ? 30 : 20; // Increase icon size for more than 2 lines

  return (
    <div style={styles.alert}>
      <div style={styles.iconContainer}>
        <FaBell style={{ ...styles.bellIcon, fontSize: iconSize }} />
      </div>
      <p style={styles.message}>{message}</p>
    </div>
  );
};

const styles = {
  alert: {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "white",
    color: "black",
    padding: "10px 20px",
    borderRadius: "15px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    fontSize: "16px",
    width: "auto",
    display: "flex", // Use flexbox for layout
    alignItems: "center", // Align items vertically in the center
    gap: "10px", // Space between the icon and the text
  },
  iconContainer: {
    display: "flex", // Flexbox for icon container
    alignItems: "center", // Center the icon vertically
    justifyContent: "center", // Center the icon horizontally
    width: "30px", // Fixed width for the icon container
    height: "30px", // Fixed height for the icon container
    marginTop: "2px", // Align the icon with the text
  },
  bellIcon: {
    color: "lightblue", // Icon color
  },
  message: {
    margin: 0, // Remove default margin for the paragraph
    whiteSpace: "pre-line", // Preserve newlines in the message
    wordWrap: "break-word", // Ensure text breaks to the next line as needed
  },
};

export default Alert;
