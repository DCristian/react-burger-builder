import * as firebase from 'firebase/app';
import 'firebase/database';

import { FirebaseConfig } from './firebaseConfig/keys';
firebase.initializeApp(FirebaseConfig);

export const databaseRef = firebase.database().ref();