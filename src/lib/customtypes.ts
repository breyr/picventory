export interface UserItem {
    id: string,
    name: string;
    description: string;
    photoURL: string;
    tags: string[];
    uid: string;
    createdAt: Date;
    updatedAt: Date;
};

export interface UserData {
    username: string;
    tags: string[];
    registrationComplete: boolean;
};
