import React, { useEffect, useState } from 'react'
import { ChatState } from "../Context/ChatProvider"
import SideDrawer from '../components/miscellaneous/SideDrawer'
import MyChats from '../components/MyChats'
import { Box } from '@chakra-ui/react'
import ChatBox from '../components/ChatBox'
import { useHistory } from 'react-router-dom'
export default function ChatPage() {

    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false)
    console.log('User in ChatPage:', user);

    return (
        <div style={{ width: '100%' }}>

            {user && <SideDrawer />}
            <Box border={"1px solid white"} color={'white'}
                display={"flex"}
                justifyContent={"space-between"}
                w="100%"
                h="91.5vh"
                p="10px"
            >
                {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    );
}
