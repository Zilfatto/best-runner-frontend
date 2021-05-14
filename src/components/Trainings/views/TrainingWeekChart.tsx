import React, { FC, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Collapse, Row, Col } from 'reactstrap';
import ChartWeekPicker from './ChartWeekPicker';
import HighchartsReact from 'highcharts-react-official';
import * as HighCharts from 'highcharts';
import {
    generateChartWeekDates,
    createDateToDistanceSumMapFrameGenerator,
    createChartWeekTrainingDistancesByDatesSumUpper,
    createChartSeriesGenerator,
    createChartOptionsGenerator
} from '../../../utils/trainings';
import { getChartWeek } from '../../../reducers/trainings';
import { setChartWeek } from '../../../actions/trainings';
import moment from 'moment';
import ITraining from '../../../models/ITraining';
import { WorkoutTupleType } from '../../../enums/WorkoutType';
import './TrainingWeekChart.scss';

export type WorkoutTypeToDistanceMap = {
    [key in WorkoutTupleType]: number;
};

export interface IDateToChartSeriesMap {
    [key: string]: WorkoutTypeToDistanceMap
}

export interface IChartSeries {
    name: string;
    data: number[];
}

interface ITrainingWeekChartProps {
    trainings: ITraining[];
    isOpen: boolean;
}

const WEEK_INTERVAL = 7;

const TrainingWeekChart: FC<ITrainingWeekChartProps> = ({ trainings, isOpen }) => {
    const dispatch = useDispatch();
    const chartWeek = useSelector(getChartWeek);
    const chartWeekDates = useMemo(() => generateChartWeekDates(chartWeek, WEEK_INTERVAL), [chartWeek]);
    // Pick up first and last week dates
    const weekStart = chartWeekDates[0];
    const weekEnd = chartWeekDates[chartWeekDates.length - 1];
    // Create new function for creating date to distances sum map frame only if chart week Dates have changed
    const generateDateToDistanceSumMapFrame = useCallback(
        () => createDateToDistanceSumMapFrameGenerator(chartWeekDates, WEEK_INTERVAL),
        [chartWeekDates]
    );

    // Use memoized function for calculating distances covered by every workout type for each date, if nothing what is used was changed
    const sumUpChartWeekTrainingDistancesByDates = useCallback(
        (dateToDistanceSumMapFrame: IDateToChartSeriesMap) =>
            createChartWeekTrainingDistancesByDatesSumUpper(dateToDistanceSumMapFrame, trainings, weekStart, weekEnd),
        [trainings, weekStart, weekEnd]
    );

    // Use memoized value for avoiding complex logic to calculate distance sum of trainings on different dates of a specified week
    const dateToDistanceSumMap = useMemo(
        mapChartWeekDatesToTrainingDistancesSum,
        [generateDateToDistanceSumMapFrame, sumUpChartWeekTrainingDistancesByDates]
    );

    // Create columns with data for each day of a chart week
    const generateChartSeries = useCallback(
        () => createChartSeriesGenerator(chartWeekDates, dateToDistanceSumMap),
        [chartWeekDates, dateToDistanceSumMap]
    );

    // Update chart only if week or trainings have changed
    const chartOptions = useMemo(
        () => createChartOptionsGenerator(chartWeekDates, generateChartSeries),
        [chartWeekDates, generateChartSeries]
    );

    // Connect chart week dates to covered distances sum of every workout type of a particular date
    function mapChartWeekDatesToTrainingDistancesSum() {
        const dateToDistanceSumMapFrame = generateDateToDistanceSumMapFrame();
        return sumUpChartWeekTrainingDistancesByDates(dateToDistanceSumMapFrame);
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