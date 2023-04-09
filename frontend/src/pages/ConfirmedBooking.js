
import { Typography } from "antd";
import { bgColor } from "../constants/colors";
import { useNavigate } from "react-router-dom";

export default function BookingConfirmed() {
    const navigate = useNavigate();
    return (
        <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{
                height: '100vh',
                width: '100vw',
                backgroundColor: bgColor,
            }}
        >
            <Typography.Title>
                Booking Confirmed
            </Typography.Title>
            <Typography.Text>
                Your booking has been confirmed. You may reach the space at the time you have opted for.
            </Typography.Text>

        </div>
    )
}