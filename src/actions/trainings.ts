import { Action } from 'redux';
import http from '../services/httpService';
import { toast } from 'react-toastify';
import { AppDispatch, AppGetState } from '../store/storeConfiguration'
import { AxiosError } from 'axios';
import ITraining from '../models/ITraining';
import ID from '../types/ID';
import { WorkoutTypeSelectValues } from '../utils/trainings';

// Interface for action in a training reducer
export interface ITrainingAction extends Action<TrainingActionTypes> {
    [extraProps: string]: any;
}

// An experimental use of enum for Action Types in order to get TS support for cases in a reducer
// With that TypeScript does not allow to add any not existing action types in a training reducer switch block
export enum TrainingActionTypes {
    FETCH_TRAININGS = 'FETCH_TRAININGS',
    SET_TRAININGS = 'SET_TRAININGS',
    CREATE_TRAINING = 'CREATE_TRAINING',
    DELETE_TRAINING = 'DELETE_TRAINING',
    UPDATE_TRAINING = 'UPDATE_TRAINING',
    SET_TRAINING_ID = ' SET_TRAINING_ID',
    SET_WORKOUT_TYPE_FILTER = 'SET_WORKOUT_TYPE_FILTER',
    SET_CHART_WEEK = 'SET_CHART_WEEK'
}

let TRAINING_TEMP_ID = -1;

const generateTrainingEndpoint = (id: ID) => `trainings/${id}`;


// Action creator for rolling back to the previous trainings state
const setTrainings = (items: ITraining[]) => ({ type: TrainingActionTypes.SET_TRAININGS, items });

// Action creator for updating a training id after it's een received from the server
const setTrainingId = (oldId: ID, newId: ID) => ({ type: TrainingActionTypes.SET_TRAINING_ID, oldId, newId });

// Trainings fetch
export const fetchTrainings = () => (dispatch: AppDispatch, getState: AppGetState) => {
    return http.get<ITraining[]>('/trainings')
        .then(response => response.data)
        .then(items => dispatch({
            type: TrainingActionTypes.FETCH_TRAININGS,
            items
        }))
        .catch((error: AxiosError) => {
            // Show an error to a user about failed training fetch
            console.error(error.message);
            toast.error('Could not load trainings from the server');
        });
};

// Training fetch
export const fetchTraining = (id: ID) => (dispatch: AppDispatch, getState: AppGetState) => {
    return http.get<ITraining>(generateTrainingEndpoint(id))
        .then(response => response.data)
        .catch((error: AxiosError) => {
            // Show an error about not successful training fetch
            console.error(error.message);
            toast.error(`Could not load trainings from the server. ${error.message}`);
        });
};

// Create a training
export const createTraining = (trainingData: Omit<ITraining, 'id'>) => (dispatch: AppDispatch, getState: AppGetState) => {
    const oldState = getState();
    const tmpId = TRAINING_TEMP_ID--;

    // Add a training to Redux first
    dispatch({
        type: TrainingActionTypes.CREATE_TRAINING,
        item: {
            ...trainingData,
            id: tmpId
        }
    });

    // Make a request to the server for saving it on the backend
    return http.post<ITraining>('/trainings')
        .then(response => response.data)
        // Then after receiving a response from the server set a real id of a training
        .then(item => dispatch(setTrainingId(tmpId, item.id)))
        .catch((error: AxiosError) => {
            // Show an error to a user
            console.error(error.message);
            toast.error(`Could not create a training. ${error.message}`);
            // Roll back to the previous state
            setTrainings(oldState.trainings.items);
        });
};

// Update a training
export const updateTraining = (updatedTraining: ITraining) => (dispatch: AppDispatch, getState: AppGetState) => {
    const oldState = getState();

    // Dispatch an updated to Redux to show a new version strait away
    dispatch({
        type: TrainingActionTypes.UPDATE_TRAINING,
        item: updatedTraining
    });

    // Then save changes on the server
    return http.put(generateTrainingEndpoint(updatedTraining.id))
        .catch((error: AxiosError) => {
            // Show an error to a user
            console.error(error.message);
            toast.error(`Could not update a training. ${error.message}`);
            // Roll back to the previous state
            setTrainings(oldState.trainings.items);
        });
};

// Delete a training
export const deleteTraining = (id: ID) => (dispatch: AppDispatch, getState: AppGetState) => {
    const oldState = getState();

    // Update the Redux first for an immediate visual effect
    dispatch({
        type: TrainingActionTypes.DELETE_TRAINING,
        id
    });

    // Then delete a training from the server
    return http.put(generateTrainingEndpoint(id))
        .catch((error: AxiosError) => {
            // Show an error to a user
            console.error(error.message);
            toast.error(`Could not delete a training. ${error.message}`);
            // Roll back to the previous state
            setTrainings(oldState.trainings.items);
        });
};

// Change a filter for trainings
export const setWorkoutTypeFilter = (workoutTypeFilter: WorkoutTypeSelectValues) => ({
    type: TrainingActionTypes.SET_WORKOUT_TYPE_FILTER,
    workoutTypeFilter
});

export const setChartWeek = (chartWeek: string) => ({ type: TrainingActionTypes.SET_CHART_WEEK, chartWeek })