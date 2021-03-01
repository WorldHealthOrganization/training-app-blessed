import {
    ObjectsTableDetailField,
    ObjectsTableProps,
    PaginationOptions,
    ReferenceObject,
    TableAction,
    TableColumn,
    TablePagination,
    TableSorting,
    TableState,
} from "@eyeseetea/d2-ui-components";
import _ from "lodash";
import { parse } from "querystring";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import i18n from "../../../locales";
import { ObjectsListProps } from "./ObjectsList";

export interface TableConfig<Obj extends ReferenceObject>
    extends Omit<
        ObjectsTableProps<Obj>,
        "rows" | "isLoading" | "onChange" | "pagination" | "onChangeSearch" | "reload"
    > {
    columns: TableColumn<Obj>[];
    actions: TableAction<Obj>[];
    paginationOptions: PaginationOptions;
    initialSorting: TableSorting<Obj>;
    details?: ObjectsTableDetailField<Obj>[];
    searchBoxLabel?: string;
}

export interface Pager {
    page: number;
    pageCount: number;
    total: number;
    pageSize: number;
}

type GetRows<Obj extends ReferenceObject> = (
    search: string,
    paging: TablePagination,
    sorting: TableSorting<Obj>
) => Promise<{ objects: Obj[]; pager: Pager }>;

// Group state to avoid multiple re-renders on individual setState dispatchers
interface State<Obj extends ReferenceObject> {
    rows: Obj[] | undefined;
    pagination: TablePagination;
    sorting: TableSorting<Obj>;
    isLoading: boolean;
}

export function useObjectsTable<Obj extends ReferenceObject>(
    config: TableConfig<Obj>,
    getRows: GetRows<Obj>
): ObjectsListProps<Obj> {
    const initialPagination: TablePagination = useMemo(
        () => ({
            page: 1,
            pageSize: config.paginationOptions.pageSizeInitialValue ?? 20,
            total: 0,
        }),
        [config.paginationOptions.pageSizeInitialValue]
    );

    const [state, setState] = useState<State<Obj>>(() => ({
        rows: undefined,
        pagination: initialPagination,
        sorting: config.initialSorting,
        isLoading: false,
    }));

    const match = useLocation();
    const queryParams = parse(match.search.slice(1));
    const initialSearch = _.castArray(queryParams.search)[0] || "";
    const [search, setSearch] = useState(initialSearch);

    const loadRows = useCallback(
        async (sorting: TableSorting<Obj>, pagination: Partial<TablePagination>) => {
            setState(state => ({ ...state, isLoading: true }));
            const paging = { ...initialPagination, ...pagination };
            const res = await getRows(search.trim(), paging, sorting);
            setState({
                rows: res.objects,
                pagination: { ...pagination, ...res.pager },
                sorting,
                isLoading: false,
            });
        },
        [getRows, search, initialPagination]
    );

    const reload = useCallback(async () => {
        loadRows(state.sorting, state.pagination);
    }, [loadRows, state.sorting, state.pagination]);

    useEffect(() => {
        loadRows(config.initialSorting, initialPagination);
    }, [config.initialSorting, loadRows, initialPagination]);

    const onChange = useCallback(
        (newState: TableState<Obj>) => {
            loadRows(newState.sorting, newState.pagination);
        },
        [loadRows]
    );

    return {
        ...config,
        isLoading: state.isLoading,
        rows: state.rows ?? [],
        onChange,
        pagination: state.pagination,
        searchBoxLabel: config.searchBoxLabel || i18n.t("Search by name"),
        onChangeSearch: setSearch,
        reload,
    };
}
