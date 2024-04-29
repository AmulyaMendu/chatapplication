import React, { useEffect } from 'react'
import { Container, Box, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useHistory } from 'react-router-dom'
export default function HomePage() {
    const history = useHistory()
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"))

        if (user) history.push("/chats")

    }, [history])
    return (
        <Container maxW='xl' centerContent>
            <Box bg={"white"} p={3} width="100%" m="40px 0 15px 0" borderRadius="3px" borderWidth="1px" d="flex" justifyContent="center">
                <Text fontSize="4xl" fontFamily="Work sans" color="black"> CHAT APPLICATION
                </Text>
            </Box >
            <Box p={3} bg={"white"} width="100%" borderRadius="3px" borderWidth="1px">
                <Tabs variant='soft-rounded' colorScheme='blue'>
                    <TabList mb="1em" >
                        <Tab width="50%">Login</Tab>
                        <Tab width="50%">Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>

            </Box>
        </Container>
    )
}
