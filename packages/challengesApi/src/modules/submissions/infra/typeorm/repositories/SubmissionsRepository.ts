import { getRepository, Repository, Between } from 'typeorm';
import Submission from '@modules/submissions/infra/typeorm/entities/Submission';
import ICreateSubmissionDTO from '@modules/submissions/dtos/ICreateSubmissionDTO';
import ISubmissionsRepository from '@modules/submissions/repositories/ISubmissionsRepository';
// import { isWithinInterval } from 'date-fns';

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

  public async findByChallengeId(
    challenge_id: string,
  ): Promise<Submission | undefined> {
    const submission = await this.ormRepository.findOne({
      where: { challenge_id },
      relations: ['challengeId'],
    });

    return submission;
  }

  public async listAll(take = -1, skip = -1): Promise<Submission[]> {
    let submissionList;

    if (take < 0 || skip < 0) {
      submissionList = await this.ormRepository.find({
        relations: ['challengeId'],
      });
    } else {
      const [result] = await this.ormRepository.findAndCount({
        relations: ['challengeId'],
        take,
        skip,
      });

      submissionList = result;
    }

    return submissionList;
  }

  public async listByDate(
    dateStart: Date,
    dateEnd: Date,
  ): Promise<Submission[]> {
    const filteredSubmissions = await this.ormRepository.find({
      where: {
        created_at: Between(dateStart, dateEnd),
      },
      relations: ['challengeId'],
    });

    return filteredSubmissions;
  }
}

export default SubmissionsRepository;
