export interface UserItem {
    id: string,
    name: string;
    photoURL: string;
    tags: string[];
    uid: string;
};

export interface UserData {
    username: string;
    tags: string[];
    registrationComplete: boolean;
};
