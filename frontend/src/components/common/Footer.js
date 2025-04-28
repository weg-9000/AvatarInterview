import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          &copy; {new Date().getFullYear()} 아바타 면접 도우미. All rights
          reserved.
        </p>
        <p>Powered by Azure AI Services, Semantic Kernel, and React.</p>
      </div>
    </footer>
  );
};

export default Footer;
