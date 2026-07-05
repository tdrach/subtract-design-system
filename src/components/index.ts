export { default as Header } from './Header'
export type { HeaderProps, NavLink } from './Header'

export { default as Footer } from './Footer'
export type { FooterProps } from './Footer'

export { default as Button } from './Button'
export type { ButtonProps } from './Button'

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './DropdownMenu'

export { Dialog, DialogTrigger, DialogClose, DialogContent, DialogHeader, DialogBody } from './Dialog'

export { TagSelector, TagPill } from './TagSelector'
export type { Tag } from './TagSelector'

// Status tag (Figma: Tag). Exported as StatusTag because the name `Tag` is
// taken by TagSelector's data type above.
export { Tag as StatusTag } from './Tag'
export type { TagProps as StatusTagProps, TagTone as StatusTagTone } from './Tag'

export { TextInput } from './TextInput'
export type { TextInputProps } from './TextInput'

export { NumberInput } from './NumberInput'
export type { NumberInputProps } from './NumberInput'

export { Select } from './Select'
export type { SelectProps } from './Select'

export { Textarea } from './Textarea'
export type { TextareaProps } from './Textarea'

export { Slider } from './Slider'
export type { SliderProps } from './Slider'

export { ChecklistItem } from './ChecklistItem'
export type { ChecklistItemProps } from './ChecklistItem'

export {
  ExpandPanel,
  ExpandPanelTrigger,
  ExpandPanelClose,
  ExpandPanelContent,
  ExpandPanelBody,
} from './ExpandPanel'

export { Sparkline } from './Sparkline'


export { TabBar, Tab } from './Tabs'
export type { TabBarProps, TabProps } from './Tabs'

export { Skeleton } from './Skeleton'
export type { SkeletonProps } from './Skeleton'

export { LineChart } from './LineChart'
export type { LineSeriesData, LineChartProps } from './LineChart'

export {
  chartTooltipStyles,
  ChartTooltipHeader,
  ChartTooltipBody,
  ChartTooltipRow,
  ChartTooltipDetail,
} from './ChartTooltip'

export { SegmentBar } from './SegmentBar'
export type { SegmentBarSegment, SegmentBarProps } from './SegmentBar'

export { GanttChart } from './GanttChart'
export type { GanttTask, GanttChartProps } from './GanttChart'

export { FunnelChart } from './FunnelChart'
export type { FunnelStage, FunnelChartProps } from './FunnelChart'

export { BubbleMatrix } from './BubbleMatrix'
export type { BubbleMatrixCell, BubbleMatrixRow, BubbleMatrixCol, BubbleMatrixProps, CalendarDataPoint } from './BubbleMatrix'

export { SegmentedControl } from './SegmentedControl'
export type { SegmentedControlOption, SegmentedControlProps } from './SegmentedControl'

export {
  ButtonGroup,
  ButtonGroupItem,
  ButtonGroupSeparator,
  ButtonGroupText,
} from './ButtonGroup'
export type { ButtonGroupProps, ButtonGroupItemProps } from './ButtonGroup'

// ─── Board ─────────────────────────────────────────────────────────────────────

export {
  Board,
  BoardColumn,
  BoardColumnHeader,
  BoardColumnBody,
  BoardCard,
  BoardCardTitle,
  BoardCardMeta,
  BoardCardAdd,
  BoardDropIndicator,
} from './Board'
export type {
  BoardProps,
  BoardColumnProps,
  BoardColumnHeaderProps,
  BoardCardProps,
  BoardCardAddProps,
} from './Board'

export { DataTable } from './DataTable'
export type { ColumnDef, RowAction, SortDirection, DataTableProps } from './DataTable'

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
  SidebarMenu,
  SidebarItem,
} from './Sidebar'
export type {
  SidebarProps,
  SidebarSectionProps,
  SidebarGroupProps,
  SidebarGroupLabelProps,
  SidebarItemProps,
} from './Sidebar'

// ─── Chat ──────────────────────────────────────────────────────────────────────

export { ChatBubble } from './ChatBubble'
export type {
  ChatBubbleProps,
  ChatRole,
  ChatBubbleTone,
  ChatBubbleVariant,
  ChatBubbleGroup,
  ChatDeliveryStatus,
} from './ChatBubble'

export { ChatThread, ChatThreadScrollButton } from './ChatThread'
export type {
  ChatThreadProps,
  ChatThreadScrollButtonProps,
  ChatThreadHandle,
} from './ChatThread'

export {
  ChatComposer,
  ChatComposerField,
  ChatComposerTextarea,
  ChatComposerToolbar,
  ChatComposerTools,
  ChatComposerSubmit,
} from './ChatComposer'
export type {
  ChatComposerProps,
  ChatComposerTextareaProps,
  ChatComposerSubmitProps,
  ChatComposerSubmitStatus,
} from './ChatComposer'

export { Persona, PersonaAvatar } from './Persona'
export type {
  PersonaProps,
  PersonaAvatarProps,
  PersonaState,
  PersonaSize,
} from './Persona'

export { TypingIndicator } from './TypingIndicator'
export type { TypingIndicatorProps } from './TypingIndicator'

export { ChatMessageActions, ChatMessageAction } from './ChatMessageActions'
export type {
  ChatMessageActionsProps,
  ChatMessageActionProps,
} from './ChatMessageActions'

export { SuggestionChips, SuggestionChip } from './SuggestionChips'
export type {
  SuggestionChipsProps,
  SuggestionChipProps,
} from './SuggestionChips'
