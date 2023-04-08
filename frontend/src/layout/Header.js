import { useState, useEffect } from "react";
import { Row, Col, Dropdown, Button, message } from "antd";
import { BsBuildings, BsCursorFill } from "react-icons/bs";
import { useSelector, useDispatch } from 'react-redux';
import { user_roles } from "../constants/user_roles"
import { darkColor, highlightBg, itemColor, lightColor } from "../constants/colors";
import { _fetch } from "../_fetch"
import { changeSelectedSpace } from "../store/action/space";

function Header() {
    const dispatch = useDispatch();
    const { role, organization } = useSelector(state => state.user);
    const toggle = useSelector(state => state.toggle);
    const [selectedKey, setSelectedKey] = useState('1');
    const [space, setSpace] = useState('Choose Space');
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const isDisabled = role !== user_roles.ADMIN || loading;

    const init = async (toDispatch = true) => {
        try {
            setLoading(true);
            if (role === user_roles.ADMIN) {
                let res = await _fetch(`${process.env.REACT_APP_API_URL}/space?populateSeats=0`, {
                    method: 'GET'
                });
                res = await res.json();
                if (res.status === 200) {
                    setSpaces(res.response);
                    if (res.response.length > 0) {
                        if (toDispatch){
                            setSelectedKey(res.response[0]._id);
                            setSpace(res.response[0].name);
                            dispatch(changeSelectedSpace(res.response[0]));
                        }
                    }
                } else {
                    message.error(res.response);
                }
            } else {
                if (!organization || !organization._id) return;
                let res = await _fetch(`${process.env.REACT_APP_API_URL}/space/${organization._id}?populateSeats=0`, {
                    method: 'GET'
                });
                res = await res.json();
                if (res.status === 200) {
                    setSpaces([
                        res.response
                    ]);
                    setSelectedKey(res.response._id);
                    setSpace(res.response.name);
                    dispatch(changeSelectedSpace(res.response));
                } else {
                    message.error(res.response);
                }
            }
        } catch (err) {
            console.log(err);
            message.error('Something went wrong while fetching spaces');
        } finally {
            setLoading(false);
        }
    }

    function getItems(item) {
        return {
            label: item.name,
            key: item._id,
            style: {
                backgroundColor: selectedKey === item._id ? highlightBg : 'transparent',
                color: selectedKey === item._id ? darkColor : lightColor,
            }
        }
    }

    const menuItems = spaces.map((item) => getItems(item));

    const handleMenuItemClick = (key) => {
        const item = spaces.find((item) => item._id === key);
        dispatch(changeSelectedSpace(item));
        setSelectedKey(key);
        setSpace(item.name);
    }

    useEffect(() => {
        init(toggle.toDispatchSpace);
    }, [toggle]);

    return (
        <div>
            <Row
                justify="end"
                align="middle"
                gutter={[12, 12]}
            >
                {
                    role === user_roles.SPACE_ADMIN && (
                        <Col>
                            <Button
                                size="large"
                                type="primary"
                                icon={<BsCursorFill
                                    style={{
                                        marginRight: '5px',
                                    }}
                                />}
                                style={{
                                    boxShadow: 'none',
                                    color: darkColor,
                                    border: 'none',
                                }}
                                onClick={() => {
                                    window.open('/booknow', '_blank');
                                }}
                            >
                                Book Now
                            </Button>
                        </Col>
                    )
                }
                <Col>
                    <Dropdown
                        trigger={['click']}
                        disabled={isDisabled}
                        menu={{
                            onClick: ({ key }) => handleMenuItemClick(key),
                            items: menuItems,
                            defaultSelectedKeys: [selectedKey],
                            selectedKeys: [selectedKey],
                            style: {
                                backgroundColor: itemColor,
                                boxShadow: 'none',
                            }
                        }}
                    >
                        <Button
                            size="large"
                            type="primary"
                            loading={loading}
                            icon={<BsBuildings
                                style={{
                                    marginRight: '5px',
                                }}
                            />}
                            style={{
                                boxShadow: 'none',
                                color: isDisabled ? lightColor : darkColor,
                                border: 'none',
                            }}
                        >
                            {space}
                        </Button>
                    </Dropdown>
                </Col>
            </Row>
        </div>
    );
}

export default Header;