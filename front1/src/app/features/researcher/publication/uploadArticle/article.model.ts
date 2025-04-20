import { User } from "../../../admin/users/user.service";
import { Domain } from "./domain.service";

export interface Contribution {
  id: number;
  user: User;
  type: string;
  date: Date;
  lieu: string;
}

export interface Article {
  id: number;
  doi: string;
  titre: string;
  keyword: string;
  description: string;
  status: string;
  user: User;
  domain?: Domain;
  domainId?: number;
  filePath?: string;
  contributions: Contribution[];
}


export interface Domain {
    id: number;
    name: string;
  }  