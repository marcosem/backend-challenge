import { container } from 'tsyringe';
import { GraphQLScalarType, Kind } from 'graphql';
import Challenge from '@modules/challenges/infra/typeorm/entities/Challenge';
import ICreateChallengeDTO from '@modules/challenges/dtos/ICreateChallengeDTO';
import GetChallengesListService from '@modules/challenges/services/GetChallengesListService';
import GetChallengeByDescriptionService from '@modules/challenges/services/GetChallengeByDescriptionService';
import GetChallengeByTitleService from '@modules/challenges/services/GetChallengeByTitleService';
import CreateChallengeService from '@modules/challenges/services/CreateChallengeService';
import UpdateChallengeService from '@modules/challenges/services/UpdateChallengeService';
import RemoveChallengeService from '@modules/challenges/services/RemoveChallengeService';
import GetChallengeService from '@modules/challenges/services/GetChallengeService';

import Submission from '@modules/submissions/infra/typeorm/entities/Submission';
import IListSubmissionsDTO from '@modules/submissions/dtos/IListSubmissionsDTO';
import GetSubmissionsListService from '@modules/submissions/services/GetSubmissionsListService';
import SendSubmissionService from '@modules/submissions/services/SendSubmissionService';

interface IChallengesRequestDTO {
  title?: string;
  description?: string;
  take?: number;
  skip?: number;
}

interface IUpdateChallengeRequestDTO {
  id: string;
  title?: string;
  description?: string;
}

interface IDeleteChallengeRequestDTO {
  id: string;
}

interface ISendSubmissionRequestDTO {
  challenge_id: string;
  repository_url: string;
}

const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }
      return null;
    },
  }),

  async challenges({
    title,
    description,
    take,
    skip,
  }: IChallengesRequestDTO): Promise<Challenge[]> {
    let challenges = [];

    if (title) {
      const getChallengeByTitle = container.resolve(GetChallengeByTitleService);

      const challenge = await getChallengeByTitle.execute(title);
      challenges.push(challenge);
    } else if (description) {
      const getChallengeByDescription = container.resolve(
        GetChallengeByDescriptionService,
      );

      const challenge = await getChallengeByDescription.execute(description);
      challenges.push(challenge);
    } else {
      const getChallengesList = container.resolve(GetChallengesListService);

      challenges = await getChallengesList.execute(take, skip);
    }

    return challenges;
  },
  async answers({
    challenge_id,
    date_start,
    date_end,
    status,
    take,
    skip,
  }: IListSubmissionsDTO): Promise<Submission[]> {
    const getSubmissionsList = container.resolve(GetSubmissionsListService);

    let dateStart;
    let dateEnd;

    if (date_start && date_end) {
      dateStart = new Date(date_start);
      dateEnd = new Date(date_end);
    }

    const submissionsList = await getSubmissionsList.execute({
      challenge_id,
      date_start: dateStart,
      date_end: dateEnd,
      status,
      take,
      skip,
    });

    return submissionsList;
  },
  async createChallenge({
    title,
    description,
  }: ICreateChallengeDTO): Promise<Challenge> {
    const createChallenge = container.resolve(CreateChallengeService);

    const challenge = await createChallenge.execute({ title, description });

    return challenge;
  },
  async updateChallenge({
    id,
    title,
    description,
  }: IUpdateChallengeRequestDTO): Promise<Challenge> {
    const updateChallenge = container.resolve(UpdateChallengeService);

    const challenge = await updateChallenge.execute({
      challenge_id: id,
      title,
      description,
    });

    return challenge;
  },
  async deleteChallenge({
    id,
  }: IDeleteChallengeRequestDTO): Promise<Challenge> {
    const getChallenge = container.resolve(GetChallengeService);

    const challenge = await getChallenge.execute(id);

    const removeChallenge = container.resolve(RemoveChallengeService);
    await removeChallenge.execute(id);

    return challenge;
  },
  async answerChallenge({
    challenge_id,
    repository_url,
  }: ISendSubmissionRequestDTO): Promise<Submission> {
    const sendSubmission = container.resolve(SendSubmissionService);

    const submission = await sendSubmission.execute({
      challenge_id,
      repository_url,
    });

    return submission;
  },
};

export default resolvers;
