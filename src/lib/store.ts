import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';

const storeExample: Writable<string> = localStorageStore('storeExample', 'skelly user');
const slimUser: Writable<object> = localStorageStore('slimUser',{name:"rick", email:"idk bro"});
const userEmail: Writable<string> = localStorageStore('userEmail', 'none');
const userId: Writable<string> = localStorageStore('userId', 'user id');

export { storeExample, slimUser, userEmail, userId }