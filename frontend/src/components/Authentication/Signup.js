import React, { useState } from 'react'
import { FormControl, FormLabel, FormErrorMessage, FormHelperText } from '@chakra-ui/react'
import { VStack, Button } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom';

import { Input, InputGroup, InputRightElement } from '@chakra-ui/input'
import { useToast } from '@chakra-ui/react'
import axios from "axios"
const Signup = () => {
    const toast = useToast()
    const [show, setShow] = useState(false)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmpassword, setConfirmpassword] = useState()
    const [pic, setPic] = useState()
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const handleClick = () => setShow(!show)
    const postDetails = (pics) => {
        setLoading(true)
        if (pics === undefined) {
            toast({
                title: "please select an image.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData()
            data.append("file", pics)
            data.append("upload_preset", "chat-app")
            data.append("cloud_name", "dcmizeepl")
            fetch("https://api.cloudinary.com/v1_1/dcmizeepl/image/upload", {
                method: "post",
                body: data
            }).then((res => res.json())).then(data => {
                setPic(data.url.toString())
                setLoading(false)
                console.log(data.url.toString())

            })
                .catch((error) => {
                    console.error();
                })
        } else {
            toast({
                title: "please select an image.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false)
            return

        }
    }
    const submitHandler = async () => {
        setLoading(true)
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: "please fill all fields.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false)
            return
        }
        if (password !== confirmpassword) {
            toast({
                title: "password Do not match.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                },
            }
            const { data } = await axios.post("/api/user/", { name, email, password, pic }, config)
            toast({
                title: "Registration success",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            localStorage.setItem("userInfo", JSON.stringify(data))
            setLoading(false)
            history.push('/')
        } catch {
            toast({
                title: "Error Occurred",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false)

        }
    }


    return (
        <VStack spacing="5px">
            <FormControl isRequired>
                <FormLabel>
                    Name
                </FormLabel>
                <Input placeholder='Enter your name' onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>
                    Email
                </FormLabel>
                <Input placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>
                    Password
                </FormLabel>
                <InputGroup>
                    <Input placeholder='Enter your password' type={show ? "text" : 'password'}
                        onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick} >
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl isRequired>
                <FormLabel>
                    Confirm Password
                </FormLabel>
                <InputGroup>
                    <Input placeholder='Enter your confirm password' type={show ? "text" : 'password'}
                        onChange={(e) => setConfirmpassword(e.target.value)} />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick} >
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl>
                <FormLabel>
                    Upload picture
                </FormLabel>
                <Input type='file' p={1.5} accept='image/*' onChange={(e) => postDetails(e.target.files[0])} />
            </FormControl>
            <Button colorScheme='blue' style={{ marginTop: "15px" }} width={"100%"} onClick={submitHandler} isLoading={loading}>
                Sign Up
            </Button>

        </VStack>
    )
}

export default Signup