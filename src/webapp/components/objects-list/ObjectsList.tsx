import {
    MouseActionsMapping,
    ObjectsTable,
    ObjectsTableProps,
    PaginationOptions,
    ReferenceObject,
    TableColumn,
    TableGlobalAction,
    TablePagination,
    TableSorting,
    TableState,
} from "@eyeseetea/d2-ui-components";
import React, { PropsWithChildren } from "react";
import { Spinner } from "../objects-list/Spinner";

export interface ObjectsListProps<Obj extends ReferenceObject> extends ObjectsTableProps<Obj> {
    className?: string;
    columns: TableColumn<Obj>[];
    rows: Obj[];
    onChange(newState: TableState<Obj>): void;

    isLoading: boolean;

    pagination: Partial<TablePagination>;
    paginationOptions: Partial<PaginationOptions>;
    initialSorting: TableSorting<Obj>;

    sideComponents?: ObjectsTableProps<Obj>["sideComponents"];
    globalActions?: TableGlobalAction[];
    mouseActionsMapping?: MouseActionsMapping;

    searchBoxLabel: string;
    onChangeSearch?(value: string): void;

    reload(): void;
}

export function ObjectsList<T extends ReferenceObject>(
    props: PropsWithChildren<ObjectsListProps<T>>
): React.ReactElement<ObjectsListProps<T>> {
    const {
        className,
        children,
        isLoading,
        rows,
        mouseActionsMapping = defaultMouseActionsMapping,
        ...tableProps
    } = props;

    return (
        <div className={className}>
            {isLoading ? <span data-test-loading /> : <span data-test-loaded />}
            {
                <ObjectsTable<T>
                    rows={rows || []}
                    mouseActionsMapping={mouseActionsMapping}
                    {...tableProps}
                    filterComponents={
                        <React.Fragment key="filters">
                            {children}

                            <Spinner isVisible={isLoading} />
                        </React.Fragment>
                    }
                />
            }
        </div>
    );
}

const defaultMouseActionsMapping: MouseActionsMapping = {
    left: { type: "contextual" },
    right: { type: "contextual" },
};
