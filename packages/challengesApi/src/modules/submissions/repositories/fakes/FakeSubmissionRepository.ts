import Submission from '@modules/submissions/infra/typeorm/entities/Submission';
import ICreateSubmissionDTO from '@modules/submissions/dtos/ICreateSubmissionDTO';
import IListSubmissionsDTO from '@modules/submissions/dtos/IListSubmissionsDTO';
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

  public async findById(
    submission_id: string,
  ): Promise<Submission | undefined> {
    const findSubmission = this.submissions.find(
      sub => sub.id === submission_id,
    );

    return findSubmission;
  }

  public async listAll({
    take = -1,
    skip = -1,
    challenge_id,
    date_start,
    date_end,
    status,
  }: IListSubmissionsDTO): Promise<Submission[]> {
    if (
      (take < 0 || skip < 0) &&
      !challenge_id &&
      (!date_start || !date_end) &&
      !status
    ) {
      return this.submissions;
    }

    const fullFilteredList = this.submissions.filter(sub => {
      if (
        (!challenge_id ||
          (challenge_id && sub.challenge_id === challenge_id)) &&
        (!date_start ||
          !date_end ||
          (date_start &&
            date_end &&
            isWithinInterval(sub.created_at, {
              start: date_start,
              end: date_end,
            }))) &&
        (!status || (status && sub.status === status))
      ) {
        return true;
      }
      return false;
    });
    let filteredSubmissions;

    if (take < 0 && skip < 0) {
      filteredSubmissions = fullFilteredList;
    } else {
      filteredSubmissions = fullFilteredList.slice(skip, take + skip);
    }

    return filteredSubmissions;
  }
}

export default FakeSubmissionsRepository;
