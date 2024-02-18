import {createContext} from 'react';
import {posts} from '../../data/posts';

export const PostsContext = createContext<any>(posts);
