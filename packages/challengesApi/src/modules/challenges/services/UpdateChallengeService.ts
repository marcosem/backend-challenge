import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Challenge from '@modules/challenges/infra/typeorm/entities/Challenge';
import IChallengesRepository from '@modules/challenges/repositories/IChallengesRepository';

interface IRequestDTO {
  challenge_id: string;
  title?: string;
  description?: string;
}

@injectable()
class UpdateChallengeService {
  constructor(
    @inject('ChallengesRepository')
    private challengesRepository: IChallengesRepository,
  ) {}

  public async execute({
    challenge_id,
    title,
    description,
  }: IRequestDTO): Promise<Challenge> {
    const challenge = await this.challengesRepository.findById(challenge_id);

    if (!challenge) {
      throw new AppError('Challenge not found', 400);
    }

    if (title) challenge.title = title;
    if (description) challenge.description = description;

    await this.challengesRepository.update(challenge);

    return challenge;
  }
}

export default UpdateChallengeService;
