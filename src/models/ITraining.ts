import ID from '../types/ID';

export default interface ITraining {
    id: ID;
    distanceInKM: number;
    date: string;
    workoutType: string;
    comment: string;
}