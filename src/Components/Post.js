import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
import '../Post.css'
import Avatar from '@material-ui/core/Avatar'
import Card from '@material-ui/core/Card';
import QuestionAnswerTwoToneIcon from '@material-ui/icons/QuestionAnswerTwoTone'
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone';
import firebase from 'firebase'
import DeleteForeverTwoToneIcon from '@material-ui/icons/DeleteForeverTwoTone';
import DropDownPostMenu from './DropDownPostMenu'

function Post({ postID, username, user, imgsrc, caption}) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    const [openComment, setOpenComment] = useState(false)

    useEffect(() => {
        let unsubscribe
        if(postID){
            unsubscribe = db.collection('posts')
                            .doc(postID)
                            .collection('comments')
                            .orderBy('timestamp', 'asc')
                            .onSnapshot((snapshot) => {
                               setComments(snapshot.docs.map(doc => ({
                                   id: doc.id,
                                   comment: doc.data()
                            })
                               
                        ))
                    })
        }

        return (() => {
            unsubscribe()
        })
    }, [postID])

    const postComment = (e) => {
        e.preventDefault()
        db.collection('posts')
          .doc(postID)
          .collection('comments')
          .add({
              text: comment,
              username: user.displayName,
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
          })

          setComment('')

    } 

    const deleteComment = (commentID) => {

        db.collection('posts').doc(postID).collection('comments').doc(commentID).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });

    }

    const deletePost = () => {

        db.collection('posts').doc(postID).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }

    return (
        <Card id="postCard">
            <div className="post">
                <div className='postHeader'>
                    <div className="postUserAvatar">
                       <Avatar
                        className="postAvatar"
                        alt={ username }
                        src="/static/images/avatar/1.jpg"
                    />
                    <h4>{ username }</h4>  
                    </div>
                    <DropDownPostMenu deletePost={ deletePost } postID={ postID }/>
                    
                </div>
                <img className="postImage" src={ imgsrc } alt="postimg"></img>
                <div className="icons">
                    <FavoriteTwoToneIcon className="icon"/>
                    <QuestionAnswerTwoToneIcon className ="icon" onClick={() => setOpenComment(!openComment) }/>
                </div>
                <h4 className="postText"><span className="username">{ username }</span> { caption }</h4>
                { comments ? comments.map(({comment, id}) => {
                    return (
                    <div className="commentDisplay" key={ id } >
                        <h5 className="commentUsername"><strong>{ comment.username }</strong></h5>
                        <h5 className="commentText">{ comment.text }</h5>
                        <DeleteForeverTwoToneIcon className="icon" onClick={() => deleteComment(id) }/>

                    </div>    
                    )
                })
                : null
            }
            </div>
            <div>
                { user && openComment && (
                <form className="commentBox">
                    <input
                    className="commentInput"
                    type="text"
                    placeholder="Add comment"
                    value={ comment }
                    onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                    className="commentBtn" 
                    type="submit" 
                    onClick={ postComment } 
                    disabled={!comment}
                    >
                    Post
                    </button>
                    
                </form>
                )}
            </div>
        </Card>
    )
}

export default Post
