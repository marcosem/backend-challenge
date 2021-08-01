export default interface IListSubmissionsDTO {
  take?: number;
  skip?: number;
  challenge_id?: string;
  date_start?: Date;
  date_end?: Date;
  status?: string;
}
