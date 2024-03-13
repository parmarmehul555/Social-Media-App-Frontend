import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Button,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import useGetUser from '../hooks/useGetUser';

export default function Setting() {
    const [data, setData] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();
    const userData = useGetUser();

    const initialRef = useRef(null);
    const finalRef = useRef(null);

    async function handlePasswords(data) {
        await fetch('http://localhost:3030/user/changepassword', {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Authorization': `bearer ${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json'
            }
        })
    }
    return (
        <>
            <div>
                <button className='btn btn-primary' onClick={onOpen}>Change Password</button>
                <Modal
                    initialFocusRef={initialRef}
                    finalFocusRef={finalRef}
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{userData.userName}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <h5 style={{textAlign:'center'}}>Change Password</h5>
                            <FormControl>
                                <FormLabel>Current name</FormLabel>
                                <Input ref={initialRef} placeholder='Old Passwrod' onChange={(e) => {
                                    setData({ ...data, oldPassword: e.target.value });
                                }} />
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>New name</FormLabel>
                                <Input placeholder='New Password' onChange={(e) => {
                                    setData({ ...data, newPassword: e.target.value });
                                }} />
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={(e) => {
                                e.preventDefault();
                                handlePasswords(data);
                            }}>
                                Save
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </>
    )
}