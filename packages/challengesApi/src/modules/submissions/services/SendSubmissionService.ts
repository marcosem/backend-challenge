import { injectable, inject } from 'tsyringe';
import Submission from '@modules/submissions/infra/typeorm/entities/Submission';
import ISubmissionsRepository from '@modules/submissions/repositories/ISubmissionsRepository';
import IChallengesRepository from '@modules/challenges/repositories/IChallengesRepository';
import IKafkaProvider from '@modules/submissions/providers/KafkaProvider/models/IKafkaProvider';
import AppError from '@shared/errors/AppError';

interface IRequestDTO {
  challenge_id: string;
  repository_url: string;
}

@injectable()
class SendSubmissionService {
  constructor(
    @inject('SubmissionsRepository')
    private submissionsRepository: ISubmissionsRepository,
    @inject('ChallengesRepository')
    private challengesRepository: IChallengesRepository,
    @inject('KafkaProvider')
    private kafkaProvider: IKafkaProvider,
  ) {}

  public async execute({
    challenge_id,
    repository_url,
  }: IRequestDTO): Promise<Submission> {
    let status = 'Pending';
    let errorMsg = '';

    const challenge = await this.challengesRepository.findById(challenge_id);
    if (!challenge) {
      status = 'Error';
      errorMsg = 'Challenge not found';
    }

    if (
      !repository_url.startsWith('https://github.com') &&
      !repository_url.startsWith('githut.com')
    ) {
      status = 'Error';
      errorMsg = 'Not a Github repository';
    }

    const newSubmission = await this.submissionsRepository.create({
      challenge_id,
      repository_url,
      grade: 0,
      status,
    });

    if (status === 'Error') {
      throw new AppError(errorMsg, 400);
    }

    const sentSubmission = await this.kafkaProvider.sendMessage({
      submissionId: newSubmission.id,
      repositoryUrl: newSubmission.repository_url,
    });

    const updateSubmission = newSubmission;
    updateSubmission.grade = sentSubmission.grade;
    updateSubmission.status = sentSubmission.status;

    const submission = await this.submissionsRepository.update(
      updateSubmission,
    );

    return submission;
  }
}

export default SendSubmissionService;
