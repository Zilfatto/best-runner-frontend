import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SmartTable from '../../shared/SmartTable';
import { fetchTrainings, setWorkoutTypeFilter } from '../../actions/trainings';
import { getTrainings, getWorkoutTypeFilter } from '../../reducers/trainings';
import {
    constructColumnsForTrainingTable,
    createWorkoutTypeSelection,
    filterTrainings,
    WorkoutTypeSelectValues
} from '../../utils/trainings';
import WorkoutType from '../../enums/WorkoutType';
import ID from '../../types/ID';

const Trainings = () => {
    const dispatch = useDispatch();
    const trainings = useSelector(getTrainings);
    const workoutTypeFilter = useSelector(getWorkoutTypeFilter);
    // Filter trainings by a selected workout type filter
    const filteredTrainings = filterTrainings(trainings, workoutTypeFilter);

    // Selection for filtering trainings
    const workoutTypeSelect = createWorkoutTypeSelection(
        workoutTypeFilter,
        handleSelectedWorkoutTypeChange,
        [ ...WorkoutType.getSelectionItems(), { value: 'all', label: 'All' } ]
        );

    useEffect(() => {
        // Fetch trainings after a component has been mounted
        dispatch(fetchTrainings());
    }, []);

    // Handle workout type selection
    function handleSelectedWorkoutTypeChange(value: WorkoutTypeSelectValues) {
        dispatch(setWorkoutTypeFilter(value));
    }

    return (
        <section>
            <SmartTable
                columns={constructColumnsForTrainingTable(workoutTypeSelect)}
                items={filteredTrainings}
                showDelete={true}
                onItemDelete={(id: ID) => null}
            />
        </section>
    );
};

export default Trainings;