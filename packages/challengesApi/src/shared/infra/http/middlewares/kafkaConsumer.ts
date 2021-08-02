import { container } from 'tsyringe';
import { Kafka, Consumer } from 'kafkajs';
import UpdateSubmissionService from '@modules/submissions/services/UpdateSubmissionService';

class KafkaConsumer {
  private kafka: Kafka;

  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'challengesApi',
      brokers: ['localhost:9092'],
    });

    this.consumer = this.kafka.consumer({ groupId: 'challenge-consumer' });
  }

  public async startConsumer(): Promise<void> {
    const updateSubmission = container.resolve(UpdateSubmissionService);

    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'challenge.correction' });

    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (topic === 'challenge.correction' && message.value !== null) {
          const parsedMessage = JSON.parse(message.value.toString());

          const { submissionId, grade, status } = parsedMessage;

          if (grade && status) {
            await updateSubmission.execute({
              submission_id: submissionId,
              grade,
              status,
            });
          }
        }
      },
    });
  }
}

export default KafkaConsumer;
