import { Card, List, Typography, Avatar, Row, Col, Button, Modal, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { user_roles } from "../constants/user_roles";
import { useSelector } from 'react-redux';
import { itemColor, highlightBg, lightColor, darkColor } from "../constants/colors";
import { _fetch } from "../_fetch";
import { UserOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';

export default function AdminPanel() {
    let user = useSelector(st => st.user);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [spaces, setSpaces] = useState([]);
    const [resetPasswordModal, setResetPasswordModal] = useState(null);
    const [users, setUsers] = useState([]);
    const [newUserRole, setNewUserRole] = useState('');

    const init = async () => {
        try {
            setLoading(true);
            let res = await _fetch(`${process.env.REACT_APP_API_URL}/user`, {
                method: 'GET'
            });
            res = await res.json();
            if (res.status === 200) {
                setUsers(res.response)
            } else {
                message.error(res.response);
            }
            let spaceRes = await _fetch(`${process.env.REACT_APP_API_URL}/space?populateSeats=0&includeColossus=1`, {
                method: 'GET'
            });
            spaceRes = await spaceRes.json();
            if (spaceRes.status === 200) {
                setSpaces(spaceRes.response);
            } else {
                message.error(spaceRes.response);
            }
        } catch (err) {
            console.log(err);
            message.error('Something went wrong while fetching the users')
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        init();
    }, []);

    const addUser = async (values) => {
        try {
            let res = await _fetch(`${process.env.REACT_APP_API_URL}/user`, {
                method: 'POST',
                body: {
                    ...values
                }
            });
            res = await res.json();
            if (res.status === 200) {
                setVisible(false);
                setNewUserRole('');
                init();
                message.success(res.response);
            } else {
                message.error(res.response);
            }
        } catch (err) {
            console.log(err);
            message.error('Something went wrong while adding the user')
        }
    }

    const deleteUser = async (id) => {
        try {
            setLoading(true);
            let res = await _fetch(`${process.env.REACT_APP_API_URL}/user/${id}`, {
                method: 'DELETE',
            });
            res = await res.json();
            if (res.status === 200) {
                await init();
                message.success(res.response);
            } else {
                message.error(res.response);
            }
        } catch (err) {
            console.log(err);
            message.error('Something went wrong while deleting the user')
        } finally {
            setLoading(false);
        }
    }

    const resetPassword = async (values) => {
        if (resetPasswordModal === null) return;
        try {
            setLoading(true);
            let res = await _fetch(`${process.env.REACT_APP_API_URL}/user/${resetPasswordModal}`, {
                method: 'PATCH',
                body: {
                    ...values
                }
            });
            res = await res.json();
            if (res.status === 200) {
                setResetPasswordModal(null);
                message.success('Password updated successfully');
            } else {
                message.error(res.response);
            }
        } catch (err) {
            console.log(err);
            message.error('Something went wrong while reseting the password')
        } finally {
            setLoading(false);
        }
    }

    const handleRoleChange = (val) => {
        setNewUserRole(val);
    }

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <div
                    style={{
                        width: "100%",
                    }}
                >
                    <Card
                        hoverable
                        style={{
                            backgroundColor: highlightBg,
                            border: 'add',
                            borderRadius: '8px',
                        }}
                        bodyStyle={{
                            padding: '8px',
                        }}
                        onClick={() => {
                            setVisible(true);
                        }}
                    >
                        <Row
                            align={'middle'}
                            justify={'center'}
                        >
                            <Col
                                className="d-flex flex-row align-items-center justify-content-center"
                            >
                                <UserAddOutlined
                                    style={{
                                        margin: '0px 8px',
                                        color: itemColor,
                                        fontSize: '18px'
                                    }}
                                />
                                <Typography.Title
                                    level={3}
                                    style={{
                                        margin: '0px',
                                        color: itemColor
                                    }}
                                >
                                    Add User
                                </Typography.Title>
                            </Col>

                        </Row>

                    </Card>
                    <List
                        itemLayout="vertical"
                        dataSource={users}
                        renderItem={(item) => (
                            <List.Item>
                                <Card
                                    hoverable
                                    style={{
                                        backgroundColor: itemColor,
                                        border: `2px solid ${itemColor}`,
                                        borderRadius: '8px',
                                    }}
                                    bodyStyle={{
                                        padding: '8px',
                                    }}
                                    className='hoverable-antd-card'
                                >
                                    <Row
                                        align={'middle'}
                                        justify={'space-between'}
                                        gutter={[16, 16]}
                                    >
                                        <Col>
                                            <div
                                                className="d-flex flex-row align-items-center justify-content-start"
                                            >
                                                <Avatar
                                                    size='large'
                                                    icon={<UserOutlined />}
                                                    style={{
                                                        marginRight: '16px'
                                                    }}
                                                />
                                                <div>
                                                    <Typography.Title
                                                        level={4}
                                                        style={{
                                                            margin: '0px',
                                                            color: highlightBg,
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Typography.Title>
                                                    <Typography.Text
                                                        style={{
                                                            margin: '0px',
                                                            color: lightColor,
                                                        }}
                                                    >
                                                        {
                                                            `${item.role} @${item.organization?.name} ~ ${item.email}`
                                                        }
                                                    </Typography.Text>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div
                                                className="d-flex flex-row align-items-center justify-content-center"
                                            >
                                                <Button
                                                    style={{
                                                        margin: '0px 8px',
                                                        border: 'none',
                                                        boxShadow: 'none',
                                                    }}
                                                    onClick={() => {
                                                        setResetPasswordModal(item._id);
                                                    }}
                                                >
                                                    Reset Password
                                                </Button>
                                                <Button
                                                    icon={<DeleteOutlined
                                                        style={{
                                                            color: lightColor,
                                                        }}
                                                    />}
                                                    onClick={() => {
                                                        if (item._id === user._id) {
                                                            message.error('You cannot delete yourself');
                                                        } else {
                                                            deleteUser(item._id)
                                                        }
                                                    }}
                                                    style={{
                                                        margin: '0px 8px',
                                                        border: 'none',
                                                        boxShadow: 'none',
                                                    }}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            </List.Item>
                        )}
                    />
                    <Modal
                        title='Add User'
                        open={visible}
                        footer={null}
                        onCancel={() => {
                            setNewUserRole('');
                            setVisible(false);
                        }}
                        destroyOnClose
                    >
                        <Form
                            labelCol={{
                                span: 6,
                            }}
                            wrapperCol={{
                                span: 14,
                            }}
                            layout="horizontal"
                            onFinish={addUser}
                        >
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the name!',
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Name"
                                    style={{
                                        border: 'none',
                                        backgroundColor: itemColor,
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the email!',
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Email"
                                    style={{
                                        border: 'none',
                                        backgroundColor: itemColor,
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the password!',
                                    },
                                ]}
                            >
                                <Input.Password
                                    placeholder="Password"
                                    style={{
                                        border: 'none',
                                        backgroundColor: itemColor,
                                    }}
                                    className="add-user-pw"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Role"
                                name="role"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select the user role!',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Role"
                                    className="add-user-role-selecter"
                                    popupClassName="add-user-role-selecter-popup"
                                    onChange={handleRoleChange}
                                >
                                    <Select.Option
                                        value={user_roles.ADMIN}
                                    >
                                        {user_roles.ADMIN}
                                    </Select.Option>
                                    <Select.Option
                                        value={user_roles.SPACE_ADMIN}
                                    >
                                        {user_roles.SPACE_ADMIN}
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Space"
                                name="organization"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please choose the space!',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Space"
                                    className="add-user-role-selecter"
                                    popupClassName="add-user-role-selecter-popup"
                                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                >

                                    {
                                        newUserRole === user_roles.ADMIN && (
                                            spaces.filter((item) => item.name?.toLowerCase().includes('colossus')).map((item) => (
                                                <Select.Option
                                                    value={item._id}
                                                    key={item._id}
                                                    label={item.name}
                                                >
                                                    {item.name}
                                                </Select.Option>
                                            ))
                                        )
                                    }
                                    {
                                        newUserRole !== user_roles.ADMIN && (
                                            spaces.filter((item) => !item.name?.toLowerCase().includes('colossus')).map((item) => (
                                                <Select.Option
                                                    value={item._id}
                                                    key={item._id}
                                                    label={item.name}
                                                >
                                                    {item.name}
                                                </Select.Option>
                                            ))
                                        )
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 6,
                                    span: 14,
                                }}
                            >
                                <Button
                                    type="primary"
                                    style={{
                                        border: 'none',
                                        boxShadow: 'none',
                                        color: darkColor
                                    }}
                                    htmlType="submit"
                                >
                                    Add User
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Modal
                        title='Reset Password'
                        open={resetPasswordModal !== null}
                        footer={null}
                        onCancel={() => {
                            setResetPasswordModal(null);
                        }}
                        destroyOnClose
                    >
                        <Form
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 14,
                            }}
                            layout="horizontal"
                            onFinish={resetPassword}
                        >
                            <Form.Item
                                label="New Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the new password!',
                                    },
                                ]}
                            >
                                <Input.Password
                                    placeholder="New Password"
                                    style={{
                                        border: 'none',
                                        backgroundColor: itemColor,
                                    }}
                                    className="add-user-pw"
                                />
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 14,
                                }}
                            >
                                <Button
                                    type="primary"
                                    style={{
                                        border: 'none',
                                        boxShadow: 'none',
                                        color: darkColor
                                    }}
                                    htmlType="submit"
                                >
                                    Reset Password
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            )}
        </div>
    );
}