// dependency

const HeaderFont = styled(Fonts.Bold14)`
  color: ${(props) => props.theme.colors.grey6};
`;

const CardContainer = styled(FlexRow)`
  width: 100%;
`;

const StyledNoteIcon = styled(NoteIconIndicator)`
  height: 16px;
  width: 16px;
  margin-right: 11px;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
`;

const LozengWrapper = styled.div`
  display: flex;
`;

const StyledLozenge = styled(Lozenge)`
  margin-right: 5px;
  margin-top: 4px;
`;

const StyledNoteCardContainer = styled.div`
  div[class*="ProductNoteWrapper"] {
    width: 357px;
    height: 230px;
    padding-left: 12px;
  }
  div[class*="AddNoteWrapper"] {
    margin-top: 33px;
  }
  svg[class*="primary__Pencil"] {
    height: 20px;
    width: 20px;
    overflow: visible;
  }
  svg[class*="primary__Trash"] {
    height: 20px;
    width: 17px;
    overflow: visible;
  }
  div[class*="DateLabel"] {
    font-size: 12px;
  }
  div[class*="DateRow"] {
    margin-top: 87px;
  }
  div[class*="Lozenge"] {
    height: 13px;
    width: 35px;
    font-size: 11.2px;
    padding-top: 2px;
  }
  margin-right: 21px;
  &:last-of-type {
    margin-right: 0;
  }
`;
const NoteWrapper = styled.div`
  margin-left: 34px;
  margin-right: 37px;
`;

const LozengeDimension = {
  height: "13px",
  width: "35px",
};
/**
 * Non abc Procuct note page
 */
const productNote: React.SFC<props> = (props) => {
  const customLozenge = () => (
    <LozengWrapper>
      <Fonts.Body12>
        {props.account && props.account.accountNickname}
        <div>
          <StyledLozenge
            lozengeFontColor={lozengeColor.grey6}
            lozengeBackgroundColor={lozengeColor.transparent}
            border={true}
            lozengeFontSize={11.2}
            dimensions={LozengeDimension}
          >
            {props.account.accountType}
          </StyledLozenge>
          {props.products.b2bUnitId}
        </div>
      </Fonts.Body12>
    </LozengWrapper>
  );

  const renderProductNoteCard = (productNote: IProductNote) => {
    return (
      <NoteCardContainer key={productNote.b2bunitId}>
        <ProductNoteCard
          originalProductNote={productNote}
          showAccountType={!props.products.defaultSupplier}
          disableViewMoreToggle
          customSaveNote={customSaveNote}
          customDeleteNote={customDeleteNote}
          customLozenge={props.products.defaultSupplier && customLozenge}
        />
      </NoteCardContainer>
    );
  };
  const productNoteDetails = (item: Iaccount) => {
    return {
      b2bunitId: item.supplierAccountNumber || props.accountB2bUnitId,
      comment: item.productNotes,
      productCode: props.products.productId,
      accountType: item.supplierAccountType,
      modifiedDate: item.lastModfiedProductNotes,
    };
  };
  /** Non abc Product Note Save */
  const customSaveNote = (productNote: IProductNote) => {
    props.dispatch(createOrUpdateProductNote(productNote, props.products));
  };
  /** Non abc Product Note Delete */
  const customDeleteNote = (productNote: IProductNote) => {
    props.dispatch(deleteProductNote(productNote, props.products));
  };

  const renderProductNoteCardDetails = () => {
    if (props.products && props.products.defaultSupplier) {
      const productNote: IProductNote = productNoteDetails(
        props.products.accounts[0]
      );
      return renderProductNoteCard(productNote);
    } else {
      return (
        props.products.accounts &&
        props.products.accounts.map((supplierAcc: Iaccount, index) => {
          const productNote: IProductNote = productNoteDetails(supplierAcc);
          return index < 3 && renderProductNoteCard(productNote);
        })
      );
    }
  };
  return (
    <NoteWrapper>
      <TitleRow>
        <StyledNoteIcon Color={brandDarkBlue} />
        <HeaderFont>Product Note</HeaderFont>
      </TitleRow>
      <CardContainer contentJustification="flex-start">
        {renderProductNoteCardDetails()}
      </CardContainer>
    </NoteWrapper>
  );
};
const mapStateToProps = (
  state: IGlobalState,
  ownProps: IOwnProps
): IStateProps => {
  const products = ownProps.products;
  if (products) {
    const isAccountHierarchy = isHierarchy(products.b2bUnitId);

    const accountAssociatedWithProduct = getAccountHierarchyForSingleAccountWithChildren(
      state,
      products.b2bUnitId
    );
    return {
      account: isAccountHierarchy
        ? getAccountHierarchyForSingleAccountWithChildren(
            state,
            ownProps.accountB2bUnitId
          )
        : accountAssociatedWithProduct,
    };
  } else {
    return null;
  }
};
/** Non abc Procuct note page */
export const productsNotes = connect(mapStateToProps)(productsNotesPage);
