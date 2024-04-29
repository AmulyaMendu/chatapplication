import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from "../UsersAvatar/UserBadgeItem"
import axios from 'axios'
import UserListItem from '../UsersAvatar/UserListItem'
const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { selectedChat, setSelectedChat, user } = ChatState()


    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)

    const toast = useToast()

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: 'User Already in group',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'only Admins can add users',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
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
            const { data } = await axios.put("/api/chat/groupadd", {
                chatId: selectedChat._id,
                userId: user1._id
            }, config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)

        } catch (error) {
            toast({
                title: 'Error Occured',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)

        }

    }
    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id === user._id) {
            toast({
                title: 'only admins can remove',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
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
            const { data } = await axios.put("/api/chat/groupremove", {
                chatId: selectedChat._id,
                userId: user1._id
            }, config)
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data)

            setFetchAgain(!fetchAgain)
            fetchMessages()
            setLoading(false)

        } catch (error) {
            toast({
                title: 'Error Occured',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)

        }


    }
    const handleRename = async () => {
        if (!groupChatName) return
        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const { data } = await axios.put("/api/chat/rename", {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)



        } catch (error) {
            toast({
                title: 'Error occured',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setRenameLoading(false)

        }
        setGroupChatName("")

    }
    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const { data } = await axios.get(`/api/user?search=${search}`, config)
            console.log(data)
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
    return (
        <>
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"35px"}
                        justifyContent={"center"} fontFamily={"Work sans"} display={"flex"}>{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                        <Box width={"100%"} display={"flex"} flexWrap={"wrap"} pb={"3px"}>
                            {selectedChat.users.map((u) => (
                                <UserBadgeItem key={user._id} user={u} handleFunction={() => handleRemove(u)} />
                            ))}

                        </Box>
                        <FormControl display={"flex"}>
                            <Input placeholder='Chat Name' mb={"3px"}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button variant={"solid"} color={"teal"}
                                ml={"1px"}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>

                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add user to group' mb={"1px"}
                                onChange={(e) => handleSearch(e.target.value)}

                            />
                        </FormControl>
                        {loading ? (<Spinner size={"1g"} />) : (
                            searchResult?.map((user) => (
                                <UserListItem key={user._id} user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' onClick={() => handleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>


        </>
    )
}

export default UpdateGroupChatModal