import Challenge from '@modules/challenges/infra/typeorm/entities/Challenge';
import ICreateChallengeDTO from '@modules/challenges/dtos/ICreateChallengeDTO';

export default interface IChallengesRepository {
  create(data: ICreateChallengeDTO): Promise<Challenge>;
  update(challenge: Challenge): Promise<Challenge>;
  delete(challenge_id: string): Promise<void>;
  findByDescription(description: string): Promise<Challenge | undefined>;
  findByTitle(title: string): Promise<Challenge | undefined>;
  listAll(take: number, skip: number): Promise<Challenge[]>;
}
