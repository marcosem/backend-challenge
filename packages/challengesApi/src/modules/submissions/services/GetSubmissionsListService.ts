import { injectable, inject } from 'tsyringe';
import Submission from '@modules/submissions/infra/typeorm/entities/Submission';
import ISubmissionsRepository from '@modules/submissions/repositories/ISubmissionsRepository';
import IListSubmissionsDTO from '@modules/submissions/dtos/IListSubmissionsDTO';

@injectable()
class GetSubmissionsListService {
  constructor(
    @inject('SubmissionsRepository')
    private submissionsRepository: ISubmissionsRepository,
  ) {}

  public async execute({
    take = -1,
    skip = -1,
    challenge_id,
    date_start,
    date_end,
    status,
  }: IListSubmissionsDTO): Promise<Submission[]> {
    const submissionsList = await this.submissionsRepository.listAll({
      take,
      skip,
      challenge_id,
      date_start,
      date_end,
      status,
    });

    return submissionsList;
  }
}

export default GetSubmissionsListService;
