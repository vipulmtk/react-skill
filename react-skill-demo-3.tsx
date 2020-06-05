export interface ITooltipProps  {
  /**
   * [Required] pass unique id for the tooltip. This must match the 'data-for' attribute on the tooltip target.
   */
  id: string;
  /**
   * [Optional] pass in boolean to disable tooltip
   */
  disable?: boolean;
  /**
   * [Optional] pass position offset if needed.
   */
  offset?: { top: number; left?: number; right?: number; bottom?: number };
  /**
   * [Optional] location of tooltip tail
   */
  tailLocation?: 'left' | 'center' | 'right';
  /**
   * [Optional] Placement of tooltip relative to target
   */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * [Optional] boolean to hide tail
   */
  hideTail?: boolean;
}

/** TODO: Add comment */
export interface ITooltipContainerProps {
  /**
   * [Optional] location of tooltip tail
   */
  tailPlacement?: string;

  /**
   * [optional] Placement of tooltip relative to target
   */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * [Optional] boolean to hide tail
   */
  hideTail?: boolean;
  /**
   * [Optional] unique key
   */
  key?: string;
}

const TooltipContainer: React.SFC<ITooltipContainerProps> = ({
  children,
  tailPlacement,
  className,
  placement,
  hideTail,
  ...props
}) => <div className={className}>{children}</div>;

const TooltipContainerStyled = styled(TooltipContainer)`
  .__react_component_tooltip {
    background: none !important;
    color: ${props => props.theme.colors.grey6} !important;
    opacity: 1 !important;
    padding: 0 !important;
    background-color: ${props => props.theme.colors.white} !important;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.3);
    &:before {
      content: ${props => (props.hideTail ? 'none !important' : '"" !important')};
      ${props => props.tailPlacement};
      border: none !important;
      width: 18px !important;
      height: 18px !important;
      bottom: -9px !important;
      margin-left: -9px !important;
      transform: rotate(45deg);
      background-color: ${props => props.theme.colors.white};
      box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.3);
      z-index: -1;
      ${props => (props.placement === 'right' ? `left: ${0}px !important` : '')};
    }
    &:after {
      display: none !important;
      content: ${props => (props.hideTail ? 'none !important' : '"" !important')};
    }
    &:empty {
      display: none;
    }
    &.place-right {
      &:before {
        top: calc(50% - 4px);
        left: 0px;
      }
    }
  }
`;

const ChildrenContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  padding: 12px 16px;
  background-color: ${props => props.theme.colors.white};
  border-radius: 2px;
  line-height: 100%;
`;

/** Tooltip Component */
export const TooltipRegular: React.SFC<ITooltipProps> = ({
  children,
  className,
  id,
  disable,
  offset,
  tailLocation,
  placement,
  hideTail,
  ...props
}) => {
  let tailPlacement;
  switch (tailLocation) {
    case 'right':
      tailPlacement = 'right: 20px !important; left: auto !important';
      break;
    case 'left':
      tailPlacement = 'left: 29px !important';
      break;
    default:
      tailPlacement = '';
      break;
  }
  return (
    <TooltipContainer
      placement={placement}
      tailPlacement={tailPlacement}
      className={className}
      hideTail={hideTail}
    >
      <ReactTooltip
        id={id}
        effect="solid"
        disable={disable}
        offset={offset}
        place={placement ? placement : 'top'}
      >
        <ChildrenCon>{children}</ChildrenCon>
      </ReactTooltip>
    </TooltipContainerStyled>
  );
};
