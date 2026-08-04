import { useState } from 'react'
import {
  Button, Card, CardBody, CardHeader, Field, Input, Textarea, Select,
  Badge, Avatar, Spinner, EmptyState, Modal, Container, SectionHeading,
} from '../components/ui'

const SWATCHES = [
  ['Canvas', '#0B0B0D'], ['Surface', '#17171C'], ['Line', '#26262E'],
  ['Ink', '#F4F1EC'], ['Ink muted', '#9C98A2'], ['Coral', '#FF5A47'],
  ['Coral dark', '#F03E28'], ['Moss', '#54E08A'], ['Rose', '#FB7185'], ['Amber', '#FBBF24'],
]

export default function StyleGuide() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="pt-24 pb-24 min-h-screen">
      <Container>
        <SectionHeading eyebrow="Design System" title="PhotoConnect UI Kit"
          description="Warm & modern — the building blocks every page uses." />

        {/* Colors */}
        <section className="mt-12">
          <h3 className="text-sm font-bold uppercase tracking-widest text-ink-muted mb-4">Colors</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {SWATCHES.map(([name, hex]) => (
              <div key={name} className="card p-3">
                <div className="h-16 rounded-xl border border-line" style={{ background: hex }} />
                <p className="text-sm font-medium text-ink mt-2">{name}</p>
                <p className="text-xs text-ink-faint">{hex}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="mt-12">
          <h3 className="text-sm font-bold uppercase tracking-widest text-ink-muted mb-4">Typography</h3>
          <Card><CardBody className="space-y-2">
            <h1 className="text-5xl font-bold">Capture the moment</h1>
            <h2 className="text-3xl font-bold">Every kind of photographer</h2>
            <h3 className="text-xl font-semibold">Book with confidence</h3>
            <p className="text-ink-muted">Body copy uses Inter — clean, legible, modern. Headings use Playfair Display for an editorial feel that lets the photography lead.</p>
          </CardBody></Card>
        </section>

        {/* Buttons */}
        <section className="mt-12">
          <h3 className="text-sm font-bold uppercase tracking-widest text-ink-muted mb-4">Buttons</h3>
          <div className="flex flex-wrap gap-3 items-center">
            <Button>Primary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="danger">Danger</Button>
            <Button loading>Loading</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        {/* Badges + Avatars */}
        <section className="mt-12 grid sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-ink-muted mb-4">Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge tone="clay" dot>Featured</Badge>
              <Badge tone="success" dot>Confirmed</Badge>
              <Badge tone="amber" dot>Pending</Badge>
              <Badge tone="danger" dot>Cancelled</Badge>
              <Badge tone="neutral">Wedding</Badge>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-ink-muted mb-4">Avatars</h3>
            <div className="flex items-end gap-3">
              <Avatar name="Aarav Shah" size="xs" />
              <Avatar name="Meera Iyer" size="sm" />
              <Avatar name="Rohan Das" size="md" />
              <Avatar name="Sara" size="lg" />
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="mt-12">
          <h3 className="text-sm font-bold uppercase tracking-widest text-ink-muted mb-4">Form controls</h3>
          <Card><CardBody className="grid sm:grid-cols-2 gap-5">
            <Field label="Full name" required><Input placeholder="Jane Doe" /></Field>
            <Field label="Specialty">
              <Select defaultValue="">
                <option value="" disabled>Choose one</option>
                <option>Wedding</option><option>Portrait</option><option>Wildlife</option>
              </Select>
            </Field>
            <Field label="Email" hint="We'll never share it."><Input type="email" placeholder="you@email.com" /></Field>
            <Field label="Password" error="Must be at least 8 characters"><Input type="password" invalid /></Field>
            <div className="sm:col-span-2">
              <Field label="About"><Textarea placeholder="Tell clients about your style…" /></Field>
            </div>
          </CardBody></Card>
        </section>

        {/* Cards + states */}
        <section className="mt-12 grid md:grid-cols-3 gap-6">
          <Card hover>
            <div className="h-40 bg-gradient-to-br from-clay-light to-clay" />
            <CardBody>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-lg font-semibold">Sunset Studios</h4>
                <Badge tone="clay">Featured</Badge>
              </div>
              <p className="text-sm text-ink-muted">Wedding & portrait · Mumbai</p>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Empty state" subtitle="No results yet" />
            <EmptyState icon="🔍" title="Nothing here" description="Try adjusting your filters." action={<Button size="sm">Reset</Button>} />
          </Card>
          <Card><CardBody className="flex flex-col items-center justify-center h-full gap-4 py-10">
            <Spinner size="lg" />
            <Button variant="ghost" onClick={() => setModalOpen(true)}>Open modal</Button>
          </CardBody></Card>
        </section>
      </Container>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Confirm booking"
        footer={<>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={() => setModalOpen(false)}>Confirm</Button>
        </>}>
        <p className="text-ink-muted">This is the modal component in the warm theme — used for booking confirmations, upload dialogs, and settings.</p>
      </Modal>
    </div>
  )
}
