import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <Box px={"2px"}
            py={"1px"}
            borderRadius={"5px"}
            m={"1px"}
            mb={"2px"}
            variant="solid"
            fontSize={"12px"}
            backgroundColor={"purple"}
            cursor={"pointer"}
            onClick={handleFunction} color={"white"}
        >

            {user.name}
            <CloseIcon pl={"1px"} />
        </Box>
    )
}

export default UserBadgeItem