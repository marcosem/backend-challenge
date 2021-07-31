import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'challengesApi',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'challenge-consumer' });

export interface ICorrectLessonMessage {
  submissionId: string;
  repositoryUrl: string;
}

export interface ICorrectLessonResponse {
  submissionId: string;
  repositoryUrl: string;
  grade: number;
  status: 'Pending' | 'Error' | 'Done';
}

export default async function SendKafkaMessage({
  submissionId,
  repositoryUrl,
}: ICorrectLessonMessage): Promise<ICorrectLessonResponse> {
  await producer.connect();

  await producer.send({
    topic: 'challenge.correction',
    messages: [{ value: JSON.stringify({ submissionId, repositoryUrl }) }],
  });

  await consumer.connect();
  await consumer.subscribe({ topic: 'challenge.correction' });

  let myMessage;
  let response: ICorrectLessonResponse;
  await consumer.run({
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

  return response;
}
