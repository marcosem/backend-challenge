import 'reflect-metadata';
import FakeChallengesRepository from '@modules/challenges/repositories/fakes/FakeChallengesRespository';
import UpdateChallengeService from '@modules/challenges/services/UpdateChallengeService';
import AppError from '@shared/errors/AppError';

let fakeChallengeRepository: FakeChallengesRepository;
let updateChallenge: UpdateChallengeService;

describe('UpdateChallenge', () => {
  beforeEach(() => {
    fakeChallengeRepository = new FakeChallengesRepository();

    updateChallenge = new UpdateChallengeService(fakeChallengeRepository);
  });

  it('Should be to update a challenge', async () => {
    const oldChallenge = await fakeChallengeRepository.create({
      title: 'Old Challenge Title',
      description: 'Old Challenge Title',
    });

    const newChallenge = await updateChallenge.execute({
      challenge_id: oldChallenge.id,
      title: 'New Challenge Title',
      description: 'New Challenge Description',
    });

    expect(newChallenge).toMatchObject({
      id: oldChallenge.id,
      title: 'New Challenge Title',
      description: 'New Challenge Description',
    });
  });

  it('Should be to update only a title of a challenge', async () => {
    const oldChallenge = await fakeChallengeRepository.create({
      title: 'Old Challenge Title',
      description: 'Old Challenge Description',
    });

    const newChallenge = await updateChallenge.execute({
      challenge_id: oldChallenge.id,
      title: 'New Challenge Title',
    });

    expect(newChallenge).toMatchObject({
      id: oldChallenge.id,
      title: 'New Challenge Title',
      description: 'Old Challenge Description',
    });
  });

  it('Should be to update only a description of a challenge', async () => {
    const oldChallenge = await fakeChallengeRepository.create({
      title: 'Old Challenge Title',
      description: 'Old Challenge Description',
    });

    const newChallenge = await updateChallenge.execute({
      challenge_id: oldChallenge.id,
      description: 'New Challenge Description',
    });

    expect(newChallenge).toMatchObject({
      id: oldChallenge.id,
      title: 'Old Challenge Title',
      description: 'New Challenge Description',
    });
  });

  it('Should not be able to update an invalid challenge', async () => {
    await expect(
      updateChallenge.execute({
        challenge_id: 'I am Invalid',
        title: 'Does not matter',
        description: 'Does not matter',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
