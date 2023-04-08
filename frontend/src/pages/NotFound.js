
import { Typography } from "antd";
import { bgColor } from "../constants/colors";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
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
                404 Not Found
            </Typography.Title>
            <Typography.Text>
                The page you are looking for has not been created yet.
            </Typography.Text>
            <Typography.Text>
                Dont know where to start? Click here for <Typography.Link onClick={() => navigate('/')}>Home</Typography.Link>
            </Typography.Text>

        </div>
    )
}