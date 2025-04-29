import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <h1>아바타 면접 도우미</h1>
        </Link>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/">홈</Link>
          </li>
          <li>
            <a
              href="https://github.com/weg-9000/AvatarInterview"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
