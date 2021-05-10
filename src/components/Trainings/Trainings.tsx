import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TrainingWeekChart from './views/TrainingWeekChart';
import TrainingFormModal from './views/TrainingFormModal';
import SmartTable from '../../shared/SmartTable';
import { Container, Row, Col, ButtonToggle, Button } from 'reactstrap';
import { fetchTrainings, setWorkoutTypeFilter, deleteTraining } from '../../actions/trainings';
import { getTrainings, getWorkoutTypeFilter } from '../../reducers/trainings';
import {
    constructColumnsForTrainingTable,
    createWorkoutTypeSelection,
    filterTrainings,
    WorkoutTypeSelectValues
} from '../../utils/trainings';
import WorkoutType from '../../enums/WorkoutType';
import ID from '../../types/ID';
import ITraining from '../../models/ITraining';

const Trainings = () => {
    const dispatch = useDispatch();
    const trainings = useSelector(getTrainings);
    const workoutTypeFilter = useSelector(getWorkoutTypeFilter);
    // Filter trainings by a selected workout type filter
    const filteredTrainings = filterTrainings(trainings, workoutTypeFilter);
    const [chartIsOpen, setChartIsOpen] = useState(false);
    const [formModalIsOpen, setFormModalIsOpen] = useState(false);
    const [editingTraining, setEditingTraining] = useState<ITraining | null>(null);
    // Selection for filtering trainings
    const workoutTypeSelect = createWorkoutTypeSelection(workoutTypeFilter, workoutTypeChangeHandler,
        [ ...WorkoutType.getSelectionItems(), { value: 'all', label: 'All' } ]
        );

    const formModalVisibilityToggle = useCallback(() => {
        setFormModalIsOpen(formModalIsOpen => !formModalIsOpen);
    }, []);

    const openTrainingFormModal = useCallback(() => {
        setFormModalIsOpen(true);
    }, []);

    const openTrainingEditingFormHandler = useCallback((training: ITraining) => {
        setEditingTraining(training);
        openTrainingFormModal();
    }, [openTrainingFormModal]);

    const openTrainingCreatingFormHandler = useCallback(() => {
        setEditingTraining(null);
        openTrainingFormModal();
    }, [openTrainingFormModal]);

    const deleteTrainingHandler = useCallback((id: ID) => dispatch(deleteTraining(id)), [dispatch]);

    const chartVisibilityToggle = useCallback(() => {
        setChartIsOpen(chartIsOpen => !chartIsOpen);
    }, []);

    useEffect(() => {
        // Fetch trainings after a component has been mounted
        dispatch(fetchTrainings());
    }, [dispatch]);

    // Handle workout type selection
    function workoutTypeChangeHandler(value: WorkoutTypeSelectValues) {
        dispatch(setWorkoutTypeFilter(value));
    }

    return (
        <Container fluid={true}>
            <Row className='justify-content-between px-3 py-3'>
                <ButtonToggle
                    color='info'
                    size='lg'
                    onClick={chartVisibilityToggle}
                >
                    Show the training week chart
                </ButtonToggle>
                <Button
                    size='lg'
                    onClick={openTrainingCreatingFormHandler}
                >
                    Create new training
                </Button>
            </Row>
            <Row className='justify-content-around'>
                <Col xs={10}>
                    <TrainingWeekChart trainings={trainings} isOpen={chartIsOpen} />
                    <TrainingFormModal
                        isOpen={formModalIsOpen}
                        modalVisibilityToggle={formModalVisibilityToggle}
                        editingTraining={editingTraining}
                    />
                    <SmartTable
                        columns={constructColumnsForTrainingTable(workoutTypeSelect)}
                        items={filteredTrainings}
                        showDelete={true}
                        onRowClick={openTrainingEditingFormHandler}
                        onItemDelete={deleteTrainingHandler}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Trainings;