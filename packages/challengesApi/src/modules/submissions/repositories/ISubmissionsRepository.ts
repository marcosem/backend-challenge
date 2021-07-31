import Submission from '@modules/submissions/infra/typeorm/entities/Submission';
import ICreateSubmissionDTO from '@modules/submissions/dtos/ICreateSubmissionDTO';

export default interface ISubmissionsRepository {
  create(data: ICreateSubmissionDTO): Promise<Submission>;
  update(submission: Submission): Promise<Submission>;
  findByChallengeId(challenge_id: string): Promise<Submission | undefined>;
  listAll(take: number, skip: number): Promise<Submission[]>;
  listByDate(dateStart: Date, dateEnd: Date): Promise<Submission[]>;
}
