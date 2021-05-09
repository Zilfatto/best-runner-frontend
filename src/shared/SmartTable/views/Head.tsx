import React from 'react';
import { IColumn } from '../SmartTable';
import { ISortingColumn } from '../SmartTable';
import Key from '../../../types/Key';
import './Head.scss';

interface IHeadProps<T extends object> {
    columns: IColumn<T>[];
    sortingColumn: ISortingColumn;
    onSortableColumnClick(columnKey: Key): void;
    showDelete?: boolean;
}

const Head = <T extends object>({ columns, sortingColumn, onSortableColumnClick, showDelete }: IHeadProps<T>) => {
    return (
        <thead>
            <tr>
                {[
                    ...columns.map(column => (
                        <th
                            key={String(column.key)}
                            className={column.sortable ? 'sortable-column' : ''}
                            onClick={column.sortable ? () => onSortableColumnClick(column.key) : undefined}
                        >
                            <span className={column.sortable ? 'me-1' : ''}>
                                {column.renderColumnTitle ? column.renderColumnTitle(column.title) : column.title}
                            </span>
                            {column.sortable && sortingColumn.key === column.key && sortingColumn.order && (
                                sortingColumn.order === 'asc'
                                    ? <i className="fa fa-sort-asc"></i>
                                    : <i className="fa fa-sort-desc"></i>
                            )}
                        </th>
                    )),
                    // Add an empty column for delete buttons of rows
                    !!showDelete && <th key='delete'>{''}</th>
                ]}
            </tr>
        </thead>
    );
};

export default Head;