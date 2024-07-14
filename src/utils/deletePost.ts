import { db } from '../firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export const deletePost = async (postId: string) => {
  try {
    await deleteDoc(doc(db, 'posts', postId));
    console.log('Post deleted successfully');
  } catch (error) {
    console.error('Error deleting post:', error);
  }
};
