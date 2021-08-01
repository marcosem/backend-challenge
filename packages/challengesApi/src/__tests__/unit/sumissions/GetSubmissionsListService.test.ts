import 'reflect-metadata';
import { subDays, addDays } from 'date-fns';
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
      status: 'Done',
      grade: 9,
    });

    await fakeSubmissionRepository.create({
      challenge_id: 'Submission #4',
      repository_url: 'https://github.com/marcosem/backend-challenge',
      status: 'Error',
      grade: 7,
    });

    await fakeSubmissionRepository.create({
      challenge_id: 'Submission #5',
      repository_url: 'https://github.com/marcosem/backend-challenge',
      status: 'Error',
      grade: 6,
    });

    const fullSubmissionsList = await getSubmissionsList.execute({});
    const partialSubmissionsList = await getSubmissionsList.execute({
      take: 3,
      skip: 1,
    });
    const brokenSubmissionsList = await getSubmissionsList.execute({
      take: 10,
      skip: 10,
    });
    const doneStatusSubmissionsList = await getSubmissionsList.execute({
      status: 'Done',
    });
    const errorStatusSubmissionsList = await getSubmissionsList.execute({
      status: 'Error',
    });
    const challengeIdSubmissionsList = await getSubmissionsList.execute({
      challenge_id: 'Submission #5',
    });

    const yesterday = subDays(new Date(), 1);
    const tomorrow = addDays(new Date(), 1);
    const intervalSubmissionsList = await getSubmissionsList.execute({
      date_start: yesterday,
      date_end: tomorrow,
    });

    expect(fullSubmissionsList.length).toEqual(5);
    expect(partialSubmissionsList.length).toEqual(3);
    expect(partialSubmissionsList[0]).toMatchObject(seekSubmission);
    expect(brokenSubmissionsList.length).toEqual(0);
    expect(doneStatusSubmissionsList.length).toEqual(1);
    expect(errorStatusSubmissionsList.length).toEqual(2);
    expect(challengeIdSubmissionsList.length).toEqual(1);
    expect(intervalSubmissionsList.length).toEqual(fullSubmissionsList.length);
  });
});
