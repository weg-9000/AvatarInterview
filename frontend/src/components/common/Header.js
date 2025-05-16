import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          AI 면접 코칭
        </Link>
        <nav className="nav">
          <ul>
            <li>
              <a
                href="https://github.com/weg-9000/Multi-agent-AI-Avatar-Interview-Assistant"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Repository
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
