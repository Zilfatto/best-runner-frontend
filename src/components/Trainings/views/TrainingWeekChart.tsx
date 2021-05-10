import React, { FC, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Collapse, Row, Col } from 'reactstrap';
import ChartWeekPicker from './ChartWeekPicker';
import HighchartsReact from 'highcharts-react-official';
import * as HighCharts from 'highcharts';
import { createTrainingWeekChartStructure, convertDatesToDayNames } from '../../../utils/trainings';
import { getChartWeek } from '../../../reducers/trainings';
import { setChartWeek } from '../../../actions/trainings';
import moment from 'moment';
import _zipObject from 'lodash-es/zipObject';
import _cloneDeep from 'lodash-es/cloneDeep';
import ITraining from '../../../models/ITraining';
import WorkoutType, { workoutTuple, WorkoutTupleType } from '../../../enums/WorkoutType';
import './TrainingWeekChart.scss';

type WorkoutTypeToDistanceMap = {
    [key in WorkoutTupleType]: number;
};

interface IDateToChartSeriesMap {
    [key: string]: WorkoutTypeToDistanceMap
}

interface IChartSeries {
    name: string;
    data: number[];
}

interface INeedfulChartStructureOptions {
    xAxis: { categories: string[] };
    series: IChartSeries[];
}

interface ITrainingWeekChartProps {
    trainings: ITraining[];
    isOpen: boolean;
}

const WEEK_INTERVAL = 7;

const TrainingWeekChart: FC<ITrainingWeekChartProps> = ({ trainings, isOpen }) => {
    const dispatch = useDispatch();
    const chartWeek = useSelector(getChartWeek);
    const chartWeekDates = generateChartWeekDates();
    // Pick up first and last week dates
    const weekStart = chartWeekDates[0];
    const weekEnd = chartWeekDates[chartWeekDates.length - 1];
    // Create new function for creating date to distances sum map frame only if chart week Dates have changed
    const generateDateToDistanceSumMapFrame = useCallback((): IDateToChartSeriesMap => {
        const chartSeriesToDistanceMap: Partial<WorkoutTypeToDistanceMap> = {};
        // Fill workout types with default value
        workoutTuple.forEach(workoutType => chartSeriesToDistanceMap[workoutType] = 0);
        // Create and an object map with dates as keys and Series of workout types as values
        return _zipObject(
            chartWeekDates,
            Array(WEEK_INTERVAL)
                .fill('')
                .map(elem => _cloneDeep(chartSeriesToDistanceMap) as WorkoutTypeToDistanceMap)
        );
    }, [chartWeekDates]);

    // Use memoized function for calculating distances covered by every workout type for each date, if nothing what is used was changed
    const sumUpChartWeekTrainingDistancesByDates = useCallback((dateToDistanceSumMapFrame: IDateToChartSeriesMap) => {
        trainings.forEach(training => {
            // Skip trainings that are not in the chart week
            if (training.date >= weekStart && training.date <= weekEnd) {
                // Sum up distances of all trainings of a particular date separately for each workout type
                dateToDistanceSumMapFrame[training.date][training.workoutType] += training.distanceInKM;
            }
        });
        return dateToDistanceSumMapFrame;
    }, [trainings, weekStart, weekEnd]);

    // Use memoized value for avoiding complex logic to calculate distance sum of trainings on different dates of a specified week
    const dateToDistanceSumMap = useMemo(
        mapChartWeekDatesToTrainingDistancesSum,
        [generateDateToDistanceSumMapFrame, sumUpChartWeekTrainingDistancesByDates]
    );

    // Create columns with data for each day of a chart week
    const generateChartSeries = useCallback((): IChartSeries[] => {
        const workoutTypeLabels = WorkoutType.getLabels();
        // Create series of all workouts for displaying in the chart
        return workoutTuple.map(workoutType => ({
            name: workoutTypeLabels[workoutType],
            // Create an array of every chart week day mapped to workout distances sum
            data: chartWeekDates.map(date => dateToDistanceSumMap[date][workoutType])
        }));
    }, [chartWeekDates, dateToDistanceSumMap]);

    // Update chart only if week or trainings have changed
    const chartOptions = useMemo(
        createChartOptions,
        [chartWeekDates, generateChartSeries]
    );

    // Connect chart week dates to covered distances sum of every workout type of a particular date
    function mapChartWeekDatesToTrainingDistancesSum() {
        const dateToDistanceSumMapFrame = generateDateToDistanceSumMapFrame();
        return sumUpChartWeekTrainingDistancesByDates(dateToDistanceSumMapFrame);
    }

    function createChartOptions() {
        const chartStructure = createTrainingWeekChartStructure();
        const daysOfChartWeek = convertDatesToDayNames(chartWeekDates);
        const chartSeries = generateChartSeries();
        return populateChartStructure(chartStructure, daysOfChartWeek, chartSeries);
    }

    function populateChartStructure<T extends INeedfulChartStructureOptions>(chartStructure: T, columnNames: string[], series: IChartSeries[]) {
        chartStructure.xAxis.categories = columnNames;
        chartStructure.series = series;
        return chartStructure;
    }

    function generateChartWeekDates(): string[] {
        // Date of a day before week start
        const dateMoment = moment(chartWeek, moment.HTML5_FMT.WEEK).subtract(1, 'day');
        // Create an array of dates from a start to an end of a chart week
        return Array(WEEK_INTERVAL).fill('').map(item => dateMoment.add(1, 'day').format(moment.HTML5_FMT.DATE));
    }

    function chartWeekChangeHandler(weekShift: number = 0) {
        const newChartWeek = moment(chartWeek).add(weekShift, 'week').format(moment.HTML5_FMT.WEEK);
        // Update a chart week on prev/next week click
        dispatch(setChartWeek(newChartWeek));
    }

    return (
        <Collapse isOpen={isOpen} className='mb-5'>
            <section className='chart-week-interval'>
                <div className='dates-container'>
                    <span onClick={() => chartWeekChangeHandler(-1)} className='prev-arrow' />
                    <span className='chart-week-date'>{weekStart}</span>
                    <span> &#9866; </span>
                    <span className='chart-week-date'>{weekEnd}</span>
                    <span onClick={() => chartWeekChangeHandler(1)} className='next-arrow' />
                </div>
            </section>
            <HighchartsReact
                highcharts={HighCharts}
                options={chartOptions}
            />
            <Row className='justify-content-around'>
                <Col xs={4}>
                    <ChartWeekPicker />
                </Col>
            </Row>
        </Collapse>
    );
};

export default TrainingWeekChart;