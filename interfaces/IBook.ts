export interface IBook {
    _id?: string; // пока оставил, уберу, если будем подключаться к БД
    title: string;
    description: string;
    authors: string;
    favorite: boolean;
    fileCover: string;
    fileName: string;
    }