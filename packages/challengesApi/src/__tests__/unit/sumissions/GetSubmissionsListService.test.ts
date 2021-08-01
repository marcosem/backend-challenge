import 'reflect-metadata';
import FakeSubmissionsRepository from '@modules/submissions/repositories/fakes/FakeSubmissionRepository';
import GetSubmissionsListService from '@modules/submissions/services/GetSubmissionsListService';

let fakeSubmissionRepository: FakeSubmissionsRepository;
let getSubmissionsList: GetSubmissionsListService;

describe('GetSubmissionsList', () => {
  beforeEach(() => {
    fakeSubmissionRepository = new FakeSubmissionsRepository();

    getSubmissionsList = new GetSubmissionsListService(
      fakeSubmissionRepository,
    );
  });

  it('Should be to get the list of submissions', async () => {
    await fakeSubmissionRepository.create({
      challenge_id: 'Submission #1',
      repository_url: 'https://github.com/marcosem/backend-challenge',
      status: 'Pending',
      grade: 8,
    });

    const seekSubmission = await fakeSubmissionRepository.create({
      challenge_id: 'Submission #2',
      repository_url: 'https://github.com/marcosem/backend-challenge',
      status: 'Pending',
      grade: 10,
    });

    await fakeSubmissionRepository.create({
      challenge_id: 'Submission #3',
      repository_url: 'https://github.com/marcosem/backend-challenge',
      status: 'Pending',
      grade: 9,
    });

    await fakeSubmissionRepository.create({
      challenge_id: 'Submission #4',
      repository_url: 'https://github.com/marcosem/backend-challenge',
      status: 'Pending',
      grade: 7,
    });

    await fakeSubmissionRepository.create({
      challenge_id: 'Submission #5',
      repository_url: 'https://github.com/marcosem/backend-challenge',
      status: 'Pending',
      grade: 6,
    });

    const fullChallengeList = await getSubmissionsList.execute();
    const partialChallengeList = await getSubmissionsList.execute(3, 1);
    const brokenChallengeList = await getSubmissionsList.execute(10, 10);

    expect(fullChallengeList.length).toEqual(5);
    expect(partialChallengeList.length).toEqual(3);
    expect(partialChallengeList[0]).toMatchObject(seekSubmission);
    expect(brokenChallengeList.length).toEqual(0);
  });
});
