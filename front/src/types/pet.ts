export interface Pet {
  _id: string;
  name: string;
  medical: Treatment[];
  members: Member[];
  groups: Group[];
  tasks: Task[];
  birthdate: Date;
  species: string;
  breed: string;
  height: string;
  weight: string;
  imgUrl: string;
}

export interface Treatment {
  _id: string;
  treatment: string;
  date: Date;
}

export interface Group {
  _id: string;
  name: string;
  description: string;
  members: any[];
  pets: Pet[];
}

export interface Member {
  _id: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  dateFrom: Date;
  dateTo: Date;
  isCompleted: boolean;
}
