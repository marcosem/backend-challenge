import 'reflect-metadata';
import FakeSubmissionsRepository from '@modules/submissions/repositories/fakes/FakeSubmissionRepository';
import GetSubmissionService from '@modules/submissions/services/GetSubmissionService';
import AppError from '@shared/errors/AppError';

let fakeSubmissionRepository: FakeSubmissionsRepository;
let getSubmission: GetSubmissionService;

describe('GetSubmission', () => {
  beforeEach(() => {
    fakeSubmissionRepository = new FakeSubmissionsRepository();

    getSubmission = new GetSubmissionService(fakeSubmissionRepository);
  });

  it('Should be to get a submission', async () => {
    const submission = await fakeSubmissionRepository.create({
      challenge_id: 'Submission #1',
      repository_url: 'https://github.com/marcosem/backend-challenge',
      status: 'Pending',
      grade: 8,
    });

    const findSubmission = await getSubmission.execute(submission.id);

    expect(findSubmission).toMatchObject(submission);
  });

  it('Should not be able to get a non existant submission', async () => {
    await expect(
      getSubmission.execute('I do not exist'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
