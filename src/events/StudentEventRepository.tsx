import { db } from '../firebase';
import { BaseRepository } from '../repositories/BaseRepository';
import { StudentEventProps } from './StudentEventProps';

export class StudentEventRepository extends BaseRepository<StudentEventProps> {
  constructor(studentId: string) {
    super(db, 'students/' + studentId + '/events');
  }
}
