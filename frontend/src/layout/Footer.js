
import { Col, Row, Typography } from "antd";
import { highlightBg, primaryColor, secondaryTextColor } from "../constants/colors";
function Footer(){
    return (
        <div
            style={{
                width: '100%',
            }}
        >
            <Row
                justify="center"
                align="middle"
            >
                <Col>
                    <div
                        className="d-flex flex-column justify-content-center align-items-center"
                    >
                        <Typography.Text
                            style={{
                                textAlign: 'center',
                            }}
                        >
                            Made with <span style={{ color: highlightBg }}>❤</span> by <span style={{ color: highlightBg }}>Team 404</span>
                        </Typography.Text>

                        <Typography.Text
                            style={{
                                textAlign: 'center',
                                color: secondaryTextColor,
                            }}
                        >
                            © 2023 Colossus. All rights reserved.
                        </Typography.Text>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Footer;