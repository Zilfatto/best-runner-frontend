import ID from '../types/ID';
import { WorkoutTupleType } from '../enums/WorkoutType';

export default interface ITraining {
    id: ID;
    distanceInKM: number;
    date: string;
    workoutType: WorkoutTupleType;
    comment: string;
}