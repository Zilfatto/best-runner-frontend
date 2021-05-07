import React from 'react';
import { IColumn } from '../SmartTable';
import ID from '../../../types/ID';
import IWithID from '../../../types/IWithID';

interface IRowProps<T extends object> {
    item: T & IWithID;
    columns: IColumn<T>[];
    showDelete?: boolean;
    onRowClick?(item: T & IWithID): void;
    onItemDelete?(id: ID): void;
}

const Row = <T extends object>({ item, columns, showDelete, onRowClick, onItemDelete }: IRowProps<T>) => {
    const renderDeleteBtnCell = () => (
        <td key='delete'>
            <button
                onClick={(event) => {
                    event.stopPropagation();
                    return onItemDelete ? onItemDelete(item.id) : null
                }}
                className="btn btn-danger btn-sm"
            >
                Delete
            </button>
        </td>
    );

    return (
        <tr onClick={() => onRowClick ? onRowClick(item) : null} >
            {[
                ...columns.map(column => (
                    <td key={String(column.key)}>
                        {item[column.dataIndex]}
                    </td>
                )),
                // Add a delete button if needed
                !!showDelete && renderDeleteBtnCell()
            ]}
        </tr>
    );
};

export default Row;