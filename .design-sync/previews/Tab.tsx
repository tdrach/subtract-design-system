import { TabBar, Tab } from '@subtract/ds'

export function InTabBar() {
  return (
    <TabBar ariaLabel="Project sections">
      <Tab active>Overview</Tab>
      <Tab>Geometry</Tab>
      <Tab>Print settings</Tab>
      <Tab>Activity</Tab>
    </TabBar>
  )
}

export function ActiveState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <TabBar ariaLabel="Inspector sections, nothing selected" border={false}>
        <Tab>Model</Tab>
        <Tab>Supports</Tab>
        <Tab>Material</Tab>
      </TabBar>
      <TabBar ariaLabel="Inspector sections, supports selected" border={false}>
        <Tab>Model</Tab>
        <Tab active>Supports</Tab>
        <Tab>Material</Tab>
      </TabBar>
    </div>
  )
}

export function InPanelHeader() {
  return (
    <div
      style={{
        width: 520,
        border: '1px solid var(--demure)',
        borderRadius: 12,
        background: 'var(--white)',
        padding: 20,
      }}
    >
      <TabBar ariaLabel="Print job sections">
        <Tab>Summary</Tab>
        <Tab active>Slicer log</Tab>
        <Tab>Filament</Tab>
      </TabBar>
      <p style={{ marginTop: 16, color: 'var(--ink-light)', lineHeight: 1.5 }}>
        PrusaSlicer 2.8.1 — 24 bins nested onto one plate, 0.2 mm layers,
        18 % gyroid infill.
      </p>
    </div>
  )
}
