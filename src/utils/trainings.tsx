import React, { ReactNode } from 'react';
import { Input } from 'reactstrap';
import ITraining from '../models/ITraining';
import { IColumn } from '../shared/SmartTable/SmartTable';
import { WorkoutTupleType } from '../enums/WorkoutType';

// Modified types for working with selection and adding an All option
export type WorkoutTypeSelectValues = WorkoutTupleType | 'all';
type WorkoutTypeSelectItems = { value: WorkoutTypeSelectValues, label: string }[];

// Create table columns for trainings
export const constructColumnsForTrainingTable = (workoutTypeSelectElement: ReactNode): IColumn<ITraining>[] => {
    const renderWorkoutTypeColumnTitle = (title: string) => (
        <>
            <p>{workoutTypeSelectElement}</p>
            <span>{title}</span>
        </>
    );

    return [
        { title: 'Workout Type', dataIndex: 'workoutType', key: 'workoutType', renderColumnTitle: renderWorkoutTypeColumnTitle},
        { title: 'Date', dataIndex: 'date', key: 'date', sortable: true },
        { title: 'Distance (KM)', dataIndex: 'distanceInKM', key: 'distanceInKM', sortable: true },
        { title: 'Comment', dataIndex: 'comment', key: 'comment' }
    ];
}

export const createTrainingWeekChartStructure = () => ({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Covered Distances of Different Workout Types Within a Week'
        },
        subtitle: {
            text: 'Source: imagination.com'
        },
        xAxis: {
            categories: [],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Distances sum (km)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} km</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: []
    });

// Create a selection for filtering genres
export const createWorkoutTypeSelection = (value: WorkoutTypeSelectValues = 'all', handler: (val: WorkoutTypeSelectValues) => void, items: WorkoutTypeSelectItems) => (
    <Input type={'select'} value={value} onChange={(e) => handler(e.target.value as WorkoutTypeSelectValues)}>
        {items.map((item, index) => <option value={item.value} key={index} >{item.label}</option>)}
    </Input>
);

// Apply workout type filter to trainings
export const filterTrainings = (trainings: ITraining[], selectedWorkoutType: WorkoutTypeSelectValues = 'all') =>
    trainings.filter(training => selectedWorkoutType === 'all' || training.workoutType === selectedWorkoutType);