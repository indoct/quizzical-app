import { UilMoon } from "@iconscout/react-unicons";
import { UilSun } from "@iconscout/react-unicons";

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDarkMode,
  toggleDarkMode,
}) => {
  console.log(isDarkMode);
  return (
    <div className="mode-switch">
      <span>Switch to: &nbsp;</span>
      <button onClick={() => toggleDarkMode()} className="toggle-btn">
        {isDarkMode ? (
          <>
            <UilSun size={18} color={"#0f1422"} /> Light
          </>
        ) : (
          <>
            <UilMoon size={18} color={"#ffffff"} /> Dark
          </>
        )}{" "}
        Mode
      </button>
    </div>
  );
};

export default ThemeToggle;
