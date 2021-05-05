import { Action } from 'redux';
import ITraining from '../models/ITraining';

// Interface for action in a training reducer
export interface ITrainingAction extends Action<TrainingActionTypes> {
    [extraProps: string]: any;
}

// An experimental use of enum for Action Types in order to get TS support for cases in a reducer
// With that TypeScript does not allow to add any not existing action types in a training reducer switch block
export enum TrainingActionTypes {
    TRAININGS_FETCH = 'trainings/fetch',
    TRAINING_ADD = 'training/add'
}

// Fake trainings fetch
export const trainingsFakeFetch = () => ({
    type: TrainingActionTypes.TRAININGS_FETCH,
    items: [
        {
            id: Date.now(),
            date: '2021-02-02',
            distanceInKM: 15.5,
            workoutType: 'Cycling',
            comment: ''
        },
        {
            id: Date.now() + 10,
            date: '2021-02-04',
            distanceInKM: 10,
            workoutType: 'Swimming',
            comment: 'It was very hard'
        }
    ] as ITraining[]
});