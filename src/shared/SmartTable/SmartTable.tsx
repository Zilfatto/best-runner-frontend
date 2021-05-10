import React, {
    PropsWithChildren,
    ReactNode,
    useState,
    useMemo,
    useCallback
} from 'react';
import { Table } from 'reactstrap';
import Head from './views/Head';
import Row from './views/Row';
import IWithKey from '../../types/IWIthKey';
import IWithID from '../../types/IWithID';
import ID from '../../types/ID';
import Key from '../../types/Key';
import './SmartTable.scss';

// Sort orders for table items
const sortOrders = ['asc', 'desc', ''] as const;
type SortOrdersType = typeof sortOrders[number];

export interface ISortingColumn {
    key: Key;
    order: SortOrdersType
}

// Column interface for dynamic binding columns and row items values
export interface IColumn<T extends object> extends IWithKey {
    title: string;
    dataIndex: keyof T;
    sortable?: boolean;
    renderColumnTitle?(title: string): ReactNode;
}

// For forcing a developer be consistent with provided objects and column data indexes
interface ISmartTableProps<T extends object> {
    columns: IColumn<T>[];
    items: (T & IWithID)[];
    showDelete?: boolean;
    onRowClick?(item: T & IWithID): void;
    onItemDelete?(id: ID): void;
}

const SmartTable = <T extends object>({ columns, items, showDelete, onRowClick, onItemDelete }: PropsWithChildren<ISmartTableProps<T>>) => {
    const [sortingColumn, setSortingColumn] = useState<ISortingColumn>({ key: '', order: '' });
    // Apply memoization for avoiding unnecessary resorting based on the same data and filters
    const sortedItems = useMemo(sortItems, [sortingColumn, columns, items]);

    const findNextSortOrder = useCallback(() => {
        const orderIndex = sortOrders.findIndex(order => order === sortingColumn.order);
        // Figure out the next applying sort order using remainder operator
        const newOrderIndex = (orderIndex + 1) % sortOrders.length;
        return sortOrders[newOrderIndex];
    }, [sortingColumn.order]);

    const sortableColumnClickHandler = useCallback((columnKey: Key) => {
        // If a user has clicked on a new column, then apply the first of sort orders
        // otherwise it needs to find the next sort order
        setSortingColumn(sortingColumn => ({
            key: columnKey,
            order: columnKey === sortingColumn.key ? findNextSortOrder() : sortOrders[0]
        }));
    }, [findNextSortOrder]);

    function sortItems() {
        if (!sortingColumn.key || !sortingColumn.order) {
            return items;
        }

        // Find a data index of a sortable column
        const { dataIndex } = columns.find(column => column.key === sortingColumn.key)!;

        // Sort depending on an selected order
        return [...items].sort((firstItem, secItem) => {
            if (firstItem[dataIndex] > secItem[dataIndex]) {
                return sortingColumn.order === 'asc' ? 1 : -1;
            }
            else if (firstItem[dataIndex] < secItem[dataIndex]) {
                return sortingColumn.order === 'asc' ? -1 : 1;
            }
            return 0;
        });
    }

    return (
        <Table striped hover>
            <Head
                columns={columns}
                sortingColumn={sortingColumn}
                onSortableColumnClick={sortableColumnClickHandler}
                showDelete={showDelete}
            />
            <tbody>
                {sortedItems.map(item => (
                    <Row
                        key={item.id}
                        item={item}
                        columns={columns}
                        showDelete={showDelete}
                        onRowClick={onRowClick}
                        onItemDelete={onItemDelete}
                    />
                ))}
            </tbody>
        </Table>
    );
};

export default SmartTable;