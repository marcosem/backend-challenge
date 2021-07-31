import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IChallengesRepository from '@modules/challenges/repositories/IChallengesRepository';

@injectable()
class RemoveChallengeService {
  constructor(
    @inject('ChallengesRepository')
    private challengesRepository: IChallengesRepository,
  ) {}

  public async execute(challenge_id: string): Promise<void> {
    const challenge = await this.challengesRepository.findById(challenge_id);

    if (!challenge) {
      throw new AppError('Challenge not found', 400);
    }

    await this.challengesRepository.delete(challenge_id);
  }
}

export default RemoveChallengeService;
