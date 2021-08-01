import 'reflect-metadata';
import FakeSubmissionsRepository from '@modules/submissions/repositories/fakes/FakeSubmissionRepository';
import FakeChallengesRepository from '@modules/challenges/repositories/fakes/FakeChallengesRespository';
import FakeKafkaProvider from '@modules/submissions/providers/KafkaProvider/fakes/FakeKafkaProvider';
import SendSubmissionService from '@modules/submissions/services/SendSubmissionService';
import AppError from '@shared/errors/AppError';

let fakeSubmissionRepository: FakeSubmissionsRepository;
let fakeChallengeRepository: FakeChallengesRepository;
let fakeKafkaProvider: FakeKafkaProvider;
let sendSubmission: SendSubmissionService;

describe('SendSubmission', () => {
  beforeEach(() => {
    fakeSubmissionRepository = new FakeSubmissionsRepository();
    fakeChallengeRepository = new FakeChallengesRepository();
    fakeKafkaProvider = new FakeKafkaProvider();

    sendSubmission = new SendSubmissionService(
      fakeSubmissionRepository,
      fakeChallengeRepository,
      fakeKafkaProvider,
    );
  });

  it('Should be able to send a submission', async () => {
    const kafkaMessage = jest.spyOn(fakeKafkaProvider, 'sendMessage');

    const challenge = await fakeChallengeRepository.create({
      title: 'Challenge Title',
      description: 'Challenge Description',
    });

    const submission = await sendSubmission.execute({
      challenge_id: challenge.id,
      repository_url: 'https://github.com/marcosem/backend-challenge',
    });

    expect(submission).toHaveProperty('id');
    expect(submission).toHaveProperty('status');
    expect(submission.status).toEqual('Pending');
    expect(kafkaMessage).toHaveBeenCalledWith({
      submissionId: submission.id,
      repositoryUrl: 'https://github.com/marcosem/backend-challenge',
    });
  });

  it('Should return error when the challenge does not exist', async () => {
    const kafkaMessage = jest.spyOn(fakeKafkaProvider, 'sendMessage');

    await expect(
      sendSubmission.execute({
        challenge_id: 'I do not exist',
        repository_url: 'github.com/marcosem/backend-challenge',
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(kafkaMessage).not.toHaveBeenCalled();
  });
});
