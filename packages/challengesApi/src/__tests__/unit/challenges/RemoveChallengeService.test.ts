import 'reflect-metadata';
import FakeChallengesRepository from '@modules/challenges/repositories/fakes/FakeChallengesRespository';
import RemoveChallengeService from '@modules/challenges/services/RemoveChallengeService';
import AppError from '@shared/errors/AppError';

let fakeChallengeRepository: FakeChallengesRepository;
let removeChallenge: RemoveChallengeService;

describe('RemoveChallenge', () => {
  beforeEach(() => {
    fakeChallengeRepository = new FakeChallengesRepository();

    removeChallenge = new RemoveChallengeService(fakeChallengeRepository);
  });

  it('Should be to remove a challenge', async () => {
    const oldChallenge = await fakeChallengeRepository.create({
      title: 'Challenge Title',
      description: 'Challenge Description',
    });

    const initialListSize = await fakeChallengeRepository.listAll();

    await removeChallenge.execute(oldChallenge.id);

    const finalListSize = await fakeChallengeRepository.listAll();
    const findLocation = await fakeChallengeRepository.findById(
      oldChallenge.id,
    );

    expect(finalListSize.length).toEqual(initialListSize.length - 1);
    expect(findLocation).toBeUndefined();
  });

  it('Should not be able to remove an invalid challenge', async () => {
    await expect(
      removeChallenge.execute('I am Invalid'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
