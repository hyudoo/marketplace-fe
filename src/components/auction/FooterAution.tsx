interface FooterAuctionProps {
  startTime?: number;
  endTime?: number;
}
import { Chip } from "@nextui-org/react";
import moment from "moment";
import { useEffect, useState } from "react";

export const FooterAuction = ({ startTime, endTime }: FooterAuctionProps) => {
  const [text, setText] = useState<string>("");
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const startDateTime = moment(startTime);
    const endDateTime = moment(endTime);
    const updateCountdown = () => {
      const currentDateTime = moment(); // Thời gian hiện tại
      if (currentDateTime < startDateTime) {
        const remainingTime = moment.duration(
          startDateTime.diff(currentDateTime)
        );
        setCountdown(remainingTime.humanize());
        setText("Upcoming");
      } else if (currentDateTime < endDateTime) {
        const remainingTime = moment.duration(
          endDateTime.diff(currentDateTime)
        );
        setCountdown(remainingTime.humanize());
        setText("In progress");
      } else {
        setCountdown("Finnished");
      }
    };
    const interval = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <Chip
        startContent={<div>{text}</div>}
        endContent={<div>{countdown}</div>}
        color="primary"
        variant="flat"
      />
    </div>
  );
};
