import React from 'react';
import { IColumn } from '../SmartTable';

interface IHeadProps<T extends object> {
    columns: IColumn<T>[]
}

const Head = <T extends object>({ columns }: IHeadProps<T>) => {
    return (
        <thead>
            <tr>
                {columns.map(column => (
                    <th key={String(column.key)}>
                        {column.title}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default Head;