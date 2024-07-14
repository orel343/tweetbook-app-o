import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useUserData } from '../../hooks/useUsers';
import { PostDataType } from '../../types/postData.type';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import s from './PostBlock.module.scss';
import { faComment, faHeart, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { auth } from '../../firebase';
import { onLike } from '../../utils/onLike';
import CommentsList from '../commentsList/CommentsList';
import CreateComment from '../createComment/CreateComment';
import { Link, useNavigate } from 'react-router-dom';
import { useComments } from '../../hooks/useComments';
import PhotoViewer from '../photoViewer/PhotoViewer';
import { deletePost } from '../../utils/deletePost';

const PostBlock: React.FC<PostDataType> = ({ id, text, image, author, date, likes }) => {
  const { userData } = useUserData(author.id);
  const [commentMode, setCommentMode] = React.useState<boolean>(false);
  const [isPostLiked, setIsPostLiked] = React.useState<boolean>();
  const [imageViewMode, setImageViewMode] = React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [showRegulationsModal, setShowRegulationsModal] = React.useState<boolean>(false);
  const [termsAgreed, setTermsAgreed] = React.useState<boolean>(false);
  const { comments, getComments } = useComments();
  const navigate = useNavigate();

  React.useEffect(() => {
    (async () => {
      await getComments(id);
    })();
  }, [comments]);

  React.useEffect(() => {
    if (auth.currentUser !== null) {
      setIsPostLiked(likes.includes(auth.currentUser?.uid));
    }
  }, [likes]);

  const handleDeletePost = async () => {
    if (termsAgreed) {
      await deletePost(id);
      setShowDeleteModal(false);
    } else {
      alert('You must agree to the terms before deleting the post.');
    }
  };

  return (
    <div className={s.post}>
      {imageViewMode && <PhotoViewer image={image} setMode={setImageViewMode} />}
      <div className={s.author}>
        <Link to={`/users/${userData?.id}`}>
          <img src={userData?.avatar} alt="avatar" />
        </Link>
        <div className={s.authorInfo}>
          <Link to={`/users/${userData?.id}`}>
            <h4>{userData?.firstName + ' ' + userData?.lastName}</h4>
          </Link>
          <span>{formatDistanceToNow(date)} ago</span>
        </div>
      </div>
      {text && <div className={s.description}>{text}</div>}
      {image && (
        <div className={s.images} onClick={() => setImageViewMode(true)}>
          <img src={image} alt="post" />
        </div>
      )}
      <div className={s.actions}>
        <div className={s.like}>
          <FontAwesomeIcon
            onClick={() => {
              if (auth.currentUser) {
                onLike(id, auth.currentUser?.uid, isPostLiked!);
              } else {
                navigate('/login');
              }
            }}
            icon={faHeart}
            style={{ color: isPostLiked ? '#e0245e' : '' }}
          />
          <span>{likes.length}</span>
        </div>
        <div className={s.comment}>
          <FontAwesomeIcon
            icon={faComment}
            style={{ color: commentMode ? '#1d3a5f' : '' }}
            onClick={() => setCommentMode(!commentMode)}
          />
          <span>{comments?.length}</span>
        </div>
        {auth.currentUser?.uid === author.id && (
          <div className={s.delete}>
            <FontAwesomeIcon
              icon={faTrashCan}
              onClick={() => setShowDeleteModal(true)}
            />
          </div>
        )}
      </div>
      {commentMode && (
        <div className={s.commentsSection}>
          <CreateComment postID={id} />
          <div className={s.comments}>
            <CommentsList postID={id} />
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className={s.deleteModal}>
          <div className={s.modalContent}>
            <p className='deletewantyou'>If you click delete you agree to our regulations</p>
            <br />
            <button className={s.regulationsButton} onClick={() => setShowRegulationsModal(true)}>
              Regulations
            </button>
            <button className={s.deleteButton} onClick={handleDeletePost}>
              Delete
            </button>
            <button className={s.cancelButton} onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {showRegulationsModal && (
        <div className={s.regulationsModal}>
          <div className={s.modalContent}>
            <h3>Regulations for Deleting Posts</h3>
            <ul>
              <li>Ensure that you have the right to delete the content you are removing.</li>
              <li>Deleting a post is permanent and cannot be undone.</li>
              <li>Understand that deleting content may impact your account's reputation.</li>
              <li>Make sure that you are not violating any community guidelines.</li>
              <li>Be aware that this action will remove all associated comments and likes.</li>
            </ul>
            <label>
              <input 
                type="checkbox" 
                checked={termsAgreed}
                onChange={() => setTermsAgreed(!termsAgreed)}
                className={s.cancelButton} 
              />
              I agree to the terms
            </label>
            <div className={s.modalActions}>
              <button 
                className={s.agreeButton} 
                onClick={handleDeletePost}
                disabled={!termsAgreed}
              >
                Delete
              </button>
              <button 
                className={s.cancelButton} 
                onClick={() => setShowRegulationsModal(false)}
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostBlock;
