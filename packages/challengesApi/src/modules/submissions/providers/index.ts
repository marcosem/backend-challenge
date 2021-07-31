import { container } from 'tsyringe';
import IKafkaProvider from '@modules/submissions/providers/KafkaProvider/models/IKafkaProvider';
import KafkaProvider from '@modules/submissions/providers/KafkaProvider/implementations/KafkaProvider';

container.registerSingleton<IKafkaProvider>('KafkaProvider', KafkaProvider);
