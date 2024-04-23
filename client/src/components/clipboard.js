import React from "react";

const ClipboardButton = () => {
  const textToCopy = "Text you want to copy"; // Replace with the text you want to copy

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        console.log("Text copied to clipboard:", textToCopy);
        alert("Text copied to clipboard: " + textToCopy); // Alert upon successful copy
      })
      .catch((err) => {
        console.error("Error copying text: ", err);
        alert("Error copying text. Please try again."); // Alert if there's an error
      });
  };

  return (
    <div>
      <button onClick={copyToClipboard}>Copy to Clipboard</button>
    </div>
  );
};

export default ClipboardButton;
