import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/ChatLogics'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import axios from 'axios'
import "./style.css"
import Lottie from 'react-lottie'
import animationData from '../animations/typing.json'
import ScrollableChat from './ScrollableChat'
import io from "socket.io-client"
const ENDPOINT = "http://localhost:7000"
var socket, selectedChatCompare


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()
    const toast = useToast()
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    }

    const fetchMessages = async () => {
        if (!selectedChat) return
        try {

            const config = {
                headers: {
                    // "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            }
            setLoading(true)
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)
            // console.log(messages)
            setMessages(data)
            setLoading(false)
            socket.emit("join chat", selectedChat._id)
        } catch (error) {
            toast({
                title: 'Error occured',
                description: "Failed to load the message",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })

        }

    }



    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            try {

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                }
                const { data } = await axios.post(`/api/message`, {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)
                // console.log(data)
                setNewMessage("")

                socket.emit("new Message", data)


                setMessages([...messages, data])
            } catch (error) {
                toast({
                    title: 'Error occured',
                    description: "Failed to send the message",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                })
            }
        }

    }




    const typeHandler = (e) => {
        setNewMessage(e.target.value)

        //typing indicator logic
        if (!socketConnected) return
        if (!typing) {
            setTyping(true)
            socket.emit("typing", selectedChat._id)

        }
        let lastTypingTime = new Date().getTime()
        var timerLength = 3000
        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime

            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id)
                setTyping(false)
            }
        }, timerLength);
    }


    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit("setup", user)
        socket.on("connected", () => setSocketConnected(true))
        socket.on("typing", () => setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false))

    }, [])

    useEffect(() => {
        fetchMessages()


        selectedChatCompare = selectedChat

    }, [selectedChat])

    console.log(notification, "==========")


    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                //give notification

                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification])
                    setFetchAgain(!fetchAgain)
                }
            } else {
                setMessages([...messages, newMessageRecieved])
            }
        })
    })


    return (
        <>
            {selectedChat ? (
                <>
                    <Text pb={"3px"} px={"3px"} fontSize={{ base: "28px", md: "30px" }}
                        fontFamily={"Work sans"} display={"flex"} w={"100%"}
                        justifyContent={{ base: "space-between" }} alignItems={"center "} color={"black"}>
                        <IconButton display={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => selectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>{getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                            </>
                        )}

                    </Text>
                    <Box display={"flex"}
                        flexDir={"column"}
                        justifyContent={"flex-end"} p={"3px"}
                        bg={"#E8E8E8"} w={"100%"} h={"100%"}

                        borderRadius={"1g"}
                        overflowY={"hidden"}
                    >

                        {loading ? (<Spinner size={"xl"} w={"20px"} h={"20px"}
                            alignSelf={"center"} margin={"auto"} />) : (
                            <div className='messages'>
                                <ScrollableChat messages={messages} />

                                {/*messages*/} </div>
                        )}

                        <FormControl onKeyDown={sendMessage} isRequired mt={"3px"}>
                            {isTyping ? <div style={{ color: "black" }}
                            >
                                <Lottie options={defaultOptions}
                                    width={"70px"}
                                    style={{ marginBottom: "15px", marginLeft: "0px" }}
                                />

                            </div> : <></>}
                            <Input variant={"filled"} onChange={typeHandler}
                                placeholder='Enter a Message' color={"black"} value={newMessage} bg={"#E0E0E0"} />

                        </FormControl>

                    </Box>
                </>
            ) : (
                <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}>
                    <Text pb={"3px"} fontSize={"3xl"} fontFamily={"Work sans"} color={"black"}>
                        Click on a user to Start Chatting


                    </Text>




                </Box>
            )}


        </>
    )
}

export default SingleChat