import {createContext} from 'react';
import {storiesData} from '../../data/stories';

export const StoriesContext = createContext<any>(storiesData);
