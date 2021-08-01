import 'reflect-metadata';
import FakeSubmissionsRepository from '@modules/submissions/repositories/fakes/FakeSubmissionRepository';
import UpdateSubmissionService from '@modules/submissions/services/UpdateSubmissionService';
import AppError from '@shared/errors/AppError';

let fakeSubmissionRepository: FakeSubmissionsRepository;
let updateSubmission: UpdateSubmissionService;

describe('UpdateSubmission', () => {
  beforeEach(() => {
    fakeSubmissionRepository = new FakeSubmissionsRepository();

    updateSubmission = new UpdateSubmissionService(fakeSubmissionRepository);
  });

  it('Should be to update a submission', async () => {
    const oldSubmission = await fakeSubmissionRepository.create({
      challenge_id: 'Challenge ID',
      repository_url: 'https://github.com/marcosem/backend-challenge',
      grade: 0,
      status: 'Pending',
    });

    const newSubmission = await updateSubmission.execute({
      submission_id: oldSubmission.id,
      grade: 10,
      status: 'Done',
    });

    expect(newSubmission).toMatchObject({
      id: oldSubmission.id,
      grade: 10,
      status: 'Done',
    });
  });

  it('Should not be able to update an invalid submission', async () => {
    await expect(
      updateSubmission.execute({
        submission_id: 'I am Invalid',
        grade: 0,
        status: 'Error',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
