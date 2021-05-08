import React, { FC, useState, useEffect, createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, InputGroup, InputGroupAddon, Button } from 'reactstrap';
import { getChartWeek } from '../../../reducers/trainings';
import { setChartWeek } from '../../../actions/trainings';

const ChartWeekPicker: FC = () => {
    const dispatch = useDispatch();
    const [chartWeekInputError, setChartWeekInputError] = useState('');
    const chartWeek = useSelector(getChartWeek);
    const weekInput = createRef<HTMLInputElement>();

    useEffect(() => {
        // Update a value of a week input on each chart week change
        weekInput.current!.value = chartWeek;
    }, [chartWeek]);

    function chartWeekChangeHandler() {
        if (weekInput.current!.checkValidity()) {
            // Update a chart week
            dispatch(setChartWeek(weekInput.current!.value));
        }
        // Update an error message
        setChartWeekInputError(weekInput.current!.validationMessage);
    }

    return (
        <div>
            <InputGroup aria-errormessage={chartWeekInputError}>
                <Input
                    type='week'
                    innerRef={weekInput}
                    defaultValue={chartWeek}
                />
                <InputGroupAddon addonType="append">
                    <Button onClick={chartWeekChangeHandler}>Search</Button>
                </InputGroupAddon>
            </InputGroup>
        </div>
    );
};

export default ChartWeekPicker;