import IKafkaProvider, {
  ICorrectLessonMessage,
  ICorrectLessonResponse,
} from '@modules/submissions/providers/KafkaProvider/models/IKafkaProvider';

import { Kafka, Producer } from 'kafkajs';

class KafkaProvider implements IKafkaProvider {
  private kafka: Kafka;

  private producer: Producer;

  // private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'challengesApi',
      brokers: ['localhost:9092'],
    });

    this.producer = this.kafka.producer();
    // this.consumer = this.kafka.consumer({ groupId: 'challenge-consumer' });
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

    const submission: ICorrectLessonResponse = {
      submissionId,
      repositoryUrl,
      grade: 0,
      status: 'Pending',
    };

    /*
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'challenge.correction' });

    let myMessage;
    let response: ICorrectLessonResponse;
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        myMessage = message;
      },
    });

    if (myMessage) {
      response = JSON.parse(myMessage);
    } else {
      response = {
        submissionId,
        repositoryUrl,
        grade: 0,
        status: 'Pending',
      };
    }
    */

    return submission;
  }
}

export default KafkaProvider;
