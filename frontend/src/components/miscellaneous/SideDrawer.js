import { Box, Button, Input, Spinner, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { color } from 'framer-motion';
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, } from '@chakra-ui/react'
import { Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup, MenuOptionGroup, MenuDivider, } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import ChatLoading from '../ChatLoading';
import axios from "axios"
import UserListItem from '../UsersAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import '../style.css'


const SideDrawer = () => {
    const history = useHistory()
    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const logoutHandler = () => {
        localStorage.removeItem("userInfo")
        history.push("/")
    }
    const toast = useToast()
    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Please enter email .',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top-left"
            })
            return

        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const { data } = await axios.get(`/api/user?search=${search}`, config)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: 'Error occured',
                description: "Failed to load search results",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })

        }
    }
    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)
            const config = {
                headers: {
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.post("/api/chat", { userId }, config)
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats])
            setSelectedChat(data)
            setLoadingChat(false)
            onclose()

        } catch (error) {
            toast({
                title: 'Error fetching the chat',
                description: "Failed to load search results",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })

        }


    }

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()
    return (
        <> <Box display={"flex"} justifyContent={"space-between"} bg={"white"} alignItems={"center"} w={"100%"}
            p={"5px 10px 5px 10px"} borderWidth={"5px"}>
            <Tooltip
                label="Search Users to chat"
                hasArrow
                placement="bottom-end">
                <Button variant={"ghost"} color={"white"} onClick={onOpen}>
                    <i style={{ color: "black" }} class="fas fa-search"></i>

                    <Text style={{ color: "black" }} d={{ base: "none", md: "flex" }} px={"4"}>Search User</Text>
                </Button>
            </Tooltip>
            <Text fontSize={"2xl"}
                fontFamily={"Work sans"}>
                Chat Application
            </Text>
            <div>
                <Menu>
                    <MenuButton p={"1px"}>
                        <BellIcon fontSize="2xl" m={"1px"} />
                        {notification.length > 0 && (
                            <div className="notification-badge">
                                <span className="badge">
                                    {notification.length}
                                </span>
                            </div>
                        )}
                    </MenuButton>


                    <MenuList pl={"2px"}>
                        {!notification.length && "No New Messages"}
                        {notification.map((item) => (
                            <MenuItem key={item._id} onClick={() => {
                                setSelectedChat(item.chat)
                                setNotification(notification.filter((n) => n !== item))
                            }}>
                                {
                                    item.chat.isGroupChat ? `New Message in ${item.chat.chatName}`
                                        : `New Message from ${getSender(user, item.chat.users)}`
                                }


                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>

                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>

                        <Avatar size='sm' cursor={"pointer"} name={user.name} src={user.pic} />

                    </MenuButton>
                    <MenuList>
                        <ProfileModal user={user}>
                            <MenuItem>My Profile</MenuItem>

                        </ProfileModal>
                        <MenuDivider />
                        <MenuItem onClick={logoutHandler}>Logout</MenuItem>

                    </MenuList>
                </Menu>

            </div>

        </Box>
            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>

                    <DrawerBody>
                        <Box display={"flex"} pb={"2"}>
                            <Input placeholder='Search by name orEmail'
                                mr={"2"} value={search}
                                onChange={(e) => setSearch(e.target.value)} />
                            <Button onClick={handleSearch}>
                                Go
                            </Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    user={user}
                                    key={user._id}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {loadingChat && <Spinner ml={"auto"} display={"flex"} />}



                    </DrawerBody>


                </DrawerContent>

            </Drawer>

        </>
    )
}

export default SideDrawer