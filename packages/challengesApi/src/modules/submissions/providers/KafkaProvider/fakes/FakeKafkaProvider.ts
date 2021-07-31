import IKafkaProvider, {
  ICorrectLessonMessage,
  ICorrectLessonResponse,
} from '@modules/submissions/providers/KafkaProvider/models/IKafkaProvider';

class FakeKafkaProvider implements IKafkaProvider {
  public async sendMessage({
    submissionId,
    repositoryUrl,
  }: ICorrectLessonMessage): Promise<ICorrectLessonResponse> {
    const response: ICorrectLessonResponse = {
      submissionId,
      repositoryUrl,
      grade: 0,
      status: 'Pending',
    };

    return response;
  }
}

export default FakeKafkaProvider;
