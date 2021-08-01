import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Challenge from '@modules/challenges/infra/typeorm/entities/Challenge';
import IChallengesRepository from '@modules/challenges/repositories/IChallengesRepository';

@injectable()
class GetChallengeService {
  constructor(
    @inject('ChallengesRepository')
    private challengesRepository: IChallengesRepository,
  ) {}

  public async execute(challenge_id: string): Promise<Challenge> {
    const challenge = await this.challengesRepository.findById(challenge_id);

    if (!challenge) {
      throw new AppError('Challenge not found', 400);
    }

    return challenge;
  }
}

export default GetChallengeService;
