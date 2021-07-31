import 'reflect-metadata';
import FakeChallengesRepository from '@modules/challenges/repositories/fakes/FakeChallengesRespository';
import GetChallengeByTitleService from '@modules/challenges/services/GetChallengeByTitleService';
import AppError from '@shared/errors/AppError';

let fakeChallengeRepository: FakeChallengesRepository;
let getChallengeByTitle: GetChallengeByTitleService;

describe('GetChallengeByTitle', () => {
  beforeEach(() => {
    fakeChallengeRepository = new FakeChallengesRepository();

    getChallengeByTitle = new GetChallengeByTitleService(
      fakeChallengeRepository,
    );
  });

  it('Should be to get a challenge by its description', async () => {
    const oldChallenge = await fakeChallengeRepository.create({
      title: 'My Peculiar Challenge Title',
      description: 'Challenge Description',
    });

    const challenge = await getChallengeByTitle.execute(
      'My Peculiar Challenge Title',
    );

    expect(challenge).toMatchObject(oldChallenge);
  });

  it('Should not be able to get a non existant challenge title', async () => {
    await expect(
      getChallengeByTitle.execute('I do not exist'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
