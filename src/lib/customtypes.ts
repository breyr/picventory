type Item = {
    name: string;
    photoURL: string;
    tags: string[];
};

export interface UserData {
    username: string;
    items: Item[];
    tags: string[];
};
