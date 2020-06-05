interface IOwnProps {
  /**
   * data
   */
  data: IPriceData[];
  /**
   * replacements
   */
  replacements?: IProduct[];
  /**
   * setReplacements
   */
  setReplacements?: any;
}
// Used here styled component

const ScrollableDiv = styled.div`
  overflow-y: auto;
  height: 450px;
  margin-right: -20px;
  padding-right: 30px;
`;

const initialState: ITLState = {
  products: [],
  expandAll: false,
  bestAcqCost: 0,
  minPerDose: 0,
  sorted: [
    { desc: false, id: "pricePerPill" },
    { desc: false, id: "" },
  ],
  mainRowList: [],
  expandedRows: [],
};

interface ITLState {
  products: IPriceCheck[];
  expandAll: boolean;
  minPerDose: number;
  bestAcqCost: number;
  sorted: IDefaultSortedProp[];
  mainRowList: string[];
  expandedRows: string[];
}

type tPayload = IPriceCheck[] | number | any | string | boolean;

interface ITLAction {
  type: string;
  payload?: tPayload;
}

const reducer = (state: ITLState, action: ITLAction): ITLState => {
  switch (action.type) {
    case "setProducts":
      const newList = action.payload.map((list: IPriceCheck) => {
        return {
          productCode: list.productCode,
          originalProductDocument: list.originalProductDocument,
          products: groupChildProducts(
            list.products,
            list.originalProductDocument.abcSellingSize
          ),
          totalResultsCount: list.totalResultsCount,
          originalProductQuantity: list.originalProductQuantity,

          minPerDose: Math.min.apply(
            Math,
            list.products.map((item) => +item.pricePerPill)
          ),
          bestAcqCost: bestAcqCost(
            list.products,
            list.originalProductDocument.abcSellingSize
          ),
        };
      });

      const mainRowList = action.payload.map((list: IPriceCheck) => {
        return list.productCode;
      });
      return {
        ...state,
        products: (newList as IPriceCheck[])
          .slice()
          .sort(sortAlphabetical("originalProductDocument.name")),
        sorted: [
          { desc: false, id: "pricePerPill" },
          { desc: false, id: "" },
        ],
        mainRowList,
      };
    case "setExpandALl":
      return {
        ...state,
        expandAll: !state.expandAll,
        expandedRows: state.mainRowList,
      };

    case "setCollapseALl":
      return {
        ...state,
        expandAll: !state.expandAll,
        expandedRows: [],
      };

    case "setExpandedRow":
      const newExpandedRows = [...state.expandedRows, action.payload];
      return {
        ...state,
        expandedRows: uniq(newExpandedRows),
      };

    case "setCollapseRow":
      const newCollapseRow = state.expandedRows.filter((item: string) => {
        return action.payload.indexOf(item) === -1;
      });
      return {
        ...state,
        expandedRows: uniq(newCollapseRow),
      };
    case "setHeaderChevronState":
      return {
        ...state,
        expandAll: action.payload,
      };
    case "sortColumn":
      return {
        ...state,
        sorted: action.payload.sortedHeaderInfo,
        products: action.payload.sortedProductData,
      };
    default:
      throw new Error("Unexpected action");
  }
};

type IProps = IOwnProps;

/** Test table rows */
export const TestTable: React.SFC<IProps> = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setValue = (type: string, payload?: tPayload) => {
    dispatch({
      type,
      payload,
    });
  };

  useEffect(() => {
    setValue("setProducts", props.data);
  }, []);

  const renderTable = () => {
    return state.products.map((row: IPriceCheck) => {
      return (
        <Table
          row={row}
          key={row.productCode}
          id="table-row"
          expandAll={state.expandAll}
          replacements={props.replacements}
          setReplacements={props.setReplacements}
          handleRowExpand={handleRowExpand}
          handleRowCollapse={handleRowCollapse}
          expandedRows={state.expandedRows}
        />
      );
    });
  };

  const handleHeaderChevronExpand = () => {
    setValue("setExpandALl");
  };
  const handleHeaderChevronCollapse = () => {
    setValue("setCollapseALl");
  };

  const handleRowExpand = (code: string) => {
    setValue("setExpandedRow", code);
  };

  const handleRowCollapse = (code: string) => {
    setValue("setCollapseRow", code);
  };

  /**
   * Callback function to called onclick of table header column
   */
  const sortApplied = (sortedData: IDefaultSortedProp[]) => {
    const sortedHeaderInfo = headerSort(sortedData, state.sorted);
    const sortedProductData = productSort(sortedHeaderInfo, state.products);

    // Call reducer with action name and payload
    setValue("sortColumn", { sortedHeaderInfo, sortedProductData });
  };

  /**
   * For handling header chevron toggle
   */
  useEffect(() => {
    state.expandedRows.length &&
      isEqual(state.expandedRows.sort(), state.mainRowList.sort()) &&
      setValue("setHeaderChevronState", true);
    state.expandedRows.length === 0 && setValue("setHeaderChevronState", false);
  }, [state.expandedRows]);

  return (
    <>
      <TableHeader
        id="table-header"
        handleHeaderChevronExpand={handleHeaderChevronExpand}
        handleHeaderChevronCollapse={handleHeaderChevronCollapse}
        expandAll={state.expandAll}
        sorted={state.sorted}
        sortApplied={sortApplied}
      />
      <ScrollableDiv>{renderTable()}</ScrollableDiv>
    </>
  );
};
