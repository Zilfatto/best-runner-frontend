// Tuple for a better TS support over working on Workout type enum
export const workoutTuple = ['walking', 'running', 'cycling', 'skiing'] as const;
export type WorkoutTupleType = typeof workoutTuple[number];

// Define a structure of returning items for select or dropdown fields
export type WorkoutTypeSelectItem = { value: WorkoutTupleType, label: string };

export default class WorkoutType {

    static WALKING = 'walking';
    static RUNNING = 'running';
    static CYCLING = 'cycling';
    static SKIING = 'skiing';

    static getLabels() {
        return {
            [this.WALKING]: 'Walking',
            [this.RUNNING]: 'Running',
            [this.CYCLING]: 'Cycling',
            [this.SKIING]: 'Skiing'
        };
    }

    static getKeys() {
        return Object.keys(this.getLabels()) as typeof workoutTuple[number][];
    }

    static getSelectionItems() {
        return (Object.entries(this.getLabels()) as [WorkoutTupleType, string][])
            .map(([value, label]) => ({
                value,
                label
            }));
    }
}