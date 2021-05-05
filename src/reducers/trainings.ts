import {ITrainingAction, TrainingActionTypes} from '../actions/trainings';
import ITraining from '../models/ITraining';

const initialState = {
    items: [] as ITraining[]
};

export default (state = initialState, action: ITrainingAction) => {
    switch (action.type) {
        case TrainingActionTypes.FETCH_TRAININGS:
            return {
                ...state,
                items: action.items
            };

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

        default:
            return state;
    }
};