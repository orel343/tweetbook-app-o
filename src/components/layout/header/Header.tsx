import React from 'react';
import s from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faPlus,
  faArrowRightToBracket,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../hooks/use-auth';
import { Link } from 'react-router-dom';
import Avatar from '../../avatar/Avatar';
import CreatePost from '../../createPost/CreatePost';
import { auth } from '../../../firebase';
import Searchbar from '../../searchbar/Searchbar';

const Header: React.FC = () => {
  const { isAuth } = useAuth();
  const [createPostMode, setCreatePostMode] = React.useState<boolean>(false);

  return (
    <>
      {createPostMode && <CreatePost setCreatePostMode={setCreatePostMode} />}
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.logo}>
            <Link to="/">
           
              <span>Tweetbook</span>
            </Link>
          </div>
          <div className={s.actions}>
            <Searchbar />

            {isAuth ? (
              <>
                <div className={s.create} onClick={() => setCreatePostMode(true)}>
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Create</span>
                </div>
                <div className={s.avatar}>
                  <Link to={`/users/${auth.currentUser?.uid}`}>
                    <Avatar id={auth.currentUser?.uid} />
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className={s.signIn}>
                  <Link to="login">
                    <FontAwesomeIcon icon={faArrowRightToBracket} />
                    <span>Log in</span>
                  </Link>
                </div>
                <div className={s.signUp}>
                  <Link to="register">
                    <FontAwesomeIcon icon={faUserPlus} />
                    <span>Register</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
