import {
  UilMoon,
  UilSun,
  UilSetting,
  UilRefresh,
} from "@iconscout/react-unicons";

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<ThemeToggleProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <header>
      <div className="controls">
        <UilRefresh size={28} />
        <UilSetting size={28} />
      </div>
      <div>
        <h1>Quizzical</h1>
      </div>
      <div className="toggle">
        <span>Switch to: &nbsp;</span>
        <button onClick={() => toggleDarkMode()} className="toggle-btn">
          {isDarkMode ? (
            <>
              <UilSun size={16} color={"#0f1422"} /> Light
            </>
          ) : (
            <>
              <UilMoon size={16} color={"#ffffff"} /> Dark
            </>
          )}{" "}
          Mode
        </button>
      </div>
    </header>
  );
};

export default Header;
