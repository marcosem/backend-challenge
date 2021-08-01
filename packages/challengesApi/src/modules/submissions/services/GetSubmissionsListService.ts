import { injectable, inject } from 'tsyringe';
import Submission from '@modules/submissions/infra/typeorm/entities/Submission';
import ISubmissionsRepository from '@modules/submissions/repositories/ISubmissionsRepository';

@injectable()
class GetSubmissionsListService {
  constructor(
    @inject('SubmissionsRepository')
    private submissionsRepository: ISubmissionsRepository,
  ) {}

  public async execute(take = -1, skip = -1): Promise<Submission[]> {
    const submissionsList = await this.submissionsRepository.listAll(
      take,
      skip,
    );

    return submissionsList;
  }
}

export default GetSubmissionsListService;
