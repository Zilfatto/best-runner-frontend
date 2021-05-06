import React from 'react';
import ITraining from '../models/ITraining';
import { IColumn } from '../shared/SmartTable/SmartTable';


// Create table columns for trainings
export function constructColumnsForTrainingTable(): IColumn<ITraining>[] {
    return [
        { title: 'Date', dataIndex: 'date', key: 'date' },
        { title: 'Workout Type', dataIndex: 'workoutType', key: 'workoutType' },
        { title: 'Distance (KM)', dataIndex: 'distanceInKM', key: 'distanceInKM' },
        { title: 'Comment', dataIndex: 'comment', key: 'comment' }
    ];
}