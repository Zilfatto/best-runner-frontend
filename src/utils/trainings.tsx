import React, { ReactNode } from 'react';
import ITraining from '../models/ITraining';
import { IColumn } from '../shared/SmartTable/SmartTable';
import { WorkoutTupleType } from '../enums/WorkoutType';

// Modified types for working with selection and adding an All option
export type WorkoutTypeSelectValues = WorkoutTupleType | 'all';
type WorkoutTypeSelectItems = { value: WorkoutTypeSelectValues, label: string }[];

// Create table columns for trainings
export const constructColumnsForTrainingTable = (workoutTypeSelectElement: ReactNode): IColumn<ITraining>[] => {
    const renderWorkoutTypeColumnTitle = (title: string) => (
        <div>
            <span>{title}</span>
            <p>{workoutTypeSelectElement}</p>
        </div>
    );

    return [
        { title: 'Workout Type', dataIndex: 'workoutType', key: 'workoutType', renderColumnTitle: renderWorkoutTypeColumnTitle},
        { title: 'Date', dataIndex: 'date', key: 'date', sortable: true },
        { title: 'Distance (KM)', dataIndex: 'distanceInKM', key: 'distanceInKM', sortable: true },
        { title: 'Comment', dataIndex: 'comment', key: 'comment' }
    ];
}

// Create a selection for filtering genres
export const createWorkoutTypeSelection = (value: WorkoutTypeSelectValues = 'all', handler: (val: WorkoutTypeSelectValues) => void, items: WorkoutTypeSelectItems) => (
    <select defaultValue={value} onChange={(e) => handler(e.target.value as WorkoutTypeSelectValues)}>
        {items.map((item, index) => <option value={item.value} key={item.value} >{item.label}</option>)}
    </select>
);

// Apply workout type filter to trainings
export const filterTrainings = (trainings: ITraining[], selectedWorkoutType: WorkoutTypeSelectValues = 'all') =>
    trainings.filter(training => selectedWorkoutType === 'all' || training.workoutType === selectedWorkoutType);