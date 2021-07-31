import { container } from 'tsyringe';

import '@modules/submissions/providers';

import IChallengesRepository from '@modules/challenges/repositories/IChallengesRepository';
import ChallengesRepository from '@modules/challenges/infra/typeorm/repositories/ChallengesRespository';

import ISubmissionsRepository from '@modules/submissions/repositories/ISubmissionsRepository';
import SubmissionsRepository from '@modules/submissions/infra/typeorm/repositories/SubmissionsRepository';

container.registerSingleton<IChallengesRepository>(
  'ChallengesRepository',
  ChallengesRepository,
);

container.registerSingleton<ISubmissionsRepository>(
  'SubmissionsRepository',
  SubmissionsRepository,
);

// for another repository, just duplicate
