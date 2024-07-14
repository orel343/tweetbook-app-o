import React from 'react';
import swal from 'sweetalert';
import { collection, addDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { uuidv4 } from '@firebase/util';
import { auth, db, storage } from '../firebase';
import { StoryDataType } from '../types/storyData.type';

interface Story {
  url: string;
  duration?: number;  // Optional duration for the story
}

export const useStories = () => {
  const [stories, setStories] = React.useState<StoryDataType[]>();
  const [storyImages, setStoryImages] = React.useState<Story[]>([]);

  // Upload a new story
  async function uploadStory(story: string) {
    const fileRef = ref(storage, 'storyImages/' + uuidv4() + '.png');

    if (story) {
      try {
        await uploadString(fileRef, story, 'data_url');
        const storyImageURL = await getDownloadURL(fileRef);
        const storiesCollectionRef = collection(db, 'stories');
        await addDoc(storiesCollectionRef, {
          id: uuidv4(),
          author: {
            id: auth.currentUser?.uid,
          },
          image: storyImageURL,
          date: Date.now()
        });
      } catch (e) {
        swal({
          title: 'Oops ErRoR...',
         
          icon: 'error',
        });
      }
    } else {
      swal({
        title: 'You must fill all fields.',
        icon: 'warning',
      });
    }
  }

  // Get stories and update state
  const getStories = async () => {
    const q = query(collection(db, 'stories'), orderBy('date', 'desc'));
    onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ ...doc.data() as StoryDataType, id: doc.id }));
      setStories(data);
    });
  };

  // Get story images and update state
  const getStoryImages = async () => {
    const q = query(collection(db, 'stories'), orderBy('date', 'desc'));
    onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ url: doc.data().image })) as Story[];
      setStoryImages(data);
    });
  };

  return { stories, storyImages, getStories, uploadStory, getStoryImages };
};
