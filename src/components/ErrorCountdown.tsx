import { useEffect, useState } from "react";

interface ErrorCountdownProps {
  initialSeconds: number;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  fetchData: () => void;
}

const useCountdown = (initialSeconds: number) => {
  const [countdown, setCountdown] = useState(initialSeconds);

  useEffect(() => {
    if (countdown === 0) return;

    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countdown]);

  return countdown;
};

const ErrorCountdown: React.FC<ErrorCountdownProps> = ({
  initialSeconds,
  fetchData,
  setGameOver,
}) => {
  const countdown = useCountdown(initialSeconds);

  useEffect(() => {
    if (countdown === 0) {
      setGameOver(false);
      fetchData();
    }
  }, [countdown]);

  return (
    <div>
      <h2>Rate limit hit</h2>
      <p>
        <strong>Too many requests.</strong> Each IP may only access the API once
        every 5 seconds.
      </p>
      <p>Retrying in {countdown} seconds... Please hold.</p>
    </div>
  );
};

export default ErrorCountdown;
