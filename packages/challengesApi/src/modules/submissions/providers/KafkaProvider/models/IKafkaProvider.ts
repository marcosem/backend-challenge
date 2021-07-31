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

export default interface IKafkaProvider {
  sendMessage({
    submissionId,
    repositoryUrl,
  }: ICorrectLessonMessage): Promise<ICorrectLessonResponse>;
}
