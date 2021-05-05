import { TrainingActionTypes, ITrainingAction } from '../actions/trainings';
import ITraining from '../models/ITraining';

const initialState = {
    items: [] as ITraining[],
};

export default (state = initialState, action: ITrainingAction) => {
    switch (action.type) {
        case TrainingActionTypes.TRAININGS_FETCH:
            return {
                ...state,
                items: action.items
            };

        default:
            return state;
    }
};