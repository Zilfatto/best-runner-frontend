import { ITrainingAction, TrainingActionTypes } from '../actions/trainings';
import { RootState } from '../store/storeConfiguration';
import ITraining from '../models/ITraining';
import ID from '../types/ID';

interface ITrainingState {
    items: ITraining[]
}

const initialState: ITrainingState = {
    items: []
};

export default (state = initialState, action: ITrainingAction) => {
    switch (action.type) {
        case TrainingActionTypes.FETCH_TRAININGS:
            return { ...state, items: action.items };

        case TrainingActionTypes.SET_TRAININGS:
            return { ...state, items: action.items };

        case TrainingActionTypes.ADD_TRAINING:
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

        case TrainingActionTypes.EDIT_TRAINING:
            return {
                ...state,
                items: state.items.map(training => training.id === action.id
                    ? {
                        ...training,
                        distanceInKM: action.distanceInKM,
                        date: action.date,
                        workoutType: action.workoutType,
                        comment: action.comment
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

        default:
            return state;
    }
};

// Getters
export const getTrainings = (state: RootState): ITraining[] => state.trainings.items;
export const getTraining = (state: RootState, id: ID): ITraining | null => state.trainings.items.find((item: ITraining) => item.id === id) || null;