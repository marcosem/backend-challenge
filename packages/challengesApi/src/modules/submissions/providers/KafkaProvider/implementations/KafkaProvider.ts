import IKafkaProvider, {
  ICorrectLessonMessage,
  ICorrectLessonResponse,
} from '@modules/submissions/providers/KafkaProvider/models/IKafkaProvider';

import { Kafka, Producer } from 'kafkajs';

class KafkaProvider implements IKafkaProvider {
  private kafka: Kafka;

  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'challengesApi',
      brokers: ['localhost:9092'],
    });

    this.producer = this.kafka.producer();
  }

  public async sendMessage({
    submissionId,
    repositoryUrl,
  }: ICorrectLessonMessage): Promise<ICorrectLessonResponse> {
    await this.producer.connect();

    await this.producer.send({
      topic: 'challenge.correction',
      messages: [{ value: JSON.stringify({ submissionId, repositoryUrl }) }],
    });

    await this.producer.disconnect();

    const submission: ICorrectLessonResponse = {
      submissionId,
      repositoryUrl,
      grade: 0,
      status: 'Pending',
    };

    return submission;
  }
}

export default KafkaProvider;
