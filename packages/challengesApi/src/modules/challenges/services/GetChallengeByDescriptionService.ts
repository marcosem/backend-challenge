import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Challenge from '@modules/challenges/infra/typeorm/entities/Challenge';
import IChallengesRepository from '@modules/challenges/repositories/IChallengesRepository';

@injectable()
class GetChallengeByDescriptionService {
  constructor(
    @inject('ChallengesRepository')
    private challengesRepository: IChallengesRepository,
  ) {}

  public async execute(description: string): Promise<Challenge> {
    const challenge = await this.challengesRepository.findByDescription(
      description,
    );

    if (!challenge) {
      throw new AppError('Challenge not found', 400);
    }

    return challenge;
  }
}

export default GetChallengeByDescriptionService;
