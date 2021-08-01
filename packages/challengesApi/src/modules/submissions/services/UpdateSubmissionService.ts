import { injectable, inject } from 'tsyringe';
import Submission from '@modules/submissions/infra/typeorm/entities/Submission';
import ISubmissionsRepository from '@modules/submissions/repositories/ISubmissionsRepository';
import AppError from '@shared/errors/AppError';

interface IRequestDTO {
  submission_id: string;
  status: string;
  grade: number;
}

@injectable()
class UpdateSubmissionService {
  constructor(
    @inject('SubmissionsRepository')
    private submissionsRepository: ISubmissionsRepository,
  ) {}

  public async execute({
    submission_id,
    status,
    grade,
  }: IRequestDTO): Promise<Submission> {
    const submission = await this.submissionsRepository.findById(submission_id);

    if (!submission) {
      throw new AppError('Submission not found', 400);
    }

    submission.status = status;
    submission.grade = grade;

    const updatedSubmission = await this.submissionsRepository.update(
      submission,
    );

    return updatedSubmission;
  }
}

export default UpdateSubmissionService;
