import Submission from '@modules/submissions/infra/typeorm/entities/Submission';
import ICreateSubmissionDTO from '@modules/submissions/dtos/ICreateSubmissionDTO';
import ISubmissionsRepository from '@modules/submissions/repositories/ISubmissionsRepository';
import { isWithinInterval } from 'date-fns';
import { v4 } from 'uuid';

class FakeSubmissionsRepository implements ISubmissionsRepository {
  private submissions: Submission[] = [];

  public async create({
    challenge_id,
    repository_url,
    status,
    grade,
  }: ICreateSubmissionDTO): Promise<Submission> {
    const submission = new Submission();

    Object.assign(submission, {
      id: v4(),
      challenge_id,
      repository_url,
      status,
      grade,
      created_at: new Date(),
    });

    this.submissions.push(submission);

    return submission;
  }

  public async update(submission: Submission): Promise<Submission> {
    this.submissions = this.submissions.map(oldSubmission =>
      oldSubmission.id !== submission.id ? oldSubmission : submission,
    );

    return submission;
  }

  public async findByChallengeId(
    challenge_id: string,
  ): Promise<Submission | undefined> {
    const findSubmission = this.submissions.find(
      sub => sub.challenge_id === challenge_id,
    );

    return findSubmission;
  }

  public async listAll(take = -1, skip = -1): Promise<Submission[]> {
    if (take < 0 && skip < 0) {
      return this.submissions;
    }

    const paginatedList = this.submissions.slice(skip, take + skip);
    return paginatedList;
  }

  public async listByDate(
    dateStart: Date,
    dateEnd: Date,
  ): Promise<Submission[]> {
    const filteredSubmissions = this.submissions.filter(sub =>
      isWithinInterval(sub.created_at, { start: dateStart, end: dateEnd }),
    );

    return filteredSubmissions;
  }
}

export default FakeSubmissionsRepository;
