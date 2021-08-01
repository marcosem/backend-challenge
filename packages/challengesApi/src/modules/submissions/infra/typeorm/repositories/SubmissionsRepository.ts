import { getRepository, Repository, Between } from 'typeorm';
import Submission from '@modules/submissions/infra/typeorm/entities/Submission';
import ICreateSubmissionDTO from '@modules/submissions/dtos/ICreateSubmissionDTO';
import IListSubmissionsDTO from '@modules/submissions/dtos/IListSubmissionsDTO';
import ISubmissionsRepository from '@modules/submissions/repositories/ISubmissionsRepository';

class SubmissionsRepository implements ISubmissionsRepository {
  private ormRepository: Repository<Submission>;

  constructor() {
    this.ormRepository = getRepository(Submission);
  }

  public async create({
    challenge_id,
    repository_url,
    status,
    grade,
  }: ICreateSubmissionDTO): Promise<Submission> {
    const submission = this.ormRepository.create({
      challenge_id,
      repository_url,
      status,
      grade,
    });

    await this.ormRepository.save(submission);

    let savedSubmission = await this.ormRepository.findOne({
      where: { id: submission.id },
      relations: ['challengeId'],
    });

    if (!savedSubmission) {
      savedSubmission = submission;
    }

    return savedSubmission;
  }

  public async update(submission: Submission): Promise<Submission> {
    await this.ormRepository.save(submission);

    let savedSubmission = await this.ormRepository.findOne({
      where: { id: submission.id },
      relations: ['challengeId'],
    });

    if (!savedSubmission) {
      savedSubmission = submission;
    }

    return savedSubmission;
  }

  public async listAll({
    take = -1,
    skip = -1,
    challenge_id,
    date_start,
    date_end,
    status,
  }: IListSubmissionsDTO): Promise<Submission[]> {
    let submissionList;

    if (
      (take < 0 || skip < 0) &&
      !challenge_id &&
      (!date_start || !date_end) &&
      !status
    ) {
      submissionList = await this.ormRepository.find({
        relations: ['challengeId'],
      });
    } else {
      const filter = {
        challenge_id,
        created_at:
          date_start && date_end ? Between(date_start, date_end) : undefined,
        status,
      };

      const [result] = await this.ormRepository.findAndCount({
        where: filter,
        relations: ['challengeId'],
        take,
        skip,
      });

      submissionList = result;
    }

    return submissionList;
  }
}

export default SubmissionsRepository;
