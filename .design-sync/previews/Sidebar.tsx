import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
  SidebarMenu,
  SidebarItem,
} from '@subtract/ds'
import {
  House,
  Tray,
  ChartLine,
  Folder,
  FolderOpen,
  Cube,
  Printer,
  Tag as TagIcon,
  Gear,
  SignOut,
  Plus,
  CaretRight,
  CaretUpDown,
  DotsThreeVertical,
  Wrench,
  ListBullets,
  File as FileIcon,
} from '@phosphor-icons/react'

const frame = (height: number): React.CSSProperties => ({
  display: 'flex',
  height,
  border: '1px solid var(--demure)',
  borderRadius: 12,
  overflow: 'hidden',
  background: 'var(--light)',
})

const STAGE: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--ink-light)',
  fontSize: 13,
}

const MARK: React.CSSProperties = {
  width: 26,
  height: 26,
  borderRadius: 8,
  background: 'var(--ink-dark)',
  color: 'var(--white)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 13,
  flexShrink: 0,
}

const BRAND_ROW: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '2px 4px',
}

const BRAND_TEXT: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  lineHeight: 1.2,
  flex: 1,
  minWidth: 0,
}

const SUB: React.CSSProperties = { color: 'var(--ink-light)', fontSize: 12 }

function Initials({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      style={{
        background: color,
        color: 'var(--white)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: 10,
      }}
    >
      {children}
    </span>
  )
}

export function WorkspaceNavigation() {
  return (
    <div style={frame(650)}>
      <Sidebar>
        <SidebarHeader>
          <div style={BRAND_ROW}>
            <span style={MARK}>S</span>
            <span style={BRAND_TEXT}>
              <strong>Subtract</strong>
              <span style={SUB}>thomas@subtract.design</span>
            </span>
            <CaretUpDown size={14} weight="bold" />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarItem icon={<House size={16} weight="bold" />} label="Home" href="#home" active />
              <SidebarItem icon={<Tray size={16} weight="bold" />} label="Inbox" trailing="12" href="#inbox" />
              <SidebarItem icon={<Cube size={16} weight="bold" />} label="Models" href="#models" />
              <SidebarItem icon={<Printer size={16} weight="bold" />} label="Print queue" trailing="3" href="#queue" />
              <SidebarItem
                icon={<Folder size={16} weight="bold" />}
                label="Projects"
                trailing={<CaretRight size={12} weight="bold" />}
                href="#projects"
              />
            </SidebarMenu>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel action={<Plus size={12} weight="bold" />}>Tags</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarItem
                icon={<TagIcon size={16} weight="bold" style={{ color: '#11A0FF' }} />}
                label="Gridfinity"
                trailing="24"
                href="#t-grid"
              />
              <SidebarItem
                icon={<TagIcon size={16} weight="bold" style={{ color: '#06D021' }} />}
                label="Fixtures"
                trailing="18"
                href="#t-fix"
              />
              <SidebarItem
                icon={<TagIcon size={16} weight="bold" style={{ color: '#FFA811' }} />}
                label="Enclosures"
                trailing="7"
                href="#t-enc"
              />
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarItem
            avatar={<Initials color="#191918">TD</Initials>}
            label="Thomas Drach"
            description="thomas@subtract.design"
            trailing={<DotsThreeVertical size={14} weight="bold" />}
            onClick={() => {}}
          />
        </SidebarFooter>
      </Sidebar>
      <div style={STAGE}>Build plate — 6 × 4 bins</div>
    </div>
  )
}

export function Floating() {
  return (
    <div style={frame(520)}>
      <Sidebar variant="floating">
        <SidebarHeader>
          <div style={BRAND_ROW}>
            <span style={{ ...MARK, background: 'var(--blue)' }}>C</span>
            <span style={BRAND_TEXT}>
              <strong>ClawMachine</strong>
              <span style={SUB}>Personal OS</span>
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            <SidebarItem icon={<House size={16} weight="bold" />} label="Dashboard" href="#1" active />
            <SidebarItem icon={<ListBullets size={16} weight="bold" />} label="Tasks" trailing="3" href="#2" />
            <SidebarItem icon={<FileIcon size={16} weight="bold" />} label="Notes" href="#3" />
          </SidebarMenu>

          <SidebarGroup>
            <SidebarGroupLabel>Documents</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarItem icon={<FolderOpen size={16} weight="bold" />} label="Fabrication" href="#d1" />
              <SidebarItem label="Cut lists" href="#d2" indent={1} size="sm" />
              <SidebarItem label="Tolerances" href="#d3" indent={1} size="sm" active />
              <SidebarItem label="2025 archive" href="#d4" indent={2} size="sm" />
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarItem icon={<Wrench size={16} weight="bold" />} label="Settings" size="sm" href="#settings" />
        </SidebarFooter>
      </Sidebar>
      <div style={STAGE}>Page content</div>
    </div>
  )
}

export function ItemStates() {
  return (
    <div
      style={{
        width: 288,
        padding: '4px 8px 8px',
        border: '1px solid var(--demure)',
        borderRadius: 12,
        background: 'var(--white)',
      }}
    >
      <SidebarGroup>
        <SidebarGroupLabel action={<Plus size={12} weight="bold" />}>Library</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarItem icon={<House size={16} weight="bold" />} label="Icon + label" href="#a" />
          <SidebarItem icon={<Tray size={16} weight="bold" />} label="Trailing count" trailing="42" href="#b" />
          <SidebarItem icon={<Printer size={16} weight="bold" />} label="Active state" href="#c" active />
          <SidebarItem
            icon={<ChartLine size={16} weight="bold" />}
            label="With description"
            description="Filament use & job time"
            href="#d"
          />
          <SidebarItem
            avatar={<Initials color="#11A0FF">TD</Initials>}
            label="Avatar row"
            description="thomas@subtract.design"
            href="#e"
          />
          <SidebarItem icon={<SignOut size={16} weight="bold" />} label="Disabled" disabled href="#f" />
          <SidebarItem icon={<Gear size={16} weight="bold" />} label="Small size" size="sm" href="#g" />
          <SidebarItem label="Nested — indent 1" href="#h" indent={1} size="sm" />
          <SidebarItem label="Nested — indent 2" href="#i" indent={2} size="sm" />
        </SidebarMenu>
      </SidebarGroup>
    </div>
  )
}
