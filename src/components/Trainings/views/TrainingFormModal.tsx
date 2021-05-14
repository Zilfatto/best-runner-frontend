import React, { FC, useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    Button,
    Label
} from 'reactstrap';
import { createTraining, updateTraining } from '../../../actions/trainings';
import Training, { validatorOptions } from '../../../utils/Validation/training';
import { generateWorkoutTypeSelectOptions, showValidationErrors } from '../../../utils/trainings';
import { validate } from 'class-validator';
import _isEmpty from 'lodash-es/isEmpty';
import { toast } from 'react-toastify';
import { WorkoutTupleType } from '../../../enums/WorkoutType';
import ITraining from '../../../models/ITraining';
import './TrainingFormModal.scss';

export type TrainingInputErrorsMap = {
    [prop in keyof Training]: string[];
};

interface ITrainingFormModalProps {
    isOpen: boolean;
    modalVisibilityToggle(): void;
    editingTraining: ITraining | null;
}

const TrainingFormModal: FC<ITrainingFormModalProps> = ({ isOpen, modalVisibilityToggle, editingTraining }) => {
    const dispatch = useDispatch();
    const [date, setDate] = useState('');
    const [workoutType, setWorkoutType] = useState<WorkoutTupleType>('running');
    const [distanceInKM, setDistanceInKM] = useState('');
    const [comment, setComment] = useState('');
    const [inputsToErrorsMap, setInputsToErrorsMap] = useState<TrainingInputErrorsMap>({ date: [], workoutType: [], distanceInKM: [], comment: [] })

    // Update function on training or isOpen change
    const populateFormInputWIthData = useCallback(() => {
        setDate(editingTraining?.date || '');
        setWorkoutType(editingTraining?.workoutType || 'running');
        setDistanceInKM(editingTraining ? String(editingTraining!.distanceInKM) : '');
        setComment(editingTraining?.comment || '');
    }, [editingTraining]);

    useEffect(() => {
        populateFormInputWIthData();

        return () => {
            cleanUpErrors();
        }
    }, [populateFormInputWIthData, isOpen]);

    function saveTrainingHandler() {
        const training = new Training(date, workoutType, +distanceInKM, comment);
        validate(training, validatorOptions).then(errors => {
            if (!_isEmpty(errors)) {
                return showValidationErrors(errors, inputsToErrorsMap, setInputsToErrorsMap);
            }

            toast.success('Saved!');
            modalVisibilityToggle();
            return editingTraining
                ? dispatch(updateTraining({ ...training, id: editingTraining.id }))
                : dispatch(createTraining(training));
        });
    }

    function cleanUpErrors() {
        setInputsToErrorsMap({
           date: [],
           workoutType: [],
           distanceInKM: [],
           comment: []
        });
    }

    return (
        <Modal isOpen={isOpen}>
            <ModalHeader toggle={modalVisibilityToggle}>
                {editingTraining ? 'Editing the training' : 'New training'}
            </ModalHeader>
            <ModalBody>
                <Form >
                    <FormGroup>
                        <Label for='trainingDate'>Date</Label>
                        <Input
                            id='trainingDate'
                            value={date}
                            type='date'
                            name='date'
                            placeholder='Enter a training date'
                            onChange={(event) => setDate(event.target.value)}
                        >
                        </Input>
                        {!_isEmpty(inputsToErrorsMap['date']) && (
                            <p className='input-errors-container'>
                                {inputsToErrorsMap['date'].map(inputError => <span key={inputError} className='input-error'>{inputError}</span>)}
                            </p>
                        )}
                    </FormGroup>
                    <FormGroup>
                        <Label for='trainingWorkoutType'>Workout Type</Label>
                        <Input
                            id='trainingWorkoutType'
                            value={workoutType}
                            type='select'
                            name='workoutType'
                            placeholder='Select workout type'
                            onChange={(event) => setWorkoutType(event.target.value as WorkoutTupleType)}
                        >
                            {generateWorkoutTypeSelectOptions()}
                        </Input>
                        {!_isEmpty(inputsToErrorsMap['workoutType']) && (
                            <p className='input-errors-container'>
                                {inputsToErrorsMap['workoutType'].map(inputError => <span key={inputError} className='input-error'>{inputError}</span>)}
                            </p>
                        )}
                    </FormGroup>
                    <FormGroup>
                        <Label for='trainingDistance'>Covered Distance (km)</Label>
                        <Input
                            id='trainingDistance'
                            value={distanceInKM}
                            type='number'
                            name='distance'
                            step={0.1}
                            placeholder='Specify covered distance (km)'
                            onChange={(event) => setDistanceInKM(event.target.value)}
                        >
                        </Input>
                        {!_isEmpty(inputsToErrorsMap['distanceInKM']) && (
                            <p className='input-errors-container'>
                                {inputsToErrorsMap['distanceInKM'].map(inputError => <span key={inputError} className='input-error'>{inputError}</span>)}
                            </p>
                        )}
                    </FormGroup>
                    <FormGroup>
                        <Label for='trainingComment'>Comment</Label>
                        <Input
                            id='trainingComment'
                            value={comment}
                            type='textarea'
                            name='comment'
                            placeholder='Your comment'
                            onChange={(event) => setComment(event.target.value)}
                        >
                        </Input>
                        {!_isEmpty(inputsToErrorsMap['comment']) && (
                            <p className='input-errors-container'>
                                {inputsToErrorsMap['comment'].map(inputError => <span key={inputError} className='input-error'>{inputError}</span>)}
                            </p>
                        )}
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color='primary' onClick={saveTrainingHandler}>Save</Button>
            </ModalFooter>
        </Modal>
    );
}

export default TrainingFormModal;