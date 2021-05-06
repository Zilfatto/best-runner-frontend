import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SmartTable from '../../shared/SmartTable';
import { fetchTrainings } from '../../actions/trainings';
import { getTrainings } from '../../reducers/trainings';
import { constructColumnsForTrainingTable } from '../../utils/trainings';

const Trainings = () => {
    const dispatch = useDispatch();
    const trainings = useSelector(getTrainings);

    useEffect(() => {
        dispatch(fetchTrainings());
    }, []);

    return (
        <section>
            <SmartTable
                columns={constructColumnsForTrainingTable()}
                items={trainings}
            />
        </section>
    );
};

export default Trainings;