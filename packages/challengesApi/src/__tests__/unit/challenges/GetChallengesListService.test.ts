import 'reflect-metadata';
import FakeChallengesRepository from '@modules/challenges/repositories/fakes/FakeChallengesRespository';
import GetChallengesListService from '@modules/challenges/services/GetChallengesListService';

let fakeChallengeRepository: FakeChallengesRepository;
let getChallengeList: GetChallengesListService;

describe('GetChallengeList', () => {
  beforeEach(() => {
    fakeChallengeRepository = new FakeChallengesRepository();

    getChallengeList = new GetChallengesListService(fakeChallengeRepository);
  });

  it('Should be to get the list of challenges', async () => {
    await fakeChallengeRepository.create({
      title: 'Challenge #1',
      description: 'Description #1',
    });

    const seekChallenge = await fakeChallengeRepository.create({
      title: 'Challenge #2',
      description: 'Description #2',
    });

    await fakeChallengeRepository.create({
      title: 'Challenge #3',
      description: 'Description #3',
    });

    await fakeChallengeRepository.create({
      title: 'Challenge #4',
      description: 'Description #4',
    });

    await fakeChallengeRepository.create({
      title: 'Challenge #5',
      description: 'Description #5',
    });

    const fullChallengeList = await getChallengeList.execute();
    const partialChallengeList = await getChallengeList.execute(3, 1);
    const brokenChallengeList = await getChallengeList.execute(10, 10);

    expect(fullChallengeList.length).toEqual(5);
    expect(partialChallengeList.length).toEqual(3);
    expect(partialChallengeList[0]).toMatchObject(seekChallenge);
    expect(brokenChallengeList.length).toEqual(0);
  });
});
