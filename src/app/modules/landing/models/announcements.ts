import { User } from './user';
import { FormGroup } from '@angular/forms';

export interface Announcement {
  _id: string;
  title: string;
  content: string; // HTML text
  contentSummary: string;
  headline?: boolean;
  postedDate: Date;
  lastEdited: Date;
  createdBy: User;
  category: string;
  language: string;
  inEditMode?: boolean;
  editForm?: FormGroup;

}
