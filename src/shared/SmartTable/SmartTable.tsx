import React, { PropsWithChildren } from 'react';
import { Table } from 'reactstrap';
import Head from './views/Head';
import Row from './views/Row';
import IWithKey from '../../types/IWIthKey';

// Column interface for dynamic binding columns and row items values
export interface IColumn<T extends object> extends IWithKey {
    title: string;
    dataIndex: keyof T;
}

// Force a developer be consistent with provided objects and column data indexes
interface ITableProps<T extends object> {
    columns: IColumn<T>[];
    items: (T & IWithKey)[];
}

const SmartTable = <T extends object>({ columns, items }: PropsWithChildren<ITableProps<T>>) => {
    return (
        <Table striped hover>
            <Head columns={columns} />
            <tbody>
                {items.map(item => (
                    <Row key={String(item.key)} item={item} columns={columns} />
                ))}
            </tbody>
        </Table>
    );
};

export default SmartTable;