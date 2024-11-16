import { IBook } from "../interfaces/IBook";

export abstract class BooksRepository {
  // Создание книги
  abstract createBook(book: IBook): Promise<IBook>; // возвращаем промис

  // Получение книги по ID
  abstract getBook(id: string): Promise<IBook | null>; // здесь может не быть книги, тогда null?

  // Получение всех книг
  abstract getBooks(): Promise<IBook[]>; // массив книг

  // Обновление книги
  abstract updateBook(id: string, book: IBook): Promise<IBook | null>;

  // Удаление книги
  abstract deleteBook(id: string): Promise<boolean>; // получаем ответ true/false
}
