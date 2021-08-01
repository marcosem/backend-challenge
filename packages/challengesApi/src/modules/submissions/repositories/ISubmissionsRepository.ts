import Submission from '@modules/submissions/infra/typeorm/entities/Submission';
import ICreateSubmissionDTO from '@modules/submissions/dtos/ICreateSubmissionDTO';
import IListSubmissionsDTO from '@modules/submissions/dtos/IListSubmissionsDTO';

export default interface ISubmissionsRepository {
  create(data: ICreateSubmissionDTO): Promise<Submission>;
  update(submission: Submission): Promise<Submission>;
  findById(submission_id: string): Promise<Submission | undefined>;
  listAll(filters: IListSubmissionsDTO): Promise<Submission[]>;
}
