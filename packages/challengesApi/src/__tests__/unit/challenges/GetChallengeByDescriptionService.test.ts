import 'reflect-metadata';
import FakeChallengesRepository from '@modules/challenges/repositories/fakes/FakeChallengesRespository';
import GetChallengeByDescriptionService from '@modules/challenges/services/GetChallengeByDescriptionService';
import AppError from '@shared/errors/AppError';

let fakeChallengeRepository: FakeChallengesRepository;
let getChallengeByDescription: GetChallengeByDescriptionService;

describe('GetChallengeByDescription', () => {
  beforeEach(() => {
    fakeChallengeRepository = new FakeChallengesRepository();

    getChallengeByDescription = new GetChallengeByDescriptionService(
      fakeChallengeRepository,
    );
  });

  it('Should be to get a challenge by its description', async () => {
    const oldChallenge = await fakeChallengeRepository.create({
      title: 'Challenge Title',
      description: 'My Peculiar Challenge Description',
    });

    const challenge = await getChallengeByDescription.execute(
      'My Peculiar Challenge Description',
    );

    expect(challenge).toMatchObject(oldChallenge);
  });

  it('Should not be able to get a non existant challenge description', async () => {
    await expect(
      getChallengeByDescription.execute('I do not exist'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
