export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    institution?: string;
    position?: string;
    department?: string;
    employmentDate?: Date;
    grade?: string;
    role: string;  // Ensure this is an array of strings, even if empty
  }
  