import moment from 'moment';
import { WorkoutTypeSelectValues } from '../utils/trainings';
import { ITrainingAction, TrainingActionTypes } from '../actions/trainings';
import { RootState } from '../store/storeConfiguration';
import ITraining from '../models/ITraining';
import ID from '../types/ID';

interface ITrainingState {
    items: ITraining[];
    workoutTypeFilter: WorkoutTypeSelectValues;
    chartWeek: string;
}

const initialState: ITrainingState = {
    items: [],
    workoutTypeFilter: 'all',
    chartWeek: moment().format(moment.HTML5_FMT.WEEK)
};

const trainings = (state = initialState, action: ITrainingAction) => {
    switch (action.type) {
        case TrainingActionTypes.FETCH_TRAININGS:
            return { ...state, items: action.items };

        case TrainingActionTypes.SET_TRAININGS:
            return { ...state, items: action.items };

        case TrainingActionTypes.CREATE_TRAINING:
            return {
                ...state,
                items: [
                    ...state.items,
                    action.item
                ]
            };

        case TrainingActionTypes.DELETE_TRAINING:
            return {
                ...state,
                items: state.items.filter(training => training.id !== action.id)
            };

        case TrainingActionTypes.UPDATE_TRAINING:
            return {
                ...state,
                items: state.items.map(training => training.id === action.item.id
                    ? {
                        ...training,
                        distanceInKM: action.item.distanceInKM,
                        date: action.item.date,
                        workoutType: action.item.workoutType,
                        comment: action.item.comment
                    }
                    : training
                )
            };

        case TrainingActionTypes.SET_TRAINING_ID:
            return {
                ...state,
                items: state.items.map(training => training.id === action.oldId
                    ? {
                        ...training,
                        id: action.newId
                    }
                    : training
                )
            };

        case TrainingActionTypes.SET_WORKOUT_TYPE_FILTER:
            return {
                ...state,
                workoutTypeFilter: action.workoutTypeFilter
            };

        case TrainingActionTypes.SET_CHART_WEEK:
            return {
                ...state,
                chartWeek: action.chartWeek
            };

        default:
            return state;
    }
};

export default trainings;

// Getters
export const getTrainings = (state: RootState): ITraining[] => state.trainings.items;
export const getTraining = (state: RootState, id: ID): ITraining | null => state.trainings.items.find((item: ITraining) => item.id === id) || null;
export const getWorkoutTypeFilter = (state: RootState): WorkoutTypeSelectValues => state.trainings.workoutTypeFilter;
export const getChartWeek = (state: RootState): string => state.trainings.chartWeek;