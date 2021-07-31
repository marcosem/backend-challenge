import { injectable, inject } from 'tsyringe';
import Challenge from '@modules/challenges/infra/typeorm/entities/Challenge';
import IChallengesRepository from '@modules/challenges/repositories/IChallengesRepository';
import ICreateChallengeDTO from '@modules/challenges/dtos/ICreateChallengeDTO';

@injectable()
class CreateChallengeService {
  constructor(
    @inject('ChallengesRepository')
    private challengesRepository: IChallengesRepository,
  ) {}

  public async execute({
    title,
    description,
  }: ICreateChallengeDTO): Promise<Challenge> {
    const challenge = await this.challengesRepository.create({
      title,
      description,
    });

    return challenge;
  }
}

export default CreateChallengeService;
