import React, { useState } from 'react'
import { Button, Card, FormControl, Input, InputLabel } from '@material-ui/core'
import '../SignUpForm.css'
import { auth } from 'firebase'
import LogInSignUpHeader from './LogInSignUpHeader'
import { db } from '../firebase'


const SignUpForm = ({setOpenModal}) => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const signUp = (e) => {
        e.preventDefault();

        auth().createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
            setOpenModal(false)
            
            authUser.user.updateProfile({
                displayName: username
            })
            return {
                uid: authUser.user.uid,
                username: username
            }
              
        }).then(({uid, username}) => {
            //Create separate database for querying later - no credentials etc.
            return db.collection('users').doc(username).set({
                userID: uid,
                username: username,
                photoURL: ''
            }).then(() => {
                console.log('User document set!')
            }).catch(err => {
                console.error('Error:', err)
            })
        }) 
        .catch((err) => {
            const errorCode = err.code;
            const errorMessage = err.message;
            if (errorCode === 'auth/weak-password') {
              alert('The password is too weak.');
            } else {
              alert(errorMessage);
            }  
        })
    } 

    return(
        <div className="signUpDiv">
            <LogInSignUpHeader />       
            
            <form className="signUpForm">
                <Card id="Card">
                <h2>Sign Up</h2>
                <FormControl className="input">
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <Input 
                        type="text"
                        id="username"
                        value={ username }
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </FormControl> 
                    
                <FormControl className="input">
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <Input 
                        type="email"
                        id="email"
                        value={ email }
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormControl>
                    
                <FormControl className="input">
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input 
                        type="password"
                        id="password"
                        value={ password }
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormControl>
                </Card>
                <Button type="submit" onClick={ signUp } variant="contained" color="primary" className="signUpBtn">Sign Up</Button>
            </form>
           
            
        </div>
    )

}


export default SignUpForm