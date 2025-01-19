export interface Club {
  _id: string;
  name: string;
  description: string;
  members: Member[];
  books: Book[];
}

export interface Member {
  _id: string;
  name: string;
  email: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  pages: number;
  cover: string;
  startDate: Date;
  endDate: Date;
  previewLink: string;
}
