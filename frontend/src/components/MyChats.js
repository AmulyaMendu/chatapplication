import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import { Text } from '@chakra-ui/react'
import "../App.css"
import GroupChatModal from './miscellaneous/GroupChatModal';
const MyChats = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState()
    const { selectedChat, user, setSelectedChat, chats, setChats } = ChatState();
    const toast = useToast()
    const fetchChats = async () => {
        try {

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const { data } = await axios.get(`/api/chat`, config)
            console.log(data)
            setChats(data)

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
    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
        fetchChats()
    }, [fetchAgain])

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDirection={"column"}
            alignItems={"center"} p={"3px"} bg={"white"} w={{ base: "100%", md: "31%" }}
            borderRadius={"1g"}

            borderWidth={"1px"}
        >
            <Box pb={"3px"} px={"3px"} fontSize={{ base: "28px", md: "30px" }}
                fontFamily={"Work sans"} display={"flex"} w={"100%"}
                justifyContent={"space-between"} alignItems={"center "} color={"black"}>
                My Chats
                <GroupChatModal>


                    <Button display={"flex"} fontSize={{ base: "17px", md: "10px", lg: "17px" }} rightIcon={<AddIcon />}>
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box display={"flex"} flexDir={"column"} p={"3px"} bg={"#F8F8F8"} w={"100%"} h={"100%"}
                borderRadius={"1g"}
                overflowY={"hidden"}>
                {chats ? (
                    <Stack overflowY={"scroll"}>
                        {chats.map((chat) => (
                            <Box onClick={() => setSelectedChat(chat)}
                                cursor={"pointer"}
                                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                color={selectedChat === chat ? "white" : "black"}
                                px={"3px"}
                                py={"2px"}
                                borderRadius={"1g"}
                                key={chat._id}>


                                <Text>
                                    {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                                </Text>

                            </Box>
                        ))}

                    </Stack>

                ) : (<ChatLoading />

                )}

            </Box>

        </Box>
    )
}

export default MyChats