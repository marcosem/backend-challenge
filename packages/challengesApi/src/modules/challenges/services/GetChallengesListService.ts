import { injectable, inject } from 'tsyringe';
import Challenge from '@modules/challenges/infra/typeorm/entities/Challenge';
import IChallengesRepository from '@modules/challenges/repositories/IChallengesRepository';

@injectable()
class GetChallengesListService {
  constructor(
    @inject('ChallengesRepository')
    private challengesRepository: IChallengesRepository,
  ) {}

  public async execute(take = -1, skip = -1): Promise<Challenge[]> {
    const challengeList = await this.challengesRepository.listAll(take, skip);

    return challengeList;
  }
}

export default GetChallengesListService;
