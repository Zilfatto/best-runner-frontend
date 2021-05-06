import React from 'react';
import { IColumn } from '../SmartTable';

interface IRowProps<T extends object> {
    item: T;
    columns: IColumn<T>[]
}

const Row = <T extends object>({ item, columns }: IRowProps<T>) => {
    return (
        <tr>
            {columns.map(column => (
                <td key={String(column.key)}>
                    {item[column.dataIndex]}
                </td>
            ))}
        </tr>
    );
};

export default Row;