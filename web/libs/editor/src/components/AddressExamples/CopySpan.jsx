import "./CopySpan.css";

const CopySpan = ({ children }) => {
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(children)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch(err => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <span className="copySpan" onClick={copyToClipboard}>
      {children}
    </span>
  );
};

export default CopySpan;
