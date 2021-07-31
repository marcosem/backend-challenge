import { getRepository, Repository } from 'typeorm';
import Challenge from '@modules/challenges/infra/typeorm/entities/Challenge';
import ICreateChallengeDTO from '@modules/challenges/dtos/ICreateChallengeDTO';
import IChallengesRepository from '@modules/challenges/repositories/IChallengesRepository';

class ChallengesRepository implements IChallengesRepository {
  private ormRepository: Repository<Challenge>;

  constructor() {
    this.ormRepository = getRepository(Challenge);
  }

  public async create({
    title,
    description,
  }: ICreateChallengeDTO): Promise<Challenge> {
    const challenge = this.ormRepository.create({
      title,
      description,
    });

    await this.ormRepository.save(challenge);

    let savedChallenge = await this.ormRepository.findOne({
      where: { id: challenge.id },
    });

    if (!savedChallenge) {
      savedChallenge = challenge;
    }

    return savedChallenge;
  }

  public async update(challenge: Challenge): Promise<Challenge> {
    await this.ormRepository.save(challenge);

    let savedChallenge = await this.ormRepository.findOne({
      where: { id: challenge.id },
    });

    if (!savedChallenge) {
      savedChallenge = challenge;
    }

    return savedChallenge;
  }

  public async delete(challenge_id: string): Promise<void> {
    const challenge = await this.ormRepository.findOne({
      where: { id: challenge_id },
    });

    if (challenge) {
      await this.ormRepository.remove(challenge);
    }
  }

  public async findById(challenge_id: string): Promise<Challenge | undefined> {
    const findChallenge = await this.ormRepository.findOne({
      where: { id: challenge_id },
    });

    return findChallenge;
  }

  public async findByDescription(
    description: string,
  ): Promise<Challenge | undefined> {
    const challenge = await this.ormRepository.findOne({
      where: { description },
    });

    return challenge;
  }

  public async findByTitle(title: string): Promise<Challenge | undefined> {
    const challenge = await this.ormRepository.findOne({
      where: { title },
    });

    return challenge;
  }

  public async listAll(take = -1, skip = -1): Promise<Challenge[]> {
    let challengeList;

    if (take < 0 || skip < 0) {
      challengeList = await this.ormRepository.find({
        order: { title: 'ASC' },
      });
    } else {
      const [result] = await this.ormRepository.findAndCount({
        order: { title: 'ASC' },
        take,
        skip,
      });

      challengeList = result;
    }

    return challengeList;
  }
}

export default ChallengesRepository;
