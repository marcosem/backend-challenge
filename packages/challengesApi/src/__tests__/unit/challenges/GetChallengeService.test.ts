import 'reflect-metadata';
import FakeChallengesRepository from '@modules/challenges/repositories/fakes/FakeChallengesRespository';
import GetChallengeService from '@modules/challenges/services/GetChallengeService';
import AppError from '@shared/errors/AppError';

let fakeChallengeRepository: FakeChallengesRepository;
let getChallenge: GetChallengeService;

describe('GetChallenge', () => {
  beforeEach(() => {
    fakeChallengeRepository = new FakeChallengesRepository();

    getChallenge = new GetChallengeService(fakeChallengeRepository);
  });

  it('Should be to get a challenge by its description', async () => {
    const oldChallenge = await fakeChallengeRepository.create({
      title: 'Challenge Title',
      description: 'Challenge Description',
    });

    const challenge = await getChallenge.execute(oldChallenge.id);

    expect(challenge).toMatchObject(oldChallenge);
  });

  it('Should not be able to get a non existant challenge title', async () => {
    await expect(getChallenge.execute('I do not exist')).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
