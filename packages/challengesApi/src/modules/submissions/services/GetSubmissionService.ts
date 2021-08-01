import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Submission from '@modules/submissions/infra/typeorm/entities/Submission';
import ISubmissionsRepository from '@modules/submissions/repositories/ISubmissionsRepository';

@injectable()
class GetSubmissionService {
  constructor(
    @inject('SubmissionsRepository')
    private submissionsRepository: ISubmissionsRepository,
  ) {}

  public async execute(submision_id: string): Promise<Submission> {
    const submission = await this.submissionsRepository.findById(submision_id);

    if (!submission) {
      throw new AppError('Submission not found', 400);
    }

    return submission;
  }
}

export default GetSubmissionService;
