import {
  UilMoon,
  UilSun,
  UilSetting,
  UilRefresh,
} from "@iconscout/react-unicons";

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
  // const [allowFetch, setAllowFetch] = useState<boolean>(false);

  // useEffect(() => {
  //   setAllowFetch(false);

  //   const fetchTimer = setTimeout(() => {
  //     setAllowFetch(true);
  //   }, 5000);

  //   return () => clearTimeout(fetchTimer);
  // }, []);

  return (
    <header>
      <div className="controls">
        {/* <button
          role="button"
          aria-label="Get new questions"
          className="ctrl-btn"
          disabled={!allowFetch}
        >
          <UilRefresh size={28} />
        </button> */}
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
