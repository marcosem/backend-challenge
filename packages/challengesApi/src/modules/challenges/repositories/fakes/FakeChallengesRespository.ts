import Challenge from '@modules/challenges/infra/typeorm/entities/Challenge';
import ICreateChallengeDTO from '@modules/challenges/dtos/ICreateChallengeDTO';
import IChallengesRepository from '@modules/challenges/repositories/IChallengesRepository';
import { v4 } from 'uuid';

class FakeChallengesRepository implements IChallengesRepository {
  private challenges: Challenge[] = [];

  public async create({
    title,
    description,
  }: ICreateChallengeDTO): Promise<Challenge> {
    const challenge = new Challenge();

    Object.assign(challenge, {
      id: v4(),
      title,
      description,
    });

    this.challenges.push(challenge);

    return challenge;
  }

  public async update(challenge: Challenge): Promise<Challenge> {
    this.challenges = this.challenges.map(oldChallenge =>
      oldChallenge.id !== challenge.id ? oldChallenge : challenge,
    );

    return challenge;
  }

  public async delete(challenge_id: string): Promise<void> {
    const listWithoutRemovedChallenge = this.challenges.filter(
      oldChallenge => oldChallenge.id !== challenge_id,
    );
    this.challenges = listWithoutRemovedChallenge;
  }

  public async findByDescription(
    description: string,
  ): Promise<Challenge | undefined> {
    const findChallenge = this.challenges.find(
      chal => chal.description === description,
    );

    return findChallenge;
  }

  public async findByTitle(title: string): Promise<Challenge | undefined> {
    const findChallenge = this.challenges.find(chal => chal.title === title);

    return findChallenge;
  }

  public async listAll(take = -1, skip = -1): Promise<Challenge[]> {
    if (take < 0 && skip < 0) {
      return this.challenges;
    }

    const paginatedList = this.challenges.slice(skip, take + skip);
    return paginatedList;
  }
}

export default FakeChallengesRepository;
