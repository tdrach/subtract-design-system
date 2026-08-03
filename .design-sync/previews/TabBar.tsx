import { TabBar, Tab } from '@subtract/ds'

export function ProjectSections() {
  return (
    <TabBar ariaLabel="Project sections">
      <Tab active>Overview</Tab>
      <Tab>Geometry</Tab>
      <Tab>Print settings</Tab>
      <Tab>Activity</Tab>
    </TabBar>
  )
}

export function Borderless() {
  return (
    <TabBar ariaLabel="Inspector sections" border={false}>
      <Tab>Model</Tab>
      <Tab active>Supports</Tab>
      <Tab>Material</Tab>
    </TabBar>
  )
}

export function WorkspaceNav() {
  return (
    <TabBar ariaLabel="Workspace sections">
      <Tab>Projects</Tab>
      <Tab>Files</Tab>
      <Tab active>Print queue</Tab>
      <Tab>Materials</Tab>
      <Tab>Members</Tab>
      <Tab>Billing</Tab>
    </TabBar>
  )
}

export function InPanel() {
  return (
    <div
      style={{
        width: 560,
        border: '1px solid var(--demure)',
        borderRadius: 12,
        background: 'var(--white)',
        padding: 20,
      }}
    >
      <h3 style={{ fontSize: 24, marginBottom: 16 }}>Gridfinity build-plate</h3>
      <TabBar ariaLabel="Build-plate sections">
        <Tab active>Overview</Tab>
        <Tab>Bins</Tab>
        <Tab>Export</Tab>
      </TabBar>
      <p style={{ marginTop: 16, color: 'var(--ink-light)', lineHeight: 1.5 }}>
        6 × 4 baseplate on a 42 mm pitch. Sliced for a 0.4 mm nozzle at 0.2 mm
        layer height — 3 h 20 m estimated on the Prusa MK4.
      </p>
    </div>
  )
}
