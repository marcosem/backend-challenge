import 'reflect-metadata';
import FakeChallengesRepository from '@modules/challenges/repositories/fakes/FakeChallengesRespository';
import CreateChallengeService from '@modules/challenges/services/CreateChallengeService';

let fakeChallengeRepository: FakeChallengesRepository;
let createChallenge: CreateChallengeService;

describe('CreateChallenge', () => {
  beforeEach(() => {
    fakeChallengeRepository = new FakeChallengesRepository();

    createChallenge = new CreateChallengeService(fakeChallengeRepository);
  });

  it('Should be able to create a challenge', async () => {
    const challenge = await createChallenge.execute({
      title: 'Challenge Title',
      description: 'Challenge Description',
    });

    expect(challenge).toHaveProperty('id');
    expect(challenge).toMatchObject({
      title: 'Challenge Title',
      description: 'Challenge Description',
    });
  });
});
