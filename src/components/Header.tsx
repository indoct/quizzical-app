import { UilMoon, UilSun, UilSetting } from "@iconscout/react-unicons";

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  handleNewSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  toggleDarkMode,
  handleNewSettings,
}) => {
  return (
    <header>
      <div className="controls">
        <button
          role="button"
          aria-label="Change settings"
          className="ctrl-btn"
          onClick={handleNewSettings}
        >
          <UilSetting size={28} />
        </button>
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
