import { MaxLength, Min, IsIn, IsDateString, IsString, IsNumber } from 'class-validator';
import ITraining from '../../models/ITraining';
import { workoutTuple, WorkoutTupleType } from '../../enums/WorkoutType';

const numberOptions = {
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 1
};

export default class Training implements Omit<ITraining, 'id'> {
    @IsDateString({ strict: true }, {
        message: 'Invalid value for $property field',
    })
    date: string;

    @IsString({
        message: 'Value of $property must be a string',
    })
    @IsIn(workoutTuple)
    workoutType: WorkoutTupleType;

    @IsNumber(numberOptions, {
        message: 'Value of $property must be a number and contain no more than 1 decimal place',
    })
    @Min(0.1, {
        message: 'Value for $property cannot be less than $constraint1',
    })
    distanceInKM: number;

    @IsString({
        message: 'Value of a $property field must be a string',
    })
    @MaxLength(1000, {
        message: 'The length of a $property cannot be longer than $constraint1 characters'
    })
    comment: string;

    constructor(date: string, workoutType: WorkoutTupleType, distance: number, comment: string) {
        this.date = date;
        this.workoutType = workoutType;
        this.distanceInKM = distance;
        this.comment = comment;
    }
}

export const validatorOptions = {
    validationError: { target: false },
    stopAtFirstError: false,
    dismissDefaultMessages: true
};