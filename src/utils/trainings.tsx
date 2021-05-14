import React, { ReactNode } from 'react';
import { Input } from 'reactstrap';
import { toast } from 'react-toastify';
import moment from 'moment';
import _zipObject from 'lodash-es/zipObject';
import _cloneDeep from 'lodash-es/cloneDeep';
import _range from 'lodash-es/range';
import ITraining from '../models/ITraining';
import { IColumn } from '../shared/SmartTable/SmartTable';
import {
    WorkoutTypeToDistanceMap,
    IDateToChartSeriesMap,
    IChartSeries
} from '../components/Trainings/views/TrainingWeekChart';
import WorkoutType, { workoutTuple, WorkoutTupleType } from '../enums/WorkoutType';
import { ValidationError } from 'class-validator';
import { TrainingInputErrorsMap } from '../components/Trainings/views/TrainingFormModal';

// Modified types for working with selection and adding an All option
export type WorkoutTypeSelectValues = WorkoutTupleType | 'all';
type WorkoutTypeSelectItems = { value: WorkoutTypeSelectValues, label: string }[];

interface INeedfulChartStructureOptions {
    xAxis: { categories: string[] };
    series: IChartSeries[];
}

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

export const convertDatesToDayNames = (dates: string[]) => dates.map(date => moment(date).format('ddd'));

// Create a selection for filtering genres
export const createWorkoutTypeSelection = (value: WorkoutTypeSelectValues = 'all', handler: (val: WorkoutTypeSelectValues) => void, items: WorkoutTypeSelectItems) => (
    <Input type={'select'} value={value} onChange={(e) => handler(e.target.value as WorkoutTypeSelectValues)}>
        {items.map((item, index) => <option value={item.value} key={index} >{item.label}</option>)}
    </Input>
);

// Apply workout type filter to trainings
export const filterTrainings = (trainings: ITraining[], selectedWorkoutType: WorkoutTypeSelectValues = 'all') => {
    return selectedWorkoutType === 'all'
        ? trainings
        : trainings.filter(training => training.workoutType === selectedWorkoutType);
};

export const generateChartWeekDates = (chartWeek: string, WEEK_INTERVAL: number): string[] => {
    // Date of a day before week start
    const dateMoment = moment(chartWeek, moment.HTML5_FMT.WEEK).subtract(1, 'day');
    // Create an array of dates from a start to an end of a chart week
    return _range(WEEK_INTERVAL).map(item => dateMoment.add(1, 'day').format(moment.HTML5_FMT.DATE));
};

export const createDateToDistanceSumMapFrameGenerator = (chartWeekDates: string[], WEEK_INTERVAL: number): IDateToChartSeriesMap => {
    const chartSeriesToDistanceMap: Partial<WorkoutTypeToDistanceMap> = {};
    // Fill workout types with default value
    workoutTuple.forEach(workoutType => chartSeriesToDistanceMap[workoutType] = 0);
    // Create and an object map with dates as keys and Series of workout types as values
    return _zipObject(
        chartWeekDates,
        _range(WEEK_INTERVAL)
            .map(() => _cloneDeep(chartSeriesToDistanceMap) as WorkoutTypeToDistanceMap)
    );
};

export const createChartWeekTrainingDistancesByDatesSumUpper = (
    dateToDistanceSumMapFrame: IDateToChartSeriesMap,
    trainings: ITraining[],
    weekStart: string,
    weekEnd: string
) => {
    trainings.forEach(training => {
        // Skip trainings that are not in the chart week
        if (training.date >= weekStart && training.date <= weekEnd) {
            // Sum up distances of all trainings of a particular date separately for each workout type
            dateToDistanceSumMapFrame[training.date][training.workoutType] += training.distanceInKM;
        }
    });
    return dateToDistanceSumMapFrame;
};

export const createChartSeriesGenerator = (chartWeekDates: string[], dateToDistanceSumMap: IDateToChartSeriesMap): IChartSeries[] => {
    const workoutTypeLabels = WorkoutType.getLabels();
    // Create series of all workouts for displaying in the chart
    return workoutTuple.map(workoutType => ({
        name: workoutTypeLabels[workoutType],
        // Create an array of every chart week day mapped to workout distances sum
        data: chartWeekDates.map(date => dateToDistanceSumMap[date][workoutType])
    }));
};

const populateChartStructure = <T extends INeedfulChartStructureOptions>(chartStructure: T, columnNames: string[], series: IChartSeries[]) => {
    chartStructure.xAxis.categories = columnNames;
    chartStructure.series = series;
    return chartStructure;
};

export const createChartOptionsGenerator = (chartWeekDates: string[], generateChartSeries: () => IChartSeries[]) => {
    const chartStructure = createTrainingWeekChartStructure();
    const daysOfChartWeek = convertDatesToDayNames(chartWeekDates);
    const chartSeries = generateChartSeries();
    return populateChartStructure(chartStructure, daysOfChartWeek, chartSeries);
};

export const showValidationErrors = (
    errors: ValidationError[],
    inputsToErrorsMap: TrainingInputErrorsMap,
    setInputsToErrorsMap: (errorsMap: TrainingInputErrorsMap) => void
) => {
    const newInputsToErrorsMap: Partial<TrainingInputErrorsMap> = {};
    // Find errors for each training field
    (Object.keys(inputsToErrorsMap) as (keyof TrainingInputErrorsMap)[]).forEach(inputName => {
        const inputError = errors.find(error => error.property === inputName);
        // Set errors for a particular field if there are any, otherwise just clean them up
        newInputsToErrorsMap[inputName] = inputError?.constraints ? Object.values(inputError.constraints) : [];
    });

    // Update inputs to errors map
    setInputsToErrorsMap(newInputsToErrorsMap as TrainingInputErrorsMap);
    toast.warn('Some of the entered values are invalid!');
}

export const generateWorkoutTypeSelectOptions = () =>
    WorkoutType.getSelectionItems().map((item, index) => (
        <option value={item.value} key={index} >{item.label}</option>
    ));